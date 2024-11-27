import React from "react";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Appointment {
  status: number;
}

interface TimeSlot {
  appointments: Appointment[];
}

interface TomorrowBranchSlotsProps {
  branchId: string | number;
}

const TomorrowBranchSlots: React.FC<TomorrowBranchSlotsProps> = ({
  branchId,
}) => {
  const [availableSlots, setAvailableSlots] = React.useState<number | null>(
    null
  );
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        const formattedDate = tomorrow.toLocaleDateString("en-US", {
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
        });

        const response = await fetch(
          `/api/timeslots?date=${formattedDate}&branch=${branchId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch time slots");
        }
        const jsonData = (await response.json()) as TimeSlot[];
        if (!Array.isArray(jsonData)) {
          throw new Error("Invalid response format");
        }

        const bookedSlots = jsonData.reduce((acc, slot) => {
          const validAppointments = slot.appointments.filter(
            (apt: Appointment) =>
              apt.status !== 3 && apt.status !== 5 && apt.status !== 4
          );
          return acc + validAppointments.length;
        }, 0);

        // Calculate available slots (7 total - booked slots)
        setAvailableSlots(7 - bookedSlots);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to load time slots")
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (branchId) {
      fetchData();
    }
  }, [branchId]);

  if (error) {
    return <span className="text-red-500">Error: {error.message}</span>;
  }

  if (isLoading) {
    return (
      <span className="flex items-center text-green-400">
        <Loader2 className="h-4 w-4 animate-spin mr-2 text-green-400" />
        Tomorrow Available Slot
      </span>
    );
  }

  if (availableSlots === null) {
    return <span className="text-gray-500">No data available</span>;
  }

  // Show available slots in red if none available, otherwise in green
  const textColorClass =
    availableSlots === 0 ? "text-red-500" : "text-green-400";

  return (
    <div className="flex flex-col  gap-2">
      <span className={`font-medium ${textColorClass}`}>
        Tomorrow Available Slots {availableSlots}
      </span>
      {availableSlots > 4 && (
        <Badge
          variant="secondary"
          className="bg-green-100 text-green-800 hover:bg-green-100"
        >
          Low Wait Times
        </Badge>
      )}
    </div>
  );
};

export default TomorrowBranchSlots;
