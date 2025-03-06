'use client'
import HeroCTASection from "./sections/HeroCTASection";
import StatsSection from "./sections/StatsSection";
import HeroSection from "./sections/HeroSection";
import FeaturesSection from "./sections/FeaturesSection";
import Testimonials from "./sections/Testimonials";
import FAQs from "./sections/FAQs";
import UseCasesSection from "./sections/UseCasesSection";
import HowItWorksSection from "./sections/HowItWorksSection";
import ComparisonSection from "./sections/ComparisonSection";
import SocialProofSection from './sections/SocialProofSection';

export default function LandingPage() {

  return (
    <>
      <main className="overflow-hidden">
        <HeroSection />
        <FeaturesSection />
        <HeroCTASection />
        <StatsSection />

        <HowItWorksSection />
        <UseCasesSection />
        <SocialProofSection />
        <ComparisonSection />
        <Testimonials />
        <FAQs />
      </main>
    </>
  );
}
