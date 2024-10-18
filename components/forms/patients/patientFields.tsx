// PatientFields.tsx
import React, { useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { UseFormReturn, useWatch } from "react-hook-form";
import { PatientFormValues } from "@/app/types";
import { Input } from "@/components/ui/input";
import Maps from "@/components/gmaps";
import useSWR from "swr";
import { RadioBtn } from "@/components/buttons/branchRadio";
import Field from "../formField";
import { Calendar } from "@/components/ui/calendar";
import TimeSlot from "@/components/buttons/selectTime";
// Inline type definitions for Address and Branch
interface Address {
  id: number;
  address: string;
  latitude: number;
  longitude: number;
}

interface Branch {
  id: number;
  name: string;
  address: string;
  addr: number;
  addresses: Address;
  preferred?: boolean; // Optional preferred flag
}

const sex = [
  { name: "Male", id: "male" },
  { name: "Female", id: "female" },
  { name: "Prefer not to say", id: "prefer_not_to_say" },
] as const;

const status = [
  { name: "Active", id: "Active" },
  { name: "Inactive", id: "Inactive" },
] as const;

interface PatientFieldsProps {
  form: UseFormReturn<PatientFormValues>;
  onSubmit: (data: PatientFormValues) => void;
}

const fetcher = (url: string): Promise<Branch[]> =>
  fetch(url).then((res) => res.json());

const PatientFields = ({ form, onSubmit }: PatientFieldsProps) => {
  const {
    data: branches,
    error,
    isLoading,
  } = useSWR<Branch[]>("/api/branch/", fetcher);

  const { data: appointments } = useSWR<Branch[]>("/api/apt/", fetcher);
  const { data: services } = useSWR("/api/services/", fetcher);

  const address = useWatch({
    control: form.control,
    name: "address",
  });

  const selectedBranchId = useWatch({
    control: form.control,
    name: "branch",
  });

  const [nearestBranch, setNearestBranch] = useState<Branch | null>(null);

  const selectedBranch =
    branches?.find((branch) => branch.id === selectedBranchId) || nearestBranch;

  const handleSubmit = (data: PatientFormValues) => {
    onSubmit(data);
  };

  const handleNearestBranchChange = (branch: Branch | null) => {
    setNearestBranch(branch);
  };

  if (isLoading) return <>Loading branches...</>;

  if (error) return <div>Error loading branches</div>;

  // Annotate branches with 'preferred' flag based on nearestBranch
  const annotatedBranches: Branch[] = branches.map((branch) => ({
    ...branch,
    preferred: nearestBranch && branch.id === nearestBranch.id,
  }));

  const selectedBranchs = form.watch("branch");
  const selectedDate = form.watch("date");
  const time = form.watch("time");
  console.log(form);
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full p-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 w-full">
          <Field form={form} name={"name"} label={"Name"} />
          <Field form={form} name={"email"} label={"Email"} />
          <Field form={form} data={sex} name={"sex"} label={"Sex"} />
          <Field form={form} name={"status"} label={"Status"} data={status} />

          {/* Phone Number Field */}
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <div className="relative ml-auto flex-1 md:grow-0">
                    <p className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground text-sm">
                      (+639)
                    </p>
                    <Input
                      type="number"
                      className="w-full rounded-lg bg-background pl-16 "
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Date of Birth Field */}
          <FormField
            control={form.control}
            name="dob"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Birth</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    value={
                      field.value instanceof Date
                        ? field.value.toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(e) => {
                      const selectedDate = new Date(e.target.value);
                      field.onChange(selectedDate);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Address Field */}
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Maps
                    field={field}
                    onNearestBranchChange={handleNearestBranchChange}
                    selectedBranch={selectedBranch}
                    branches={annotatedBranches}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Branch Selection Field */}
        <FormField
          control={form.control}
          name="branch"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Branch</FormLabel>
              <FormControl>
                <RadioBtn
                  field={field}
                  data={annotatedBranches}
                  form={form}
                  text={true} // Assuming you want a search input for branches
                />
              </FormControl>
              <FormMessage>{fieldState.error?.message}</FormMessage>
            </FormItem>
          )}
        />

        <Field
          form={form}
          name={"services"}
          label={"Services"}
          data={services}
        />

        <FormField
          name="date"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <Calendar
                mode="single"
                selected={field.value} // Bind the calendar's selected date to the form field value
                onSelect={(date) => field.onChange(date)} // Update the form field on date selection
                className="rounded-md border shadow"
                disabled={(date) => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0); // Set today's time to midnight
                  const maxDate = new Date(today);
                  maxDate.setDate(today.getDate() + 29); // Set maxDate to 29 days from today

                  // Disable dates before today or after 29 days from today
                  return date < today || date > maxDate;
                }}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        {selectedBranchs && (
          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time</FormLabel>
                <TimeSlot
                  branch={selectedBranchs}
                  field={field}
                  date={selectedDate}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="flex justify-end">
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
};

export default PatientFields;
