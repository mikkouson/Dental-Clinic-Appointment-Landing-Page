"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { PatientCol } from "@/app/schema";
import { PatientFormValues, PatientSchema } from "@/app/types";
import PatientFields from "@/components/forms/patients/patientFields";
import { toast } from "@/hooks/use-toast";
import useSWR from "swr";
import { newAppointment } from "../actions";
import Consent from "@/components/consent";
import { Button } from "@/components/ui/button";

const fetcher = (url: string): Promise<any> =>
  fetch(url).then((res) => res.json());

export default function Page() {
  const [showPatientFields, setShowPatientFields] = useState(false);

  // Fetch patient data
  const { data: responseData, error } = useSWR("/api/patients/", fetcher);

  // Extract the array of patients from the response data
  const patients = responseData?.data || [];

  // Initialize form with react-hook-form
  const form = useForm<z.infer<typeof PatientSchema>>({
    resolver: zodResolver(PatientSchema),
    mode: "onChange", // Validates on change

    defaultValues: {
      name: "",
      email: "",
      sex: "",
    },
  });

  // Function to check if email already exists
  const checkEmailExists = async (email: string): Promise<boolean> => {
    return patients.some((patient: PatientCol) => patient.email === email);
  };

  async function onSubmit(data: PatientFormValues) {
    // Call the server function and await its response
    const result = await newAppointment(data);

    if (!result.success) {
      // Display an error toast with the message
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive",
      });
      return;
    }

    // If appointment creation is successful, display a success toast
    toast({
      title: "Success",
      description: "Appointment created successfully!",
      variant: "success",
    });

    // Reset the form if needed
    // form.reset();
    // setShowPatientFields(false); // Hide fields after submission
  }

  return (
    <>
      {showPatientFields ? (
        <PatientFields
          form={form}
          onSubmit={onSubmit}
          setShowPatientFields={setShowPatientFields}
        />
      ) : (
        <Consent setShowPatientFields={setShowPatientFields} />
      )}
    </>
  );
}
