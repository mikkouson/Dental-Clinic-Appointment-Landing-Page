"use server";

import { createClient } from "@/utils/supabase/server";
import moment from "moment";
import { redirect } from "next/navigation";
import { z } from "zod";
import { PatientFormValues, PatientSchema } from "@/app/types";

interface AppointmentActionProps {
  aptId: number;
}

export async function newAppointment(data: PatientFormValues) {
  // Validate the incoming data
  const result = PatientSchema.safeParse(data);

  if (!result.success) {
    console.log("Validation errors:", result.error.format());
    // You might want to throw an error or handle it accordingly
    return;
  }

  const supabase = createClient();

  // Step 1: Insert address and get the ID
  const { data: addressData, error: addressError } = await supabase
    .from("addresses")
    .insert([
      {
        address: data.address.address,
        latitude: data.address.latitude,
        longitude: data.address.longitude,
      },
    ])
    .select("id")
    .single();

  if (addressError || !addressData) {
    console.error("Error inserting address:", addressError?.message);
    // Handle the error appropriately, maybe throw or return
    return;
  }

  const addressId = addressData.id;

  // Step 2: Insert patient with the address ID and get the patient ID
  const { data: patientData, error: patientError } = await supabase
    .from("patients")
    .insert([
      {
        name: data.name,
        email: data.email,
        sex: data.sex,
        address: addressId,
        phone_number: data.phoneNumber,
        dob: data.dob,
        status: data.status,
      },
    ])
    .select("id")
    .single();

  if (patientError || !patientData) {
    console.error("Error inserting patient:", patientError?.message);
    // Handle the error appropriately
    return;
  }

  const patientId = patientData.id;

  // Step 3: Insert appointment with the patient ID
  const { data: appointment, error: appointmentError } = await supabase
    .from("appointments")
    .insert([
      {
        patient_id: patientId, // Associate with the newly created patient
        service: data.services, // Ensure 'services' matches the expected type
        branch: data.branch,
        date: moment(data.date).format("YYYY-MM-DD"), // Use ISO format
        time: data.time,
      },
    ])
    .single();

  if (appointmentError || !appointment) {
    console.error("Error inserting appointment:", appointmentError?.message);
    // Handle the error appropriately
    return;
  }

  console.log("Patient and appointment data inserted successfully");

  // Optionally, redirect to a confirmation page or another relevant page
  redirect(`/patients/${patientId}`);
}
