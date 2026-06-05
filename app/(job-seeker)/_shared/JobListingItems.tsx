import { AvatarImage, Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/drizzle/db";
import {
  experienceLevels,
  JobListingTable,
  jobListingTypes,
  locationRequirements,
  OrganizationTable,
} from "@/drizzle/schema";
import { convertSearchParamsToString } from "@/lib/convertSearchParamsToString";
import { cn } from "@/lib/utils";
import { and, count, desc, eq, ilike, or, SQL } from "drizzle-orm";
import Link from "next/link";
import { Suspense } from "react";
import { differenceInDays } from "date-fns";
import { connection } from "next/server";
import { Badge } from "@/components/ui/badge";
import JobListingBadges from "@/features/jobListings/components/JobListingBadges";
import z from "zod";
import { cacheTag } from "next/cache";
import { getJobListingGlobalTag } from "@/features/jobListings/db/cache/jobListings";
import { getOrganizationIdTag } from "@/features/organizations/db/cache/organization";
import { Pagination } from "@/components/Pagination";

type Props = {
  searchParams: Promise<Record<string, string | string[]>>;
  params?: Promise<{ jobListingId: string }>;
};

const searchParamsSchema = z.object({
  title: z.string().optional().catch(undefined),
  city: z.string().optional().catch(undefined),
  state: z.string().optional().catch(undefined),
  experience: z.enum(experienceLevels).optional().catch(undefined),
  locationRequirement: z.enum(locationRequirements).optional().catch(undefined),
  type: z.enum(jobListingTypes).optional().catch(undefined),
  jobIds: z
    .union([z.string().uuid(), z.array(z.string().uuid())])
    .transform((v) => (Array.isArray(v) ? v : [v]))
    .optional()
    .catch([]),
  page: z.coerce.number().min(1).optional().default(1),
});

const JobListingItems = (props: Props) => {
  return (
    <Suspense>
      <SuspendedComponent {...props} />
    </Suspense>
  );
};

const SuspendedComponent = async ({ searchParams, params }: Props) => {
  const jobListingId = params ? (await params).jobListingId : undefined;
  const rawParams = await searchParams;
  const { success, data } = searchParamsSchema.safeParse(rawParams);
  const search = success ? data : { page: 1 };
  const LIMIT = 10;

  const {
    data: jobListings,
    totalPages,
    currentPage,
  } = await getJobListings(search, jobListingId, LIMIT);
  if (jobListings.length === 0) {
    return (
      <div className="text-muted-foreground p-4">No job listings found</div>
    );
  }

  return (
    <div className="space-y-4">
      {jobListings.map((jobListing) => {
        const isActive = jobListing.id === jobListingId;

        return (
          <Link
            className={cn(
              "block rounded-lg transition-all duration-200",
              isActive
                ? "ring-2 ring-primary shadow-md bg-accent/10" // Đang chọn: viền sáng, nổi bóng, nền hơi đậm
                : "hover:ring-1 hover:ring-primary/50 opacity-90 hover:opacity-100", // Bình thường: hover xịn xò
            )}
            key={jobListing.id}
            href={`/job-listings/${jobListing.id}?${convertSearchParamsToString(rawParams)}`}
          >
            <JobListingListItem
              jobListing={jobListing}
              organization={jobListing.organization}
            />
          </Link>
        );
      })}
      <Pagination totalPages={totalPages} currentPage={currentPage} />
    </div>
  );
};

const JobListingListItem = ({
  jobListing,
  organization,
}: {
  jobListing: Pick<
    typeof JobListingTable.$inferSelect,
    | "title"
    | "stateAbbreviation"
    | "city"
    | "wage"
    | "wageInterval"
    | "experienceLevel"
    | "type"
    | "postedAt"
    | "locationRequirement"
    | "isFeatured"
  >;
  organization: Pick<
    typeof OrganizationTable.$inferSelect,
    "name" | "imageUrl"
  >;
}) => {
  const nameInitials = organization?.name
    .split(" ")
    .splice(0, 4)
    .map((word) => word[0])
    .join("");

  return (
    <Card
      className={cn(
        "@container",
        jobListing.isFeatured && "border-featured bg-featured/20",
      )}
    >
      <CardHeader>
        <div className="flex gap-4">
          <Avatar className="size-14 @max-sm:hidden">
            <AvatarImage
              src={organization.imageUrl ?? undefined}
              alt={organization.name}
            />
            <AvatarFallback className="uppercase bg-primary text-primary-foreground">
              {nameInitials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1">
            <CardTitle className="text-xl">{jobListing.title}</CardTitle>
            <CardDescription className="text-base">
              {organization.name}
            </CardDescription>
            {jobListing.postedAt != null && (
              <div className="text-sm font-medium text-primary @min-md:hidden">
                <Suspense fallback={jobListing.postedAt.toLocaleDateString()}>
                  <DaysSincePosting postedAt={jobListing.postedAt} />
                </Suspense>
              </div>
            )}
          </div>
          {jobListing.postedAt != null && (
            <div className="text-sm font-medium text-primary ml-auto @max-md:hidden">
              <Suspense fallback={jobListing.postedAt.toLocaleDateString()}>
                <DaysSincePosting postedAt={jobListing.postedAt} />
              </Suspense>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        <JobListingBadges
          jobListing={jobListing}
          className={jobListing.isFeatured ? "border-primary/35" : undefined}
        />
      </CardContent>
    </Card>
  );
};

const DaysSincePosting = async ({ postedAt }: { postedAt: Date }) => {
  await connection();
  const daysSincePosted = differenceInDays(postedAt, Date.now());

  if (daysSincePosted === 0) {
    return <Badge>New</Badge>;
  }

  return new Intl.RelativeTimeFormat(undefined, {
    style: "narrow",
    numeric: "always",
  }).format(daysSincePosted, "days");
};

const getJobListings = async (
  searchParams: z.infer<typeof searchParamsSchema>,
  jobListingId: string | undefined,
  limit: number = 10,
) => {
  "use cache";
  cacheTag(getJobListingGlobalTag());

  const whereConditions: (SQL | undefined)[] = [];
  if (searchParams.title) {
    whereConditions.push(
      ilike(JobListingTable.title, `%${searchParams.title}%`),
    );
  }

  if (searchParams.locationRequirement) {
    whereConditions.push(
      eq(JobListingTable.locationRequirement, searchParams.locationRequirement),
    );
  }

  if (searchParams.city) {
    whereConditions.push(ilike(JobListingTable.city, `%${searchParams.city}%`));
  }

  if (searchParams.state) {
    whereConditions.push(
      eq(JobListingTable.stateAbbreviation, searchParams.state),
    );
  }

  if (searchParams.experience) {
    whereConditions.push(
      eq(JobListingTable.experienceLevel, searchParams.experience),
    );
  }

  if (searchParams.type) {
    whereConditions.push(eq(JobListingTable.type, searchParams.type));
  }

  const validJobIds = (searchParams.jobIds ?? []).filter(Boolean);
  if (validJobIds.length > 0) {
    whereConditions.push(
      or(...validJobIds.map((jobId) => eq(JobListingTable.id, jobId))),
    );
  }

  const whereClause = or(
    jobListingId
      ? and(
          eq(JobListingTable.status, "published"),
          eq(JobListingTable.id, jobListingId),
        )
      : undefined,
    and(eq(JobListingTable.status, "published"), ...whereConditions),
  );

  const [{ total }] = await db
    .select({ total: count() })
    .from(JobListingTable)
    .where(whereClause);

  const offset = ((searchParams.page ?? 1) - 1) * limit;

  const data = await db.query.JobListingTable.findMany({
    where: whereClause,
    with: {
      organization: {
        columns: {
          id: true,
          name: true,
          imageUrl: true,
        },
      },
    },
    orderBy: [desc(JobListingTable.isFeatured), desc(JobListingTable.postedAt)],
    limit: limit,
    offset: offset,
  });

  data.forEach((listing) => {
    cacheTag(getOrganizationIdTag(listing.organization.id));
  });

  return {
    data,
    totalPages: Math.ceil(total / limit),
    currentPage: searchParams.page ?? 1,
  };
};

export default JobListingItems;
