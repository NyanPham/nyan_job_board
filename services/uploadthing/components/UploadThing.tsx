"use client"

import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";

import { CustomFileRouter } from "../router";
import { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { UploadThingError } from "uploadthing/server";
import { Json } from "@uploadthing/shared";

// const UploadButtonComponent = generateUploadButton<CustomFileRouter>();
const UploadDropzoneComponent = generateUploadDropzone<CustomFileRouter>();

export const UploadDropzone = ({
  className,
  onClientUploadComplete,
  onUploadError,
  ...props
}: ComponentProps<typeof UploadDropzoneComponent>) => {
  return (
    <UploadDropzoneComponent
      {...props}
      className={cn(
        "border-dashed border-2 border-muted rounde-lg flex items-center justify-center",
        className,
      )}
      onClientUploadComplete={(res) => {
        res.forEach(({ serverData }) => {
          toast.success(serverData.message);
        });
        onClientUploadComplete?.(res);
      }}
      onUploadError={(error: UploadThingError<Json>) => {
        toast.success(error.message);
        onUploadError?.(error);
      }}
    />
  );
};
