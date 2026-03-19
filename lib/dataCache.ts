type CacheTag =
  | "users"
  | "organizations"
  | "jobListings"
  | "userNotificationSettings"
  | "userResumes"
  | "jobListingApplications"
  | "organizationUserSettings";

export const getGlobalTag = (tag: CacheTag) => `global:${tag}` as const;

export const getJobListingTag = (tag: CacheTag, jobListingId: string) =>
  `jobListing:${jobListingId}-${tag}` as const;

export const getOrganizationTag = (tag: CacheTag, organizationId: string) =>
  `organization:${organizationId}-${tag}` as const;

export const getIdTag = (tag: CacheTag, id: string) =>
  `id:${id}-${tag}` as const;
