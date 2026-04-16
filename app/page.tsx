import HulyHero from "./sections/HulyHero";
import LogoStrip from "./components/LogoStrip";
import SiteNavbar from "./components/SiteNavbar";
import FeatureCards from "./sections/FeatureCards";
import WhyJupitex from "./sections/WhyJupitex";
import Services from "./sections/Services";
import Testimonials from "./sections/Testimonials";
import FaqChat from "./sections/FaqChat";
import BookCallSection from "./sections/BookCallSection";
import Problems from "./sections/Problems";
import FooterSection from "./sections/FooterSection";

export default function Home() {
  return (
    <main>
      <SiteNavbar />
      <HulyHero />
      <LogoStrip />
    
      <Problems />
      <Services />
      <WhyJupitex /> <Testimonials />
      <FaqChat />
      <BookCallSection />
      <FooterSection />
    </main>
  );
}
