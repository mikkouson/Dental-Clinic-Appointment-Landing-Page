import React from "react";
import { Loader2 } from "lucide-react";

interface TimeSlot {
  id: number;
  time: string;
  appointments: Array<{
    id: number;
    status: number;
    // other appointment properties...
  }>;
}

interface TimeSlotProps {
  date: Date;
  branch: string;
  field: {
    value: number;
    onChange: (value: number) => void;
  };
}

const formatTime = (time: string): string => {
  const date = new Date(`1970/01/01 ${time}`);
  return date
    .toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .replace(/\s+/g, "");
};

export default function TimeSlot({ branch, field, date }: TimeSlotProps) {
  const [data, setData] = React.useState<TimeSlot[] | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const formattedDate = date.toLocaleDateString("en-US", {
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
        });

        const response = await fetch(
          `/api/timeslots?date=${formattedDate}&branch=${branch}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch time slots");
        }
        const jsonData = await response.json();
        if (!Array.isArray(jsonData)) {
          throw new Error("Invalid response format");
        }
        setData(jsonData);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to load time slots")
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [date, branch]);

  if (error) {
    return (
      <div className="p-4 text-red-500 bg-red-50 rounded-lg">
        Error: {error.message}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-4">
        <Loader2 className="h-5 w-5 animate-spin" />
        <p className="ml-2">Loading time slots...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-4 text-yellow-500 bg-yellow-50 rounded-lg">
        No time slots available
      </div>
    );
  }

  const isToday = new Date(date).toDateString() === new Date().toDateString();
  const currentTime = new Date();

  const handleSelect = (id: number) => {
    field.onChange(id);
  };

  return (
    <div className="grid grid-cols-1 gap-2">
      {data.map((slot: TimeSlot) => {
        // Filter out appointments with status 3 and 5
        const validAppointments = slot.appointments.filter(
          (apt) => apt.status !== 3 && apt.status !== 5 && apt.status !== 4
        );

        const patientCount = validAppointments.length;
        const slotsUsed = Math.min(1, patientCount);
        const remainingSlots = 1 - slotsUsed;
        const slotTime = new Date(`1970/01/01 ${slot.time}`);
        const isPastTime =
          isToday && slotTime.getTime() < currentTime.getTime();

        const isSelected = field.value === slot.id;
        const isDisabled = remainingSlots === 0 || isPastTime;

        return (
          <div
            key={slot.id}
            className={`
              flex justify-between items-center p-3 rounded-lg border transition-all duration-200
              ${isSelected ? "bg-blue-50 border-blue-500" : "bg-white border-gray-200 hover:bg-gray-50"}
              ${isDisabled ? "opacity-50 cursor-not-allowed" : "hover:border-blue-300 cursor-pointer"}
            `}
            onClick={() => !isDisabled && handleSelect(slot.id)}
            role="button"
            tabIndex={0}
            aria-disabled={isDisabled}
          >
            <span className="font-medium text-gray-900">
              {formatTime(slot.time)}
            </span>
            <div className="flex items-center space-x-2">
              <span
                className={`
                  text-sm
                  ${remainingSlots === 0 ? "text-red-500" : ""}
                  ${isPastTime ? "text-gray-400" : ""}
                  ${!isDisabled ? "text-gray-600" : ""}
                `}
              >
                {slotsUsed}/1 Slots
                {remainingSlots === 0 && " (Full)"}
                {isPastTime && " (Past)"}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
