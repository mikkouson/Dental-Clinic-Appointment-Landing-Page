import { z } from "zod";

export const PatientSchema = z
  .object({
    id: z.number().optional(),
    name: z.string().min(1, { message: "Name is required." }),
    phoneNumber: z.coerce
      .number()
      .min(100000000, { message: "Invalid phone number" })
      .max(999999999, { message: "Invalid phone number" }),
    email: z.string().email({ message: "Invalid email address" }).min(1, {
      message: "Email is required",
    }),
    address: z
      .object({
        id: z.number().optional(),
        address: z.string({
          required_error: "Address is required",
        }),
        latitude: z.number({
          required_error: "Invalid address",
        }),
        longitude: z.number({
          required_error: "Invalid address",
        }),
      })
      .refine((data) => data.address.trim().length > 0, {
        message: "Address must be provided",
      }),
    sex: z.string().min(1, { message: "Sex is required" }),
    dob: z.date({
      required_error: "Date of birth is required",
    }),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[0-9]/, "Password must contain at least 1 number")
      .regex(/[a-z]/, "Password must contain at least 1 lowercase letter")
      .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter"),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type PatientFormValues = z.infer<typeof PatientSchema>;

export const AppointmentSchema = z.object({
  patient_id: z.number(),
  address: z
    .object({
      id: z.number().optional(),
      address: z.string({
        required_error: "Address is required",
      }),
      latitude: z.number({
        required_error: "Invalid address",
      }),
      longitude: z.number({
        required_error: "Invalid address",
      }),
    })
    .refine((data) => data.address.trim().length > 0, {
      message: "Address must be provided",
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

export type AppointmentFormValues = z.infer<typeof AppointmentSchema>;

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
