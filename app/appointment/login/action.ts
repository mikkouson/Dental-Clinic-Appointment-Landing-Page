"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
  const supabase = createClient();

  const appointment_ticket = formData.get("ticket") as string;
  const email = formData.get("email") as string;

  if (!appointment_ticket || !email) {
    redirect(
      "/appointment/login?message=Appointment ticket and email are required."
    );
    return;
  }

  // Join appointments with patients and check both appointment_ticket and email match
  const { data: appointmentData, error: appointmentError } = await supabase
    .from("appointments")
    .select(
      `
      id,
      patient_id,
      appointment_ticket,
      patient:patients!inner (
        id,
        email
      )
    `
    )
    .eq("appointment_ticket", appointment_ticket)
    .eq("patients.email", email)
    .single();

  // Check if appointment exists with matching email
  if (appointmentError || !appointmentData) {
    redirect(
      "/appointment/login?message=Invalid appointment ticket or email. Please try again."
    );
    return;
  }

  // Authentication using the validated data
  const { error: authError } = await supabase.auth.signInAnonymously({
    options: {
      data: {
        appointment_id: appointmentData.id,
        patient_id: appointmentData.patient_id,
      },
    },
  });

  if (authError) {
    redirect(
      "/appointment/login?message=Authentication error. Please try again."
    );
    return;
  }

  revalidatePath("/", "layout");
  redirect(`/appointment/view`);
}
