import {
  boolean,
  integer,
  pgTable,
  primaryKey,
  varchar,
} from "drizzle-orm/pg-core";
import { UserTable } from "./user";
import { OrganizationTable } from "./organization";
import { createdAt, updatedAt } from "../schemaHelpers";
import { relations } from "drizzle-orm";

export const OrganiazationUserSettingsTable = pgTable(
  "organization_user_settings",
  {
    userId: varchar()
      .notNull()
      .references(() => UserTable.id),
    organizationId: varchar()
      .notNull()
      .references(() => OrganizationTable.id),
    newApplicationEmailNotifications: boolean().notNull().default(false),
    minimumRating: integer(),
    createdAt,
    updatedAt,
  },
  (table) => [primaryKey({ columns: [table.userId, table.organizationId] })],
);

export const organizationUserSettingsRelations = relations(
  OrganiazationUserSettingsTable,
  ({ one }) => ({
    user: one(UserTable, {
      fields: [OrganiazationUserSettingsTable.userId],
      references: [UserTable.id],
    }),
    organization: one(OrganizationTable, {
      fields: [OrganiazationUserSettingsTable.userId],
      references: [OrganizationTable.id],
    }),
  }),
);
