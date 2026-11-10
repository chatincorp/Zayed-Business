import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import type { QueryCtx } from "./_generated/server";

/* ══════════════════════════════════════════════════════════════
 *  SITE CONTENT STORE
 *
 *  Single source of truth for content the admin panel edits and
 *  the public website renders: services, pages, navigation,
 *  landing pages, plans, FAQs, testimonials and partners.
 * ══════════════════════════════════════════════════════════════ */

const serviceStatus = v.union(v.literal("draft"), v.literal("published"), v.literal("archived"));
const pageStatus = v.union(v.literal("draft"), v.literal("published"), v.literal("scheduled"), v.literal("archived"));
const landingStatus = v.union(v.literal("draft"), v.literal("published"), v.literal("scheduled"));
const testimonialStatus = v.union(v.literal("draft"), v.literal("published"), v.literal("archived"));

const FLAGS_KEY = "section_flags";

const DEFAULT_FLAGS: Record<string, boolean> = {
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

async function readFlags(ctx: QueryCtx): Promise<Record<string, boolean>> {
  const doc = await ctx.db
    .query("settings")
    .withIndex("by_key", (q) => q.eq("key", FLAGS_KEY))
    .first();
  return { ...DEFAULT_FLAGS, ...((doc?.value as Record<string, boolean> | undefined) ?? {}) };
}

/* ══════════════════════════════════════════════════════════════
 *  PUBLIC + ADMIN READS
 * ══════════════════════════════════════════════════════════════ */

/** Content the public website needs. Returns empty arrays until seeded. */
export const siteContent = query({
  handler: async (ctx) => {
    const [nav, plans, services, flags, pages, partners, testimonials, faqs] = await Promise.all([
      ctx.db.query("navigation").withIndex("by_menu", (q) => q.eq("menu", "header")).collect(),
      ctx.db.query("plans").withIndex("by_order").collect(),
      ctx.db.query("services").withIndex("by_status", (q) => q.eq("status", "published")).collect(),
      readFlags(ctx),
      ctx.db.query("pages").collect(),
      ctx.db.query("partners").collect(),
      ctx.db.query("testimonials").collect(),
      ctx.db.query("faqs").withIndex("by_order").collect(),
    ]);

    return {
      nav: nav.filter((n) => n.visible).sort((a, b) => a.order - b.order),
      plans: plans.filter((p) => p.active).sort((a, b) => a.order - b.order),
      services: services.sort((a, b) => a.displayOrder - b.displayOrder),
      pages,
      partners: partners.filter((p) => p.status === "active").sort((a, b) => a.displayOrder - b.displayOrder),
      testimonials: testimonials.filter((t) => t.status === "published").sort((a, b) => a.displayOrder - b.displayOrder),
      faqs: faqs.filter((f) => f.visible).sort((a, b) => a.order - b.order),
      flags,
    };
  },
});

/** Full content bundle for the admin panel (includes drafts/inactive rows). */
export const adminContent = query({
  handler: async (ctx) => {
    const [nav, plans, services, faqs, testimonials, partners, pages, landingPages, flags] =
      await Promise.all([
        ctx.db.query("navigation").collect(),
        ctx.db.query("plans").withIndex("by_order").collect(),
        ctx.db.query("services").collect(),
        ctx.db.query("faqs").withIndex("by_order").collect(),
        ctx.db.query("testimonials").collect(),
        ctx.db.query("partners").collect(),
        ctx.db.query("pages").collect(),
        ctx.db.query("landingPages").collect(),
        readFlags(ctx),
      ]);

    return {
      nav: nav.sort((a, b) => a.order - b.order),
      plans: plans.sort((a, b) => a.order - b.order),
      services: services.sort((a, b) => a.displayOrder - b.displayOrder),
      faqs: faqs.sort((a, b) => a.order - b.order),
      testimonials: testimonials.sort((a, b) => a.displayOrder - b.displayOrder),
      partners: partners.sort((a, b) => a.displayOrder - b.displayOrder),
      pages: pages.sort((a, b) => b.updatedAt - a.updatedAt),
      landingPages: landingPages.sort((a, b) => b.updatedAt - a.updatedAt),
      flags,
    };
  },
});

/* ══════════════════════════════════════════════════════════════
 *  SERVICES
 * ══════════════════════════════════════════════════════════════ */

export const upsertService = mutation({
  args: {
    id: v.optional(v.id("services")),
    title: v.string(),
    slug: v.string(),
    category: v.string(),
    shortDescription: v.optional(v.string()),
    ctaUrl: v.optional(v.string()),
    displayOrder: v.number(),
    status: serviceStatus,
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    if (args.id) {
      await ctx.db.patch(args.id, {
        title: args.title,
        slug: args.slug,
        category: args.category,
        shortDescription: args.shortDescription,
        ctaUrl: args.ctaUrl,
        displayOrder: args.displayOrder,
        status: args.status,
        updatedAt: now,
      });
      return args.id;
    }
    return await ctx.db.insert("services", {
      title: args.title,
      slug: args.slug,
      category: args.category,
      shortDescription: args.shortDescription,
      ctaUrl: args.ctaUrl,
      displayOrder: args.displayOrder,
      status: args.status,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const setServiceStatus = mutation({
  args: { id: v.id("services"), status: serviceStatus },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status, updatedAt: Date.now() });
  },
});

export const deleteService = mutation({
  args: { id: v.id("services") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

/* ══════════════════════════════════════════════════════════════
 *  PAGES
 * ══════════════════════════════════════════════════════════════ */

export const upsertPage = mutation({
  args: {
    id: v.optional(v.id("pages")),
    title: v.string(),
    slug: v.string(),
    content: v.optional(v.string()),
    seoTitle: v.optional(v.string()),
    seoDescription: v.optional(v.string()),
    status: pageStatus,
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    if (args.id) {
      await ctx.db.patch(args.id, {
        title: args.title,
        slug: args.slug,
        content: args.content,
        seoTitle: args.seoTitle,
        seoDescription: args.seoDescription,
        status: args.status,
        updatedAt: now,
        ...(args.status === "published" ? { publishedAt: now } : {}),
      });
      return args.id;
    }
    return await ctx.db.insert("pages", {
      title: args.title,
      slug: args.slug,
      content: args.content,
      seoTitle: args.seoTitle,
      seoDescription: args.seoDescription,
      status: args.status,
      publishedAt: args.status === "published" ? now : undefined,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const deletePage = mutation({
  args: { id: v.id("pages") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

/* ══════════════════════════════════════════════════════════════
 *  NAVIGATION
 * ══════════════════════════════════════════════════════════════ */

export const upsertNavItem = mutation({
  args: {
    id: v.optional(v.id("navigation")),
    label: v.string(),
    href: v.string(),
    order: v.number(),
    visible: v.boolean(),
    menu: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.id) {
      await ctx.db.patch(args.id, {
        label: args.label,
        href: args.href,
        order: args.order,
        visible: args.visible,
        ...(args.menu ? { menu: args.menu } : {}),
      });
      return args.id;
    }
    return await ctx.db.insert("navigation", {
      menu: args.menu ?? "header",
      label: args.label,
      href: args.href,
      order: args.order,
      visible: args.visible,
    });
  },
});

export const deleteNavItem = mutation({
  args: { id: v.id("navigation") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

/* ══════════════════════════════════════════════════════════════
 *  PLANS
 * ══════════════════════════════════════════════════════════════ */

export const upsertPlan = mutation({
  args: {
    id: v.optional(v.id("plans")),
    name: v.string(),
    tagline: v.optional(v.string()),
    priceUsd: v.optional(v.number()),
    priceLabel: v.optional(v.string()),
    period: v.string(),
    features: v.array(v.string()),
    active: v.boolean(),
    popular: v.optional(v.boolean()),
    taxNote: v.string(),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const fields = {
      name: args.name,
      tagline: args.tagline,
      priceUsd: args.priceUsd,
      priceLabel: args.priceLabel,
      period: args.period,
      features: args.features,
      active: args.active,
      popular: args.popular ?? false,
      taxNote: args.taxNote,
      order: args.order,
      updatedAt: now,
    };
    if (args.id) {
      await ctx.db.patch(args.id, fields);
      return args.id;
    }
    return await ctx.db.insert("plans", { ...fields, createdAt: now });
  },
});

export const setPlanActive = mutation({
  args: { id: v.id("plans"), active: v.boolean() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { active: args.active, updatedAt: Date.now() });
  },
});

export const deletePlan = mutation({
  args: { id: v.id("plans") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

/* ══════════════════════════════════════════════════════════════
 *  FAQS
 * ══════════════════════════════════════════════════════════════ */

export const upsertFaq = mutation({
  args: {
    id: v.optional(v.id("faqs")),
    question: v.string(),
    answer: v.string(),
    category: v.string(),
    visible: v.boolean(),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    if (args.id) {
      await ctx.db.patch(args.id, {
        question: args.question,
        answer: args.answer,
        category: args.category,
        visible: args.visible,
        order: args.order,
        updatedAt: now,
      });
      return args.id;
    }
    return await ctx.db.insert("faqs", {
      question: args.question,
      answer: args.answer,
      category: args.category,
      visible: args.visible,
      order: args.order,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const toggleFaq = mutation({
  args: { id: v.id("faqs"), visible: v.boolean() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { visible: args.visible, updatedAt: Date.now() });
  },
});

export const deleteFaq = mutation({
  args: { id: v.id("faqs") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

/* ══════════════════════════════════════════════════════════════
 *  TESTIMONIALS
 * ══════════════════════════════════════════════════════════════ */

export const upsertTestimonial = mutation({
  args: {
    id: v.optional(v.id("testimonials")),
    quote: v.string(),
    clientName: v.string(),
    company: v.optional(v.string()),
    position: v.optional(v.string()),
    status: testimonialStatus,
    displayOrder: v.number(),
  },
  handler: async (ctx, args) => {
    if (args.id) {
      await ctx.db.patch(args.id, {
        quote: args.quote,
        clientName: args.clientName,
        company: args.company,
        position: args.position,
        status: args.status,
        displayOrder: args.displayOrder,
      });
      return args.id;
    }
    return await ctx.db.insert("testimonials", {
      quote: args.quote,
      clientName: args.clientName,
      company: args.company,
      position: args.position,
      status: args.status,
      displayOrder: args.displayOrder,
      createdAt: Date.now(),
    });
  },
});

export const setTestimonialStatus = mutation({
  args: { id: v.id("testimonials"), status: testimonialStatus },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });
  },
});

export const deleteTestimonial = mutation({
  args: { id: v.id("testimonials") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

/* ══════════════════════════════════════════════════════════════
 *  PARTNERS
 * ══════════════════════════════════════════════════════════════ */

export const upsertPartner = mutation({
  args: {
    id: v.optional(v.id("partners")),
    name: v.string(),
    logo: v.optional(v.string()),
    industry: v.optional(v.string()),
    website: v.optional(v.string()),
    relationshipType: v.string(),
    displayOrder: v.number(),
    status: v.union(v.literal("active"), v.literal("archived")),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    if (args.id) {
      await ctx.db.patch(args.id, {
        name: args.name,
        logo: args.logo,
        industry: args.industry,
        website: args.website,
        relationshipType: args.relationshipType,
        displayOrder: args.displayOrder,
        status: args.status,
        updatedAt: now,
      });
      return args.id;
    }
    return await ctx.db.insert("partners", {
      name: args.name,
      logo: args.logo,
      industry: args.industry,
      website: args.website,
      relationshipType: args.relationshipType,
      displayOrder: args.displayOrder,
      status: args.status,
      featured: true,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const setPartnerStatus = mutation({
  args: { id: v.id("partners"), status: v.union(v.literal("active"), v.literal("archived")) },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status, updatedAt: Date.now() });
  },
});

export const deletePartner = mutation({
  args: { id: v.id("partners") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

/* ══════════════════════════════════════════════════════════════
 *  LANDING PAGES
 * ══════════════════════════════════════════════════════════════ */

export const upsertLandingPage = mutation({
  args: {
    id: v.optional(v.id("landingPages")),
    title: v.string(),
    slug: v.string(),
    targetService: v.optional(v.string()),
    primaryCta: v.optional(v.string()),
    status: landingStatus,
    conversionRate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    if (args.id) {
      await ctx.db.patch(args.id, {
        title: args.title,
        slug: args.slug,
        targetService: args.targetService,
        primaryCta: args.primaryCta,
        status: args.status,
        conversionRate: args.conversionRate,
        updatedAt: now,
      });
      return args.id;
    }
    return await ctx.db.insert("landingPages", {
      title: args.title,
      slug: args.slug,
      targetService: args.targetService,
      primaryCta: args.primaryCta,
      status: args.status,
      conversionRate: args.conversionRate,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const deleteLandingPage = mutation({
  args: { id: v.id("landingPages") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

/* ══════════════════════════════════════════════════════════════
 *  SECTION FLAGS ("Coming Soon" control)
 * ══════════════════════════════════════════════════════════════ */

export const sectionFlags = query({
  handler: async (ctx) => await readFlags(ctx),
});

export const setSectionFlag = mutation({
  args: { key: v.string(), enabled: v.boolean() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("settings")
      .withIndex("by_key", (q) => q.eq("key", FLAGS_KEY))
      .first();
    const current = (existing?.value as Record<string, boolean> | undefined) ?? {};
    const next = { ...DEFAULT_FLAGS, ...current, [args.key]: args.enabled };
    if (existing) {
      await ctx.db.patch(existing._id, { value: next, updatedAt: Date.now() });
    } else {
      await ctx.db.insert("settings", { key: FLAGS_KEY, value: next, updatedAt: Date.now() });
    }
  },
});

/* ══════════════════════════════════════════════════════════════
 *  HOMEPAGE SETTINGS (section order / visibility + notification bar)
 * ══════════════════════════════════════════════════════════════ */

const HOME_KEY = "homepage_settings";

const sectionValidator = v.object({
  id: v.string(),
  visible: v.boolean(),
  order: v.number(),
});

const notificationValidator = v.object({
  enabled: v.boolean(),
  message: v.string(),
});

export const homepageSettings = query({
  handler: async (ctx) => {
    const doc = await ctx.db
      .query("settings")
      .withIndex("by_key", (q) => q.eq("key", HOME_KEY))
      .first();
    type Stored = {
      sections?: { id: string; visible: boolean; order: number }[];
      notification?: { enabled: boolean; message: string };
    };
    return (doc?.value as Stored | undefined) ?? null;
  },
});

export const setHomepageSettings = mutation({
  args: {
    sections: v.array(sectionValidator),
    notification: notificationValidator,
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("settings")
      .withIndex("by_key", (q) => q.eq("key", HOME_KEY))
      .first();
    const value = { sections: args.sections, notification: args.notification };
    if (existing) {
      await ctx.db.patch(existing._id, { value, updatedAt: Date.now() });
    } else {
      await ctx.db.insert("settings", { key: HOME_KEY, value, updatedAt: Date.now() });
    }
  },
});

/* ══════════════════════════════════════════════════════════════
 *  SEED DEFAULT CONTENT
 *  Idempotent: only fills tables that are still empty.
 * ══════════════════════════════════════════════════════════════ */

const DEFAULT_SERVICES = [
  { title: "Business Development", category: "business", shortDescription: "Strategic planning, market intelligence and growth strategies for sustainable business expansion.", ctaUrl: "/#business-dev" },
  { title: "Sales Services", category: "sales", shortDescription: "Sales strategy, process optimization, CRM implementation and team development for predictable revenue.", ctaUrl: "/#sales" },
  { title: "Marketing Services", category: "marketing", shortDescription: "Brand positioning, digital marketing, content strategy and customer experience optimization.", ctaUrl: "/#marketing" },
  { title: "Promotional Services", category: "promotional", shortDescription: "Campaign development, product launches, event marketing and partnership promotion programs.", ctaUrl: "/#promotional" },
  { title: "Security Solutions", category: "security", shortDescription: "Professional CCTV, surveillance, access control and security technology solutions for all sectors.", ctaUrl: "/#security" },
  { title: "Digital Solutions", category: "digital", shortDescription: "Custom websites, web applications, e-commerce platforms and responsive digital experiences.", ctaUrl: "/#technology" },
  { title: "AI & Automation", category: "ai", shortDescription: "AI system integration, custom chatbots, workflow automation and intelligent business systems.", ctaUrl: "/#ai" },
  { title: "FMCG Services", category: "fmcg", shortDescription: "Order booking, route-to-market sales, supplier sourcing, merchandizing and product promotion for fast-moving consumer goods.", ctaUrl: "/fmcg" },
  { title: "Marketplace Product Listings", category: "digital", shortDescription: "List and manage products on Jumia, Jiji and Kilimall where buyers are already shopping.", ctaUrl: "/services/marketplace-listings" },
  { title: "Account & Social Media Management", category: "digital", shortDescription: "Day-to-day management of your social accounts so your brand stays active, on-brand and growing.", ctaUrl: "/services/account-social-media-management" },
  { title: "Content Generation", category: "digital", shortDescription: "Words, visuals and campaign content produced for your channels.", ctaUrl: "/services/content-generation" },
  { title: "Ad Generation", category: "digital", shortDescription: "Natural and AI-generated ads in image, video or both, with natural or AI voice-overs for radio-style ads.", ctaUrl: "/services/ad-generation" },
];

const DEFAULT_PAGES = [
  { title: "Home", slug: "/" },
  { title: "About Us", slug: "/about" },
  { title: "Services", slug: "/services" },
  { title: "FMCG Services", slug: "/fmcg" },
  { title: "Wholesale Ordering", slug: "/wholesale" },
  { title: "Pricing", slug: "/pricing" },
  { title: "Checkout", slug: "/checkout" },
  { title: "Zayed Tabloid", slug: "/tabloid" },
  { title: "Contact", slug: "/contact" },
  { title: "Supplier Registration", slug: "/supplier/register" },
];

const DEFAULT_NAV = [
  { label: "Home", href: "/#hero" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "FMCG", href: "/fmcg" },
  { label: "Tabloid", href: "/tabloid" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
];

const DEFAULT_PLANS = [
  {
    name: "Starter",
    tagline: "For businesses taking the first step",
    priceUsd: 499,
    period: "month",
    popular: false,
    features: ["Monthly strategy consultation (2 sessions)", "Email and chat support", "Basic market research", "Business health assessment", "Access to knowledge base", "Monthly performance report"],
  },
  {
    name: "Growth",
    tagline: "For ambitious businesses ready to scale",
    priceUsd: 1499,
    period: "month",
    popular: true,
    features: ["Everything in Starter", "Weekly strategy sessions", "Dedicated account manager", "Sales and marketing strategy", "CRM setup and optimization", "AI workflow recommendations", "Security assessment", "Priority support", "Quarterly business review"],
  },
  {
    name: "Enterprise",
    tagline: "For organizations that demand the best",
    priceLabel: "Custom",
    period: "",
    popular: false,
    features: ["Senior strategist as your point of contact", "Unlimited consulting hours", "Full technology implementation", "Custom AI development", "Enterprise security infrastructure", "Dedicated project team", "SLA guarantees", "Board-level advisory", "24/7 premium support"],
  },
];

const DEFAULT_FAQS = [
  { question: "What services does Yasir Zayed offer?", answer: "We provide business development, web development, AI integration, security solutions, and digital transformation services.", category: "General" },
  { question: "How do I request a quotation?", answer: "You can request a quotation through our contact form, by calling us, or by booking a meeting through the website.", category: "Sales" },
  { question: "Do you work with international clients?", answer: "Yes, we work with clients globally across Africa, Europe, Asia, the Americas, and the Middle East.", category: "General" },
  { question: "What is YASIR VERIFY™?", answer: "YASIR VERIFY™ is our proprietary human verification system that protects against bots and fraudulent activity.", category: "Security" },
  { question: "Can you build custom AI chatbots?", answer: "Yes, we develop AI-powered chatbots tailored to your specific business requirements and workflows.", category: "Technology" },
  { question: "What is your pricing model?", answer: "We offer project-based pricing, retainer models, and customized packages depending on the scope and requirements.", category: "Sales" },
];

const DEFAULT_TESTIMONIALS = [
  { quote: "Yasir Zayed restructured our sales process and our close rate nearly doubled in one quarter.", clientName: "Grace Mwangi", company: "Rift Valley Distributors", position: "Commercial Director" },
  { quote: "The security audit and camera deployment were handled end to end — professional from survey to handover.", clientName: "Peter Otieno", company: "Nairobi Logistics Hub", position: "Operations Manager" },
  { quote: "Their AI chatbot now handles most of our inbound enquiries, and the team finally has time to sell.", clientName: "Amina Hassan", company: "Coastline Retail", position: "Founder" },
];

const PARTNER_LOGO_FILES: Record<string, string> = {
  "Dahua": "dahua",
  "OpenAI": "openai",
  "Anthropic (Claude)": "anthropic",
  "Amazon AWS": "amazonaws",
  "Google Cloud": "googlecloud",
  "Oracle": "oracle",
  "HP": "hp",
  "Cisco": "cisco",
  "Dell": "dell",
  "Namecheap": "namecheap",
  "WordPress": "wordpress",
  "Shopify": "shopify",
  "Microsoft": "microsoft",
  "Apple": "apple",
  "Samsung": "samsung",
  "Huawei": "huawei",
  "Cloudflare": "cloudflare",
  "Vercel": "vercel",
};

const DEFAULT_PARTNERS = Object.keys(PARTNER_LOGO_FILES);

const DEFAULT_LANDING_PAGES = [
  { title: "AI Solutions Landing", slug: "/ai", targetService: "AI & Automation" },
  { title: "Security Services", slug: "/security", targetService: "Security Solutions" },
  { title: "Business Development", slug: "/business-dev", targetService: "Business Development" },
  { title: "Technology Consulting", slug: "/tech", targetService: "Digital Solutions" },
];

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export const seedDefaults = mutation({
  handler: async (ctx) => {
    const now = Date.now();
    const created: Record<string, number> = {};

    const servicesCount = (await ctx.db.query("services").collect()).length;
    if (servicesCount === 0) {
      for (let i = 0; i < DEFAULT_SERVICES.length; i++) {
        const s = DEFAULT_SERVICES[i];
        await ctx.db.insert("services", {
          title: s.title,
          slug: slugify(s.title),
          category: s.category,
          shortDescription: s.shortDescription,
          ctaUrl: s.ctaUrl,
          status: "published",
          displayOrder: i + 1,
          featured: i < 4,
          createdAt: now,
          updatedAt: now,
        });
      }
      created.services = DEFAULT_SERVICES.length;
    }

    const pagesCount = (await ctx.db.query("pages").collect()).length;
    if (pagesCount === 0) {
      for (const p of DEFAULT_PAGES) {
        await ctx.db.insert("pages", {
          title: p.title,
          slug: p.slug,
          status: "published",
          publishedAt: now,
          createdAt: now,
          updatedAt: now,
        });
      }
      created.pages = DEFAULT_PAGES.length;
    }

    const navCount = (await ctx.db.query("navigation").collect()).length;
    if (navCount === 0) {
      for (let i = 0; i < DEFAULT_NAV.length; i++) {
        await ctx.db.insert("navigation", {
          menu: "header",
          label: DEFAULT_NAV[i].label,
          href: DEFAULT_NAV[i].href,
          order: i + 1,
          visible: true,
        });
      }
      created.navigation = DEFAULT_NAV.length;
    }

    const plansCount = (await ctx.db.query("plans").collect()).length;
    if (plansCount === 0) {
      for (let i = 0; i < DEFAULT_PLANS.length; i++) {
        const p = DEFAULT_PLANS[i];
        await ctx.db.insert("plans", {
          name: p.name,
          tagline: p.tagline,
          priceUsd: p.priceUsd,
          priceLabel: p.priceLabel,
          period: p.period,
          features: p.features,
          active: true,
          popular: p.popular,
          taxNote: "Prices are not inclusive of Tax",
          order: i + 1,
          createdAt: now,
          updatedAt: now,
        });
      }
      created.plans = DEFAULT_PLANS.length;
    }

    const faqCount = (await ctx.db.query("faqs").collect()).length;
    if (faqCount === 0) {
      for (let i = 0; i < DEFAULT_FAQS.length; i++) {
        const f = DEFAULT_FAQS[i];
        await ctx.db.insert("faqs", {
          question: f.question,
          answer: f.answer,
          category: f.category,
          visible: true,
          order: i + 1,
          createdAt: now,
          updatedAt: now,
        });
      }
      created.faqs = DEFAULT_FAQS.length;
    }

    const testimonialCount = (await ctx.db.query("testimonials").collect()).length;
    if (testimonialCount === 0) {
      for (let i = 0; i < DEFAULT_TESTIMONIALS.length; i++) {
        const t = DEFAULT_TESTIMONIALS[i];
        await ctx.db.insert("testimonials", {
          quote: t.quote,
          clientName: t.clientName,
          company: t.company,
          position: t.position,
          status: "published",
          displayOrder: i + 1,
          createdAt: now,
        });
      }
      created.testimonials = DEFAULT_TESTIMONIALS.length;
    }

    const partnerCount = (await ctx.db.query("partners").collect()).length;
    if (partnerCount === 0) {
      for (let i = 0; i < DEFAULT_PARTNERS.length; i++) {
        const name = DEFAULT_PARTNERS[i];
        await ctx.db.insert("partners", {
          name,
          logo: `/logos/${PARTNER_LOGO_FILES[name] ?? slugify(name)}.svg`,
          relationshipType: "technology_partner",
          displayOrder: i + 1,
          status: "active",
          featured: true,
          createdAt: now,
          updatedAt: now,
        });
      }
      created.partners = DEFAULT_PARTNERS.length;
    }

    const landingCount = (await ctx.db.query("landingPages").collect()).length;
    if (landingCount === 0) {
      for (const lp of DEFAULT_LANDING_PAGES) {
        await ctx.db.insert("landingPages", {
          title: lp.title,
          slug: lp.slug,
          targetService: lp.targetService,
          primaryCta: "Get Started",
          status: "published",
          createdAt: now,
          updatedAt: now,
        });
      }
      created.landingPages = DEFAULT_LANDING_PAGES.length;
    }

    const settingsDoc = await ctx.db
      .query("settings")
      .withIndex("by_key", (q) => q.eq("key", FLAGS_KEY))
      .first();
    if (!settingsDoc) {
      await ctx.db.insert("settings", { key: FLAGS_KEY, value: DEFAULT_FLAGS, updatedAt: now });
      created.flags = Object.keys(DEFAULT_FLAGS).length;
    }

    return created;
  },
});
