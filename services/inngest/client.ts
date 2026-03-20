import {
  DeletedObjectJSON,
  OrganizationJSON,
  UserJSON,
} from "@clerk/nextjs/types";
import { EventSchemas, Inngest } from "inngest";

type ClerkWebHookData<T> = {
  data: {
    data: T;
    raw: string;
    headers: Record<string, string>;
  };
};

type Events = {
  "clerk/user.created": ClerkWebHookData<UserJSON>;
  "clerk/user.updated": ClerkWebHookData<UserJSON>;
  "clerk/user.deleted": ClerkWebHookData<DeletedObjectJSON>;

  "clerk/organization.created": ClerkWebHookData<OrganizationJSON>;
  "clerk/organization.updated": ClerkWebHookData<OrganizationJSON>;
  "clerk/organization.deleted": ClerkWebHookData<DeletedObjectJSON>;

  "app/jobListingApplication.created": {
    data: {
      jobListingId: string;
      userId: string;
    };
  };

  "app/resume.uploaded": {
    user: {
      id: string;
    };
  };
};

export const inngest = new Inngest({
  id: "nyan-job-board",
  schemas: new EventSchemas().fromRecord<Events>(),
});
