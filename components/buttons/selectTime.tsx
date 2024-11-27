import React from "react";
import { Loader2 } from "lucide-react";

// Types
interface TimeSlot {
  id: number;
  time: string;
  appointments: Array<{
    id: number;
    status: number;
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

// Helper functions
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

const isTimeSlotPast = (date: Date, timeString: string): boolean => {
  const now = new Date();
  const [hours, minutes] = timeString.split(":");

  const slotDate = new Date(date);
  slotDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0);

  return now > slotDate;
};

// Components
const LoadingState = () => (
  <div className="flex justify-center items-center p-4">
    <Loader2 className="h-5 w-5 animate-spin" />
    <p className="ml-2">Loading time slots...</p>
  </div>
);

const ErrorState = ({ message }: { message: string }) => (
  <div className="p-4 text-red-500 bg-red-50 rounded-lg">Error: {message}</div>
);

const EmptyState = () => (
  <div className="p-4 text-yellow-500 bg-yellow-50 rounded-lg">
    No time slots available
  </div>
);

const TimeSlotItem = ({
  slot,
  isSelected,
  isDisabled,
  isPastTime,
  remainingSlots,
  slotsUsed,
  onClick,
}: {
  slot: TimeSlot;
  isSelected: boolean;
  isDisabled: boolean;
  isPastTime: boolean;
  remainingSlots: number;
  slotsUsed: number;
  onClick: () => void;
}) => (
  <div
    className={`
      flex justify-between items-center p-3 rounded-lg border transition-all duration-200
      ${isSelected ? "bg-blue-50 border-blue-500" : "bg-white border-gray-200 hover:bg-gray-50"}
      ${isDisabled ? "opacity-50 cursor-not-allowed" : "hover:border-blue-300 cursor-pointer"}
    `}
    onClick={onClick}
    role="button"
    tabIndex={0}
    aria-disabled={isDisabled}
  >
    <span className="font-medium text-gray-900">{formatTime(slot.time)}</span>
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

// Main component
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

  if (error) return <ErrorState message={error.message} />;
  if (isLoading) return <LoadingState />;
  if (!data) return <EmptyState />;

  const isToday = date.toDateString() === new Date().toDateString();

  return (
    <div className="grid grid-cols-1 gap-2">
      {data.map((slot: TimeSlot) => {
        const validAppointments = slot.appointments.filter(
          (apt) => apt.status !== 3 && apt.status !== 5 && apt.status !== 4
        );

        const patientCount = validAppointments.length;
        const slotsUsed = Math.min(1, patientCount);
        const remainingSlots = 1 - slotsUsed;
        const isPastTime = isToday && isTimeSlotPast(date, slot.time);
        const isSelected = field.value === slot.id;
        const isDisabled = remainingSlots === 0 || isPastTime;

        return (
          <TimeSlotItem
            key={slot.id}
            slot={slot}
            isSelected={isSelected}
            isDisabled={isDisabled}
            isPastTime={isPastTime}
            remainingSlots={remainingSlots}
            slotsUsed={slotsUsed}
            onClick={() => !isDisabled && field.onChange(slot.id)}
          />
        );
      })}
    </div>
  );
}
