import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import SmoothScrollProvider from "./components/SmoothScrollProvider";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const siteUrl = new URL("https://jupitex.io");
const siteDescription =
  "Jupitex helps growing businesses put AI to work by finding repetitive operations, building useful automations, and training teams to make them stick.";

export const metadata: Metadata = {
  metadataBase: siteUrl,
  applicationName: "Jupitex",
  title: {
    default: "Jupitex | AI Automation and Technology Services",
    template: "%s | Jupitex",
  },
  description: siteDescription,
  keywords: [
    "Jupitex",
    "AI automation",
    "AI transformation",
    "custom AI solutions",
    "full-stack development",
    "staff augmentation",
  ],
  authors: [{ name: "Jupitex", url: siteUrl }],
  creator: "Jupitex",
  publisher: "Jupitex",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Jupitex",
    title: "Jupitex | AI Automation and Technology Services",
    description: siteDescription,
    images: [
      {
        url: "/images/hero-illustration.png",
        width: 1024,
        height: 569,
        alt: "Jupitex AI automation dashboard preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jupitex | AI Automation and Technology Services",
    description: siteDescription,
    images: ["/images/hero-illustration.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
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
