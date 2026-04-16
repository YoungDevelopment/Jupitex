"use client";
import { Footer } from "@/components/ui/modem-animated-footer";
import { Twitter, Linkedin, Github, Mail } from "lucide-react";
import Image from "next/image";

export default function FooterSection() {
  const socialLinks = [
    {
      icon: <Twitter className="w-5 h-5" />,
      href: "https://twitter.com",
      label: "Twitter",
    },
    {
      icon: <Linkedin className="w-5 h-5" />,
      href: "https://linkedin.com",
      label: "LinkedIn",
    },
    {
      icon: <Github className="w-5 h-5" />,
      href: "https://github.com",
      label: "GitHub",
    },
    {
      icon: <Mail className="w-5 h-5" />,
      href: "mailto:contact@jupitex.com",
      label: "Email",
    },
  ];

  const navLinks = [
    { label: "Problems", href: "#problems" },
    { label: "Services", href: "#services" },
    { label: "Why Jupitex", href: "#why-jupitex" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "FAQ", href: "#faq" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <Footer
      brandName="Jupitex"
      brandDescription="We help teams ship faster with AI, automation, and dedicated engineering—strategy through execution."
      socialLinks={socialLinks}
      navLinks={navLinks}
      brandIcon={
        <Image
          src="/images/logo/nav_logo_dark.png"
          alt="Jupitex"
          width={200}
          height={52}
          className="h-10 w-auto sm:h-12"
        />
      }
    />
  );
}
