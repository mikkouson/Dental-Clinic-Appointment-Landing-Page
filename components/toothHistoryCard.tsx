import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Treatment {
  id?: number;
  history_date: string;
  tooth_location: number;
  tooth_condition: string;
  tooth_history: string;
  appointments?: {
    services?: {
      name: string;
    };
  };
}

interface ToothHistoryProps {
  history: Treatment[];
}

type SortOrder = "asc" | "desc";

export default function ToothHistoryCard({ history }: ToothHistoryProps) {
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const conditionColors = {
    partial_erupted: "#FFA07A",
    healthy: "#98FB98",
    missing: "#D3D3D3",
    decayed: "#8B4513",
    filled: "#87CEEB",
  };

  const sortedTreatments = [...history].sort((a: Treatment, b: Treatment) => {
    try {
      const dateA = new Date(a.history_date);
      const dateB = new Date(b.history_date);
      return sortOrder === "desc"
        ? dateB.getTime() - dateA.getTime()
        : dateA.getTime() - dateB.getTime();
    } catch (error) {
      return 0;
    }
  });

  const toggleSort = () => {
    setSortOrder((current) => (current === "desc" ? "asc" : "desc"));
  };

  const formatDate = (date: string) => {
    try {
      const d = new Date(date);
      return {
        day: d.getDate(),
        month: d.toLocaleString("default", { month: "short" }),
        year: d.getFullYear(),
      };
    } catch (error) {
      return { day: "--", month: "---", year: "----" };
    }
  };

  const getToothDescription = (location: number) => {
    const positions = {
      upper: location <= 16,
      left: location <= 8 || (location >= 25 && location <= 32),
    };

    return `${positions.upper ? "Upper" : "Lower"} ${positions.left ? "Left" : "Right"}`;
  };

  return (
    <div className="flex flex-col w-full">
      <div className="mb-4 flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleSort}
          className="flex items-center gap-2"
        >
          <span>{sortOrder === "desc" ? "Newest First" : "Oldest First"}</span>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              sortOrder === "asc" ? "rotate-180" : ""
            }`}
          />
        </Button>
      </div>
      <ScrollArea className="bg-transparent w-full h-[395px]">
        <div className="space-y-6">
          {sortedTreatments.map((treatment, index) => {
            const date = formatDate(treatment.history_date);
            const toothDescription = getToothDescription(
              treatment.tooth_location
            );

            return (
              <div
                key={`treatment-${treatment.id}-${index}`}
                className="flex group"
              >
                <div className="flex flex-col items-center mr-4">
                  <div className="rounded-full h-3 w-3 bg-primary group-hover:scale-110 transition-transform" />
                  {index < sortedTreatments.length - 1 && (
                    <div className="h-full w-0.5 bg-border mt-1" />
                  )}
                </div>

                <Card className="flex-grow hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-semibold">{date.day}</div>
                        <div className="text-sm text-muted-foreground">
                          {date.month}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {date.year}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <h3 className="font-medium text-sm">
                          Tooth Number: {treatment.tooth_location}
                        </h3>
                        <p className="text-sm text-muted-foreground italic">
                          {toothDescription.charAt(0).toUpperCase() +
                            toothDescription.slice(1)}
                        </p>
                        <Badge
                          variant="outline"
                          className="mb-2"
                          style={{
                            backgroundColor:
                              conditionColors[
                                treatment.tooth_condition as keyof typeof conditionColors
                              ],
                          }}
                        >
                          {treatment.tooth_condition}
                        </Badge>

                        {treatment?.appointments?.services && (
                          <div className="flex gap-2">
                            <h3 className="font-medium text-sm">Service:</h3>
                            <p className="text-sm text-muted-foreground">
                              {treatment.appointments.services.name}
                            </p>
                          </div>
                        )}
                        <div className="flex gap-2">
                          <h3 className="font-medium text-sm">Description:</h3>
                          <p className="text-sm text-muted-foreground">
                            {treatment.tooth_history}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
