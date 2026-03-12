import { ReactNode, Suspense } from "react";
import { auth } from "@clerk/nextjs/server";

export const SignedOut = async ({ children }: { children: ReactNode }) => {
  const { userId } = await auth();

  return <Suspense>{!userId && children}</Suspense>;
};

export const SignedIn = async ({ children }: { children: ReactNode }) => {
  const { userId } = await auth();

  return <Suspense>{userId && children}</Suspense>;
};
