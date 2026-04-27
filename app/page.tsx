import dynamic from "next/dynamic";
import HulyHero from "./sections/HulyHero";
import LogoStrip from "./components/LogoStrip";
import SiteNavbar from "./components/SiteNavbar";
import WhyJupitex from "./sections/WhyJupitex";
import Services from "./sections/Services";
import OurWork from "./sections/OurWork";
import Problems from "./sections/Problems";

const Testimonials = dynamic(() => import("./sections/Testimonials"));
const FaqChat = dynamic(() => import("./sections/FaqChat"));
const BookCallSection = dynamic(() => import("./sections/BookCallSection"));
const FooterSection = dynamic(() => import("./sections/FooterSection"));

export default function Home() {
  return (
    <main>
      <SiteNavbar />
      <HulyHero />
      <LogoStrip />
      <Problems />
      <Services /> <WhyJupitex />
      <OurWork />
      <Testimonials />
      <FaqChat />
      <BookCallSection />
      <FooterSection />
    </main>
  );
}
