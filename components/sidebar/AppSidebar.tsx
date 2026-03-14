import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebarClient } from "./_AppSidebarClient";
import { SignedIn } from "@/services/clerk/components/SignedInStatus";
import { ReactNode } from "react";

export default async function AppSidebar({
  children,
  content,
  footerButton,
}: {
  children: ReactNode;
  content: ReactNode;
  footerButton: ReactNode;
}) {
  return (
    <SidebarProvider className="overflow-y-hidden">
      <AppSidebarClient>
        <Sidebar collapsible="icon" className="overflow-y-hidden">
          <SidebarHeader className="flex-row">
            <SidebarTrigger />
            <span className="text-xl text-nowrap">Nyan Jobs</span>
          </SidebarHeader>
          <SidebarContent>
            {content}
            {/* <SidebarGroup>
              <SidebarMenu>
                <SignedOut>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href={"/sign-in"}>
                        <LogInIcon />
                        <span>Login</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SignedOut>
              </SidebarMenu>
            </SidebarGroup> */}
          </SidebarContent>
          <SignedIn>
            <SidebarFooter>
              <SidebarMenu>
                <SidebarMenuItem>
                  {footerButton}
                  {/* <SidebarUserButton /> */}
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
          </SignedIn>
        </Sidebar>
        <main className="flex-1">{children}</main>
      </AppSidebarClient>
    </SidebarProvider>
  );
}
