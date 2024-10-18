import { BentoGridDemo } from "@/components/bentogrid";
import { CarouselSize } from "@/components/carousel";
import DentalClinicFAQ from "@/components/collapsible";
import Footer from "@/components/footer";
import Hero from "@/components/hero";
import ConnectSupabaseSteps from "@/components/tutorial/connect-supabase-steps";
import SignUpUserSteps from "@/components/tutorial/sign-up-user-steps";
import { Card } from "@/components/ui/card";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { title } from "process";

export default async function Index() {
  return (
    <main className="flex-1 flex flex-col gap-6 px-4 ">
      <Hero />

      {/* <Card className="p-4 text-center shadow-lg">
          <h2 className="text-lg font-bold">{title}</h2>
          <p>description</p>
          <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Know this more
          </button>
        </Card> */}
      <BentoGridDemo />
      <CarouselSize />
      <DentalClinicFAQ />
    </main>
  );
}
