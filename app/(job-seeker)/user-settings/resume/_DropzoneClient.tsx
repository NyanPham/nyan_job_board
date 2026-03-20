"use client";

import { UploadDropzone } from "@/services/uploadthing/components/UploadThing";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const DropzoneClient = () => {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <UploadDropzone
      endpoint={"resumeUploader"}
      onClientUploadComplete={() => router.refresh()}
    />
  );
};

export default DropzoneClient;
