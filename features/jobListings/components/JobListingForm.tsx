"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { jobListingSchema } from "../actions/schema";
import z from "zod";
import { Input } from "@/components/ui/input";
import {
  experienceLevels,
  jobListingTypes,
  locationRequirements,
  wageIntervals,
} from "@/drizzle/schema";
import {
  formatExperienceLevel,
  formatJobType,
  formatLocationRequirement,
  formatWageInterval,
} from "../lib/formatter";
import StateSelectItems from "./StateSelectItems";
import { MarkdownEditor } from "@/components/markdown/MarkdownEditor";
import { Button } from "@/components/ui/button";
import LoadingSwap from "@/components/LoadingSwap";
import { createJobListing } from "../actions/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const NONE_SELECT_VALUE = "none";

const JobListingForm = () => {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(jobListingSchema),
    defaultValues: {
      title: "",
      description: "",
      stateAbbreviation: null,
      city: null,
      wage: null,
      wageInterval: "yearly",
      experienceLevel: "junior",
      type: "full-time",
      locationRequirement: "in-office",
    },
  });

  const onSubmit = async (data: z.infer<typeof jobListingSchema>) => {
    const res = await createJobListing(data);
    if (res.error) {
      toast.error(res.message);
    } else {
      toast.success("Job listing created successfully!");
      router.push(`/employer/job-listings/${res.data.id}`);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 @container"
      >
        <div className="grid grid-cols-1 @md:grid-cols-2 gap-x-4 gap-y-6 items-start">
          <FormField
            name="title"
            control={form.control}
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            name="wage"
            control={form.control}
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Wage</FormLabel>
                  <div className="flex">
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        value={field.value ?? ""}
                        className="rounded-r-none"
                        onChange={(e) =>
                          field.onChange(
                            isNaN(e.target.valueAsNumber)
                              ? null
                              : e.target.valueAsNumber,
                          )
                        }
                      />
                    </FormControl>
                    <FormField
                      name="wageInterval"
                      control={form.control}
                      render={({ field }) => {
                        return (
                          <FormItem>
                            <Select
                              onValueChange={(val) =>
                                field.onChange(val ?? null)
                              }
                              value={field.value ?? ""}
                            >
                              <FormControl>
                                <SelectTrigger className="rounded-l-none">
                                  / <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {wageIntervals.map((interval) => {
                                  return (
                                    <SelectItem key={interval} value={interval}>
                                      {formatWageInterval(interval)}
                                    </SelectItem>
                                  );
                                })}
                              </SelectContent>
                            </Select>
                          </FormItem>
                        );
                      }}
                    />
                  </div>
                  <FormDescription>Optional</FormDescription>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </div>
        <div className="grid grid-cols-1 @md:grid-cols-2 gap-x-4 gap-y-6 items-start">
          <div className="grid grid-cols-1 @xs:grid-cols-2 gap-x-2 gap-y-6 items-start">
            <FormField
              name="city"
              control={form.control}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              name="stateAbbreviation"
              control={form.control}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <Select
                      onValueChange={(val) =>
                        field.onChange(val === NONE_SELECT_VALUE ? null : val)
                      }
                      value={field.value ?? ""}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {field.value != null && (
                          <SelectItem
                            value={NONE_SELECT_VALUE}
                            className="text-muted-foreground"
                          >
                            Clear
                          </SelectItem>
                        )}
                        <StateSelectItems />
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>
          <FormField
            name="locationRequirement"
            control={form.control}
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Location Requirements</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {locationRequirements.map((lr) => {
                        return (
                          <SelectItem key={lr} value={lr}>
                            {formatLocationRequirement(lr)}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </FormItem>
              );
            }}
          />
        </div>
        <div className="grid grid-cols-1 @md:grid-cols-2 gap-x-4 gap-y-6 items-start">
          <FormField
            name="type"
            control={form.control}
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Job Type</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {jobListingTypes.map((type) => {
                        return (
                          <SelectItem key={type} value={type}>
                            {formatJobType(type)}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            name="experienceLevel"
            control={form.control}
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Experience Level</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {experienceLevels.map((experience) => {
                        return (
                          <SelectItem key={experience} value={experience}>
                            {formatExperienceLevel(experience)}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </div>
        <FormField
          name="description"
          control={form.control}
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <MarkdownEditor {...field} markdown={field.value} />
                </FormControl>
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
            Create Job Listing
          </LoadingSwap>
        </Button>
      </form>
    </Form>
  );
};

export default JobListingForm;
