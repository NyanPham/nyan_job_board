import { PricingTable as ClerkPricingTable } from "@clerk/nextjs";

const PricingTable = () => {
  return (
    <ClerkPricingTable
      for="organization"
      newSubscriptionRedirectUrl="/employer/pricing"
    />
  );
};

export default PricingTable;
