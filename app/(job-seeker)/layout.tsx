import AppSidebar from "@/components/sidebar/AppSidebar";
import SidebarNavMenuGroup from "@/components/sidebar/SidebarNavMenuGroup";
import { SidebarUserButton } from "@/features/users/components/SidebarUserButton";
import { BrainCircuitIcon, ClipboardListIcon, LogInIcon } from "lucide-react";
import { ReactNode } from "react";

const JobSeekerLayout = ({ children }: { children: ReactNode }) => {
  return (
    <AppSidebar
      content={
        <SidebarNavMenuGroup
          className="mt-auto"
          items={[
            {
              href: "/",
              icon: <ClipboardListIcon />,
              label: "Job Board",
            },
            {
              href: "/ai-search",
              icon: <BrainCircuitIcon />,
              label: "AI Search",
            },
            {
              href: "/employer",
              icon: <ClipboardListIcon />,
              label: "Employer Dashboard",
              authStatus: "signedIn",
            },
            {
              href: "/sign-in",
              icon: <LogInIcon />,
              label: "Sign In",
              authStatus: "signedOut",
            },
          ]}
        />
      }
      footerButton={<SidebarUserButton />}
    >
      {children}
    </AppSidebar>
  );
};

export default JobSeekerLayout;
