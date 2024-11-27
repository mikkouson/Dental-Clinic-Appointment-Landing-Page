import React, { useEffect, useState } from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { UseFormReturn, useWatch } from "react-hook-form";
import { AppointmentFormValues } from "@/app/types";
import useSWR from "swr";
import { cn } from "@/lib/utils";
import DatePicker from "./dateField";
import TimePicker from "./timeField";
import LoadingSkeleton from "@/components/skeleton";
import { useAppointments } from "@/components/hooks/useAppointment";

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

interface AppointmentFieldsProps {
  form: UseFormReturn<AppointmentFormValues>;
  onSubmit: (data: AppointmentFormValues) => void;
}

// Custom Stepper Component
interface StepperProps {
  currentStep: number;
  steps: {
    label: string;
    number: number;
  }[];
}

const CustomStepper = ({ currentStep = 1, steps }: StepperProps) => {
  return (
    <div className="w-full mb-8">
      <div className="flex justify-between items-center">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2",
                  step.number === currentStep
                    ? "bg-yellow-400 border-yellow-400 text-black"
                    : step.number < currentStep
                      ? "bg-yellow-400 border-yellow-400 text-black"
                      : "bg-gray-200 border-gray-200 text-black"
                )}
              >
                {step.number}
              </div>
              <span className="mt-2 text-sm font-medium text-black">
                {step.label}
              </span>
            </div>

            {index < steps.length - 1 && (
              <div className="flex-1 mx-4">
                <div
                  className={cn(
                    "h-0.5 w-full",
                    currentStep > step.number ? "bg-yellow-400" : "bg-gray-200"
                  )}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

const AppointmentStepper = ({ currentStep }: { currentStep: number }) => {
  const steps = [
    { number: 1, label: "Branch" },
    { number: 2, label: "Service" },
    { number: 3, label: "Date & Time" },
  ];

  return <CustomStepper currentStep={currentStep} steps={steps} />;
};

const fetcher = (url: string): Promise<Branch[]> =>
  fetch(url).then((res) => res.json());

const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

const AppointmentFields = ({ form, onSubmit }: AppointmentFieldsProps) => {
  useEffect(() => {
    form.setValue("date", new Date());
  }, [form]);

  const {
    data: branches,
    error,
    isLoading,
  } = useSWR<Branch[]>("/api/branch/", fetcher);

  const { data: services } = useSWR("/api/services/", fetcher);

  const selectedBranchId = useWatch({
    control: form.control,
    name: "branch",
  });

  const address = useWatch({
    control: form.control,
    name: "address",
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [travelData, setTravelData] = useState<
    { branchId: number; duration: string; distance: string }[]
  >([]);
  const [nearestBranchId, setNearestBranchId] = useState<number | null>(null);

  // Update travel data when address or branches change
  useEffect(() => {
    if (address && branches && address.latitude && address.longitude) {
      const branchesWithDistance = branches.map((branch) => ({
        ...branch,
        distance: calculateDistance(
          address.latitude,
          address.longitude,
          branch.addresses.latitude,
          branch.addresses.longitude
        ),
      }));

      const nearest = branchesWithDistance.reduce((prev, curr) =>
        prev.distance < curr.distance ? prev : curr
      );

      setNearestBranchId(nearest.id);

      const newTravelData = branchesWithDistance.map((branch) => ({
        branchId: branch.id,
        duration: `${Math.round(branch.distance * 2)} mins`,
        distance: `${branch.distance.toFixed(1)} km`,
      }));

      setTravelData(newTravelData);
    }
  }, [address, branches]);

  const handleNextStep = async () => {
    let validStep = false;

    if (currentStep === 0) {
      validStep = await form.trigger("branch");
    } else if (currentStep === 1) {
      validStep = await form.trigger("services");
    } else if (currentStep === 2) {
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
      form.reset();
    }
  };

  const handleBranchSelect = (branchId: number) => {
    form.setValue("branch", branchId);
  };

  if (isLoading) return <LoadingSkeleton />;
  if (error) return <div>Error loading branches</div>;

  const branchImages = [
    "/images/branches/marawoy.png",
    "/images/branches/dagatan.png",
    "/images/branches/tanauan.png",
  ];

  const { isSubmitting } = form.formState;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full p-2">
        <AppointmentStepper currentStep={currentStep + 1} />
        {currentStep === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {branches?.map((branch, index) => (
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
                      : "",
                    nearestBranchId === branch.id && !selectedBranchId
                      ? "ring-4 ring-green-500"
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

                  <div className="relative z-10 text content">
                    <div className="flex items-center justify-between">
                      <h1 className="font-bold text-xl md:text-2xl text-gray-50">
                        {branch.name}
                      </h1>
                      {nearestBranchId === branch.id && (
                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                          Nearest
                        </span>
                      )}
                    </div>
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

        {currentStep === 1 && (
          <div className="grid grid-cols-4 gap-3">
            {services?.map((service) => (
              <div
                key={service.id}
                className="w-full group"
                onClick={() => form.setValue("services", service.id)}
              >
                <div
                  className={cn(
                    "h-full p-3 rounded-lg border border-gray-200 shadow-sm transition-all duration-200",
                    "hover:shadow hover:border-yellow-200 cursor-pointer",
                    "bg-white hover:bg-gray-50",
                    form.watch("services") === service.id
                      ? "ring-2 ring-yellow-500"
                      : ""
                  )}
                >
                  <div className="space-y-1">
                    <h1 className="font-semibold text-base text-gray-900 group-hover:text-gray-800">
                      {service.name}
                    </h1>
                    <p className="font-normal text-xs text-gray-600 group-hover:text-gray-700 line-clamp-2">
                      {service.description || "Description not available"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {currentStep === 2 && (
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

          {currentStep < 2 && (
            <Button onClick={handleNextStep} type="button">
              Next
            </Button>
          )}
          {currentStep === 2 && (
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};

export default AppointmentFields;
