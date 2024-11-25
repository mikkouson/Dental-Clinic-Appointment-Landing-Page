"use strict";
import { PatientFormValues, PatientSchema } from "@/app/types";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createNewUser } from "./action";
import PatientFields from "./patientFields";

export function NewPatientForm() {
  const form = useForm<PatientFormValues>({
    resolver: zodResolver(PatientSchema),
  });

  async function onSubmit(data: PatientFormValues) {
    try {
      const result = await createNewUser(data);

      if (result.error) {
        // Handle field-specific errors
        if (result.error.field) {
          form.setError(result.error.field as any, {
            type: "manual",
            message: result.error.message,
          });
        }

        toast({
          className: cn(
            "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
          ),
          title: "Error",
          description: result.error.message,
          variant: "destructive",
          duration: 3000,
        });
        return;
      }

      toast({
        className: cn(
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
        ),
        title: "Success",
        description: "Please check your email for email verification!",
        variant: "success",
        duration: 3000,
      });

      form.reset();
    } catch (error: any) {
      toast({
        className: cn(
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
        ),
        title: "Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
        duration: 3000,
      });
    }
  }

  return (
    <div className="w-full py-10">
      <PatientFields form={form} onSubmit={onSubmit} />
    </div>
  );
}
