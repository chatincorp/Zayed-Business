import Navigation from "@/components/Navigation";
import NotificationBar from "@/components/NotificationBar";
import FloatingWidgets from "@/components/FloatingWidgets";
import CookieNotice from "@/components/CookieNotice";
import HeroCarousel from "@/components/HeroCarousel";
import FmcgSection from "@/components/sections/FmcgSection";
import LatestIntelligence from "@/components/sections/LatestIntelligence";
import NewsEngineBoot from "@/components/tabloid/NewsEngineBoot";
import { useSEO } from "@/lib/seo";
import { isBackendConfigured } from "@/lib/backend";
import { HOME_SECTIONS, useHomepageSettings } from "@/lib/siteContent";
import type { ComponentType } from "react";
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
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import FinalCTASection from "@/components/sections/FinalCTASection";
import Footer from "@/components/Footer";

const SECTION_COMPONENTS: Record<string, ComponentType> = {
  fmcg: FmcgSection,
  intro: IntroSection,
  intelligence: LatestIntelligence,
  services: ServicesSection,
  "ai-preview": AIIntegrationPreview,
  "live-demos": LiveDemoPreviews,
  "business-dev": BusinessDevSection,
  sales: SalesSection,
  marketing: MarketingSection,
  promotional: PromotionalSection,
  security: SecuritySection,
  technology: TechnologySection,
  ai: AISection,
  "chatbot-demo": ChatbotDemo,
  workflow: WorkflowAutomation,
  process: ProcessSection,
  transformation: TransformationSection,
  engagement: EngagementSection,
  "case-studies": CaseStudiesSection,
  testimonials: TestimonialsSection,
  "final-cta": FinalCTASection,
};

export default function Landing() {
  // Section order and visibility are managed in the admin Homepage Manager.
  const homepage = useHomepageSettings();
  const sections = HOME_SECTIONS.map((base) => {
    const saved = homepage?.sections.find((s) => s.id === base.id);
    return {
      ...base,
      visible: saved?.visible ?? base.visible,
      order: saved?.order ?? base.order,
    };
  }).sort((a, b) => a.order - b.order);

  useSEO({
    title: "Yasir Zayed — Business, FMCG, Security & Technology Solutions in Kenya",
    description:
      "Yasir Zayed combines FMCG order booking, sales, supplier sourcing, merchandizing and product promotion with business development, marketing, web development, AI automation and security solutions under one integrated ecosystem. Building Stronger Businesses. Smarter Systems. Secure Futures.",
    path: "/",
    keywords:
      "FMCG services Kenya, FMCG order booking, FMCG sales, supplier sourcing Kenya, merchandizing, product promotion, business development Kenya, security solutions, AI chatbots, web development, digital transformation, Yasir Zayed",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "Service",
        name: "FMCG Services",
        serviceType:
          "FMCG order booking, route-to-market sales, supplier sourcing, merchandizing and product promotion",
        description:
          "End-to-end FMCG support for distributors, retailers and brand owners in Kenya and East Africa: structured order booking, sales execution, supplier sourcing, shelf merchandizing and product promotion.",
        url: "https://yasirzayed.com/services",
        provider: {
          "@type": "Organization",
          "@id": "https://yasirzayed.com/#organization",
          name: "Yasir Zayed",
        },
        areaServed: ["Kenya", "East Africa", "Global"],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "FMCG Services",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "FMCG Order Booking",
                url: "https://yasirzayed.com/services/fmcg-order-booking",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "FMCG Sales",
                url: "https://yasirzayed.com/services/fmcg-sales",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "FMCG Supplier Sourcing",
                url: "https://yasirzayed.com/services/fmcg-supplier-sourcing",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "FMCG Merchandizing",
                url: "https://yasirzayed.com/services/fmcg-merchandizing",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "FMCG Product Promotion",
                url: "https://yasirzayed.com/services/fmcg-product-promotion",
              },
            },
          ],
        },
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "What services does Yasir Zayed offer?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yasir Zayed provides FMCG order booking, sales, supplier sourcing, merchandizing and product promotion, plus business development, sales and marketing strategy, CCTV and security systems, AI system integration, custom AI chatbots, workflow automation, corporate websites and WordPress development — all under one integrated ecosystem.",
            },
          },
          {
            "@type": "Question",
            name: "Does Yasir Zayed provide FMCG services in Kenya?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. Our FMCG team handles order booking, route-to-market sales, supplier sourcing, merchandizing and product promotion for distributors, retailers and brand owners across Kenya and East Africa.",
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
      {sections.map((section) => {
        if (!section.visible) return null;
        const Section = SECTION_COMPONENTS[section.id];
        return Section ? <Section key={section.id} /> : null;
      })}
      <Footer />
      <CookieNotice />
      <FloatingWidgets />
      {isBackendConfigured && <NewsEngineBoot />}
    </div>
  );
}
