import { auth } from "@clerk/nextjs/server";
import { Suspense } from "react";
import SidebarUserButtonClient from "./SidebarUserButtonClient";

export const SidebarUserButton = () => {
  return (
    <Suspense>
      <SidebarUserSuspense />
    </Suspense>
  );
};

const SidebarUserSuspense = async () => {
  const { userId } = await auth();
  return (
    <SidebarUserButtonClient
      user={{ email: "nyanphamdev@gmail.com", name: "NyanPham", imageUrl: "" }}
    />
  );
};
