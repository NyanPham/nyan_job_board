import { OrganizationList } from "@clerk/nextjs";
import { Suspense } from "react";

type Props = {
  searchParams: Promise<{ redirect?: string }>;
};

const OrganizationSelectPage = (props: Props) => {
  return (
    <Suspense>
      <SuspensePage {...props} />
    </Suspense>
  );
};

const SuspensePage = async ({ searchParams }: Props) => {
  const { redirect } = await searchParams;
  const redirectUrl = redirect ?? "/employer";

  return (
    <OrganizationList
      hidePersonal
      skipInvitationScreen
      afterSelectOrganizationUrl={redirectUrl}
      afterCreateOrganizationUrl={redirectUrl}
    />
  );
};

export default OrganizationSelectPage;
