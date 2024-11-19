"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { AppointmentsCol } from "@/app/schema";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SquarePen } from "lucide-react";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { toast } from "@/hooks/use-toast";

import { cn } from "@/lib/utils";
import { ReScheduleSchema } from "@/app/types";
import { rescheduleAppointment } from "@/app/actions";
import { Form } from "./ui/form";
import DatePicker from "./forms/patients/dateField";
import TimePicker from "./forms/patients/timeField";

export function EditAppointment({
  appointment,
  text,
  disabled,
  mutate,
}: {
  appointment: AppointmentsCol;
  text: boolean;
  disabled: boolean;
  mutate: any;
}) {
  const [open, setOpen] = useState(false);
  const [originalValues, setOriginalValues] = useState({
    date: appointment.date ? new Date(appointment.date) : null,
    time: appointment.time || 0,
  });

  useEffect(() => {
    setTimeout(() => (document.body.style.pointerEvents = ""), 0);
  });

  const form = useForm<z.infer<typeof ReScheduleSchema>>({
    resolver: zodResolver(ReScheduleSchema),
  });

  const set = () => {
    if (appointment.date) {
      form.setValue("date", new Date(appointment.date));
    }
    form.setValue("id", appointment.id);
    form.setValue("time", appointment?.time || 0);
  };

  const { isSubmitting } = form.formState;

  // Watch for changes in date and time fields
  const currentDate = form.watch("date");
  const currentTime = form.watch("time");

  // Function to check if values have changed
  const hasChanges = (): boolean => {
    const originalDate = originalValues.date;
    const originalTime = originalValues.time;

    // If either date is null, only compare the ones that exist
    if (!originalDate || !currentDate) {
      return originalDate !== currentDate;
    }

    // Compare dates (ignoring time component)
    const datesAreEqual =
      originalDate.toDateString() === currentDate.toDateString();
    const timesAreEqual = originalTime === currentTime;

    return !datesAreEqual || !timesAreEqual;
  };

  async function onSubmit(formData: z.infer<typeof ReScheduleSchema>) {
    mutate();

    try {
      await rescheduleAppointment(formData);

      toast({
        className: cn(
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
        ),
        title: "Success",
        duration: 2000,
        variant: "success",
        description: "Appointment rescheduled successfully!",
      });
      setOpen(false);
    } catch (error: any) {
      toast({
        className: cn(
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
        ),
        duration: 2000,
        variant: "destructive",
        description: `Failed to reschedule appointment: ${error.message}`,
      });
    }
  }

  useEffect(() => {
    setTimeout(() => (document.body.style.pointerEvents = ""), 0);
  }, []);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" onClick={() => set()} size="sm">
          Reschedule
        </Button>
      </SheetTrigger>
      <SheetContent
        className="w-full md:w-[800px] overflow-auto"
        onInteractOutside={(e) => {
          const hasPacContainer = e.composedPath().some((el: EventTarget) => {
            if ("classList" in el) {
              return Array.from((el as Element).classList).includes(
                "pac-container"
              );
            }
            return false;
          });

          if (hasPacContainer) {
            e.preventDefault();
          }
        }}
      >
        <SheetHeader>
          <SheetTitle>Reschedule Appointment</SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full p-2">
            <div className="">
              <DatePicker form={form} name="date" />
              <div className="w-full ">
                {appointment.branch && (
                  <TimePicker
                    form={form}
                    name="time"
                    branch={appointment.branch.id.toString()}
                    date={form.watch("date")}
                  />
                )}
              </div>
            </div>
            <div className="mt-2 flex justify-end">
              <Button type="submit" disabled={isSubmitting || !hasChanges()}>
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
