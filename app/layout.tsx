import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import SmoothScrollProvider from "./components/SmoothScrollProvider";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "Huly — Everything App for your teams",
  description:
    "Huly, an open-source platform, serves as an all-in-one replacement of Linear, Jira, Slack, and Notion.",
  icons: {
    icon: [
      {
        url: "/images/logo/tab-logo-light.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/images/logo/tab-logo-dark.png",
        media: "(prefers-color-scheme: dark)",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className="antialiased" style={{ background: "#000000" }}>
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
