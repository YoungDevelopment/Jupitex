import HeroSection from "@/components/HeroSection";
import ProblemsSection from "@/components/ProblemsSection";
import AuditSection from "@/components/AuditSection";
import AutomationsSection from "@/components/AutomationsSection";
import RoiSection from "@/components/RoiSection";

import ServicesSection from "@/components/ServicesSection";
import WhyJupitexSection from "@/components/WhyJupitexSection";
import OurWorkSection from "@/components/OurWorkSection";
import AuditRockSection from "@/components/AuditRockSection";
import FaqChatSection from "@/components/FaqChatSection";
import BookCallSection from "@/components/BookCallSection";
import FloatingNav from "@/components/FloatingNav";
import SiteFooter from "@/components/SiteFooter";
import { CONTACT_EMAIL, FAQS, SITE_URL, WORKFLOWS } from "@/lib/site";

// Structured data for search engines: who Jupitex is, what it offers, and the FAQ
const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": `${SITE_URL}/#organization`,
      name: "Jupitex",
      url: SITE_URL,
      logo: `${SITE_URL}/JupitexLogos/nav_logo_light.png`,
      email: CONTACT_EMAIL,
      description:
        "Back-office automation for debt collection agencies: client remittance reports, payment posting and reconciliation, and placement file intake, built inside the collection software agencies already use.",
      areaServed: { "@type": "Country", name: "United States" },
      knowsAbout: WORKFLOWS.map((w) => w.name),
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Back-office automation",
        itemListElement: [
          {
            "@type": "Offer",
            name: "Free 90-minute automation audit",
            price: "0",
            priceCurrency: "USD",
            description:
              "A 30-minute intro and a 60-minute process-mapping session. No access to your systems, NDA first. You get a written roadmap with a fixed price for each workflow.",
          },
          ...WORKFLOWS.map((w) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: w.name, description: w.blurb },
          })),
        ],
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Jupitex",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}/#faq`,
      mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        // escape "<" so the JSON can never close the script tag early
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD).replace(/</g, "\\u003c") }}
      />
      <FloatingNav />
      <main className="min-h-screen w-full bg-background">
        {/* Hero -> Problems -> Audit must stay adjacent: ProblemsSection drives the
            one-swipe-per-screen scrolling between them. */}
        <HeroSection />
        <ProblemsSection />
        <AuditSection />
        <AutomationsSection />
        <RoiSection />
        <ServicesSection />
        <WhyJupitexSection />
        <OurWorkSection />
        <AuditRockSection />
        <FaqChatSection />
        <BookCallSection />
      </main>
      <SiteFooter />
    </>
  );
}
