import React from "react";
import useSWR from "swr";
import moment from "moment";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils"; // Assuming you have a utility for conditional classNames

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type TimeSlotProps = {
  date: Date;
  branch: string;
  field: {
    value: number;
    onChange: (value: number) => void;
  };
};

export default function TimeSlot({ branch, field, date }: TimeSlotProps) {
  const dates = moment(date).format("MM/DD/YYYY");
  const { data, error } = useSWR(
    `/api/timeslots?date=${dates}&branch=${branch}`,
    fetcher
  );

  if (error) return <div>Error loading time slots.</div>;
  if (!data)
    return (
      <div className="flex justify-center">
        <Loader2 className="animate-spin" />
        <p className="ml-2">Loading time slots...</p>
      </div>
    );

  const handleSelect = (id: number) => {
    field.onChange(id); // Update the form's "time" field with the selected time slot's ID
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      {data.map((slot: { id: number; time: string; appointments: any[] }) => {
        const patientCount = slot.appointments.length;
        const slotsUsed = Math.min(3, patientCount); // Limit slots used to a maximum of 3
        const remainingSlots = 3 - slotsUsed; // Calculate remaining available slots

        return (
          <div
            key={slot.id}
            className={cn(
              "flex justify-between p-2 rounded-lg border cursor-pointer",
              field.value === slot.id
                ? "bg-blue-100 border-blue-500"
                : "bg-white border-gray-300",
              remainingSlots === 0 ? "opacity-50 cursor-not-allowed" : ""
            )}
            onClick={() => remainingSlots > 0 && handleSelect(slot.id)} // Only allow clicking if there are available slots
          >
            <span>{slot.time}</span>
            <span>
              {slotsUsed} / 3 Slots Taken {remainingSlots === 0 && "(Full)"}
            </span>
          </div>
        );
      })}
    </div>
  );
}
