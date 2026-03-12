import { auth } from "@clerk/nextjs/server";
import { Suspense } from "react";
import SidebarUserButtonClient from "./SidebarUserButtonClient";
import { getCurrentUser } from "@/services/clerk/lib/getCurrentUser";

export const SidebarUserButton = () => {
  return (
    <Suspense>
      <SidebarUserSuspense />
    </Suspense>
  );
};

const SidebarUserSuspense = async () => {
  const { user } = await getCurrentUser({ allData: true });

  return (
    <SidebarUserButtonClient
      user={...user}
    />
  );
};
