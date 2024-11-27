import React, { useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { cn } from "@/lib/utils";
import { useAppointments } from "@/components/hooks/useAppointment";
import moment from "moment-timezone";

// Constants derived from actual data
const FULLBOOKED_THRESHOLD = 8;
const BUSY_THRESHOLD = 5;
const EXCLUDED_STATUSES = ["Reject", "Canceled", "Completed"];

const TIME_SLOTS = [
  { id: 3, time: "10:00:00" },
  { id: 4, time: "11:00:00" },
  { id: 5, time: "12:00:00" },
  { id: 6, time: "13:00:00" },
  { id: 7, time: "14:00:00" },
  { id: 8, time: "15:00:00" },
  { id: 9, time: "16:00:00" },
];

const DatePicker = ({
  form,
  name,
}: {
  form: UseFormReturn<any>;
  name: string;
}) => {
  const branch = form.watch("branch");
  const { appointments } = useAppointments(branch);

  const {
    appointmentCounts,
    fullBookedDates,
    appointmentsByDateAndTime,
    branchWorkload,
  } = useMemo(() => {
    if (!appointments?.data) {
      return {
        appointmentCounts: new Map(),
        fullBookedDates: new Set(),
        appointmentsByDateAndTime: new Map(),
        branchWorkload: new Map(),
      };
    }

    const countMap = new Map();
    const fullbooked = new Set();
    const dateTimeMap = new Map();
    const workloadMap = new Map();

    appointments.data.forEach((appointment) => {
      if (!appointment.date || !appointment.status?.name) return;

      // Convert the date to PHT
      const dateInPHT = moment(appointment.date).tz("Asia/Manila");
      const dateKey = dateInPHT.format("YYYY-MM-DD");

      // Skip excluded statuses
      if (EXCLUDED_STATUSES.includes(appointment.status.name)) return;

      // Track appointments by date
      const count = (countMap.get(dateKey) || 0) + 1;
      countMap.set(dateKey, count);

      // Check for full booking
      if (count >= FULLBOOKED_THRESHOLD) {
        fullbooked.add(dateKey);
      }

      // Track time slots
      if (!dateTimeMap.has(dateKey)) {
        dateTimeMap.set(dateKey, new Set());
      }
      dateTimeMap.get(dateKey).add(appointment.time);

      // Track branch workload
      const branchId = appointment.branch?.id;
      if (branchId) {
        const branchCount = (workloadMap.get(branchId) || 0) + 1;
        workloadMap.set(branchId, branchCount);
      }
    });

    return {
      appointmentCounts: countMap,
      fullBookedDates: fullbooked,
      appointmentsByDateAndTime: dateTimeMap,
      branchWorkload: workloadMap,
    };
  }, [appointments]);

  const isTimeSlotAvailable = (
    date: Date | undefined | null,
    timeSlotId: number
  ): boolean => {
    if (!date) return false;

    const dateInPHT = moment(date).tz("Asia/Manila");
    const dateString = dateInPHT.format("YYYY-MM-DD");
    const currentDate = moment().tz("Asia/Manila");
    const slot = TIME_SLOTS.find((slot) => slot.id === timeSlotId);
    if (!slot) return false;

    // Check if slot is in the past
    const [hours] = slot.time.split(":");
    if (dateInPHT.format("YYYY-MM-DD") === currentDate.format("YYYY-MM-DD")) {
      if (parseInt(hours) <= currentDate.hour()) {
        return false;
      }
    }

    // Check if slot is already booked
    const bookedTimes = appointmentsByDateAndTime.get(dateString);
    if (bookedTimes?.has(timeSlotId)) return false;

    // Check branch capacity
    const dateAppointments = appointmentCounts.get(dateString) || 0;
    if (dateAppointments >= FULLBOOKED_THRESHOLD) return false;

    return true;
  };

  return (
    <FormField
      name={name}
      control={form.control}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Select Appointment Date</FormLabel>
          <div className="relative">
            <Calendar
              mode="single"
              selected={field.value}
              defaultMonth={field.value || moment().tz("Asia/Manila").toDate()}
              onSelect={(date: Date | undefined) => {
                if (date) {
                  // Convert to PHT when setting the value
                  const dateInPHT = moment(date).tz("Asia/Manila");
                  field.onChange(dateInPHT.toDate());

                  // Reset the time field when date changes
                  form.setValue("time", null);
                }
              }}
              initialFocus
              modifiers={{
                fullbooked: (date: Date) => {
                  const currentDate = moment().tz("Asia/Manila");
                  if (moment(date).isBefore(currentDate)) return false;
                  const dateString = moment(date)
                    .tz("Asia/Manila")
                    .format("YYYY-MM-DD");
                  return fullBookedDates.has(dateString);
                },
                busy: (date: Date) => {
                  const currentDate = moment().tz("Asia/Manila");
                  if (moment(date).isBefore(currentDate)) return false;
                  const dateString = moment(date)
                    .tz("Asia/Manila")
                    .format("YYYY-MM-DD");
                  const count = appointmentCounts.get(dateString);
                  return (
                    count >= BUSY_THRESHOLD && count < FULLBOOKED_THRESHOLD
                  );
                },
              }}
              modifiersClassNames={{
                fullbooked: "bg-red-200 text-red-900 font-semibold",
                busy: "bg-orange-200 text-orange-900",
                selected:
                  "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
              }}
              disabled={(date: Date) => {
                const currentDate = moment().tz("Asia/Manila");
                const maxDate = moment().tz("Asia/Manila").add(29, "days");
                const dateInPHT = moment(date).tz("Asia/Manila");
                const dateString = dateInPHT.format("YYYY-MM-DD");
                const isFullbooked = fullBookedDates.has(dateString);

                return (
                  dateInPHT.isBefore(currentDate) ||
                  dateInPHT.isAfter(maxDate) ||
                  isFullbooked ||
                  currentDate.isSame(dateInPHT, "day")
                );
              }}
              className={cn(
                "rounded-md border shadow",
                !field.value && "bg-muted"
              )}
            />
          </div>
          <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-200 rounded" />
              <span>Fully Booked</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-orange-200 rounded" />
              <span>Busy</span>
            </div>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default DatePicker;
