"use client";
import React, { useEffect, useState } from "react";
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
  Calendar as CalendarIcon,
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
import CancelConfirmationDialog from "./cancelAppointment";
import LoadingSkeleton from "./patientCardSkeleton";
import TeethChart from "./teeth-permanent";
import ToothHistoryCard from "./toothHistoryCard";
import { createClient } from "@/utils/supabase/client";
import moment from "moment";

const fetcher = (url: string): Promise<any> =>
  fetch(url).then((res) => res.json());

export default function BlackWhiteYellowPatientCard() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

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
      if (data.address) {
        form.setValue("address", {
          id: data.address.id,
          address: data.address.address,
          latitude: data.address.latitude,
          longitude: data.address.longitude,
        });
      }
    }
  }, [data, form]);
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel(`realtime tooth-history`)

      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tooth_history" },
        () => {
          mutate();
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "appointments" },
        () => {
          mutate();
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "patients" },
        () => {
          mutate();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, mutate]);

  if (isLoading) return <LoadingSkeleton />;
  if (error)
    return (
      <div className="text-gray-800">Error loading appointment details</div>
    );

  const latestAppointment = data?.appointments?.reduce(
    (latest: any, current: any) => {
      if (!latest) return current;
      const latestDate = new Date(latest.updated_at);
      const currentDate = new Date(current.updated_at);
      return currentDate > latestDate ? current : latest;
    },
    null
  );

  const hasPendingAppointment = data?.appointments?.some(
    (appointment: any) =>
      appointment.status.id === 1 ||
      appointment.status.id === 2 ||
      appointment.status.id === 6
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
      form.reset();
      mutate();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create appointment. Please try again later.",
        variant: "destructive",
        duration: 2000,
      });
      form.reset();
    }
  };

  return (
    <div className="w-full px-4 py-8 bg-white">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mx-auto">
        <div className="flex justify-between items-center mb-4">
          <TabsList className="bg-gray-200">
            <TabsTrigger
              value="details"
              className="data-[state=active]:bg-yellow-100 data-[state=active]:text-gray-800"
            >
              <Clock className="h-4 w-4 mr-2" />
              <span className="hidden lg:inline">Latest appointment</span>
            </TabsTrigger>
            <TabsTrigger
              value="appointments"
              className="data-[state=active]:bg-yellow-100 data-[state=active]:text-gray-800"
            >
              <Calendar className="h-4 w-4 mr-2" />

              <span className="hidden lg:inline">Appointments History</span>
            </TabsTrigger>
            <TabsTrigger
              value="odontogram"
              className="data-[state=active]:bg-yellow-100 data-[state=active]:text-gray-800"
            >
              Odontogram
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
                      label="New Appointment"
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
          <Card className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
            <CardHeader className="bg-yellow-50 text-gray-800 p-6 border-b border-yellow-200">
              <CardTitle className="text-2xl font-bold">
                Latest Appointment Details
              </CardTitle>
              {latestAppointment && (
                <div className="text-sm text-gray-600">
                  Last updated:{" "}
                  {new Date(latestAppointment.updated_at).toLocaleString()}
                </div>
              )}
            </CardHeader>
            <CardContent className="p-6">
              {latestAppointment ? (
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row md:space-x-6">
                    <div className="flex-1 space-y-4">
                      <DetailItem
                        icon={User}
                        label="Patient"
                        value={data.name}
                      />
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
                        value={moment(
                          latestAppointment.time_slots.time,
                          "HH:mm:ss"
                        ).format("h:mm A")}
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
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                  <CalendarIcon className="w-16 h-16 mb-4 text-yellow-500" />
                  <h3 className="text-xl font-medium mb-2">
                    No Recent Appointments
                  </h3>
                  <p className="text-center mb-6">
                    You haven't scheduled any appointments yet. Click the "New
                    Appointment" button above to schedule your first
                    appointment.
                  </p>
                  {/* <DrawerDialogDemo
                    open={open}
                    setOpen={setOpen}
                    label="New Appointment"
                    disabled={hasPendingAppointment}
                    className={cn(
                      "fixed inset-0 z-50", // Add these positioning classes
                      hasPendingAppointment && "cursor-not-allowed opacity-50"
                    )}
                  >
                    <AppointmentFields form={form} onSubmit={onSubmit} />
                  </DrawerDialogDemo> */}
                </div>
              )}
            </CardContent>
            {latestAppointment && (
              <CardFooter className="bg-gray-50 p-6 flex flex-col sm:flex-row justify-end items-center space-y-2 sm:space-y-0 gap-2">
                {latestAppointment.status.id === 1 && (
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
                  <CancelConfirmationDialog
                    onConfirm={handleCancel}
                    appointmentDate={latestAppointment.date}
                    appointmentTime={latestAppointment.time_slots.time}
                  />
                )}
              </CardFooter>
            )}
          </Card>
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

        <TabsContent value="odontogram">
          <Card className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
            <CardHeader className="bg-yellow-50 text-gray-800 p-6 border-b border-yellow-200">
              <div className="flex items-center gap-2">
                {/* <Tooth className="w-6 h-6 text-yellow-500" /> */}
                <CardTitle className="text-2xl font-bold">
                  Dental Chart
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 flex gap-4 flex-col md:flex-row justify-center items-center">
              <div>
                <TeethChart history={data.tooth_history} />
              </div>{" "}
              {data?.tooth_history && data.tooth_history.length > 0 ? (
                <ToothHistoryCard history={data.tooth_history} />
              ) : (
                <div className="text-center text-gray-500 flex items-center justify-center w-full">
                  No tooth history available.
                </div>
              )}
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
