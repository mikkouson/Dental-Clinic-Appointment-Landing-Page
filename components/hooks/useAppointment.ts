"use client";
import { useEffect } from "react";
import useSWR from "swr";
import { createClient } from "@/utils/supabase/client";
import { AppointmentsCol } from "@/app/schema";

const fetcher = async (
  url: string
): Promise<{
  data: AppointmentsCol[] | [];
  count: number;
}> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch");
  }
  return response.json();
};

export function useAppointments(branches?: string | null) {
  const queryString = new URLSearchParams();

  if (branches) {
    queryString.append("branch", branches);
  }

  const {
    data: appointments,
    error: appointmentsError,
    isLoading: appointmentsLoading,
    mutate,
  } = useSWR<{
    data: AppointmentsCol[] | [];
    count: number;
  }>(`/api/apt?${queryString.toString()}`, fetcher);

  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel("realtime-appointments")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "appointments" },
        () => {
          mutate();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, mutate]);

  return { appointments, appointmentsError, appointmentsLoading, mutate };
}
