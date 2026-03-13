import { ReactNode } from "react";
import { auth } from "@clerk/nextjs/server";

export const SignedOut = async ({ children }: { children: ReactNode }) => {
  const { userId } = await auth();

  return !userId ? <>{children}</> : null;
};

export const SignedIn = async ({ children }: { children: ReactNode }) => {
  const { userId } = await auth();

  return userId ? <>{children}</> : null;
};
