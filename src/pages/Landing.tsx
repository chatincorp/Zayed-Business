import Navigation from "@/components/Navigation";
import NotificationBar from "@/components/NotificationBar";
import FloatingWidgets from "@/components/FloatingWidgets";
import CookieNotice from "@/components/CookieNotice";
import HeroCarousel from "@/components/HeroCarousel";
import LatestIntelligence from "@/components/sections/LatestIntelligence";
import NewsEngineBoot from "@/components/tabloid/NewsEngineBoot";
import { useSEO } from "@/lib/seo";
import { isBackendConfigured } from "@/lib/backend";
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
  useSEO({
    title: "Yasir Zayed — Business Development, Security & Technology Solutions in Kenya",
    description:
      "Yasir Zayed combines business development, sales & marketing, web development, custom AI chatbots, intelligent automation and security solutions under one integrated ecosystem. Building Stronger Businesses. Smarter Systems. Secure Futures.",
    path: "/",
    keywords:
      "business development Kenya, consultancy, security solutions, AI chatbots, web development, digital transformation, technology consulting, Yasir Zayed",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "What services does Yasir Zayed offer?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yasir Zayed provides business development, sales and marketing strategy, CCTV and security systems, AI system integration, custom AI chatbots, workflow automation, corporate websites and WordPress development — all under one integrated ecosystem.",
            },
          },
          {
            "@type": "Question",
            name: "Where is Yasir Zayed located?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yasir Zayed is based in Nairobi, Kenya, and serves clients across East Africa and globally. Contact: +254 114 712 989 or +254 717 227 012, info@yasirzayed.com.",
            },
          },
          {
            "@type": "Question",
            name: "How much do Yasir Zayed services cost?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Pricing depends on scope: strategy engagements start from $2,500 (KES equivalent), security systems are custom-quoted, and website packages are subscription-based. Visit yasirzayed.com/pricing for full USD and KES pricing.",
            },
          },
          {
            "@type": "Question",
            name: "Does Yasir Zayed work with small businesses and startups?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. Engagements scale from early-stage startups to established enterprises, with flexible monthly subscriptions and project-based options.",
            },
          },
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://yasirzayed.com/" },
          { "@type": "ListItem", position: 2, name: "Services", item: "https://yasirzayed.com/services" },
          { "@type": "ListItem", position: 3, name: "Tabloid", item: "https://yasirzayed.com/tabloid" },
          { "@type": "ListItem", position: 4, name: "Contact", item: "https://yasirzayed.com/contact" },
        ],
      },
    ],
  });

  return (
    <div className="min-h-screen">
      <NotificationBar />
      <Navigation />
      <HeroCarousel />
      <IntroSection />
      <LatestIntelligence />
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
      <FloatingWidgets />
      {isBackendConfigured && <NewsEngineBoot />}
    </div>
  );
}
