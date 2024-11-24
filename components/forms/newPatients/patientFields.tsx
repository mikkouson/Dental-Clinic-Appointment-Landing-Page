import { PatientFormValues } from "@/app/types";
import Maps from "@/components/maps";
import PasswordInput from "@/components/passworInput";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import Field from "../formField";

const sex = [
  { name: "Male", id: "male" },
  { name: "Female", id: "female" },
  { name: "Prefer not to say", id: "prefer_not_to_say" },
] as const;

const status = [
  { name: "Active", id: "Active" },
  { name: "Inactive", id: "Inactive" },
] as const;

interface PatientFieldsProps {
  form: UseFormReturn<PatientFormValues>;
  onSubmit: (data: PatientFormValues) => void;
  next?: boolean;
}

const PatientFields = ({
  form,
  onSubmit,
  next = false,
}: PatientFieldsProps) => {
  const { isSubmitting } = form.formState;
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState<boolean>(false);

  const togglePasswordVisibility = () => setIsPasswordVisible((prev) => !prev);
  const toggleConfirmVisibility = () => setIsConfirmVisible((prev) => !prev);
  console.log(form);
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full p-2 ">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Field form={form} name={"name"} label={"Name"} />
          <Field form={form} name={"email"} label={"Email"} />
          <Field form={form} data={sex} name={"sex"} label={"Sex"} />
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <div className="relative ml-auto flex-1 md:grow-0">
                    <p className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground text-sm">
                      (+639)
                    </p>
                    <Input
                      type="number"
                      className="w-full rounded-lg bg-background pl-16 input-no-spin "
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <PasswordInput form={form} name={"password"} label={"Password"} />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <FormControl>
                    <Input
                      id="confirmPassword"
                      className="pe-9"
                      placeholder="Confirm Password"
                      type={isConfirmVisible ? "text" : "password"}
                      {...field}
                    />
                  </FormControl>
                  <button
                    className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 ring-offset-background transition-shadow hover:text-foreground focus-visible:border focus-visible:border-ring focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                    type="button"
                    onClick={toggleConfirmVisibility}
                    aria-label={
                      isConfirmVisible ? "Hide password" : "Show password"
                    }
                    aria-pressed={isConfirmVisible}
                  >
                    {isConfirmVisible ? (
                      <EyeOff size={16} strokeWidth={2} aria-hidden="true" />
                    ) : (
                      <Eye size={16} strokeWidth={2} aria-hidden="true" />
                    )}
                  </button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dob"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Birth</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    value={
                      field.value instanceof Date &&
                      !isNaN(field.value.getTime())
                        ? field.value.toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(e) => {
                      const date = e.target.value
                        ? new Date(e.target.value)
                        : null;
                      field.onChange(date);
                    }}
                    max={new Date().toISOString().split("T")[0]}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Maps field={field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting} variant="outline">
            {next ? "Next" : isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PatientFields;
