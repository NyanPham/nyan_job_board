import AppSidebar from "@/components/sidebar/AppSidebar";
import SidebarNavMenuGroup from "@/components/sidebar/SidebarNavMenuGroup";
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { SidebarOrganizationButton } from "@/features/organizations/components/SidebarOrganizationbutton";
import { getCurrentOrganization } from "@/services/clerk/lib/getCurrentAuth";
import { ClipboardListIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ReactNode, Suspense } from "react";

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
            <SidebarGroupAction href="/employer/job-listings/new" title="Add Job Listing">
              <PlusIcon /> <span className="sr-only">Add Job Listing</span>
            </SidebarGroupAction>
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

export default EmployerLayout;
