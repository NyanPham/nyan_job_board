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
import {
  formatExperienceLevel,
  formatJobListingLocation,
  formatJobType,
  formatLocationRequirement,
  formatWage,
} from "@/features/jobListings/lib/formatter";

type JobListing = {
  id: string;
  title: string;
  city: string | null;
  stateAbbreviation: string | null;
  type: "internship" | "part-time" | "full-time";
  experienceLevel: "junior" | "mid-level" | "senior";
  wage: number | null;
  wageInterval: "hourly" | "yearly" | null;
  locationRequirement: "in-office" | "hybrid" | "remote";
  organizationName: string;
};

const DailyJobListingEmail = ({
  userName,
  jobListings,
  serverUrl,
}: {
  userName: string;
  jobListings: JobListing[];
  serverUrl: string;
}) => {
  return (
    <Tailwind config={tailwindConfig}>
      <Html>
        <Head />
        <Container className="font-sans">
          <Heading as="h1">New Job Listings!</Heading>
          <Text>
            Hi {userName}. Here are all the new job listings that fit your
            demands.
          </Text>
          <Section>
            {jobListings.map((jobListing) => (
              <div
                key={jobListing.id}
                className="bg-card text-card-foreground rounded-lg border p-4 border-primary border-solid mb-6"
              >
                <Text className="leading-none font-semibold text-xl my-0">
                  {jobListing.title}
                </Text>
                <Text className="text-muted-foreground mb-2 mt-0">
                  {jobListing.organizationName}
                </Text>
                <div className="mb-5">
                  {getBadges(jobListing).map((badge, index) => (
                    <div
                      key={index}
                      className="inline-block rounded-md border-solid border font-medium w-fit text-foreground text-sm px-3 py-1 mb-1 mr-1"
                    >
                      {badge}
                    </div>
                  ))}
                </div>
                <Button
                  href={`${serverUrl}/job-listings/${jobListing.id}`}
                  className="rounded-md text-sm font-medium focus-visible: border-ring bg-primary text-primary-foreground px-4 py-2"
                >
                  View Details
                </Button>
              </div>
            ))}
          </Section>
        </Container>
      </Html>
    </Tailwind>
  );
};

const getBadges = (jobListing: JobListing) => {
  const badges = [
    formatLocationRequirement(jobListing.locationRequirement),
    formatJobType(jobListing.type),
    formatExperienceLevel(jobListing.experienceLevel),
  ];

  if (jobListing.city != null || jobListing.stateAbbreviation != null) {
    badges.unshift(formatJobListingLocation(jobListing));
  }

  if (jobListing.wage != null && jobListing.wageInterval != null) {
    badges.unshift(formatWage(jobListing.wage, jobListing.wageInterval));
  }

  return badges;
};

DailyJobListingEmail.PreviewProps = {
  jobListings: [
    {
      city: "Omaha",
      stateAbbreviation: "NE",
      title: "Frontend Developer",
      wage: null,
      wageInterval: null,
      experienceLevel: "senior",
      type: "part-time",
      id: "550e8400-e29b-41d4-a716-446655440000",
      organizationName: "Web Dev Simplified",
      locationRequirement: "in-office",
    },
    {
      city: null,
      stateAbbreviation: null,
      title: "Software Engineer",
      wage: 100000,
      wageInterval: "yearly",
      experienceLevel: "mid-level",
      type: "full-time",
      id: "550e8400-e29b-41d4-a716-446655440001",
      organizationName: "Google",
      locationRequirement: "remote",
    },
  ],
  userName: "Nyan Pham",
  serverUrl: "http://localhost:3000",
} satisfies Parameters<typeof DailyJobListingEmail>[0];

export default DailyJobListingEmail;
