import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { panelMutation, panelQuery } from "./authz";

// Get all leads with optional filtering
export const list = panelQuery({
  args: {
    status: v.optional(v.string()),
    leadType: v.optional(v.string()),
    service: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let q = ctx.db.query("leads").order("desc");

    if (args.status) {
      q = q.filter((q) => q.eq(q.field("status"), args.status));
    }
    if (args.leadType) {
      q = q.filter((q) => q.eq(q.field("leadType"), args.leadType));
    }
    if (args.service) {
      q = q.filter((q) => q.eq(q.field("service"), args.service));
    }

    return await q.take(args.limit ?? 50);
  },
});

// Get a single lead by ID
export const get = panelQuery({
  args: { id: v.id("leads") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Create a new lead (from contact form submissions)
export const create = mutation({
  args: {
    leadType: v.string(),
    name: v.string(),
    phone: v.optional(v.string()),
    countryCode: v.optional(v.string()),
    personalEmail: v.string(),
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
    utmSource: v.optional(v.string()),
    utmMedium: v.optional(v.string()),
    utmCampaign: v.optional(v.string()),
    landingPage: v.optional(v.string()),
    referrer: v.optional(v.string()),
    sourcePage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const leadCount = await ctx.db.query("leads").collect();
    const leadId = `YZL-${String(leadCount.length + 1).padStart(4, "0")}`;

    return await ctx.db.insert("leads", {
      ...args,
      leadId,
      emailVerified: false,
      status: "new",
      submittedAt: now,
      updatedAt: now,
    });
  },
});

// Update lead status
export const updateStatus = panelMutation({
  args: {
    id: v.id("leads"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const lead = await ctx.db.get(args.id);
    if (!lead) throw new Error("Lead not found");

    await ctx.db.patch(args.id, {
      status: args.status as unknown as "closed" | "new" | "verified" | "contacted" | "qualified" | "proposal_sent" | "negotiation" | "won" | "lost",
      updatedAt: Date.now(),
    });
  },
});

// Assign lead to user
export const assign = panelMutation({
  args: {
    id: v.id("leads"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      assignedTo: args.userId,
      updatedAt: Date.now(),
    });
  },
});

// Add note to lead
export const addNote = panelMutation({
  args: {
    id: v.id("leads"),
    text: v.string(),
    author: v.string(),
  },
  handler: async (ctx, args) => {
    const lead = await ctx.db.get(args.id);
    if (!lead) throw new Error("Lead not found");

    const existingNotes = lead.notes ?? [];
    await ctx.db.patch(args.id, {
      notes: [
        ...existingNotes,
        {
          text: args.text,
          author: args.author,
          createdAt: Date.now(),
        },
      ],
      updatedAt: Date.now(),
    });
  },
});

// Get lead counts by status
export const counts = panelQuery({
  handler: async (ctx) => {
    const all = await ctx.db.query("leads").collect();
    const byStatus: Record<string, number> = {};
    const byType: Record<string, number> = {};
    const byService: Record<string, number> = {};

    for (const lead of all) {
      byStatus[lead.status] = (byStatus[lead.status] || 0) + 1;
      byType[lead.leadType] = (byType[lead.leadType] || 0) + 1;
      if (lead.service) {
        byService[lead.service] = (byService[lead.service] || 0) + 1;
      }
    }

    return { total: all.length, byStatus, byType, byService };
  },
});
