import { getGlobalTag, getIdTag } from "@/lib/dataCache";
import { revalidateTag } from "next/cache";

export const getOrganizationUserSettingsGlobalTag = () =>
  getGlobalTag("organizationUserSettings");

export const getOrganizationUserSettingsIdTag = ({
  userId,
  organizationId,
}: {
  userId: string;
  organizationId: string;
}) => getIdTag("organizationUserSettings", `${organizationId}-${userId}`);

export const revalidateOrganizationUserSettingsCache = (id: {
  organizationId: string;
  userId: string;
}) => {
  revalidateTag(getOrganizationUserSettingsGlobalTag(), "");
  revalidateTag(getOrganizationUserSettingsIdTag(id), "");
};
