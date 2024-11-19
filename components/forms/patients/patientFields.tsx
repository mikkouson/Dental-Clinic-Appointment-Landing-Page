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
import { cn } from "@/lib/utils";
import DatePicker from "./dateField";
import TimePicker from "./timeField";

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

// Custom Stepper Components
const StepperDot = ({
  number,
  isActive,
  isCompleted,
}: {
  number: number;
  isActive: boolean;
  isCompleted: boolean;
}) => {
  return (
    <div className="flex flex-col items-center">
      <div
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-200",
          isActive && "bg-yellow-400 text-black",
          isCompleted && "bg-yellow-400 text-black",
          !isActive && !isCompleted && "bg-gray-200 text-gray-600"
        )}
      >
        {number}
      </div>
    </div>
  );
};

const CustomStepper = ({ currentStep }: { currentStep: number }) => {
  const steps = ["Basic Info", "Branch", "Service", "Date & Time"];

  return (
    <div className="w-full mb-8">
      <div className="flex justify-between items-center relative">
        <div className="absolute h-0.5 bg-gray-200 top-4 left-0 right-0 -z-10" />
        <div
          className="absolute h-0.5 bg-yellow-400 top-4 left-0 -z-10 transition-all duration-300"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        />

        <div className="w-full flex justify-between">
          {steps.map((label, index) => (
            <div key={label} className="flex flex-col items-center space-y-2">
              <StepperDot
                number={index + 1}
                isActive={currentStep === index}
                isCompleted={currentStep > index}
              />
              <span
                className={cn(
                  "text-sm font-medium",
                  currentStep === index && "text-black",
                  currentStep > index && "text-black",
                  currentStep < index && "text-gray-500"
                )}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const PatientFields = ({
  form,
  onSubmit,
  setShowPatientFields,
}: PatientFieldsProps) => {
  useEffect(() => {
    form.setValue("date", new Date());
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

  const handleTravelDataChange = (
    data: { branchId: number; duration: string; distance: string }[]
  ) => {
    setTravelData(data);
  };

  if (isLoading)
    return <div className="w-full text-center py-4">Loading branches...</div>;
  if (error)
    return (
      <div className="w-full text-center py-4 text-red-500">
        Error loading branches
      </div>
    );

  const annotatedBranches: Branch[] = branches!.map((branch) => ({
    ...branch,
    preferred: nearestBranch ? branch.id === nearestBranch.id : undefined,
  }));

  const branchImages = [
    "/images/branches/marawoy.png",
    "/images/branches/dagatan.png",
    "/images/branches/tanauan.png",
  ];

  const { isSubmitting } = form.formState;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full p-2">
        <CustomStepper currentStep={currentStep} />

        {currentStep === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 w-full">
            <Field form={form} name="name" label="Name" />
            <Field form={form} name="email" label="Email" />
            <Field form={form} data={sex} name="sex" label="Sex" />
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
                        className="w-full rounded-lg bg-background pl-16"
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
                        field.value instanceof Date &&
                        !isNaN(field.value.getTime())
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
            {services?.map((service) => (
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
                  <div>
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
            <DatePicker form={form} name="date" />
            <div className="w-full ml-8">
              {selectedBranchId && (
                <TimePicker
                  form={form}
                  name="time"
                  branch={selectedBranchId.toString()}
                  date={form.watch("date")}
                />
              )}
            </div>
          </div>
        )}

        <div className="flex justify-between mt-4">
          <Button onClick={handlePreviousStep} type="button">
            Back
          </Button>

          {currentStep < 3 ? (
            <Button
              onClick={handleNextStep}
              type="button"
              className="bg-yellow-400 hover:bg-yellow-500 text-black"
            >
              Next
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-yellow-400 hover:bg-yellow-500 text-black"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};

export default PatientFields;
