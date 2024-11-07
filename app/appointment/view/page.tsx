import PatientCard from "@/components/patientCard";
import { createClient } from "@/utils/supabase/server";

export default async function AppointmentView() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log(user);
  return (
    <div className="w-full">
      <PatientCard
        id={user?.user_metadata.patient_id}
        appointment={user?.user_metadata.appointment_id}
      />
    </div>
  );
}
