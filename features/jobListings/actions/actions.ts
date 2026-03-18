"use server";

import z from "zod";
import { jobListingSchema } from "./schema";
import { getCurrentOrganization } from "@/services/clerk/lib/getCurrentAuth";
import { redirect } from "next/navigation";
import { insertJobListing, updateJobListing as updateJobListingDB } from "../db/jobListings";
import { cacheTag } from "next/cache";
import { getJobListingIdTag } from "../db/cache/jobListings";
import { db } from "@/drizzle/db";
import { JobListingTable } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";

export const createJobListing = async (
  unsafeData: z.infer<typeof jobListingSchema>,
) => {
  const { orgId } = await getCurrentOrganization();
  if (orgId == null) {
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
  if (orgId == null) {
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

  const jobListing = await getJobListing(id, orgId);
  const updatedJobListing = await updateJobListingDB(id, data);

  redirect(`/employer/job-listings/${updatedJobListing.id}`);
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
