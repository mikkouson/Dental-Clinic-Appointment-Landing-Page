"use client";

import { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
  Activity,
  BriefcaseMedical,
  Ticket,
  CircleEllipsis,
} from "lucide-react";
import useSWR from "swr";
import { EditAppointment } from "./editAppointment";
import { cancelAppointment, signOut } from "@/app/actions";
import { createClient } from "@/utils/supabase/client";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { SubmitButton } from "./submit-button";
import AppointmentTable from "./table";
import { AppointmentsCol } from "@/app/schema";

const fetcher = (url: string): Promise<any> =>
  fetch(url).then((res) => res.json());

export default function BlackWhiteYellowPatientCard({
  id,
  appointment,
}: {
  id: number;
  appointment: AppointmentsCol;
}) {
  const { data, error, isLoading, mutate } = useSWR(
    `/api/patientdetails`,
    fetcher
  );
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel(`realtime-tooth_history-${appointment.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "appointments" },
        () => {
          mutate();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, mutate, appointment.id]);

  if (isLoading) return <div className="text-gray-800">Loading...</div>;
  if (error)
    return (
      <div className="text-gray-800">Error loading appointment details</div>
    );

  const Apt = data?.appointments.find(
    (apt: { id: AppointmentsCol }) => apt.id === appointment
  );

  const handleCancel = async () => {
    try {
      await cancelAppointment({ aptId: Apt.id });
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

  return (
    <div className="w-full px-4 py-8 bg-white">
      <Tabs defaultValue="details" className=" mx-auto">
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
          <form>
            <SubmitButton
              variant="outline"
              pendingText="Signing out..."
              className="bg-white text-gray-800 border-gray-300 hover:bg-yellow-50"
              formAction={signOut}
            >
              Sign Out
            </SubmitButton>
          </form>
        </div>

        <TabsContent value="details">
          <Card className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
            <CardHeader className="bg-yellow-50 text-gray-800 p-6 border-b border-yellow-200">
              <CardTitle className="text-2xl font-bold">
                Appointment Details
              </CardTitle>
              <p className="text-gray-600">
                Appointment ID: {Apt?.appointment_ticket}
              </p>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="flex flex-col md:flex-row md:space-x-6">
                <div className="flex-1 space-y-4">
                  <DetailItem icon={User} label="Patient" value={data?.name} />
                  <DetailItem
                    icon={Phone}
                    label="Contact"
                    value={`(+639) ${data?.phone_number}`}
                  />
                  <DetailItem icon={Calendar} label="Date" value={Apt?.date} />
                  <DetailItem
                    icon={Clock}
                    label="Time"
                    value={Apt?.time_slots?.time}
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
                    value={Apt?.services?.name}
                  />
                  <DetailItem
                    icon={MapPin}
                    label="Location"
                    value={Apt?.branch?.address}
                  />
                  <DetailItem
                    icon={CircleEllipsis}
                    label="Status"
                    value={Apt?.status?.name}
                  />
                  <DetailItem
                    icon={Ticket}
                    label="Ticket"
                    value={Apt?.appointment_ticket}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 p-6 flex flex-col sm:flex-row justify-end items-center space-y-2 sm:space-y-0">
              {(Apt?.status.id === 1 || Apt?.status.id === 2) && (
                <EditAppointment
                  appointment={Apt}
                  text={false}
                  disabled={false}
                  mutate={mutate}
                />
              )}
              {(Apt?.status.id === 1 ||
                Apt?.status.id === 2 ||
                Apt?.status.id === 6) && (
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
