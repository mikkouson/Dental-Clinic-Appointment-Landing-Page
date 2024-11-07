"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function login(formData: FormData) {
  const supabase = createClient();

  const appointment_ticket = formData.get("ticket") as string;
  const email = formData.get("email") as string;

  const { data, error } = await supabase
    .from("appointments")
    .select(`id, patient_id, patients (email)`)
    .eq("appointment_ticket", appointment_ticket)
    .eq("patients.email", email)
    .single();

  if (error || !data) {
    redirect(
      "/appointment/login?message=Invalid appointment ticket or email. Please try again."
    );
  } else {
    const { id, patient_id } = data;
    const { error: authError } = await supabase.auth.signInAnonymously({
      options: {
        data: { appointment_id: id, patient_id },
      },
    });

    if (authError) {
      redirect(
        "/appointment/login?message=Authentication error. Please try again."
      );
    }

    revalidatePath("/", "layout");
    redirect(`/appointment/view`);
  }
}
