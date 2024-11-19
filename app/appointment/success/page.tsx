import Link from "next/link";
import {
  CalendarCheck,
  ArrowLeft,
  PlusCircle,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AppointmentConfirmation() {
  return (
    <div className=" bg-background flex items-center justify-center p-4">
      <Card className="w-full ">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 bg-primary rounded-full p-3 w-16 h-16 flex items-center justify-center">
            <CalendarCheck className="w-8 h-8 " />
          </div>
          <CardTitle className="text-2xl font-bold">
            Appointment Confirmed!
          </CardTitle>
          <CardDescription>
            Your appointment has been successfully scheduled.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted p-4 rounded-md text-sm">
            <p className="font-semibold mb-2">Reminder:</p>
            <p>
              Please arrive 15 minutes before your scheduled appointment time.
              Don't forget to bring any relevant medical records or test
              results.
            </p>
          </div>
          <p className="text-sm text-center text-muted-foreground">
            Check your email. Weve sent your appointment ticket, which will be
            used as credentials to view appointment details.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button asChild className="w-full">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Link>
          </Button>

          <Button asChild variant="outline" className="w-full">
            <Link href="/appointment/login">
              <ExternalLink className="mr-2 h-4 w-4" /> View Appointment Details
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
