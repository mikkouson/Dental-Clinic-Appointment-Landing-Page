"use client";
import SubmitButton from "@/components/buttons/submitBtn";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { createClient } from "@/utils/supabase/server";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { login } from "./action";

export default function ViewAppointment({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  return (
    <div className="overflow-hidden w-full lg:grid lg:min-h-[600px]  xl:min-h-[800px] ">
      <div className="flex items-center justify-center py-12  ">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">View Your Appointment</h1>
            <p className="text-balance text-muted-foreground">
              Enter your appointment ticket number and email to view your
              detailssadas
            </p>
          </div>
          <form>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="appointment-ticket">Appointment Ticket</Label>

                <InputOTP
                  maxLength={6}
                  pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                  name="ticket"
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  name="email"
                />
              </div>
              <SubmitButton
                className="w-full"
                pendingText="Loading appointment details..."
                formAction={login}
              >
                View Appointment
              </SubmitButton>
              <div className="text-center text-red-500">
                {(searchParams && searchParams.message) ?? ""}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
