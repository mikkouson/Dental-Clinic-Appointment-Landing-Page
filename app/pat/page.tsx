"use client";
import { toast } from "@/hooks/use-toast";
import React from "react";

const page = () => {
  return (
    <button
      onClick={() => {
        toast({
          title: "Scheduled: Catch up",
          description: "Friday, February 10, 2023 at 5:57 PM",
        });
      }}
    >
      Show Toast
    </button>
  );
};

export default page;
