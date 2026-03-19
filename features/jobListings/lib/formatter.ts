import {
  ExperienceLevelEnum,
  JobListingStatusEnum,
  JobListingTypeEnum,
  LocationRequirementEnum,
  WageIntervalEnum,
} from "@/drizzle/schema";

export const formatWageInterval = (interval: WageIntervalEnum) => {
  switch (interval) {
    case "hourly":
      return "Hour";
    case "yearly":
      return "Year";
    default:
      throw new Error(`Invalid wage interval: ${interval satisfies never}`);
  }
};

export const formatLocationRequirement = (
  locationRequirement: LocationRequirementEnum,
) => {
  switch (locationRequirement) {
    case "remote":
      return "Remote";
    case "in-office":
      return "In Office";
    case "hybrid":
      return "Hybrid";
    default:
      throw new Error(
        `Unknown location requirement: ${locationRequirement satisfies never}`,
      );
  }
};

export const formatJobType = (type: JobListingTypeEnum) => {
  switch (type) {
    case "internship":
      return "Internship";
    case "part-time":
      return "Part-Time";
    case "full-time":
      return "Full-Time";
    default:
      throw new Error(`Unknown job type: ${type satisfies never}`);
  }
};
export const formatExperienceLevel = (experienceLevel: ExperienceLevelEnum) => {
  switch (experienceLevel) {
    case "junior":
      return "Junior";
    case "mid-level":
      return "Mid-Level";
    case "senior":
      return "Senior";
    default:
      throw new Error(
        `Unknown experience level: ${experienceLevel satisfies never}`,
      );
  }
};

export const formatJobListing = (status: JobListingStatusEnum) => {
  switch (status) {
    case "published":
      return "Active";
    case "draft":
      return "Draft";
    case "delisted":
      return "Delisted";
    default:
      throw new Error(`Unknown status: ${status satisfies never}`);
  }
};

export const formatWage = (wage: number, wageInterval: WageIntervalEnum) => {
  const wageFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  });

  switch (wageInterval) {
    case "hourly":
      return `${wageFormatter.format(wage)} / hr`;
    case "yearly":
      return wageFormatter.format(wage);
    default:
      throw new Error(`Unknown wage interval: ${wageInterval satisfies never}`);
  }
};

export const formatJobListingLocation = ({
  stateAbbreviation,
  city,
}: {
  stateAbbreviation: string | null;
  city: string | null;
}) => {
  if (stateAbbreviation == null && city == null) return "None";

  const locationParts = [];
  if (city != null) locationParts.push(city);
  if (stateAbbreviation != null) {
    locationParts.push(stateAbbreviation.toUpperCase());
  }

  return locationParts.join(", ");
};

export function formatJobListingStatus(status: JobListingStatusEnum) {
  switch (status) {
    case "published":
      return "Active";
    case "draft":
      return "Draft";
    case "delisted":
      return "Delisted";
    default:
      throw new Error(`Unknown status: ${status satisfies never}`);
  }
}
