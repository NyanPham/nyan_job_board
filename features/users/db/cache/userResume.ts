import { getGlobalTag, getIdTag } from "@/lib/dataCache";
import { revalidateTag } from "next/cache";

export const getUserResumeGlobalTag = () => {
  return getGlobalTag("userResumes");
};

export const getUserResumeIdTag = (userId: string) => {
  return getIdTag("userResumes", userId);
};

export const revalidateUserResumeCache = (userId: string) => {
  revalidateTag(getUserResumeGlobalTag(), "");
  revalidateTag(getUserResumeIdTag(userId), "");
};
