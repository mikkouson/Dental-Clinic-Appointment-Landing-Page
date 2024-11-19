import React from "react";
import useSWR from "swr";
import moment from "moment";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Define proper types for the API response
interface TimeSlot {
  id: number;
  time: string;
  appointments: any[];
}

interface TimeSlotProps {
  date: Date;
  branch: string;
  field: {
    value: number;
    onChange: (value: number) => void;
  };
}

const fetcher = async (url: string): Promise<TimeSlot[]> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch time slots");
  }
  const data = await response.json();
  // Ensure the response is an array
  if (!Array.isArray(data)) {
    throw new Error("Invalid response format");
  }
  return data;
};

export default function TimeSlot({ branch, field, date }: TimeSlotProps) {
  const dates = moment(date).format("MM/DD/YYYY");
  const { data, error, isLoading } = useSWR<TimeSlot[], Error>(
    `/api/timeslots?date=${dates}&branch=${branch}`,
    fetcher
  );

  if (error) {
    return (
      <div className="p-4 text-red-500 bg-red-50 rounded-lg">
        Error: {error.message || "Failed to load time slots"}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-4">
        <Loader2 className="animate-spin" />
        <p className="ml-2">Loading time slots...</p>
      </div>
    );
  }

  // Additional check to ensure data exists and is an array
  if (!data || !Array.isArray(data)) {
    return (
      <div className="p-4 text-yellow-500 bg-yellow-50 rounded-lg">
        No time slots available
      </div>
    );
  }

  const isToday = moment(date).isSame(new Date(), "day");
  const currentTime = moment();

  const handleSelect = (id: number) => {
    field.onChange(id);
  };

  return (
    <div className="grid grid-cols-1 gap-1">
      {data.map((slot: TimeSlot) => {
        const patientCount = slot.appointments.length;
        const slotsUsed = Math.min(1, patientCount);
        const remainingSlots = 1 - slotsUsed;
        const slotTime = moment(slot.time, "h:mm A");
        const isPastTime = isToday && slotTime.isBefore(currentTime);

        return (
          <div
            key={slot.id}
            className={cn(
              "flex justify-between p-2 rounded-lg border cursor-pointer transition-all duration-200",
              field.value === slot.id
                ? "bg-blue-100 border-blue-500"
                : "bg-white border-gray-300 hover:bg-gray-50",
              remainingSlots === 0 || isPastTime
                ? "opacity-50 cursor-not-allowed"
                : "hover:border-blue-300"
            )}
            onClick={() =>
              remainingSlots > 0 && !isPastTime && handleSelect(slot.id)
            }
            role="button"
            tabIndex={0}
            aria-disabled={remainingSlots === 0 || isPastTime}
          >
            <span className="font-medium">{slot.time}</span>
            <span
              className={cn(
                "text-sm",
                remainingSlots === 0 ? "text-red-500" : "text-gray-600"
              )}
            >
              {slotsUsed} / 1 Slots Taken
              {remainingSlots === 0 && " (Full)"}
              {isPastTime && " (Past)"}
            </span>
          </div>
        );
      })}
    </div>
  );
}
