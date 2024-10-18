"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { PatientCol } from "@/app/schema";
import { PatientFormValues, PatientSchema } from "@/app/types";
import PatientFields from "@/components/forms/patients/patientFields";
import { toast } from "@/hooks/use-toast";
import useSWR from "swr";
import { newAppointment } from "../actions";

const fetcher = (url: string): Promise<any> =>
  fetch(url).then((res) => res.json());

export default function Page() {
  // Fetch patient data
  const { data: responseData, error } = useSWR("/api/patients/", fetcher);

  // Extract the array of patients from the response data
  const patients = responseData?.data || [];

  // Initialize form with react-hook-form
  const form = useForm<z.infer<typeof PatientSchema>>({
    resolver: zodResolver(PatientSchema),
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
    // Check if email already exists in fetched data
    // const emailExists = await checkEmailExists(data.email);

    // if (emailExists) {
    //   form.setError("email", {
    //     type: "manual",
    //     message: "Email already exists",
    //   });
    //   return;
    // }

    newAppointment(data);
    // setOpen(false);

    form.reset();
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <>
      <PatientFields form={form} onSubmit={onSubmit} />
      <button
        onClick={() => {
          toast({
            title: "Scheduled: Catch up",
            description: "Friday, February 10, 2023 at 5:57 PM",
          });
        }}
      >
        Show Toast
      </button>
    </>
  );
}
