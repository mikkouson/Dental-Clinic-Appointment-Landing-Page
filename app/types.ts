import { z } from "zod";

export const PatientSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, { message: "Name is required." }),
  phoneNumber: z.coerce
    .number()
    .min(100000000, { message: "Invalid Phone Number" })
    .max(999999999, { message: "Invalid Phone Number" }),
  email: z.string().email().min(1, {
    message: "Invalid email address.",
  }),

  address: z
    .object({
      id: z.number().optional(),
      address: z.string({
        required_error: "Address is required.",
      }),
      latitude: z.number({
        required_error: "Invalid Address",
      }),
      longitude: z.number({
        required_error: "Invalid Address",
      }),
    })
    .refine((data) => data.address.trim().length > 0, {
      message: "Address must be provided.",
    }),
  sex: z.string().min(1, { message: "Sex is required." }),
  dob: z.date({
    required_error: "A date of birth is required.",
  }),

  branch: z.number({
    required_error: "Please select an branch to display.",
  }),
  services: z.number({
    required_error: "Please select an branch to display.",
  }),
  date: z.date({
    required_error: "Date is required.",
  }),
  time: z.number({
    required_error: "Time is required.",
  }),
});
export type PatientFormValues = z.infer<typeof PatientSchema>;

export const ReScheduleSchema = z.object({
  id: z.number().optional(),
  date: z.date({
    required_error: "Date is required.",
  }),
  time: z.number({
    required_error: "Time is required.",
  }),
});
export type RescheduleFormValues = z.infer<typeof ReScheduleSchema>;
