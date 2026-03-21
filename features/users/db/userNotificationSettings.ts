import { db } from "@/drizzle/db";
import { UserNotificationSettingsTable } from "@/drizzle/schema";
import { revalidateNotificationSettingsCache } from "./cache/userNotificationSettings";
import { eq } from "drizzle-orm";

export const insertUserNotificationSettings = async (
  settings: typeof UserNotificationSettingsTable.$inferInsert,
) => {
  await db
    .insert(UserNotificationSettingsTable)
    .values(settings)
    .onConflictDoNothing();

  revalidateNotificationSettingsCache(settings.userId);
};

export const updateUserNotificationSettings = async (
  userId: string,
  settings: Partial<typeof UserNotificationSettingsTable.$inferInsert>,
) => {
  await db
    .insert(UserNotificationSettingsTable)
    .values({ ...settings, userId })
    .onConflictDoUpdate({
      target: UserNotificationSettingsTable.userId,
      set: settings,
    });

  revalidateNotificationSettingsCache(userId);
};
