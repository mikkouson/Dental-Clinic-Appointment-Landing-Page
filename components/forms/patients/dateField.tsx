import { Calendar } from "@/components/ui/calendar";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
const DatePicker = ({
  form,
  name,
}: {
  form: UseFormReturn<any>;
  name: string;
}) => {
  return (
    <FormField
      name={name}
      control={form.control}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Date</FormLabel>
          <Calendar
            mode="single"
            selected={field.value || new Date()} // Set the default to today's date
            onSelect={(date) => {
              field.onChange(date);
              form.setValue("time", 0); // Reset the time field when the date changes
            }}
            className="rounded-md border shadow flex items-center justify-center"
            disabled={(date) => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const maxDate = new Date(today);
              maxDate.setDate(today.getDate() + 29);

              return date < today || date > maxDate;
            }}
            defaultMonth={new Date()} // Ensure the calendar opens on the current month
          />
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default DatePicker;
