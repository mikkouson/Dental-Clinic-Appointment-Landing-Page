import Footer from "@/components/footer";
import { Toaster } from "@/components/ui/toaster";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://www.lobodentdentalclinic.online/`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Lobodent Dental Clinic",
  description:
    "Lobodent Dental Clinic provides expert dental care, including Odontectomy. Visit us in Lipa or Tanauan City, Batangas. Open Mon-Sun (closed Wed), 10 AM - 5 PM. Contact us today!",
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
