"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
export async function login(formData: FormData) {
  const supabase = createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  // Attempt to sign in
  const { data: signInData, error } =
    await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect("/login?message=Invalid password or email please try again.");
  }

  // Check if sign in was successful and user exists
  if (!signInData?.user) {
    redirect("/login?message=Unable to retrieve user data.");
  }

  // Check if user has the correct role
  const userRole = signInData.user.user_metadata?.role;

  if (userRole !== "patient") {
    // Sign out the user since they don't have the correct role
    await supabase.auth.signOut();
    redirect("/login?message=Access denied. This portal is for patients only.");
  }

  // If all checks pass, proceed with login
  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signOut() {
  const supabase = createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    redirect("/error");
  } else {
    revalidatePath("/", "layout");
    redirect("/login");
  }
}

export async function loginWithGoogle() {
  const supabase = createClient();
  const origin = headers().get("origin");

  const { error, data } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.log(error);
    return error;
  } else {
    return redirect(data.url);
  }
}
