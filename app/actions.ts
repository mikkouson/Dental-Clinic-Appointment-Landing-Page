"use server";

import { createClient } from "@/utils/supabase/server";
import moment from "moment";
import { z } from "zod";
import { PatientFormValues, PatientSchema } from "@/app/types";

// Helper function to normalize names
function normalizeName(name: string, length = 10) {
  return name.replace(/\s+/g, "").toLowerCase().slice(0, length);
}

// Function to insert address and return the ID
async function insertAddress(addressData: {
  address: string;
  latitude: number;
  longitude: number;
}) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("addresses")
    .insert([addressData])
    .select("id")
    .single();

  if (error || !data) {
    let errorMessage = "Address insertion failed";

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (
      typeof error === "object" &&
      error !== null &&
      "message" in error
    ) {
      errorMessage = (error as any).message;
    }

    console.error("Error inserting address:", errorMessage);
    throw new Error(errorMessage);
  }

  return data.id;
}

export async function newAppointment(data: PatientFormValues) {
  // Validate the incoming data
  const result = PatientSchema.safeParse(data);

  if (!result.success) {
    console.log("Validation errors:", result.error.format());
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
    let errorMessage = "Error fetching patient";

    if (existingPatientError instanceof Error) {
      errorMessage = existingPatientError.message;
    } else if (
      typeof existingPatientError === "object" &&
      existingPatientError !== null &&
      "message" in existingPatientError
    ) {
      errorMessage = (existingPatientError as any).message;
    }

    console.error("Error fetching patient:", errorMessage);
    return {
      success: false,
      message: errorMessage,
    };
  }

  let patientId;

  if (!existingPatients || existingPatients.length === 0) {
    console.log(
      "No patient found with the given details. Creating a new patient."
    );

    let addressId;
    try {
      addressId = await insertAddress({
        address: data.address.address,
        latitude: data.address.latitude,
        longitude: data.address.longitude,
      });
    } catch (error) {
      let errorMessage = "Error creating new patient";

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (
        typeof error === "object" &&
        error !== null &&
        "message" in error
      ) {
        errorMessage = (error as any).message;
      }

      return {
        success: false,
        message: errorMessage,
      };
    }

    // Create a new patient with the address
    const { data: newPatient, error: newPatientError } = await supabase
      .from("patients")
      .insert([
        {
          name: data.name,
          dob: formattedDOB,
          email: data.email,
          phone_number: data.phoneNumber,
          address: addressId,
          // Include any other required fields
        },
      ])
      .select("id");
    if (newPatientError) {
      let errorMessage = "Error creating new patient";

      if (newPatientError instanceof Error) {
        errorMessage = newPatientError.message;
      } else if (
        typeof newPatientError === "object" &&
        newPatientError !== null &&
        "message" in newPatientError
      ) {
        errorMessage = (newPatientError as any).message;
      }

      console.error("Error creating new patient:", errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    }

    patientId = newPatient[0].id;
    console.log("New patient created with ID:", patientId);
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

      let addressId;
      try {
        addressId = await insertAddress({
          address: data.address.address,
          latitude: data.address.latitude,
          longitude: data.address.longitude,
        });
      } catch (error) {
        let errorMessage = "Error creating new patient";

        if (error instanceof Error) {
          errorMessage = error.message;
        } else if (
          typeof error === "object" &&
          error !== null &&
          "message" in error
        ) {
          errorMessage = (error as any).message;
        }

        return {
          success: false,
          message: errorMessage,
        };
      }

      // Create a new patient with the address
      const { data: newPatient, error: newPatientError } = await supabase
        .from("patients")
        .insert([
          {
            name: data.name,
            dob: formattedDOB,
            email: data.email,
            phone_number: data.phoneNumber,
            sex: data.sex,
            status: "active",
            address: addressId, // Include the address ID here
            // Include any other required fields
          },
        ])
        .select("id");

      if (newPatientError) {
        let errorMessage = "Error creating new patient";

        if (newPatientError instanceof Error) {
          errorMessage = newPatientError.message;
        } else if (
          typeof newPatientError === "object" &&
          newPatientError !== null &&
          "message" in newPatientError
        ) {
          errorMessage = (newPatientError as any).message;
        }

        console.error("Error creating new patient:", errorMessage);
        return {
          success: false,
          message: errorMessage,
        };
      }

      patientId = newPatient[0].id;
      console.log("New patient created with ID:", patientId);
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
      console.log("Patient exists with ID:", patientId);
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
    let errorMessage = "Error fetching appointments";

    if (existingAppointmentsError instanceof Error) {
      errorMessage = existingAppointmentsError.message;
    } else if (
      typeof existingAppointmentsError === "object" &&
      existingAppointmentsError !== null &&
      "message" in existingAppointmentsError
    ) {
      errorMessage = (existingAppointmentsError as any).message;
    }

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
        patient_id: patientId, // Associate with the existing or newly created patient
        service: data.services, // Ensure 'services' matches the expected type
        branch: data.branch,
        date: appointmentDate, // Use ISO format
        time: data.time,
        type: "online",
        status: 2,
      },
    ]);

  if (newAppointmentError) {
    let errorMessage = "Error creating appointment";

    if (newAppointmentError instanceof Error) {
      errorMessage = newAppointmentError.message;
    } else if (
      typeof newAppointmentError === "object" &&
      newAppointmentError !== null &&
      "message" in newAppointmentError
    ) {
      errorMessage = (newAppointmentError as any).message;
    }

    console.error("Error creating appointment:", errorMessage);
    return {
      success: false,
      message: errorMessage,
    };
  }

  console.log("Appointment created successfully:", newAppointment);
  return {
    success: true,
    message: "Appointment created successfully.",
    appointment: newAppointment,
  };
}
