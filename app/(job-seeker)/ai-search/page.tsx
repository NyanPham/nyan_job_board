import AsyncIf from "@/components/AsyncIf"
import LoadingSwap from "@/components/LoadingSwap";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import JobListingAISearchForm from "@/features/jobListings/components/JobListingAISearchForm";
import { SignUpButton } from "@/services/clerk/components/AuthButtons";
import { getCurrentUser } from "@/services/clerk/lib/getCurrentAuth";

const AISearch = () => {
  return <div className="p-4 flex items-center justify-center min-h-screen">
    <Card className="w-full max-w-4xl">
        <AsyncIf condition={async () => {
            const {userId } = await getCurrentUser();
            return userId != null;
        }} loadingFallback={<LoadingSwap isLoading><AICard /></LoadingSwap>}
        otherwise={<NoPermission />}>
            <AICard />
        </AsyncIf>
    </Card>
  </div>
}

const AICard = () => {
    return <>
    <CardHeader>
        <CardTitle>AI Search</CardTitle>
        <CardDescription>This can take a few minutes to process, so please be patient.</CardDescription>
    </CardHeader>
    <CardContent>
        <JobListingAISearchForm />
    </CardContent>
    </>
}

const NoPermission = () => {
    return <CardContent className="text-center">
        <h2 className="text-xl font-bold mb-1">Permission Denied</h2>
        <p className="mb-4 text-muted-foreground">
            You need to create an account before using AI seach!
        </p>
        <SignUpButton />
    </CardContent>
}

export default AISearch