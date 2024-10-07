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

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        {/* <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        > */}
        <main className="min-h-screen flex flex-col items-center">
          <div className="flex-1 w-full flex flex-col  items-center">
            <nav className="w-full h-16 flex justify-center">
              <div className="w-full max-w-7xl flex justify-between items-center p-4 px-6 ">
                <div className="flex">
                  <Image
                    alt="Doctor"
                    src="/images/logo.png"
                    width={40}
                    height={40}
                    className="rounded-full mr-1"
                  />
                  <h3 className="text-lg font-semibold   ">Lobodent</h3>
                </div>
                <ul className="flex gap-4">
                  <li className="font-medium">
                    <small className="text-sm  leading-none ">
                      <Link href="/">Home</Link>
                    </small>
                  </li>
                  <li className="text-muted-foreground">
                    <small className="text-sm font-light leading-none">
                      <Link href="/">About us</Link>
                    </small>
                  </li>
                  <li className="text-muted-foreground">
                    <small className="text-sm font-light leading-none">
                      <Link href="/">Services</Link>
                    </small>
                  </li>
                  <li className="text-muted-foreground">
                    <small className="text-sm font-light leading-none">
                      <Link href="/">Appointment</Link>
                    </small>
                  </li>
                  <li className="text-muted-foreground">
                    <small className="text-sm font-light leading-none">
                      <Link href="/">FAQs</Link>
                    </small>
                  </li>
                </ul>
              </div>
            </nav>

            <div className="flex   max-w-7xl">{children}</div>

            {/* <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
              <p>
                Powered by{" "}
                <a
                  href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
                  target="_blank"
                  className="font-bold hover:underline"
                  rel="noreferrer"
                >
                  Supabase
                </a>
              </p>
              <ThemeSwitcher />
            </footer> */}
          </div>
        </main>
        {/* </ThemeProvider> */}
      </body>
      <Footer />
    </html>
  );
}
