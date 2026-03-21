"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { jobListingAISearchSchema } from "../actions/schema";
import z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import LoadingSwap from "@/components/LoadingSwap";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { getAIJobListingSearchResults } from "../actions/actions";
import { useRouter } from "next/navigation";

const JobListingAISearchForm = () => {
    const router = useRouter()

  const form = useForm({
    resolver: zodResolver(jobListingAISearchSchema),
    defaultValues: {
      query: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof jobListingAISearchSchema>) => {
    const results = await getAIJobListingSearchResults(data)
    if (results.error) {
        toast.error(results.message);
        return;
    }

    const params = new URLSearchParams()
    results.jobIds.forEach(id => params.append("jobIds", id))
    router.push(`/?${params.toString()}`)
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          name="query"
          control={form.control}
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Query</FormLabel>
                <FormControl>
                  <Textarea {...field} className="min-h-32" />
                </FormControl>
                <FormDescription>
                  Provide a description of your skills/experience as well as
                  what you are looking for in a job. The more specific you are,
                  the better the results will be.
                </FormDescription>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <Button
          disabled={form.formState.isSubmitting}
          type="submit"
          className="w-full"
        >
          <LoadingSwap isLoading={form.formState.isSubmitting}>
            Search
          </LoadingSwap>
        </Button>
      </form>
    </Form>
  );
};

export default JobListingAISearchForm;
