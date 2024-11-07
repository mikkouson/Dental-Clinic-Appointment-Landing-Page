import TimeSlot from "@/components/buttons/selectTime";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
const TimePicker = ({
  form,
  name,
  branch,
  date,
}: {
  form: UseFormReturn<any>;
  name: string;
  branch: string;
  date: Date;
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Time</FormLabel>
          <TimeSlot branch={branch} field={field} date={date} />
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default TimePicker;
