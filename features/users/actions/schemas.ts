import z from "zod";

export const userNotificationSettingsSchema = z.object({
  newJobEmailNotifications: z.boolean(),
  aiPrompt: z
    .string()
    .transform((v) => (v.trim() === "" ? null : v))
    .nullable(),
});
