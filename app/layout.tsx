import DeployButton from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/header-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import "./globals.css";
import Image from "next/image";
import Footer from "@/components/footer";
import { Toaster } from "@/components/ui/toaster";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Lobodent Dental Clinic",
  description:
    "Lobodent Dental Clinic offers expert dental care including Odontectomy procedures for teeth no. 28 & 38. Walk-ins are accepted, but appointments are prioritized. Contact us for inquiries and appointments at 0912 032 2767. We have two convenient locations: Lipa City and Tanauan City, Batangas. Open Monday to Sunday, with Wednesday closure. Parking is available for your convenience. We look forward to welcoming you to our clinic for a brighter smile!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <main className="flex flex-col min-h-screen">
          <div className="flex-1 w-full flex flex-col items-center">
            <nav className="w-full h-16 sticky top-0 z-50 bg-white shadow-md flex justify-center">
              <div className="w-full max-w-7xl flex justify-between items-center p-4 px-6">
                <div className="flex">
                  <Image
                    alt="Doctor"
                    src="/images/logo.png"
                    width={40}
                    height={40}
                    className="rounded-full mr-1"
                  />
                  <h3 className="text-lg font-semibold">Lobodent</h3>
                </div>

                {/* Menu for larger screens */}
                <div className="hidden md:flex gap-4">
                  <Link href="/">Home</Link>
                  <Link href="/#services">Services</Link>
                  <Link href="/#feedback">Feedbacks</Link>
                  <Link href="/appointment">Appointment</Link>
                  <Link href="/#faq">FAQs</Link>
                </div>

                {/* Burger icon for small screens (checkbox input) */}
                <div className="md:hidden relative">
                  <input
                    type="checkbox"
                    id="menu-toggle"
                    className="peer hidden"
                  />
                  <label
                    htmlFor="menu-toggle"
                    className="block cursor-pointer text-2xl"
                  >
                    ☰
                  </label>

                  {/* Mobile Menu */}
                  <div className="absolute right-0 top-full mt-2 hidden peer-checked:flex flex-col bg-slate-50 p-8 justify-center items-start gap-2">
                    <Link href="/">Home</Link>
                    <Link href="/#services">Services</Link>
                    <Link href="/#feedback">Feedbacks</Link>
                    <Link href="/appointment">Appointment</Link>
                    <Link href="/#faq">FAQs</Link>
                  </div>
                </div>
              </div>
            </nav>

            <div className="flex w-full max-w-7xl">{children}</div>
            <Toaster />
          </div>
          <Footer />
        </main>
      </body>
    </html>
  );
}
