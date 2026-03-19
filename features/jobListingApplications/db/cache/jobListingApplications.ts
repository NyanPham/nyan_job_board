import { getGlobalTag, getIdTag, getJobListingTag } from "@/lib/dataCache";
import { revalidateTag } from "next/cache";

export const getJobListingApplicationGlobalTag = () => {
  return getGlobalTag("jobListingApplications");
};

export const getJobListingApplicationJobListingTag = (jobListingId: string) => {
  return getJobListingTag("jobListingApplications", jobListingId);
};

export const getJobListingApplicationIdTag = ({
  jobListingId,
  userId,
}: {
  jobListingId: string;
  userId: string;
}) => {
  return getIdTag("jobListingApplications", `${jobListingId}-${userId}`);
};

export const revalidateJobListingApplicationCache = (id: {
  userId: string;
  jobListingId: string;
}) => {
  revalidateTag(getJobListingApplicationGlobalTag(), "");
  revalidateTag(getJobListingApplicationJobListingTag(id.jobListingId), "");
  revalidateTag(getJobListingApplicationIdTag(id), "");
};
