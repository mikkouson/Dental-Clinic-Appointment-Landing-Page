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
import { Stepper, Step } from "react-form-stepper";
import { cn } from "@/lib/utils";

interface Address {
  id: number;
  address: string;
  latitude: number;
  longitude: number;
}

interface Branch {
  description: string;
  id: number;
  name: string;
  address: string;
  addr: number;
  addresses: Address;
  preferred?: boolean;
}

const sex = [
  { name: "Male", id: "male" },
  { name: "Female", id: "female" },
  { name: "Prefer not to say", id: "prefer_not_to_say" },
] as const;

interface PatientFieldsProps {
  form: UseFormReturn<PatientFormValues>;
  onSubmit: (data: PatientFormValues) => void;
  setShowPatientFields: (value: boolean) => void;
}

const fetcher = (url: string): Promise<Branch[]> =>
  fetch(url).then((res) => res.json());

const PatientFields = ({
  form,
  onSubmit,
  setShowPatientFields,
}: PatientFieldsProps) => {
  useEffect(() => {
    form.setValue("date", new Date()); // Set the default date to today
  }, [form]);

  const {
    data: branches,
    error,
    isLoading,
  } = useSWR<Branch[]>("/api/branch/", fetcher);

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
  const [currentStep, setCurrentStep] = useState(0);
  const [travelData, setTravelData] = useState<
    { branchId: number; duration: string; distance: string }[]
  >([]);

  const selectedBranch =
    branches?.find((branch) => branch.id === selectedBranchId) || nearestBranch;

  const handleSubmit = (data: PatientFormValues) => {
    onSubmit(data);
  };

  const handleNextStep = async () => {
    let validStep = false;

    if (currentStep === 0) {
      validStep = await form.trigger([
        "name",
        "email",
        "sex",
        "address",
        "phoneNumber",
        "dob",
      ]);
    } else if (currentStep === 1) {
      validStep = await form.trigger("branch");
    } else if (currentStep === 2) {
      validStep = await form.trigger("services");
    } else if (currentStep === 3) {
      validStep = await form.trigger(["date", "time"]);
    }

    if (validStep) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    } else {
      setShowPatientFields(false);
      form.reset();
    }
  };
  const handleNearestBranchChange = (branch: Branch | null) => {
    setNearestBranch(branch);
  };

  const handleBranchSelect = (branchId: number) => {
    form.setValue("branch", branchId);
  };

  if (isLoading) return <>Loading branches...</>;

  if (error) return <div>Error loading branches</div>;

  const annotatedBranches: Branch[] = branches!.map((branch) => ({
    ...branch,
    preferred: nearestBranch ? branch.id === nearestBranch.id : undefined,
  }));

  const selectedBranchs = form.watch("branch");
  const selectedDate = form.watch("date");
  const handleTravelDataChange = (
    data: { branchId: number; duration: string; distance: string }[]
  ) => {
    setTravelData(data);
  };
  const branchImages = [
    "/images/branches/marawoy.png",
    "/images/branches/dagatan.png",
    "/images/branches/tanauan.png",
  ];
  const { isSubmitting } = form.formState;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full p-2">
        <Stepper
          activeStep={currentStep}
          nonLinear={true}
          styleConfig={{
            activeBgColor: "#FBBF24",
            completedBgColor: "#FBBF24",
            inactiveBgColor: "#E5E7EB",
            labelFontSize: "1rem",
            circleFontSize: "1rem",
            size: "2rem",
            activeTextColor: "#000000",
            completedTextColor: "#000000",
            inactiveTextColor: "#6B7280",
            borderRadius: "50%",
            fontWeight: "bold",
          }}
        >
          <Step label="Basic Info" />
          <Step label="Branch" />
          <Step label="Service" />
          <Step label="Date & Time" />
        </Stepper>

        {currentStep === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 w-full">
            <Field form={form} name={"name"} label={"Name"} />
            <Field form={form} name={"email"} label={"Email"} />
            <Field form={form} data={sex} name={"sex"} label={"Sex"} />
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
            <FormField
              control={form.control}
              name="dob"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <Input
                      min="1899-01-01"
                      max={new Date().toISOString().split("T")[0]}
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
                      onTravelDataChange={handleTravelDataChange}
                      selectedBranch={selectedBranch}
                      branches={annotatedBranches}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {currentStep === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {annotatedBranches.map((branch, index) => (
              <div
                key={branch.id}
                className="max-w-xs w-full group/card"
                onClick={() => handleBranchSelect(branch.id)}
              >
                <div
                  className={cn(
                    "relative card h-96 rounded-md shadow-xl max-w-sm mx-auto flex flex-col justify-between p-4 cursor-pointer overflow-hidden",
                    selectedBranchId === branch.id
                      ? "ring-4 ring-yellow-500"
                      : ""
                  )}
                >
                  <div
                    className={cn(
                      "absolute inset-0 bg-cover bg-center transition-all duration-300",
                      selectedBranchId === branch.id
                        ? "brightness-[1.75]"
                        : "group-hover/card:brightness-100 brightness-75"
                    )}
                    style={{
                      backgroundImage: `linear-gradient(to bottom right, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0)), url(${branchImages[index % branchImages.length]})`,
                    }}
                  />
                  <div className="absolute inset-0 bg-black opacity-20 transition-all duration-300 group-hover/card:opacity-20"></div>

                  <div className="relative z-10 flex flex-row items-center space-x-4">
                    <div className="flex flex-col">
                      {branch.preferred && (
                        <p className="font-normal text-base text-green-400">
                          Preferred
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="relative z-10 text content">
                    <h1 className="font-bold text-xl md:text-2xl text-gray-50">
                      {branch.name}
                    </h1>
                    <p className="font-normal text-sm text-gray-50">
                      <span className="font-medium">
                        Estimated Travel Time:{" "}
                      </span>
                      {travelData.find((d) => d.branchId === branch.id)
                        ?.duration || "Calculating..."}
                    </p>
                    <p className="font-normal text-sm text-gray-50">
                      <span className="font-medium">Distance: </span>
                      {travelData.find((d) => d.branchId === branch.id)
                        ?.distance || "Calculating..."}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {currentStep === 2 && (
          <div className="grid grid-cols-1 gap-4">
            {services?.map((service, index) => (
              <div
                key={service.id}
                className="w-full group/card"
                onClick={() => form.setValue("services", service.id)}
              >
                <div
                  className={cn(
                    "flex justify-between p-2 rounded-lg border cursor-pointer",
                    form.watch("services") === service.id
                      ? "ring-2 ring-yellow-500"
                      : ""
                  )}
                >
                  <div className="">
                    <h1 className="font-bold text-xl text-gray-900">
                      {service.name}
                    </h1>
                    <p className="font-normal text-sm text-gray-700">
                      {service.description || "Description not available"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {currentStep === 3 && (
          <div className="flex">
            <FormField
              name="date"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <Calendar
                    mode="single"
                    selected={field.value || new Date()} // Set the default to today's date
                    onSelect={(date) => {
                      field.onChange(date);
                      form.setValue("time", 0); // Reset the time field when the date changes
                    }}
                    className="rounded-md border shadow"
                    disabled={(date) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      const maxDate = new Date(today);
                      maxDate.setDate(today.getDate() + 29);

                      return date < today || date > maxDate;
                    }}
                    defaultMonth={new Date()} // Ensure the calendar opens on the current month
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="w-full ml-8">
              {selectedBranchs && (
                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time</FormLabel>
                      <TimeSlot
                        branch={selectedBranchs.toString()}
                        field={field}
                        date={selectedDate}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          </div>
        )}
        <div className="flex justify-between mt-4">
          <Button onClick={handlePreviousStep} type="button">
            Back
          </Button>

          {currentStep < 3 && (
            <Button onClick={handleNextStep} type="button">
              Next
            </Button>
          )}
          {currentStep === 3 && (
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};

export default PatientFields;
