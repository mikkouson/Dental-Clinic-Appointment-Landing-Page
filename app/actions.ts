"use server";

import { PatientFormValues, PatientSchema } from "@/app/types";
import DentalAppointmentPendingEmail from "@/components/emailTemplates/pendingAppointment";
import { createClient } from "@/utils/supabase/server";
import moment from "moment";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Helper function to normalize names
function normalizeName(name: string, length = 10) {
  return name.replace(/\s+/g, "").toLowerCase().slice(0, length);
}

// Function to insert address and return the ID
async function insertAddress(addressData: {
  address: string;
  latitude: number;
  longitude: number;
}): Promise<number> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("addresses")
    .insert([addressData])
    .select("id")
    .single();

  if (error || !data) {
    const errorMessage = error?.message || "Address insertion failed";
    console.error("Error inserting address:", errorMessage);
    throw new Error(errorMessage);
  }

  return data.id;
}

// Function to create a new patient
async function createNewPatient(data: PatientFormValues): Promise<number> {
  const supabase = createClient();

  const addressId = await insertAddress({
    address: data.address.address,
    latitude: data.address.latitude,
    longitude: data.address.longitude,
  });

  const { data: newPatient, error: newPatientError } = await supabase
    .from("patients")
    .insert([
      {
        name: data.name,
        dob: moment(data.dob).format("YYYY-MM-DD"),
        email: data.email,
        phone_number: data.phoneNumber,
        sex: data.sex,
        status: "active",
        address: addressId,
      },
    ])
    .select("id")
    .single();

  if (newPatientError || !newPatient) {
    const errorMessage =
      newPatientError?.message || "Error creating new patient";
    console.error("Error creating new patient:", errorMessage);
    throw new Error(errorMessage);
  }

  console.log(`New patient created with ID: ${newPatient.id}`);
  return newPatient.id;
}

export async function newAppointment(data: PatientFormValues) {
  // Validate the incoming data
  const result = PatientSchema.safeParse(data);

  if (!result.success) {
    console.error("Validation errors:", result.error.format());
    return {
      success: false,
      message: "Validation errors",
      errors: result.error.format(),
    };
  }

  const supabase = createClient();

  // Format the DOB correctly
  const formattedDOB = moment(data.dob).format("YYYY-MM-DD");

  // Normalize the input name
  const normalizedName = normalizeName(data.name);

  // Fetch patients matching DOB, email, or phone number
  const { data: existingPatients, error: existingPatientError } = await supabase
    .from("patients")
    .select("id, name")
    .eq("dob", formattedDOB)
    .or(`email.eq.${data.email},phone_number.eq.${data.phoneNumber}`);

  if (existingPatientError) {
    const errorMessage =
      existingPatientError.message || "Error fetching patient";
    console.error("Error fetching patient:", errorMessage);
    return {
      success: false,
      message: errorMessage,
    };
  }

  let patientId: number;

  if (!existingPatients || existingPatients.length === 0) {
    console.log(
      "No patient found with the given details. Creating a new patient."
    );
    try {
      patientId = await createNewPatient(data);
    } catch (error: any) {
      console.error("Error creating new patient:", error.message);
      return {
        success: false,
        message: error.message || "Error creating new patient",
      };
    }
  } else {
    // Filter patients by normalized name
    const matchingPatients = existingPatients.filter((patient) => {
      const patientNormalizedName = normalizeName(patient.name);
      return patientNormalizedName === normalizedName;
    });

    if (matchingPatients.length === 0) {
      console.log(
        "No patient found with the given name and DOB. Creating a new patient."
      );
      try {
        patientId = await createNewPatient(data);
      } catch (error: any) {
        console.error("Error creating new patient:", error.message);
        return {
          success: false,
          message: error.message || "Error creating new patient",
        };
      }
    } else if (matchingPatients.length > 1) {
      console.error(
        "Multiple patients found with the same details. Consider refining the search."
      );
      return {
        success: false,
        message:
          "Multiple patients found with the same details. Consider refining the search.",
      };
    } else {
      patientId = matchingPatients[0].id;
      console.log(`Patient exists with ID: ${patientId}`);
    }
  }

  // Check if the patient already has an appointment on the given date
  const appointmentDate = moment(data.date).format("YYYY-MM-DD");

  const { data: existingAppointments, error: existingAppointmentsError } =
    await supabase
      .from("appointments")
      .select("id")
      .eq("patient_id", patientId)
      .eq("date", appointmentDate);

  if (existingAppointmentsError) {
    const errorMessage =
      existingAppointmentsError.message || "Error fetching appointments";
    console.error("Error fetching appointments:", errorMessage);
    return {
      success: false,
      message: errorMessage,
    };
  }

  if (existingAppointments && existingAppointments.length > 0) {
    console.error("Patient already has an appointment on this date.");
    return {
      success: false,
      message: "Patient already has an appointment on this date.",
    };
  }

  console.log("Patient does not have an appointment on this date.");

  // Proceed to create the new appointment
  const { data: newAppointment, error: newAppointmentError } = await supabase
    .from("appointments")
    .insert([
      {
        patient_id: patientId,
        service: data.services,
        branch: data.branch,
        date: appointmentDate,
        time: data.time,
        type: "online",
        status: 2,
      },
    ])
    .select("*")
    .single();

  console.log(
    `Appointment created successfully: ${JSON.stringify(newAppointment)}`
  );

  await pendingAppointment({ aptId: newAppointment.id });

  return {
    success: true,
    message: "Appointment created successfully.",
    appointment: newAppointment,
  };
}

interface AppointmentActionProps {
  aptId: number;
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

  // Redirect after all the async operations are complete
  redirect("/appointment");
}
