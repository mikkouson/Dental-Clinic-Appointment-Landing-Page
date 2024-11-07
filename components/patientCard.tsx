"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BriefcaseMedical,
  Calendar,
  CircleEllipsis,
  Clock,
  MapPin,
  Phone,
  Ticket,
  User,
} from "lucide-react";
import useSWR from "swr";
import { EditAppointment } from "./editAppointment";
import { cancelAppointment, signOut } from "@/app/actions";
import { createClient } from "@/utils/supabase/client";
import { useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { SubmitButton } from "./submit-button";
import { useFormStatus } from "react-dom";
import { AppointmentsCol } from "@/app/schema";
import AppointmentTable from "./table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Import Tabs components

const fetcher = (url: string): Promise<any> =>
  fetch(url).then((res) => res.json());

const PatientCard = ({
  id,
  appointment,
}: {
  id: number;
  appointment: AppointmentsCol;
}) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/api/patientdetails`,
    fetcher
  );

  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel("realtime appointments")
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
  }, [supabase, mutate]);

  if (isLoading) return <>Loading</>;
  if (error) return <>Error loading appointment details</>;

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
      mutate(); // Update the data after cancellation
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
    <div>
      <div className=" w-full px-4 py-8">
        {/* Tabs are now outside the card */}
        <Tabs defaultValue="details" className="mb-4">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
            </TabsList>
            <form>
              <SubmitButton
                variant="outline"
                pendingText="Signing out..."
                className="w-full"
                formAction={signOut}
              >
                Sign Out
              </SubmitButton>
            </form>
          </div>

          {/* Tab Content for Details */}
          <TabsContent value="details">
            <Card className=" w-full mx-auto">
              <CardHeader>
                <CardTitle className="text-2xl">Appointment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4 mb-2">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <span>{data?.name}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <span>(+639) {data?.phone_number}</span>
                </div>
                <div className="flex items-center space-x-4 mb-2">
                  <Ticket className="h-5 w-5 text-muted-foreground" />
                  <span>{Apt?.appointment_ticket}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <span>{Apt?.date}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <span>{Apt?.time_slots?.time}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <BriefcaseMedical className="h-5 w-5 text-muted-foreground" />
                  <span>{Apt?.services?.name}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <span>{Apt?.branch?.address}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <CircleEllipsis className="h-5 w-5 text-muted-foreground" />
                  <span>{Apt?.status?.name}</span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                {(Apt?.status.id === 1 ||
                  Apt?.status.id === 2 ||
                  Apt?.status.id === 6) && (
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
                    >
                      Cancel Appointment
                    </SubmitButton>
                  </form>
                )}
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Tab Content for Appointments */}
          <TabsContent value="appointments">
            <AppointmentTable data={data?.appointments} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PatientCard;
