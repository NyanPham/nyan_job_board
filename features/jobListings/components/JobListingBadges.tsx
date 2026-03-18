import { Badge } from "@/components/ui/badge";
import { JobListingTable } from "@/drizzle/schema";
import { cn } from "@/lib/utils";
import { ComponentProps } from "react";
import {
  formatExperienceLevel,
  formatJobListingLocation,
  formatJobType,
  formatLocationRequirement,
  formatWage,
  formatWageInterval,
} from "../lib/formatter";
import {
  BanknoteIcon,
  BuildingIcon,
  GraduationCapIcon,
  HourglassIcon,
  MapPinIcon,
} from "lucide-react";

const JobListingBadges = ({
  jobListing: {
    isFeatured,
    wage,
    wageInterval,
    stateAbbreviation,
    city,
    type,
    experienceLevel,
    locationRequirement,
  },
  className,
}: {
  jobListing: Pick<
    typeof JobListingTable.$inferSelect,
    | "wage"
    | "wageInterval"
    | "stateAbbreviation"
    | "city"
    | "type"
    | "experienceLevel"
    | "locationRequirement"
    | "isFeatured"
  >;
  className?: string;
}) => {
  const badgeProps = {
    variant: "outline",
    className: cn(isFeatured && "border-primary/35"),
  } satisfies ComponentProps<typeof Badge>;

  return (
    <>
    {isFeatured && (
        <Badge {...badgeProps} className={cn(className, "border-featured bg-featured/50 text-featured-foreground")}>Featured</Badge>
    )}
      {wage != null && wageInterval != null && (
        <Badge {...badgeProps}>
          <BanknoteIcon />
          {formatWage(wage, wageInterval)}
        </Badge>
      )}
      {(stateAbbreviation != null || city != null) && (
        <Badge {...badgeProps}>
          <MapPinIcon className="size-10" />
          {formatJobListingLocation({ stateAbbreviation, city })}
        </Badge>
      )}
      <Badge {...badgeProps}>
        <BuildingIcon className="size-10" />
        {formatLocationRequirement(locationRequirement)}
      </Badge>
      <Badge {...badgeProps}>
        <HourglassIcon className="size-10" />
        {formatJobType(type)}
      </Badge>
      <Badge {...badgeProps}>
        <GraduationCapIcon className="size-10" />
        {formatExperienceLevel(experienceLevel)}
      </Badge>
    </>
  );
};

export default JobListingBadges;
