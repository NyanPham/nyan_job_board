import {
  Head,
  Tailwind,
  Html,
  Container,
  Heading,
  Text,
  Section,
  Button,
} from "@react-email/components";
import tailwindConfig from "./tailwindConfig";
import { JobListingApplicationTable } from "@/drizzle/schema";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Application = Pick<
  typeof JobListingApplicationTable.$inferSelect,
  "rating"
> & {
  userName: string;
  organizationId: string;
  organizationName: string;
  jobListingId: string;
  jobListingTitle: string;
};

const DailyApplicationEmail = ({
  applications,
  userName,
}: {
  userName: string;
  applications: Application[];
}) => {
  return (
    <Tailwind config={tailwindConfig}>
      <Html>
        <Head />
        <Container className="font-sans">
          <Heading as="h1">New Applications!</Heading>

          <Text>
            Hi {userName}. Here are all the new applications for your job
            listings.
          </Text>
          {Object.entries(
            Object.groupBy(applications, (a) => a.organizationId),
          ).map(([orgId, orgApplications], i) => {
            if (orgApplications == null || orgApplications.length === 0) {
              return null;
            }

            return (
              <OrganizationSection
                key={orgId}
                orgName={orgApplications[0].organizationName}
                applications={orgApplications}
                noMargin={i === 0}
              />
            );
          })}
        </Container>
      </Html>
    </Tailwind>
  );
};
const OrganizationSection = ({
  orgName,
  applications,
  noMargin = false,
}: {
  orgName: string;
  applications: Application[];
  noMargin?: boolean;
}) => {
  return (
    <Section className={noMargin ? undefined : "mt-8"}>
      <Heading as="h2" className="leading-none font-semibold text-3xl my-4">
        {orgName}
      </Heading>
      {Object.entries(Object.groupBy(applications, (a) => a.jobListingId)).map(
        ([jobListingId, listingApplications], i) => {
          if (listingApplications == null || listingApplications.length === 0) {
            return null;
          }

          return (
            <JobListingCard
              key={jobListingId}
              jobListingTitle={listingApplications[0].jobListingTitle}
              applications={listingApplications}
              noMargin={i === 0}
            />
          );
        },
      )}
    </Section>
  );
};

const JobListingCard = ({
  jobListingTitle,
  applications,
  noMargin = false,
}: {
  jobListingTitle: string;
  applications: Application[];
  noMargin?: boolean;
}) => {
  return (
    <div
      className={cn(
        "bg-card text-card-foreground rounded-lg border p-4 border-primary border-solid",
        !noMargin && "mt-6",
      )}
    >
      <Heading as="h3" className="leading-none font-semibold text-xl mt-0 mb-3">
        {jobListingTitle}
      </Heading>
      {applications.map((application, i) => (
        <Text key={i} className="mt-2 mb-0">
          <span>{application.userName}: </span>
          <RatingIcons rating={application.rating} />
        </Text>
      ))}
    </div>
  );
};

const RatingIcons = ({ rating }: { rating: number | null }) => {
  if (rating == null || rating < 1 || rating > 5) {
    return "Unrated";
  }

  const stars: ReactNode[] = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span key={i} className="w-3 -mb-1.75 mr-0.5">
        {rating >= i ? "★" : "☆"}
      </span>,
    );
  }

  return stars;
};

DailyApplicationEmail.PreviewProps = {
  applications: [
    {
      organizationId: "org-1",
      organizationName: "Nyan Academy",
      jobListingId: "job-listing-1",
      jobListingTitle: "Software Engineer",
      rating: 2,
      userName: "Larry Cook",
    },
    {
      organizationId: "org-1",
      organizationName: "Nyan Academy",
      jobListingId: "job-listing-1",
      jobListingTitle: "Software Engineer",
      rating: 3,
      userName: "Jane Smith",
    },
    {
      organizationId: "org-1",
      organizationName: "Nyan Academy",
      jobListingId: "job-listing-2",
      jobListingTitle: "Backend Developer",
      rating: null,
      userName: "Jane Smith",
    },
    {
      organizationId: "org-2",
      organizationName: "Tech Innovations",
      jobListingId: "job-listing-3",
      jobListingTitle: "Frontend Developer",
      rating: 4,
      userName: "Jane Smith",
    },
  ],
  userName: "NyanPham",
} satisfies Parameters<typeof DailyApplicationEmail>[0];

export default DailyApplicationEmail;