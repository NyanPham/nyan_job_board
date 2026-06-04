import { db } from "@/drizzle/db";
import { JobListingApplicationTable } from "@/drizzle/schema";
import { revalidateJobListingApplicationCache } from "./cache/jobListingApplications";
import { and, eq } from "drizzle-orm";

export const insertJobListingApplication = async (
  application: typeof JobListingApplicationTable.$inferInsert,
) => {
  const [inserted] = await db
    .insert(JobListingApplicationTable)
    .values(application)
    .onConflictDoNothing({
      target: [
        JobListingApplicationTable.jobListingId,
        JobListingApplicationTable.userId,
      ],
    })
    .returning();

  revalidateJobListingApplicationCache(application);
  return inserted;
};

export const updateJobListingApplication = async (
  {
    jobListingId,
    userId,
  }: {
    jobListingId: string;
    userId: string;
  },
  data: Partial<typeof JobListingApplicationTable.$inferInsert>,
) => {
  await db
    .update(JobListingApplicationTable)
    .set(data)
    .where(
      and(
        eq(JobListingApplicationTable.jobListingId, jobListingId),
        eq(JobListingApplicationTable.userId, userId),
      ),
    );

  revalidateJobListingApplicationCache({ jobListingId, userId });
};
