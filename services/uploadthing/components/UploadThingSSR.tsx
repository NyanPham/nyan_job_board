import { connection } from "next/server";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { customFileRouter } from "../router";
import { Suspense } from "react";

export const UploadThingSSR = () => {
  return (
    <Suspense>
      <UTSSR />
    </Suspense>
  );
};

const UTSSR = async () => {
  await connection();
  return <NextSSRPlugin routerConfig={extractRouterConfig(customFileRouter)} />;
};
