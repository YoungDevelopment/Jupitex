import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "@/lib/site";

// Inter is a variable font: one file covers every weight the site uses (300 to 700)
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const TITLE = "Jupitex | Back-office automation for debt collection agencies";
const DESCRIPTION =
  "Jupitex automates the back-office work inside debt collection agencies: client remittance reports, payment posting and placement intake. Start with a free 90-minute audit.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Jupitex",
    title: TITLE,
    description: DESCRIPTION,
  },
  icons: {
    icon: [
      {
        url: "/JupitexLogos/tab-logo-light.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/JupitexLogos/tab-logo-dark.png",
        media: "(prefers-color-scheme: dark)",
      },
    ],
    shortcut: "/JupitexLogos/tab-logo-light.png",
    apple: "/JupitexLogos/tab-logo-light.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-background text-[#0a0a0a] font-sans selection:bg-black selection:text-white">
        {children}
      </body>
    </html>
  );
}
