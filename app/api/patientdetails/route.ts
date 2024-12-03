import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const supabase = createClient();

  // First, verify user authentication
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { data: Patient, error } = await supabase
      .from("patients")
      .select(
        `
        *,
        address (*),
        appointments (
          *,
          services (*),
          time_slots (*),
          status (*),
          branch (*)
        ),
        tooth_history(
          *,
          appointments (
            *,
            services (*)
          )
        )
      `
      )
      .eq("user_id", user.id)
      .is("tooth_history.deleteOn", null)
      .is("appointments.deleteOn", null)
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!Patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    return NextResponse.json(Patient);
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
