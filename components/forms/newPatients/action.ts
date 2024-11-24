"use server";
import { PatientFormValues, PatientSchema } from "@/app/types";
import { createAdminClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createNewUser(formData: PatientFormValues) {
  if (!formData) throw new Error("Form data is required");

  const result = PatientSchema.safeParse(formData);

  if (!result.success) {
    console.log("Validation errors:", result.error.format());
    throw new Error("Validation failed");
  }

  const supabase = createAdminClient();

  const { data, error } = await supabase.auth.admin.createUser({
    email: formData.email,
    password: formData.password,
    user_metadata: {
      name: formData.name,
      role: "patient",
      address: {
        address: formData.address.address,
        latitude: formData.address.latitude,
        longitude: formData.address.longitude,
      },
      phoneNumber: formData.phoneNumber,
      email: formData.email,
      sex: formData.sex,
      dob: formData.dob,
    },
    email_confirm: true,
    role: "authenticated",
  });

  if (error) {
    if (error.message.includes("duplicate"))
      throw new Error("User already exists");
    if (error.message.includes("invalid_email"))
      throw new Error("Invalid email");
    if (error.message.includes("weak_password"))
      throw new Error("Password too weak");
    throw error;
  }

  if (!data?.user) throw new Error("Failed to create user");

  // Optionally, you can revalidate and redirect after everything is successful
  //   revalidatePath("/", "layout");
  // redirect("/users");

  return { success: true, userId: data.user.id };
}
