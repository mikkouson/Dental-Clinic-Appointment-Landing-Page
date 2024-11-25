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
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Lock,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
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

  return (
    <Card className="w-full mx-auto shadow-lg">
      <CardHeader className="space-y-1">
        <div className="flex items-center">
          <Link
            href="/login"
            className="absolute text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            <span>Back to Login</span>
          </Link>
        </div>
        <CardTitle className="text-2xl font-bold text-center mt-8">
          Patient Registration
        </CardTitle>
        <CardDescription className="text-center">
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information Section */}
              <div className="space-y-4">
                <div className="relative">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <User size={16} />
                          Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="pl-3"
                            placeholder="Enter your full name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="relative">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Mail size={16} />
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="pl-3"
                            placeholder="Enter your email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Field form={form} data={sex} name="sex" label="Sex" />

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Phone size={16} />
                        Phone Number
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                            (+639)
                          </div>
                          <Input
                            type="number"
                            className="pl-16 input-no-spin"
                            placeholder="Enter phone number"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Additional Information Section */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Calendar size={16} />
                        Date of Birth
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          className="pl-3"
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
                      <FormLabel className="flex items-center gap-2">
                        <MapPin size={16} />
                        Address
                      </FormLabel>
                      <FormControl>
                        <Maps field={field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <PasswordInput form={form} name="password" label="Password" />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Lock size={16} />
                        Confirm Password
                      </FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            className="pr-10"
                            placeholder="Confirm your password"
                            type={isConfirmVisible ? "text" : "password"}
                            {...field}
                          />
                        </FormControl>
                        <button
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                          type="button"
                          onClick={toggleConfirmVisibility}
                        >
                          {isConfirmVisible ? (
                            <EyeOff
                              size={16}
                              className="text-muted-foreground"
                            />
                          ) : (
                            <Eye size={16} className="text-muted-foreground" />
                          )}
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <CardFooter className="flex justify-end pt-6">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="min-w-32 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {next
                  ? "Next"
                  : isSubmitting
                    ? "Submitting..."
                    : "Create Account"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PatientFields;
