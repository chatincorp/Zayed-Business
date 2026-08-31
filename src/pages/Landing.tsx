import Navigation from "@/components/Navigation";
import NotificationBar from "@/components/NotificationBar";
import CookieNotice from "@/components/CookieNotice";
import HeroCarousel from "@/components/HeroCarousel";
import IntroSection from "@/components/sections/IntroSection";
import ServicesSection from "@/components/sections/ServicesSection";
import AIIntegrationPreview from "@/components/sections/AIIntegrationPreview";
import ChatbotDemo from "@/components/sections/ChatbotDemo";
import LiveDemoPreviews from "@/components/sections/LiveDemoPreviews";
import BusinessDevSection from "@/components/sections/BusinessDevSection";
import SalesSection from "@/components/sections/SalesSection";
import MarketingSection from "@/components/sections/MarketingSection";
import PromotionalSection from "@/components/sections/PromotionalSection";
import SecuritySection from "@/components/sections/SecuritySection";
import TechnologySection from "@/components/sections/TechnologySection";
import AISection from "@/components/sections/AISection";
import WorkflowAutomation from "@/components/sections/WorkflowAutomation";
import ProcessSection from "@/components/sections/ProcessSection";
import TransformationSection from "@/components/sections/TransformationSection";
import EngagementSection from "@/components/sections/EngagementSection";
import CaseStudiesSection from "@/components/sections/CaseStudiesSection";
import FinalCTASection from "@/components/sections/FinalCTASection";
import Footer from "@/components/Footer";

export default function Landing() {
  return (
    <div className="min-h-screen">
      <NotificationBar />
      <Navigation />
      <HeroCarousel />
      <IntroSection />
      <ServicesSection />
      <AIIntegrationPreview />
      <LiveDemoPreviews />
      <BusinessDevSection />
      <SalesSection />
      <MarketingSection />
      <PromotionalSection />
      <SecuritySection />
      <TechnologySection />
      <AISection />
      <ChatbotDemo />
      <WorkflowAutomation />
      <ProcessSection />
      <TransformationSection />
      <EngagementSection />
      <CaseStudiesSection />
      <FinalCTASection />
      <Footer />
      <CookieNotice />
    </div>
  );
}
