"use strict";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PatientSchema, PatientFormValues } from "@/app/types";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import PatientFields from "./patientFields";
import { PatientCol } from "@/app/schema";
import { useRouter } from "next/navigation";
import { usePatients } from "@/components/hooks/usePatient";
import { ToastAction } from "@/components/ui/toast";
import { createNewUser } from "./action";

export function NewPatientForm() {
  const form = useForm<PatientFormValues>({
    resolver: zodResolver(PatientSchema),
  });

  async function onSubmit(data: PatientFormValues) {
    try {
      // Here you can add your API call to save the patient data
      await createNewUser(data);
      toast({
        className: cn(
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
        ),
        title: "Success",
        description: "Please check your email for email verification!",
        variant: "success",
        duration: 3000,
      });

      // Optional: Reset form after successful submission
      form.reset();
    } catch (error: any) {
      toast({
        className: cn(
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
        ),
        title: "Error",
        description:
          error.message || "An error occurred while submitting the form.",
        variant: "destructive",
        duration: 3000,
      });
    }
  }

  return (
    <div className="w-full">
      <div className="w-full">
        <h2 className="text-2xl font-bold mb-2">Patient Information</h2>
        <p className="text-muted-foreground mb-4">
          Enter patient's personal details
        </p>
        <Button
          variant="outline"
          onClick={() => {
            toast({
              title: "Scheduled: Catch up ",
              description: "Friday, February 10, 2023 at 5:57 PM",
              action: (
                <ToastAction altText="Goto schedule to undo">Undo</ToastAction>
              ),
            });
          }}
        >
          Add to calendar
        </Button>
        <PatientFields form={form} onSubmit={onSubmit} />
      </div>
    </div>
  );
}
