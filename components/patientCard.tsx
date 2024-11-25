"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  User,
  BriefcaseMedical,
  Ticket,
  CircleEllipsis,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useSWR from "swr";
import { EditAppointment } from "./editAppointment";
import { cancelAppointment, signOut } from "@/app/actions";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { SubmitButton } from "./submit-button";
import AppointmentTable from "./table";
import { DrawerDialogDemo } from "./drawerDialog";
import AppointmentFields from "./forms/patients/patientFields";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppointmentFormValues, AppointmentSchema } from "@/app/types";
import { z } from "zod";
import { newApp } from "@/app/dashboard/action";

const fetcher = (url: string): Promise<any> =>
  fetch(url).then((res) => res.json());

export default function BlackWhiteYellowPatientCard() {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof AppointmentSchema>>({
    resolver: zodResolver(AppointmentSchema),
    mode: "onChange",
    defaultValues: {
      patient_id: undefined,
    },
  });

  const { data, error, isLoading, mutate } = useSWR(
    `/api/patientdetails`,
    fetcher
  );

  useEffect(() => {
    if (data?.id) {
      form.setValue("patient_id", Number(data.id));
    }
  }, [data, form]);

  if (isLoading) return <div className="text-gray-800">Loading...</div>;
  if (error)
    return (
      <div className="text-gray-800">Error loading appointment details</div>
    );

  const latestAppointment =
    data?.appointments?.length > 0
      ? data.appointments[data.appointments.length - 1]
      : null;

  // Check if there are any pending appointments or pending reschedules
  const hasPendingAppointment = data?.appointments?.some(
    (appointment: any) =>
      appointment.status.id === 1 || // Pending
      appointment.status.id === 2 || // Confirmed
      appointment.status.id === 6 // Pending Reschedule
  );

  const handleCancel = async () => {
    try {
      await cancelAppointment({ aptId: latestAppointment.id });
      toast({
        className: cn(
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
        ),
        title: "Success",
        description: "Appointment cancelled successfully!",
        variant: "success",
        duration: 2000,
      });
      mutate();
    } catch (error) {
      console.error("Failed to cancel appointment:", error);
      toast({
        className: cn(
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
        ),
        title: "Error",
        description: "Failed to cancel the appointment. Please try again.",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  const onSubmit = async (formData: AppointmentFormValues) => {
    try {
      const dataToSubmit = {
        ...formData,
        patient_id: Number(data.id),
      };

      await newApp(dataToSubmit);
      setOpen(false);

      toast({
        title: "Success",
        description: "Appointment created successfully!",
        variant: "success",
        duration: 2000,
      });

      mutate();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create appointment. Please try again later.",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  return (
    <div className="w-full px-4 py-8 bg-white">
      <Tabs defaultValue="details" className="mx-auto">
        <div className="flex justify-between items-center mb-4">
          <TabsList className="bg-gray-200">
            <TabsTrigger
              value="details"
              className="data-[state=active]:bg-yellow-100 data-[state=active]:text-gray-800"
            >
              Details
            </TabsTrigger>
            <TabsTrigger
              value="appointments"
              className="data-[state=active]:bg-yellow-100 data-[state=active]:text-gray-800"
            >
              Appointments
            </TabsTrigger>
          </TabsList>

          <form className="flex justify-center items-center gap-2">
            <SubmitButton
              size="sm"
              variant="outline"
              pendingText="Signing out..."
              className="bg-white text-gray-800 border-gray-300 hover:bg-yellow-50"
              formAction={signOut}
            >
              Sign Out
            </SubmitButton>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="inline-block">
                    <DrawerDialogDemo
                      open={open}
                      setOpen={setOpen}
                      label={"New Appointment"}
                      disabled={hasPendingAppointment}
                      className={cn(
                        hasPendingAppointment && "cursor-not-allowed opacity-50"
                      )}
                    >
                      <AppointmentFields form={form} onSubmit={onSubmit} />
                    </DrawerDialogDemo>
                  </div>
                </TooltipTrigger>
                {hasPendingAppointment && (
                  <TooltipContent className="bg-gray-800 text-white p-2 rounded">
                    <p>
                      Cannot create new appointment while you have pending,
                      confirmed, or pending reschedule appointments
                    </p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </form>
        </div>

        <TabsContent value="details">
          {latestAppointment && (
            <Card className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
              <CardHeader className="bg-yellow-50 text-gray-800 p-6 border-b border-yellow-200">
                <CardTitle className="text-2xl font-bold">
                  Latest Appointment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="flex flex-col md:flex-row md:space-x-6">
                  <div className="flex-1 space-y-4">
                    <DetailItem icon={User} label="Patient" value={data.name} />
                    <DetailItem
                      icon={Phone}
                      label="Contact"
                      value={`(+639) ${data.phone_number}`}
                    />
                    <DetailItem
                      icon={Calendar}
                      label="Date"
                      value={latestAppointment.date}
                    />
                    <DetailItem
                      icon={Clock}
                      label="Time"
                      value={latestAppointment.time_slots.time}
                    />
                  </div>
                  <Separator
                    orientation="vertical"
                    className="hidden md:block bg-yellow-200"
                  />
                  <div className="flex-1 space-y-4 mt-4 md:mt-0">
                    <DetailItem
                      icon={BriefcaseMedical}
                      label="Service"
                      value={latestAppointment.services.name}
                    />
                    <DetailItem
                      icon={MapPin}
                      label="Location"
                      value={latestAppointment.branch.address}
                    />
                    <DetailItem
                      icon={CircleEllipsis}
                      label="Status"
                      value={latestAppointment.status.name}
                    />
                    <DetailItem
                      icon={Ticket}
                      label="Type"
                      value={latestAppointment.type}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 p-6 flex flex-col sm:flex-row justify-end items-center space-y-2 sm:space-y-0">
                {(latestAppointment.status.id === 1 ||
                  latestAppointment.status.id === 2) && (
                  <EditAppointment
                    appointment={latestAppointment}
                    text={false}
                    disabled={false}
                    mutate={mutate}
                  />
                )}
                {(latestAppointment.status.id === 1 ||
                  latestAppointment.status.id === 2 ||
                  latestAppointment.status.id === 6) && (
                  <form>
                    <SubmitButton
                      variant="destructive"
                      className="ml-2"
                      formAction={handleCancel}
                      pendingText="Cancelling Appointment"
                      size="sm"
                    >
                      Cancel Appointment
                    </SubmitButton>
                  </form>
                )}
              </CardFooter>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="appointments">
          <Card className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
            <CardHeader className="bg-yellow-50 text-gray-800 p-6 border-b border-yellow-200">
              <CardTitle className="text-2xl font-bold">
                Appointment History
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <AppointmentTable data={data?.appointments} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function DetailItem({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center space-x-3">
      <Icon className="w-5 h-5 text-yellow-500" />
      <div>
        <p className="text-sm text-gray-600">{label}</p>
        <p className="font-medium text-gray-800">{value}</p>
      </div>
    </div>
  );
}
