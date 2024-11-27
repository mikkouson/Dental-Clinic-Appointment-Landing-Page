import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const supabase = createClient();
  const date = req.nextUrl.searchParams.get("date");
  const branch = req.nextUrl.searchParams.get("branch");

  let query = supabase
    .from("time_slots")
    .select(
      `
      *,
      appointments(*,
        patients(*)
      )
    `
    )
    .is("appointments.deleteOn", null)
    .is("appointments.patients.deleteOn", null)
    .eq("appointments.date", date);

  // Add branch filter only if branch parameter is provided
  if (branch) {
    query = query.eq("appointments.branch", branch);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Supabase error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
