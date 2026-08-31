import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// default user roles
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
  SUPER_ADMIN: "super_admin",
  EDITOR: "editor",
  MARKETING: "marketing",
  SALES: "sales",
  SECURITY_MANAGER: "security_manager",
  TABLOID_EDITOR: "tabloid_editor",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
  v.literal(ROLES.SUPER_ADMIN),
  v.literal(ROLES.EDITOR),
  v.literal(ROLES.MARKETING),
  v.literal(ROLES.SALES),
  v.literal(ROLES.SECURITY_MANAGER),
  v.literal(ROLES.TABLOID_EDITOR),
);
export type Role = Infer<typeof roleValidator>;

const schema = defineSchema(
  {
    // default auth tables
    ...authTables,

    // Users
    users: defineTable({
      name: v.optional(v.string()),
      image: v.optional(v.string()),
      email: v.optional(v.string()),
      emailVerificationTime: v.optional(v.number()),
      isAnonymous: v.optional(v.boolean()),
      role: v.optional(roleValidator),
    }).index("email", ["email"]),

    // --- CMS: Services ---
    services: defineTable({
      title: v.string(),
      slug: v.string(),
      category: v.string(), // "business" | "sales" | "marketing" | "promotional" | "security" | "digital" | "wordpress" | "ai"
      shortDescription: v.optional(v.string()),
      fullDescription: v.optional(v.string()),
      benefits: v.optional(v.array(v.string())),
      features: v.optional(v.array(v.string())),
      heroImage: v.optional(v.string()),
      thumbnail: v.optional(v.string()),
      ctaText: v.optional(v.string()),
      ctaUrl: v.optional(v.string()),
      seoTitle: v.optional(v.string()),
      seoDescription: v.optional(v.string()),
      status: v.union(v.literal("draft"), v.literal("published"), v.literal("archived")),
      displayOrder: v.number(),
      featured: v.optional(v.boolean()),
      createdBy: v.optional(v.id("users")),
      createdAt: v.number(),
      updatedAt: v.number(),
    })
      .index("by_slug", ["slug"])
      .index("by_category", ["category"])
      .index("by_status", ["status"]),

    // --- CMS: Pages ---
    pages: defineTable({
      title: v.string(),
      slug: v.string(),
      content: v.optional(v.string()), // markdown or JSON blocks
      featuredImage: v.optional(v.string()),
      seoTitle: v.optional(v.string()),
      seoDescription: v.optional(v.string()),
      ogImage: v.optional(v.string()),
      status: v.union(v.literal("draft"), v.literal("published"), v.literal("scheduled"), v.literal("archived")),
      publishedAt: v.optional(v.number()),
      createdAt: v.number(),
      updatedAt: v.number(),
      createdBy: v.optional(v.id("users")),
    })
      .index("by_slug", ["slug"])
      .index("by_status", ["status"]),

    // --- CMS: Page Blocks ---
    pageBlocks: defineTable({
      pageId: v.id("pages"),
      type: v.string(), // "hero" | "text" | "image" | "services" | "cta" | etc.
      order: v.number(),
      content: v.any(), // structured JSON content
      settings: v.optional(v.any()),
      visibility: v.optional(v.boolean()),
      createdAt: v.number(),
      updatedAt: v.number(),
    })
      .index("by_page", ["pageId"]),

    // --- CMS: Landing Pages ---
    landingPages: defineTable({
      title: v.string(),
      slug: v.string(),
      targetService: v.optional(v.string()),
      targetIndustry: v.optional(v.string()),
      targetRegion: v.optional(v.string()),
      primaryCta: v.optional(v.string()),
      campaign: v.optional(v.string()),
      status: v.union(v.literal("draft"), v.literal("published"), v.literal("scheduled")),
      conversionRate: v.optional(v.number()),
      createdAt: v.number(),
      updatedAt: v.number(),
    })
      .index("by_slug", ["slug"]),

    // --- Leads ---
    leads: defineTable({
      leadId: v.string(), // human-readable ID
      leadType: v.string(), // "appointment" | "meeting" | "inquiry" | "quotation"
      name: v.string(),
      phone: v.optional(v.string()),
      countryCode: v.optional(v.string()),
      personalEmail: v.string(),
      emailVerified: v.boolean(),
      company: v.optional(v.string()),
      businessType: v.optional(v.string()),
      position: v.optional(v.string()),
      businessEmail: v.optional(v.string()),
      service: v.optional(v.string()),
      message: v.optional(v.string()),
      preferredDate: v.optional(v.string()),
      preferredTime: v.optional(v.string()),
      meetingFormat: v.optional(v.string()),
      budget: v.optional(v.string()),
      projectLocation: v.optional(v.string()),
      status: v.union(
        v.literal("new"),
        v.literal("verified"),
        v.literal("contacted"),
        v.literal("qualified"),
        v.literal("proposal_sent"),
        v.literal("negotiation"),
        v.literal("won"),
        v.literal("lost"),
        v.literal("closed")
      ),
      assignedTo: v.optional(v.id("users")),
      notes: v.optional(v.array(v.object({
        text: v.string(),
        author: v.string(),
        createdAt: v.number(),
      }))),
      // Marketing attribution
      utmSource: v.optional(v.string()),
      utmMedium: v.optional(v.string()),
      utmCampaign: v.optional(v.string()),
      landingPage: v.optional(v.string()),
      referrer: v.optional(v.string()),
      sourcePage: v.optional(v.string()),
      submittedAt: v.number(),
      updatedAt: v.number(),
    })
      .index("by_status", ["status"])
      .index("by_type", ["leadType"])
      .index("by_service", ["service"])
      .index("by_submitted", ["submittedAt"]),

    // --- Partners ---
    partners: defineTable({
      name: v.string(),
      logo: v.optional(v.string()),
      industry: v.optional(v.string()),
      country: v.optional(v.string()),
      description: v.optional(v.string()),
      website: v.optional(v.string()),
      relationshipType: v.string(), // "partner" | "technology_partner" | "strategic_partner" | "supplier" | "client" | "other"
      featured: v.optional(v.boolean()),
      displayOrder: v.number(),
      status: v.union(v.literal("active"), v.literal("archived")),
      createdAt: v.number(),
      updatedAt: v.number(),
    })
      .index("by_featured", ["featured"])
      .index("by_status", ["status"]),

    // --- Testimonials ---
    testimonials: defineTable({
      quote: v.string(),
      clientName: v.string(),
      company: v.optional(v.string()),
      position: v.optional(v.string()),
      photo: v.optional(v.string()),
      status: v.union(v.literal("draft"), v.literal("published"), v.literal("archived")),
      displayOrder: v.number(),
      createdAt: v.number(),
    })
      .index("by_status", ["status"]),

    // --- Blog / Tabloid Articles ---
    articles: defineTable({
      headline: v.string(),
      slug: v.string(),
      category: v.string(),
      subcategory: v.optional(v.string()),
      excerpt: v.optional(v.string()),
      body: v.string(),
      featuredImage: v.optional(v.string()),
      author: v.optional(v.string()),
      source: v.optional(v.string()),
      tags: v.optional(v.array(v.string())),
      seoTitle: v.optional(v.string()),
      seoDescription: v.optional(v.string()),
      seoKeywords: v.optional(v.string()),
      socialImage: v.optional(v.string()),
      status: v.union(v.literal("draft"), v.literal("review"), v.literal("approved"), v.literal("published"), v.literal("scheduled"), v.literal("archived")),
      publishedAt: v.optional(v.number()),
      createdAt: v.number(),
      updatedAt: v.number(),
      createdBy: v.optional(v.id("users")),
    })
      .index("by_slug", ["slug"])
      .index("by_category", ["category"])
      .index("by_status", ["status"]),

    // --- Global Settings ---
    settings: defineTable({
      key: v.string(),
      value: v.any(),
      updatedAt: v.number(),
    }).index("by_key", ["key"]),

    // --- Navigation Items ---
    navigation: defineTable({
      menu: v.string(), // "header" | "footer"
      label: v.string(),
      href: v.string(),
      order: v.number(),
      visible: v.boolean(),
      parentId: v.optional(v.id("navigation")),
      children: v.optional(v.array(v.id("navigation"))),
    })
      .index("by_menu", ["menu"]),

    // --- Email Routing ---
    emailRouting: defineTable({
      primaryRecipient: v.string(),
      secondaryRecipient: v.optional(v.string()),
      bccRecipient: v.optional(v.string()),
      replyTo: v.optional(v.string()),
      senderName: v.optional(v.string()),
      subjectPrefix: v.optional(v.string()),
      // Per-form routing
      appointmentRecipient: v.optional(v.string()),
      meetingRecipient: v.optional(v.string()),
      inquiryRecipient: v.optional(v.string()),
      quotationRecipient: v.optional(v.string()),
      updatedAt: v.number(),
    }),

    // --- YASIR VERIFY Settings ---
    verifySettings: defineTable({
      enabled: v.boolean(),
      silentVerification: v.boolean(),
      challengeSensitivity: v.string(), // "low" | "medium" | "high"
      riskThresholds: v.object({
        low: v.number(),
        medium: v.number(),
        high: v.number(),
        block: v.number(),
      }),
      maxAttempts: v.number(),
      tokenLifetime: v.number(), // seconds
      rateLimit: v.number(), // requests per minute
      formProtection: v.any(),
      updatedAt: v.number(),
    }),

    // --- Security Logs ---
    securityLogs: defineTable({
      timestamp: v.number(),
      endpoint: v.string(),
      eventType: v.string(),
      riskLevel: v.string(),
      verificationResult: v.string(),
      challengeType: v.optional(v.string()),
      sessionId: v.optional(v.string()),
      metadata: v.optional(v.any()),
    })
      .index("by_timestamp", ["timestamp"])
      .index("by_event", ["eventType"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;
