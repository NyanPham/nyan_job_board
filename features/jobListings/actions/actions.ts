"use server";

import z from "zod";
import { jobListingAISearchSchema, jobListingSchema } from "./schema";
import {
  getCurrentOrganization,
  getCurrentUser,
} from "@/services/clerk/lib/getCurrentAuth";
import { redirect } from "next/navigation";
import {
  deleteJobListingDB,
  insertJobListing,
  updateJobListing as updateJobListingDB,
} from "../db/jobListings";
import { cacheTag } from "next/cache";
import {
  getJobListingGlobalTag,
  getJobListingIdTag,
} from "../db/cache/jobListings";
import { db } from "@/drizzle/db";
import { JobListingTable } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";
import { hasOrgUserPermission } from "@/services/clerk/lib/orgUserPermissions";
import { getNextJobListingStatus } from "../lib/utils";
import {
  hasReachedMaxFeaturedJobListings,
  hasReachedMaxPublishedJobListings,
} from "../lib/planFeatureHelper";
import { getMatchingJobListings } from "@/services/inngest/ai/getMatchingJobListings";

export const createJobListing = async (
  unsafeData: z.infer<typeof jobListingSchema>,
) => {
  const { orgId } = await getCurrentOrganization();
  if (
    orgId == null ||
    !(await hasOrgUserPermission("org:job_listings:create"))
  ) {
    return {
      error: true,
      message: "You don't have permission to create a job listing",
    };
  }

  const { success, data } = jobListingSchema.safeParse(unsafeData);
  if (!success) {
    return {
      error: true,
      message: "There was an error creating your job listing",
    };
  }

  const jobListing = await insertJobListing({
    ...data,
    organizationId: orgId,
    status: "draft",
  });

  redirect(`/employer/job-listings/${jobListing.id}`);
};

export const updateJobListing = async (
  id: string,
  unsafeData: z.infer<typeof jobListingSchema>,
) => {
  const { orgId } = await getCurrentOrganization();
  if (
    orgId == null ||
    !(await hasOrgUserPermission("org:job_listings:update"))
  ) {
    return {
      error: true,
      message: "You don't have permission to update a job listing",
    };
  }

  const { success, data } = jobListingSchema.safeParse(unsafeData);
  if (!success) {
    return {
      error: true,
      message: "There was an error updating your job listing",
    };
  }

  const jobListing = await getJobListing(id, orgId);

  if (jobListing == null) {
    return {
      error: true,
      message: "There was an error updating your job listing",
    };
  }

  const updatedJobListing = await updateJobListingDB(id, data);

  redirect(`/employer/job-listings/${updatedJobListing.id}`);
};

export const toggleJobListingStatus = async (id: string) => {
  const error = {
    error: true,
    message: "You don't have permission to update a job listing's status",
  };
  const { orgId } = await getCurrentOrganization();
  if (orgId == null) return error;

  const jobListing = await getJobListing(id, orgId);

  if (jobListing == null) return error;

  const newStatus = getNextJobListingStatus(jobListing.status);
  if (
    !(await hasOrgUserPermission("org:job_listings:change_status")) ||
    (newStatus === "published" && (await hasReachedMaxPublishedJobListings()))
  )
    return error;

  await updateJobListingDB(id, {
    status: newStatus,
    isFeatured: newStatus === "published" ? undefined : false,
    postedAt:
      newStatus === "published" && jobListing.postedAt == null
        ? new Date()
        : undefined,
  });

  return {
    error: false,
  };
};

export const toggleJobListingFeatured = async (id: string) => {
  const error = {
    error: true,
    message:
      "You don't have permission to update a job listing's featured status ",
  };

  const { orgId } = await getCurrentOrganization();
  if (orgId == null) return error;

  const jobListing = await getJobListing(id, orgId);

  if (jobListing == null) return error;

  const newFeaturedStatus = !jobListing.isFeatured;
  if (
    !(await hasOrgUserPermission("org:job_listings:change_status")) ||
    (newFeaturedStatus === true && (await hasReachedMaxFeaturedJobListings()))
  )
    return error;

  await updateJobListingDB(id, {
    isFeatured: newFeaturedStatus,
  });

  return {
    error: false,
  };
};

export const deleteJobListing = async (id: string) => {
  const error = {
    error: true,
    message: "You don't have permission to delete this job listing",
  };

  const { orgId } = await getCurrentOrganization();
  if (orgId == null) return error;

  const jobListing = await getJobListing(id, orgId);

  if (jobListing == null) return error;

  if (!(await hasOrgUserPermission("org:job_listings:delete"))) return error;

  await deleteJobListingDB(id);

  redirect("/employer");
};

export const getAIJobListingSearchResults = async (
  unsafeData: z.infer<typeof jobListingAISearchSchema>,
): Promise<{ error: true; message: string } | { error: false; jobIds: string[] }> => {
  const { success, data } = jobListingAISearchSchema.safeParse(unsafeData);

  if (!success) {
    return {
      error: true,
      message: "There was an error processing your search query",
    };
  }

  const { userId } = await getCurrentUser();
  if (userId == null) {
    return {
      error: true,
      message: "You need an account to use AI job search",
    };
  }

  // TODO: for performance, instead of getting all public job listings
  // find the ones that are potential, and ask AI from there

  const allJobListings = await getPublicJobListings();
  const matchedListings = await getMatchingJobListings(
    data.query,
    allJobListings,
    {
      maxNumberOfJobs: 10,
    },
  );

  if (matchedListings.length === 0) {
    return {
      error: true,
      message: "No jobs match your search criteria",
    };
  }

  return {
    error: false,
    jobIds: matchedListings,
  };
};

const getJobListing = async (id: string, orgId: string) => {
  "use cache";
  cacheTag(getJobListingIdTag(id));

  return db.query.JobListingTable.findFirst({
    where: and(
      eq(JobListingTable.id, id),
      eq(JobListingTable.organizationId, orgId),
    ),
  });
};

const getPublicJobListings = async () => {
  "use cache";
  cacheTag(getJobListingGlobalTag());

  return db.query.JobListingTable.findMany({
    where: eq(JobListingTable.status, "published"),
  });
};
