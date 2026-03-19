import AsyncIf from "@/components/AsyncIf";
import AppSidebar from "@/components/sidebar/AppSidebar";
import SidebarNavMenuGroup from "@/components/sidebar/SidebarNavMenuGroup";
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { db } from "@/drizzle/db";
import {
  JobListingApplicationTable,
  JobListingStatusEnum,
  JobListingTable,
} from "@/drizzle/schema";
import { getJobListingApplicationJobListingTag } from "@/features/jobListingApplications/db/cache/jobListingApplications";
import { getJobListingOrganizationTag } from "@/features/jobListings/db/cache/jobListings";
import { sortJobListingByStatus } from "@/features/jobListings/lib/utils";
import { SidebarOrganizationButton } from "@/features/organizations/components/SidebarOrganizationbutton";
import { getCurrentOrganization } from "@/services/clerk/lib/getCurrentAuth";
import { hasOrgUserPermission } from "@/services/clerk/lib/orgUserPermissions";
import { count, desc, eq } from "drizzle-orm";
import { ClipboardListIcon, PlusIcon } from "lucide-react";
import { cacheTag } from "next/cache";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ReactNode, Suspense } from "react";
import JobListingMenuGroup from "./_JobListingMenuGroup";

const EmployerLayout = ({ children }: { children: ReactNode }) => {
  return (
    <Suspense>
      <LayoutSuspense>{children}</LayoutSuspense>
    </Suspense>
  );
};

const LayoutSuspense = async ({ children }: { children: ReactNode }) => {
  const { orgId } = await getCurrentOrganization();

  if (orgId == null) {
    return redirect("/organizations/select");
  }

  return (
    <AppSidebar
      content={
        <>
          <SidebarGroup>
            <SidebarGroupLabel>Job Listings</SidebarGroupLabel>
            <AsyncIf
              condition={() => hasOrgUserPermission("org:job_listings:create")}
            >
              <SidebarGroupAction
                href="/employer/job-listings/new"
                title="Add Job Listing"
              >
                <PlusIcon /> <span className="sr-only">Add Job Listing</span>
              </SidebarGroupAction>
            </AsyncIf>
            <SidebarGroupContent className="group-data-[state=collapsed:hidden">
              <Suspense>
                <JobListingMenu orgId={orgId} />
              </Suspense>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarNavMenuGroup
            className="mt-auto"
            items={[
              {
                href: "/",
                icon: <ClipboardListIcon />,
                label: "Job Board",
              },
            ]}
          />
        </>
      }
      footerButton={<SidebarOrganizationButton />}
    >
      {children}
    </AppSidebar>
  );
};

const JobListingMenu = async ({ orgId }: { orgId: string }) => {
  const jobListings = await getJobListings(orgId);

  if (
    jobListings.length === 0 &&
    (await hasOrgUserPermission("org:job_listings:create"))
  ) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <Link href="/employer/job-listings/new">
              <PlusIcon />
              <span>Create your first job listing</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return Object.entries(Object.groupBy(jobListings, (j) => j.status))
    .sort(([a], [b]) => {
      return sortJobListingByStatus(
        a as JobListingStatusEnum,
        b as JobListingStatusEnum,
      );
    })
    .map(([status, jobListings]) => {
      return (
        <JobListingMenuGroup
          key={status}
          status={status as JobListingStatusEnum}
          jobListings={jobListings}
        />
      );
    });
};

const getJobListings = async (orgId: string) => {
  "use cache";

  cacheTag(getJobListingOrganizationTag(orgId));

  const data = await db
    .select({
      id: JobListingTable.id,
      title: JobListingTable.title,
      status: JobListingTable.status,
      applicationCount: count(JobListingApplicationTable.userId),
    })
    .from(JobListingTable)
    .where(eq(JobListingTable.organizationId, orgId))
    .leftJoin(
      JobListingApplicationTable,
      eq(JobListingTable.id, JobListingApplicationTable.jobListingId),
    )
    .groupBy(JobListingApplicationTable.jobListingId, JobListingTable.id)
    .orderBy(desc(JobListingTable.createdAt));

  data.forEach((jobListing) => {
    cacheTag(getJobListingApplicationJobListingTag(jobListing.id));
  });

  return data;
};

export default EmployerLayout;
