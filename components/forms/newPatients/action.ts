// server-action.ts
"use server";

import { PatientFormValues, PatientSchema } from "@/app/types";
import { createAdminClient } from "@/utils/supabase/server";
export type RegistrationResult = {
  success?: boolean;
  userId?: string;
  error?: {
    code: string;
    message: string;
    field?: string;
    details?: Record<string, any>;
  };
};
export async function createNewUser(
  formData: PatientFormValues
): Promise<RegistrationResult> {
  if (!formData) {
    return {
      error: {
        code: "FORM_DATA_REQUIRED",
        message: "Form data is required",
      },
    };
  }

  const result = PatientSchema.safeParse(formData);

  if (!result.success) {
    console.log("Validation errors:", result.error.format());
    return {
      error: {
        code: "VALIDATION_ERROR",
        message: "Please check your input and try again",
        details: result.error.format(),
      },
    };
  }

  const supabase = createAdminClient();

  try {
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          name: formData.name,
          role: "patient",
          address: {
            address: formData.address.address,
            latitude: formData.address.latitude,
            longitude: formData.address.longitude,
          },
          staus: "Active",
          phoneNumber: formData.phoneNumber,
          email: formData.email,
          sex: formData.sex,
          dob: formData.dob,
        },
      },
    });

    if (error) {
      if (error.message.includes("duplicate")) {
        return {
          error: {
            code: "EMAIL_TAKEN",
            message: "This email is already registered",
            field: "email",
          },
        };
      }
      if (error.message.includes("invalid_email")) {
        return {
          error: {
            code: "INVALID_EMAIL",
            message: "Please enter a valid email address",
            field: "email",
          },
        };
      }
      if (error.message.includes("weak_password")) {
        return {
          error: {
            code: "WEAK_PASSWORD",
            message: "Password is too weak. Please use a stronger password",
            field: "password",
          },
        };
      }

      return {
        error: {
          code: "UNKNOWN_ERROR",
          message: error.message,
        },
      };
    }

    if (!data?.user) {
      return {
        error: {
          code: "USER_CREATION_FAILED",
          message: "Failed to create user",
        },
      };
    }

    return { success: true, userId: data.user.id };
  } catch (error: any) {
    console.error("Unexpected error during user creation:", error);
    return {
      error: {
        code: "UNEXPECTED_ERROR",
        message: "An unexpected error occurred. Please try again later.",
      },
    };
  }
}
