"use client";

import { useUser } from "@clerk/nextjs";
import { ReactNode } from "react";

export const SignedOut = ({ children }: { children: ReactNode }) => {
  const { isSignedIn } = useUser();

  if (isSignedIn === false) {
    return <>{children}</>;
  }

  return null;
};

export const SignedIn = ({ children }: { children: ReactNode }) => {
  const { isSignedIn } = useUser();

  if (isSignedIn) {
    return <>{children}</>;
  }

  return null;
};
