import HeroSection from "@/components/HeroSection";
import ProblemsSection from "@/components/ProblemsSection";
import AuditSection from "@/components/AuditSection";
import AutomationsSection from "@/components/AutomationsSection";
import RoiSection from "@/components/RoiSection";
// import ProcessSection from "@/components/ProcessSection";
import ServicesSection from "@/components/ServicesSection";
import WhyJupitexSection from "@/components/WhyJupitexSection";
import OurWorkSection from "@/components/OurWorkSection";
import AuditRockSection from "@/components/AuditRockSection";
import FaqChatSection from "@/components/FaqChatSection";
import BookCallSection from "@/components/BookCallSection";
import FloatingNav from "@/components/FloatingNav";
import SiteFooter from "@/components/SiteFooter";

export default function Home() {
  return (
    <>
      <FloatingNav />
      <main className="min-h-screen w-full bg-background">
        {/* Hero -> Problems -> Audit must stay adjacent: ProblemsSection drives the
            one-swipe-per-screen scrolling between them. */}
        <HeroSection />
        <ProblemsSection />
        <AuditSection />
        <AutomationsSection />
        <RoiSection />
        {/* <ProcessSection /> hidden for now */}
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
