import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jupitex | Back-office automation for debt collection agencies",
  description:
    "Jupitex automates the back-office work inside debt collection agencies: client remittance reports, payment posting and placement intake. Start with a free 90-minute audit.",
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
