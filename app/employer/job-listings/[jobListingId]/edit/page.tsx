import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/drizzle/db";
import { JobListingTable } from "@/drizzle/schema";
import JobListingForm from "@/features/jobListings/components/JobListingForm";
import {
  getJobListingGlobalTag,
  getJobListingIdTag,
} from "@/features/jobListings/db/cache/jobListings";
import { getCurrentOrganization } from "@/services/clerk/lib/getCurrentAuth";
import { and, eq } from "drizzle-orm";
import { cacheTag } from "next/cache";
import { notFound } from "next/navigation";
import { Suspense } from "react";

type Props = {
  params: Promise<{ jobListingId: string }>;
};

const EditJobListingPage = (props: Props) => {
  return (
    <div className="max-w-5xl max-auto p-4">
      <h1 className="text-2xl font-bold mb-2">Edit Job Listing</h1>
      <Card>
        <CardContent>
          <Suspense>
            <SuspendedPage {...props} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
};

const SuspendedPage = async ({ params }: Props) => {
  const { jobListingId } = await params;
  const { orgId } = await getCurrentOrganization();

  if (orgId == null) return notFound();

  const jobListing = await getJobListing(jobListingId, orgId);

  return <JobListingForm jobListing={jobListing} />;
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

export default EditJobListingPage;
