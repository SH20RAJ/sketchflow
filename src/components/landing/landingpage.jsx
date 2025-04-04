import HeroSection from "./sections/HeroSection";
import FeaturesSection from "./sections/FeaturesSection";
import StatsSection from "./sections/StatsSection";
import HowItWorksSection from "./sections/HowItWorksSection";
import UseCasesSection from "./sections/UseCasesSection";
import CTASection from "./sections/CTASection";
import SocialProofSection from './sections/SocialProofSection';
import ComparisonSection from "./sections/ComparisonSection";
import Testimonials from "./sections/Testimonials";
import FAQs from "./sections/FAQs";
import StructuredData from "./StructuredData";

export default function LandingPage() {

  return (
    <>
      {/* Add structured data for SEO */}
      <StructuredData />

      <main className="overflow-hidden">
        {/* Hero Section - First impression */}
        <HeroSection />

        {/* Features Section - Showcase product capabilities */}
        <FeaturesSection />

        {/* Social Proof - Build credibility */}
        <SocialProofSection />

        {/* How It Works - Explain the product */}
        <HowItWorksSection />

        {/* Stats Section - Demonstrate impact */}
        <StatsSection />

        {/* Use Cases - Show practical applications */}
        <UseCasesSection />

        {/* Comparison - Differentiate from competitors */}
        <ComparisonSection />

        {/* Testimonials - Build trust */}
        <Testimonials />

        {/* FAQ Section - Address common questions */}
        <FAQs />

        {/* CTA Section - Drive conversions */}
        <CTASection />
      </main>
    </>
  );
}
