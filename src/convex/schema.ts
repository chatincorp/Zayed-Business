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

    // --- Zayed Tabloid: News Feed Sources ---
    newsFeeds: defineTable({
      name: v.string(),
      url: v.string(), // RSS/Atom endpoint
      pageUrl: v.optional(v.string()), // public page for reference
      category: v.string(),
      active: v.boolean(),
      lastFetchedAt: v.optional(v.number()),
      itemCount: v.optional(v.number()),
      createdAt: v.number(),
    }).index("by_active", ["active"]),

    // --- Zayed Tabloid: Ingested + AI-rewritten news items ---
    tabloidNews: defineTable({
      feedId: v.optional(v.id("newsFeeds")),
      sourceName: v.string(),
      sourceUrl: v.string(),
      dedupeKey: v.string(),
      originalTitle: v.string(),
      originalExcerpt: v.optional(v.string()),
      title: v.string(),
      excerpt: v.string(),
      aiRewrite: v.string(),
      body: v.string(),
      image: v.optional(v.string()), // original article image from the source feed
      category: v.string(),
      tags: v.array(v.string()),
      seoTitle: v.optional(v.string()),
      seoDescription: v.optional(v.string()),
      seoKeywords: v.optional(v.string()),
      readTime: v.string(),
      author: v.string(),
      editor: v.optional(v.string()),
      status: v.union(
        v.literal("ingested"),
        v.literal("rewritten"),
        v.literal("pending_review"),
        v.literal("approved"),
        v.literal("published"),
        v.literal("rejected")
      ),
      publishedAt: v.number(),
      rewrittenAt: v.optional(v.number()),
      createdAt: v.number(),
      updatedAt: v.number(),
    })
      .index("by_status", ["status"])
      .index("by_category", ["category"])
      .index("by_dedupe", ["dedupeKey"])
      .index("by_published", ["publishedAt"]),

    // --- FMCG: Suppliers ---
    suppliers: defineTable({
      fullName: v.string(),
      idNumber: v.string(),
      businessName: v.string(),
      businessAddress: v.string(),
      officialEmail: v.string(),
      registrationNumber: v.string(),
      countyPermitNumber: v.optional(v.string()),
      countyPermitStorageId: v.optional(v.id("_storage")),
      // Director ID copies + CR12 (companies)
      documentStorageIds: v.array(v.id("_storage")),
      personalPhone: v.string(),
      companyPhone: v.string(),
      storefrontStorageId: v.optional(v.id("_storage")),
      // Chosen at registration; immutable afterwards
      category: v.string(),
      paymentTerms: v.string(),
      status: v.union(
        v.literal("pending"),
        v.literal("approved"),
        v.literal("rejected"),
        v.literal("suspended"),
      ),
      reviewNotes: v.optional(v.string()),
      createdAt: v.number(),
      updatedAt: v.number(),
    })
      .index("by_email", ["officialEmail"])
      .index("by_status", ["status"])
      .index("by_category", ["category"]),

    // --- FMCG: Products listed by approved suppliers ---
    fmcgProducts: defineTable({
      supplierId: v.optional(v.id("suppliers")),
      supplierName: v.string(),
      name: v.string(),
      description: v.optional(v.string()),
      category: v.string(),
      unit: v.string(),
      caseSize: v.number(),
      moq: v.number(),
      pricePerUnit: v.number(),
      currency: v.string(),
      paymentTerms: v.string(),
      imageUrl: v.optional(v.string()),
      imageStorageId: v.optional(v.id("_storage")),
      status: v.union(
        v.literal("pending_review"),
        v.literal("approved"),
        v.literal("rejected"),
        v.literal("archived"),
      ),
      createdAt: v.number(),
      updatedAt: v.number(),
    })
      .index("by_status", ["status"])
      .index("by_supplier", ["supplierId"])
      .index("by_category", ["category"]),

    // --- FMCG: Wholesale order bookings (reviewed by the order desk) ---
    wholesaleOrders: defineTable({
      reference: v.string(),
      clientName: v.string(),
      businessName: v.string(),
      email: v.string(),
      phone: v.string(),
      county: v.string(),
      deliveryAddress: v.string(),
      preferredDate: v.optional(v.string()),
      notes: v.optional(v.string()),
      items: v.array(
        v.object({
          productId: v.optional(v.id("fmcgProducts")),
          name: v.string(),
          supplierName: v.string(),
          quantity: v.number(),
          unit: v.string(),
          caseSize: v.number(),
          unitPrice: v.number(),
          lineTotal: v.number(),
        }),
      ),
      estimatedTotal: v.number(),
      currency: v.string(),
      status: v.union(
        v.literal("pending_review"),
        v.literal("confirmed"),
        v.literal("processing"),
        v.literal("fulfilled"),
        v.literal("cancelled"),
      ),
      createdAt: v.number(),
      updatedAt: v.number(),
    })
      .index("by_status", ["status"])
      .index("by_email", ["email"])
      .index("by_created", ["createdAt"]),

    // --- FMCG: Marketing enquiries from the FMCG page ---
    fmcgEnquiries: defineTable({
      name: v.string(),
      businessName: v.string(),
      email: v.string(),
      phone: v.string(),
      service: v.string(),
      monthlyVolume: v.optional(v.string()),
      message: v.string(),
      status: v.union(
        v.literal("new"),
        v.literal("contacted"),
        v.literal("qualified"),
        v.literal("closed"),
      ),
      createdAt: v.number(),
    }).index("by_created", ["createdAt"]),

    // --- FAQs (site-facing) ---
    faqs: defineTable({
      question: v.string(),
      answer: v.string(),
      category: v.string(),
      visible: v.boolean(),
      order: v.number(),
      createdAt: v.number(),
      updatedAt: v.number(),
    }).index("by_order", ["order"]),

    // --- Subscription / Checkout Plans ---
    plans: defineTable({
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
      createdAt: v.number(),
      updatedAt: v.number(),
    }).index("by_order", ["order"]),

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

    // --- Verification Codes ---
    verificationCodes: defineTable({
      email: v.string(),
      code: v.string(),
      purpose: v.string(), // "login" | "signup" | "password_reset" | "email_verify"
      status: v.union(
        v.literal("pending"),
        v.literal("verified"),
        v.literal("expired"),
        v.literal("revoked")
      ),
      attempts: v.number(),
      maxAttempts: v.number(),
      createdAt: v.number(),
      expiresAt: v.number(),
      verifiedAt: v.optional(v.number()),
      ipAddress: v.optional(v.string()),
      userAgent: v.optional(v.string()),
      sessionId: v.optional(v.string()),
    })
      .index("by_email", ["email"])
      .index("by_email_purpose", ["email", "purpose"])
      .index("by_status", ["status"])
      .index("by_expires", ["expiresAt"]),

    // --- Email Logs ---
    emailLogs: defineTable({
      to: v.string(),
      subject: v.string(),
      body: v.string(),
      provider: v.string(), // "freebuff" | "sendgrid" | "resend" | "ses"
      status: v.union(
        v.literal("queued"),
        v.literal("sent"),
        v.literal("delivered"),
        v.literal("failed"),
        v.literal("bounced")
      ),
      error: v.optional(v.string()),
      metadata: v.optional(v.any()),
      sentAt: v.number(),
    })
      .index("by_to", ["to"])
      .index("by_status", ["status"])
      .index("by_sent", ["sentAt"]),

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

    // --- Projects (Delivery Portal + Tracking) ---
    projects: defineTable({
      clientId: v.id("users"),
      title: v.string(),
      description: v.optional(v.string()),
      service: v.optional(v.string()),
      // "planning" | "in_progress" | "review" | "completed" | "delivered" | "on_hold"
      status: v.union(
        v.literal("planning"),
        v.literal("in_progress"),
        v.literal("review"),
        v.literal("completed"),
        v.literal("delivered"),
        v.literal("on_hold"),
      ),
      // "completed" = single delivery, "phased" = multi-phase (no download fee)
      projectType: v.union(v.literal("completed"), v.literal("phased")),
      phases: v.optional(v.array(v.object({
        id: v.string(),
        name: v.string(),
        status: v.union(v.literal("pending"), v.literal("in_progress"), v.literal("review"), v.literal("completed")),
        description: v.optional(v.string()),
        dueDate: v.optional(v.number()),
        completedAt: v.optional(v.number()),
      }))),
      deliverables: v.optional(v.array(v.object({
        id: v.string(),
        name: v.string(),
        fileUrl: v.optional(v.string()),
        fileSize: v.optional(v.number()),
        fileType: v.optional(v.string()),
        phaseId: v.optional(v.string()),
        uploadedAt: v.number(),
      }))),
      tracking: v.optional(v.array(v.object({
        id: v.string(),
        title: v.string(),
        description: v.optional(v.string()),
        status: v.union(v.literal("info"), v.literal("warning"), v.literal("success"), v.literal("update")),
        createdAt: v.number(),
        author: v.string(),
      }))),
      budget: v.optional(v.string()),
      startDate: v.optional(v.number()),
      estimatedCompletion: v.optional(v.number()),
      completedAt: v.optional(v.number()),
      createdAt: v.number(),
      updatedAt: v.number(),
    })
      .index("by_client", ["clientId"])
      .index("by_status", ["status"]),

    // --- Departments ---
    departments: defineTable({
      name: v.string(),
      head: v.optional(v.string()),
      description: v.optional(v.string()),
      staffCount: v.number(),
      createdAt: v.number(),
      updatedAt: v.number(),
    }),

    // --- Staff ---
    staff: defineTable({
      name: v.string(),
      email: v.string(),
      role: v.union(v.literal("admin"), v.literal("manager"), v.literal("staff")),
      department: v.string(),
      status: v.union(v.literal("active"), v.literal("pending"), v.literal("suspended")),
      responsibilities: v.array(v.string()),
      joinedAt: v.string(),
      createdAt: v.number(),
      updatedAt: v.number(),
    })
      .index("by_department", ["department"])
      .index("by_status", ["status"]),

    // --- Campaigns ---
    campaigns: defineTable({
      name: v.string(),
      type: v.union(v.literal("email"), v.literal("social"), v.literal("ads"), v.literal("sms")),
      status: v.union(v.literal("draft"), v.literal("active"), v.literal("paused"), v.literal("completed")),
      sent: v.number(),
      opened: v.number(),
      clicked: v.number(),
      createdAt: v.number(),
      updatedAt: v.number(),
    })
      .index("by_status", ["status"]),

    // --- Email Templates ---
    emailTemplates: defineTable({
      name: v.string(),
      subject: v.string(),
      body: v.optional(v.string()),
      category: v.string(),
      lastEdited: v.number(),
      createdAt: v.number(),
    })
      .index("by_category", ["category"]),

    // --- CTAs ---
    ctas: defineTable({
      label: v.string(),
      url: v.string(),
      style: v.string(),
      clicks: v.number(),
      visible: v.boolean(),
      createdAt: v.number(),
      updatedAt: v.number(),
    }),

    // --- Form Submissions (contact forms) ---
    formSubmissions: defineTable({
      name: v.string(),
      email: v.string(),
      subject: v.string(),
      message: v.string(),
      department: v.string(),
      status: v.union(v.literal("unread"), v.literal("replied"), v.literal("escalated")),
      createdAt: v.number(),
      repliedAt: v.optional(v.number()),
      phone: v.optional(v.string()),
      company: v.optional(v.string()),
      inquiryType: v.optional(v.string()),
    })
      .index("by_status", ["status"]),

    // --- Live Chats ---
    chats: defineTable({
      client: v.string(),
      clientEmail: v.string(),
      department: v.string(),
      assignedTo: v.string(),
      status: v.union(v.literal("active"), v.literal("waiting"), v.literal("resolved"), v.literal("escalated")),
      messages: v.array(v.object({
        from: v.string(),
        text: v.string(),
        time: v.string(),
      })),
      createdAt: v.number(),
      updatedAt: v.number(),
    })
      .index("by_status", ["status"])
      .index("by_department", ["department"]),

    // --- Project Download Tracking ---
    projectDownloads: defineTable({
      projectId: v.id("projects"),
      clientId: v.id("users"),
      freeDownloadUsed: v.boolean(),
      downloadCount: v.number(),
      lastDownloadAt: v.optional(v.number()),
      // null = no active subscription; timestamp = downloads allowed until
      paidUntil: v.optional(v.number()),
      createdAt: v.number(),
    })
      .index("by_project", ["projectId"])
      .index("by_client", ["clientId"])
      .index("by_project_client", ["projectId", "clientId"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;
