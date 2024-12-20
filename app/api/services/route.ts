import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("services")
    .select("*")
    .is("deleteOn", null) // Exclude soft-deleted items
    .order("id", { ascending: true }); // Sort by ID in ascending order

  if (error) {
    console.error("Supabase error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}
