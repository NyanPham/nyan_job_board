import { ReactNode } from "react";

const ClerkLayout = ({ children }: { children: ReactNode }) => {
  return <div className="flex h-screen w-screen items-center justify-center">{children}</div>;
};

export default ClerkLayout;
