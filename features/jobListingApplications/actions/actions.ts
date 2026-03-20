"use server";

import { db } from "@/drizzle/db";
import { JobListingTable, UserResumeTable } from "@/drizzle/schema";
import { getJobListingIdTag } from "@/features/jobListings/db/cache/jobListings";
import { getUserResumeIdTag } from "@/features/users/db/cache/userResume";
import { getCurrentUser } from "@/services/clerk/lib/getCurrentAuth";
import { and, eq } from "drizzle-orm";
import { cacheTag } from "next/cache";
import z from "zod";
import { newJobListingApplicationSchema } from "./schemas";
import { insertJobListingApplication } from "../db/jobListingApplication";
import { inngest } from "@/services/inngest/client";

export const createJobListingApplication = async (
  jobListingId: string,
  unsafeData: z.infer<typeof newJobListingApplicationSchema>,
) => {
  const permissionErr = {
    error: true,
    message: "You don't have permission to submit an application",
  };

  const { userId } = await getCurrentUser();
  if (userId == null) return permissionErr;

  const [userResume, jobListing] = await Promise.all([
    getUserResume(userId),
    getPublicJobListing(jobListingId),
  ]);

  if (jobListing == null) return permissionErr;
  // if (userResume == null || jobListing == null) return permissionErr;

  const { success, data } =
    newJobListingApplicationSchema.safeParse(unsafeData);

  if (!success) {
    return {
      error: true,
      message: "There was an error submitting your application",
    };
  }

  await insertJobListingApplication({
    jobListingId,
    userId,
    ...data,
  });

  // TODO: AI generation

  await inngest.send({
    name: "app/jobListingApplication.created",
    data: {
      jobListingId,
      userId,
    }
  })

  return {
    error: false,
    message: "Your application was successfully submitted!",
  };
};

const getPublicJobListing = async (id: string) => {
  "use cache";
  cacheTag(getJobListingIdTag(id));

  return db.query.JobListingTable.findFirst({
    where: and(
      eq(JobListingTable.id, id),
      eq(JobListingTable.status, "published"),
    ),
    columns: {
      id: true,
    },
  });
};

const getUserResume = async (userId: string) => {
  "use cache";
  cacheTag(getUserResumeIdTag(userId));

  return db.query.UserResumeTable.findFirst({
    where: and(eq(UserResumeTable.userId, userId)),
    columns: {
      userId: true,
    },
  });
};
