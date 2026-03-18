import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelpers";
import { OrganizationTable } from "./organization";
import { relations } from "drizzle-orm";
import { JobListingApplicationTable } from "./jobListingApplication";

export const wageIntervals = ["hourly", "yearly"] as const;
export type WageIntervalEnum = (typeof wageIntervals)[number];
export const wageIntervalEnum = pgEnum(
  "job_listing_wage_interval",
  wageIntervals,
);

export const locationRequirements = ["in-office", "hybrid", "remote"] as const;
export type LocationRequirementEnum = (typeof locationRequirements)[number];
export const locationRequirementEnum = pgEnum(
  "job_listing_location_requirement",
  locationRequirements,
);

export const experienceLevels = ["junior", "mid-level", "senior"] as const;
export type ExperienceLevelEnum = (typeof experienceLevels)[number];
export const experienceLevelEnum = pgEnum(
  "job_listing_experience_level",
  experienceLevels,
);

export const jobListingStatuses = ["draft", "published", "delisted"] as const;
export type JobListingStatusEnum = (typeof jobListingStatuses)[number];
export const jobListingStatusEnum = pgEnum(
  "job_listing_status",
  jobListingStatuses,
);

export const jobListingTypes = [
  "internship",
  "part-time",
  "full-time",
] as const;
export type JobListingTypeEnum = (typeof jobListingTypes)[number];
export const jobListingTypeEnum = pgEnum("job_listing_types", jobListingTypes);

export const JobListingTable = pgTable(
  "job_listings",
  {
    id,
    organizationId: varchar()
      .references(() => OrganizationTable.id, { onDelete: "cascade" })
      .notNull(),
    title: varchar().notNull(),
    description: text().notNull(),
    wage: integer(),
    wageInterval: wageIntervalEnum(),
    stateAbbreviation: varchar(),
    city: varchar(),
    isFeatured: boolean().notNull().default(false),
    locationRequirement: locationRequirementEnum().notNull(),
    experienceLevel: experienceLevelEnum().notNull(),
    status: jobListingStatusEnum().notNull().default("draft"),
    type: jobListingTypeEnum().notNull(),
    postedAt: timestamp({ withTimezone: true }),
    createdAt,
    updatedAt,
  },
  (table) => [index().on(table.stateAbbreviation)],
);

export const jobListingReferences = relations(
  JobListingTable,
  ({ one, many }) => ({
    organzation: one(OrganizationTable, {
      fields: [JobListingTable.organizationId],
      references: [OrganizationTable.id],
    }),
    applicatons: many(JobListingApplicationTable),
  }),
);
