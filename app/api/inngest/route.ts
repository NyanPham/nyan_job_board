import { serve } from "inngest/next";
import { inngest } from "@/services/inngest/client";
import {
  clerkCreateOrganization,
  clerkCreateOrgMembership,
  clerkCreateUser,
  clerkDeleteOrganization,
  clerkDeleteOrgMembership,
  clerkDeleteUser,
  clerkUpdateOrganization,
  clerkUpdateUser,
} from "@/services/inngest/functions/clerk";
import { createdAIsummaryOfUploadedResume } from "@/services/inngest/functions/resume";
import { rankApplication } from "@/services/inngest/functions/jobListingApplication";
import {
  prepareDailyUserJobListingNotifications,
  sendDailyUserJobListingEmail,
} from "@/services/inngest/functions/email";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    clerkCreateUser,
    clerkUpdateUser,
    clerkDeleteUser,
    clerkCreateOrganization,
    clerkUpdateOrganization,
    clerkDeleteOrganization,
    clerkCreateOrgMembership,
    clerkDeleteOrgMembership,
    createdAIsummaryOfUploadedResume,
    rankApplication,
    prepareDailyUserJobListingNotifications,
    sendDailyUserJobListingEmail,
  ],
});
