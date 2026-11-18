/**
 * Site content hooks.
 *
 * The public site must render with or without a Convex deployment, so every
 * hook here returns bundled fallbacks and only subscribes to the backend when
 * one is configured. Admin edits (via the content manager) replace the
 * fallbacks as soon as the deployment is reachable.
 */

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { isBackendConfigured } from "@/lib/backend";

export interface SiteNavItem {
  _id?: string;
  label: string;
  href: string;
  order: number;
  visible: boolean;
}

export interface SitePlan {
  _id?: string;
  name: string;
  tagline?: string;
  priceUsd?: number;
  priceLabel?: string;
  period: string;
  features: string[];
  active: boolean;
  popular?: boolean;
  taxNote: string;
  order: number;
}

export interface SiteService {
  _id?: string;
  title: string;
  slug: string;
  category: string;
  shortDescription?: string;
  ctaUrl?: string;
  status: string;
  displayOrder: number;
}

export const FALLBACK_NAV: SiteNavItem[] = [
  { label: "Home", href: "/#hero", order: 1, visible: true },
  { label: "About", href: "/about", order: 2, visible: true },
  { label: "Services", href: "/services", order: 3, visible: true },
  { label: "FMCG", href: "/fmcg", order: 4, visible: true },
  { label: "Tabloid", href: "/tabloid", order: 5, visible: true },
  { label: "Pricing", href: "/pricing", order: 6, visible: true },
  { label: "Contact", href: "/contact", order: 7, visible: true },
];

export const FALLBACK_PLANS: SitePlan[] = [
  {
    name: "Starter",
    tagline: "For businesses taking the first step",
    priceUsd: 499,
    period: "month",
    popular: false,
    taxNote: "Prices are not inclusive of Tax",
    order: 1,
    active: true,
    features: [
      "Monthly strategy consultation (2 sessions)",
      "Email and chat support",
      "Basic market research",
      "Business health assessment",
      "Access to knowledge base",
      "Monthly performance report",
    ],
  },
  {
    name: "Growth",
    tagline: "For ambitious businesses ready to scale",
    priceUsd: 1499,
    period: "month",
    popular: true,
    taxNote: "Prices are not inclusive of Tax",
    order: 2,
    active: true,
    features: [
      "Everything in Starter",
      "Weekly strategy sessions",
      "Dedicated account manager",
      "Sales and marketing strategy",
      "CRM setup and optimization",
      "AI workflow recommendations",
      "Security assessment",
      "Priority support",
      "Quarterly business review",
    ],
  },
  {
    name: "Enterprise",
    tagline: "For organizations that demand the best",
    priceLabel: "Custom",
    period: "",
    popular: false,
    taxNote: "Prices are not inclusive of Tax",
    order: 3,
    active: true,
    features: [
      "Senior strategist as your point of contact",
      "Unlimited consulting hours",
      "Full technology implementation",
      "Custom AI development",
      "Enterprise security infrastructure",
      "Dedicated project team",
      "SLA guarantees",
      "Board-level advisory",
      "24/7 premium support",
    ],
  },
];

export const FALLBACK_SERVICES: SiteService[] = [
  { title: "Business Development", slug: "business-development", category: "business", shortDescription: "Strategic planning, market intelligence and growth strategies for sustainable business expansion.", ctaUrl: "/#business-dev", status: "published", displayOrder: 1 },
  { title: "Sales Services", slug: "sales-services", category: "sales", shortDescription: "Sales strategy, process optimization, CRM implementation and team development for predictable revenue.", ctaUrl: "/#sales", status: "published", displayOrder: 2 },
  { title: "Marketing Services", slug: "marketing-services", category: "marketing", shortDescription: "Brand positioning, digital marketing, content strategy and customer experience optimization.", ctaUrl: "/#marketing", status: "published", displayOrder: 3 },
  { title: "Promotional Services", slug: "promotional-services", category: "promotional", shortDescription: "Campaign development, product launches, event marketing and partnership promotion programs.", ctaUrl: "/#promotional", status: "published", displayOrder: 4 },
  { title: "Security Solutions", slug: "security-solutions", category: "security", shortDescription: "Professional CCTV, surveillance, access control and security technology solutions for all sectors.", ctaUrl: "/#security", status: "published", displayOrder: 5 },
  { title: "Digital Solutions", slug: "digital-solutions", category: "digital", shortDescription: "Custom websites, web applications, e-commerce platforms and responsive digital experiences.", ctaUrl: "/#technology", status: "published", displayOrder: 6 },
  { title: "AI & Automation", slug: "ai-automation", category: "ai", shortDescription: "AI system integration, custom chatbots, workflow automation and intelligent business systems.", ctaUrl: "/#ai", status: "published", displayOrder: 7 },
  { title: "Marketplace Product Listings", slug: "marketplace-listings", category: "digital", shortDescription: "List and manage products on Jumia, Jiji and Kilimall where buyers are already shopping.", ctaUrl: "/services/marketplace-listings", status: "published", displayOrder: 8 },
  { title: "Account & Social Media Management", slug: "account-social-media-management", category: "digital", shortDescription: "Day-to-day management of your social accounts so your brand stays active, on-brand and growing.", ctaUrl: "/services/account-social-media-management", status: "published", displayOrder: 9 },
  { title: "Content Generation", slug: "content-generation", category: "digital", shortDescription: "Words, visuals and campaign content produced for your channels.", ctaUrl: "/services/content-generation", status: "published", displayOrder: 10 },
  { title: "Ad Generation", slug: "ad-generation", category: "digital", shortDescription: "Natural and AI-generated ads in image, video or both, with natural or AI voice-overs for radio-style ads.", ctaUrl: "/services/ad-generation", status: "published", displayOrder: 11 },
  { title: "FMCG Services", slug: "fmcg-services", category: "fmcg", shortDescription: "Order booking, route-to-market sales, supplier sourcing, merchandizing and product promotion.", ctaUrl: "/fmcg", status: "published", displayOrder: 12 },
];

export const DEFAULT_SECTION_FLAGS: Record<string, boolean> = {
  pricing: true,
  checkout: true,
  fmcg: true,
  wholesale: true,
  supplier_register: true,
  tabloid: true,
  ai_demos: true,
  portfolio: true,
  careers: true,
};

export const SECTION_FLAG_LABELS: { key: string; label: string; description: string }[] = [
  { key: "pricing", label: "Pricing page", description: "Show published plans at /pricing" },
  { key: "checkout", label: "Checkout page", description: "Allow customers to reach /checkout" },
  { key: "fmcg", label: "FMCG services", description: "Public FMCG service page at /fmcg" },
  { key: "wholesale", label: "Wholesale ordering", description: "Wholesale catalogue and order booking" },
  { key: "supplier_register", label: "Supplier registration", description: "Supplier onboarding at /supplier/register" },
  { key: "tabloid", label: "Zayed Tabloid", description: "News engine at /tabloid" },
  { key: "ai_demos", label: "Live demos", description: "Demo previews at /demo/*" },
  { key: "portfolio", label: "Portfolio", description: "Portfolio page" },
  { key: "careers", label: "Careers", description: "Careers page" },
];

export interface SitePartner {
  _id?: string;
  name: string;
  logo?: string;
  industry?: string;
  website?: string;
  status: string;
  displayOrder: number;
}

export interface SiteTestimonial {
  _id?: string;
  quote: string;
  clientName: string;
  company?: string;
  position?: string;
  status: string;
  displayOrder: number;
}

export interface SiteFaq {
  _id?: string;
  question: string;
  answer: string;
  category: string;
  visible: boolean;
  order: number;
}

export interface HomeSection {
  id: string;
  label: string;
  visible: boolean;
  order: number;
}

/** Canonical homepage section registry — shared by the admin manager and the page. */
export interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
  company?: string;
  inquiryType?: string;
  department?: string;
}

/**
 * Returns a submitter that persists contact-form messages to Convex.
 * Resolves `true` when stored, `false` when no backend is attached.
 */
export function useContactSubmitter() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const submit = isBackendConfigured ? useMutation(api.contact.submitContact) : null;

  return async (payload: ContactPayload): Promise<boolean> => {
    if (!submit) return false;
    await submit(payload);
    return true;
  };
}

/** Public routes whose publish state is controlled by a record in the pages table. */
export const GATED_ROUTES = [
  "/",
  "/about",
  "/services",
  "/contact",
  "/fmcg",
  "/wholesale",
  "/supplier/register",
  "/pricing",
  "/checkout",
  "/tabloid",
] as const;

export const HOME_SECTIONS: HomeSection[] = [
  { id: "fmcg", label: "FMCG Section", order: 1, visible: true },
  { id: "intro", label: "Introduction", order: 2, visible: true },
  { id: "intelligence", label: "Latest Intelligence", order: 3, visible: true },
  { id: "services", label: "Services Overview", order: 4, visible: true },
  { id: "added-services-briefing", label: "Added Services Briefing", order: 5, visible: true },
  { id: "ai-preview", label: "AI Integration Preview", order: 7, visible: true },
  { id: "live-demos", label: "Live Demo Previews", order: 6, visible: true },
  { id: "business-dev", label: "Business Development", order: 7, visible: true },
  { id: "sales", label: "Sales", order: 8, visible: true },
  { id: "marketing", label: "Marketing", order: 9, visible: true },
  { id: "promotional", label: "Promotional", order: 10, visible: true },
  { id: "security", label: "Security Solutions", order: 11, visible: true },
  { id: "technology", label: "Technology", order: 12, visible: true },
  { id: "ai", label: "AI Solutions", order: 14, visible: true },
  { id: "chatbot-demo", label: "Chatbot Demo", order: 15, visible: true },
  { id: "workflow", label: "Workflow Automation", order: 16, visible: true },
  { id: "process", label: "How We Work", order: 17, visible: true },
  { id: "transformation", label: "Transformation", order: 18, visible: true },
  { id: "engagement", label: "Engagement", order: 19, visible: true },
  { id: "case-studies", label: "Case Studies", order: 20, visible: true },
  { id: "testimonials", label: "Testimonials", order: 21, visible: true },
  // Off by default: the "testimonials" section above already renders the unified
  // Client Voices header + live rating chart, and repeating the same header with
  // quote cards read as a duplicate. Re-enable from Admin → Homepage Manager.
  { id: "homepage-testimonials-carousel", label: "Homepage Testimonials Carousel", order: 22, visible: false },
  { id: "final-cta", label: "Final CTA", order: 23, visible: true },
];

export interface HomepageSettings {
  sections: { id: string; visible: boolean; order: number }[];
  notification: { enabled: boolean; message: string };
}

type SitePayload = {
  nav: SiteNavItem[];
  plans: SitePlan[];
  services: SiteService[];
  partners?: SitePartner[];
  testimonials?: SiteTestimonial[];
  faqs?: SiteFaq[];
  pages?: { slug: string; status: string }[];
  flags: Record<string, boolean>;
};

const backend = isBackendConfigured;

function useSitePayload(): SitePayload | undefined {
  // The hook is only mounted by callers when a backend exists (see consumers),
  // but keep the guard so a stale configuration never crashes the bundle.
  if (!backend) return undefined;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useQuery(api.content.siteContent) as SitePayload | undefined;
}

/** Header navigation. Falls back to the bundled menu while loading/offline. */
export function useSiteNav(): SiteNavItem[] {
  const data = useSitePayload();
  const nav = data?.nav?.filter((n) => n.visible).sort((a, b) => a.order - b.order);
  return nav && nav.length > 0 ? nav : FALLBACK_NAV;
}

/** Published pricing plans, ordered for display. */
export function useSitePlans(): SitePlan[] {
  const data = useSitePayload();
  const plans = data?.plans?.filter((p) => p.active).sort((a, b) => a.order - b.order);
  return plans && plans.length > 0 ? plans : FALLBACK_PLANS;
}

/** Published homepage services, ordered for display. */
export function useSiteServices(): SiteService[] {
  const data = useSitePayload();
  const services = data?.services?.sort((a, b) => a.displayOrder - b.displayOrder);
  return services && services.length > 0 ? services : FALLBACK_SERVICES;
}

/** Feature flags that decide whether a public section is live or "coming soon". */
export function useSectionFlags(): Record<string, boolean> {
  const data = useSitePayload();
  return { ...DEFAULT_SECTION_FLAGS, ...(data?.flags ?? {}) };
}

/** Active partners shown in the website logo strip. */
export function useSitePartners(): SitePartner[] | undefined {
  const data = useSitePayload();
  if (!data) return undefined;
  return data.partners ?? [];
}

/** Published testimonials. */
export function useSiteTestimonials(): SiteTestimonial[] | undefined {
  const data = useSitePayload();
  if (!data) return undefined;
  return data.testimonials ?? [];
}

/** Visible FAQs. */
export function useSiteFaqs(): SiteFaq[] | undefined {
  const data = useSitePayload();
  if (!data) return undefined;
  return data.faqs ?? [];
}

/** Homepage section order/visibility and the notification bar content. */
export function useHomepageSettings(): HomepageSettings | undefined {
  if (!isBackendConfigured) return undefined;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useQuery(api.content.homepageSettings) as HomepageSettings | null | undefined ?? undefined;
}

/** All page records (used to decide whether a route is published). */
export function useSitePages() {
  const data = useSitePayload();
  return data?.pages as { slug: string; status: string }[] | undefined;
}
