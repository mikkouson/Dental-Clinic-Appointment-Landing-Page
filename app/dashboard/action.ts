"use server";

import DentalAppointmentPendingEmail from "@/components/emailTemplates/pendingAppointment";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import * as React from "react";
import { Resend } from "resend";
import { z } from "zod";
import { AppointmentFormValues, AppointmentSchema } from "../types";

const resend = new Resend(process.env.RESEND_API_KEY);
interface AppointmentActionProps {
  aptId: number;
}

export async function newApp(data: AppointmentFormValues) {
  const result = AppointmentSchema.safeParse(data);
  if (!result.success) {
    throw new Error(
      `Validation failed: ${JSON.stringify(result.error.format())}`
    );
  }

  const supabase = createClient();
  const moment = require("moment-timezone");
  const dateInPHT = moment(data.date).tz("Asia/Manila");

  if (!dateInPHT.isValid()) {
    throw new Error("Invalid appointment date provided");
  }

  const { error, data: newAppointmentData } = await supabase
    .from("appointments")
    .insert([
      {
        patient_id: data.patient_id,
        service: data.services,
        branch: data.branch,
        date: dateInPHT.format("MM-DD-YYYY"),
        time: data.time,
        status: 2,
        type: "online",
      },
    ])
    .select("id")
    .single();

  if (error) {
    throw new Error(`Error inserting appointment: ${error.message}`);
  }

  if (newAppointmentData) {
    await pendingAppointment({ aptId: newAppointmentData.id });
  }

  revalidatePath("/");
}

export async function pendingAppointment({ aptId }: AppointmentActionProps) {
  const supabase = createClient();

  try {
    // Combine status and appointment_ticket updates in one query
    const { data: appointmentData, error: updateError } = await supabase
      .from("appointments")
      .update({
        status: 2,
      })
      .eq("id", aptId)
      .select(
        `
          *,
          patients (
            *
          )
        `
      )
      .single();

    if (updateError) {
      throw new Error(`Error updating appointment: ${updateError.message}`);
    }

    // Extract patient email from the related patient data
    const patientEmail = appointmentData.patients?.email;

    if (!patientEmail) {
      throw new Error(
        "No email found for the patient associated with this appointment."
      );
    }

    // Send the confirmation email using the retrieved appointment data
    const emailResponse = await resend.emails.send({
      from: "Appointment@email.lobodentdentalclinic.online",
      to: [patientEmail], // Send to the patient's email
      subject: "Appointment Application",
      react: DentalAppointmentPendingEmail() as React.ReactElement, // Ensure this matches your email service's expected format
    });

    // Check if the email was sent successfully
    if (emailResponse.error) {
      throw new Error(
        `Error sending confirmation email: ${emailResponse.error.message}`
      );
    }

    console.log("Appointment rejection email sent to:", patientEmail);

    // Revalidate the path to update the cache
    revalidatePath("/");
  } catch (error) {
    // Catch any errors that occur during the process and log them
    console.error("An error occurred during appointment acceptance:", error);
  }
  revalidatePath("/");

  // Redirect after all the async operations are complete
  // redirect("/appointments?tab=calendar");
}
