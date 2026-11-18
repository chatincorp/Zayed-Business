import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// ─── List all projects (admin) ───
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("projects").order("desc").collect();
  },
});

// ─── List projects for a specific client ───
export const listByClient = query({
  args: { clientId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("projects")
      .withIndex("by_client", (q) => q.eq("clientId", args.clientId))
      .order("desc")
      .collect();
  },
});

// ─── List projects for the current user (client view) ───
export const listMine = query({
  args: {},
  handler: async (ctx) => {
    const userId = (await ctx.auth.getUserIdentity())?.subject;
    if (!userId) return [];
    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", userId))
      .first();
    if (!user) return [];
    return await ctx.db
      .query("projects")
      .withIndex("by_client", (q) => q.eq("clientId", user._id))
      .order("desc")
      .collect();
  },
});

// ─── Get single project ───
export const get = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.projectId);
  },
});

// ─── Create project (admin) ───
export const create = mutation({
  args: {
    clientId: v.id("users"),
    title: v.string(),
    description: v.optional(v.string()),
    service: v.optional(v.string()),
    status: v.union(
      v.literal("planning"),
      v.literal("in_progress"),
      v.literal("review"),
      v.literal("completed"),
      v.literal("delivered"),
      v.literal("on_hold"),
    ),
    projectType: v.union(v.literal("completed"), v.literal("phased")),
    phases: v.optional(v.array(v.object({
      id: v.string(),
      name: v.string(),
      status: v.union(v.literal("pending"), v.literal("in_progress"), v.literal("review"), v.literal("completed")),
      description: v.optional(v.string()),
      dueDate: v.optional(v.number()),
      completedAt: v.optional(v.number()),
    }))),
    budget: v.optional(v.string()),
    startDate: v.optional(v.number()),
    estimatedCompletion: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("projects", {
      ...args,
      deliverables: [],
      tracking: [{
        id: "trk_" + now,
        title: "Project created",
        description: "Project has been initialized and is ready for planning.",
        status: "info",
        createdAt: now,
        author: "System",
      }],
      createdAt: now,
      updatedAt: now,
    });
  },
});

// ─── Update project (admin) ───
export const update = mutation({
  args: {
    projectId: v.id("projects"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    service: v.optional(v.string()),
    status: v.optional(v.union(
      v.literal("planning"),
      v.literal("in_progress"),
      v.literal("review"),
      v.literal("completed"),
      v.literal("delivered"),
      v.literal("on_hold"),
    )),
    projectType: v.optional(v.union(v.literal("completed"), v.literal("phased"))),
    phases: v.optional(v.array(v.object({
      id: v.string(),
      name: v.string(),
      status: v.union(v.literal("pending"), v.literal("in_progress"), v.literal("review"), v.literal("completed")),
      description: v.optional(v.string()),
      dueDate: v.optional(v.number()),
      completedAt: v.optional(v.number()),
    }))),
    budget: v.optional(v.string()),
    startDate: v.optional(v.number()),
    estimatedCompletion: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { projectId, ...updates } = args;
    const cleaned: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(updates)) {
      if (v !== undefined) cleaned[k] = v;
    }
    cleaned.updatedAt = Date.now();
    await ctx.db.patch(projectId, cleaned);
  },
});

// ─── Delete project (admin) ───
export const remove = mutation({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.projectId);
  },
});

// ─── Add tracking entry (admin) ───
export const addTracking = mutation({
  args: {
    projectId: v.id("projects"),
    title: v.string(),
    description: v.optional(v.string()),
    status: v.union(v.literal("info"), v.literal("warning"), v.literal("success"), v.literal("update")),
    author: v.string(),
  },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.projectId);
    if (!project) throw new Error("Project not found");
    const now = Date.now();
    const entry = {
      id: "trk_" + now + "_" + Math.floor(Math.random() * 1000),
      title: args.title,
      description: args.description,
      status: args.status,
      createdAt: now,
      author: args.author,
    };
    const tracking = [...(project.tracking ?? []), entry];
    await ctx.db.patch(args.projectId, { tracking, updatedAt: now });
    return entry;
  },
});

// ─── Add deliverable file (admin) ───
export const addDeliverable = mutation({
  args: {
    projectId: v.id("projects"),
    name: v.string(),
    fileUrl: v.optional(v.string()),
    fileSize: v.optional(v.number()),
    fileType: v.optional(v.string()),
    phaseId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.projectId);
    if (!project) throw new Error("Project not found");
    const now = Date.now();
    const deliverable = {
      id: "del_" + now + "_" + Math.floor(Math.random() * 1000),
      name: args.name,
      fileUrl: args.fileUrl,
      fileSize: args.fileSize,
      fileType: args.fileType,
      phaseId: args.phaseId,
      uploadedAt: now,
    };
    const deliverables = [...(project.deliverables ?? []), deliverable];
    await ctx.db.patch(args.projectId, { deliverables, updatedAt: now });
    return deliverable;
  },
});

// ─── Remove deliverable (admin) ───
export const removeDeliverable = mutation({
  args: { projectId: v.id("projects"), deliverableId: v.string() },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.projectId);
    if (!project) throw new Error("Project not found");
    const deliverables = (project.deliverables ?? []).filter((d) => d.id !== args.deliverableId);
    await ctx.db.patch(args.projectId, { deliverables, updatedAt: Date.now() });
  },
});

// ─── Check download eligibility ───
export const checkDownload = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const userId = (await ctx.auth.getUserIdentity())?.subject;
    if (!userId) return { allowed: false, reason: "not_authenticated" };

    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", userId))
      .first();
    if (!user) return { allowed: false, reason: "user_not_found" };

    const project = await ctx.db.get(args.projectId);
    if (!project) return { allowed: false, reason: "project_not_found" };

    // Phased projects — always free
    if (project.projectType === "phased") {
      return { allowed: true, fee: 0, reason: "phased_project_free" };
    }

    // Check existing download record
    const existing = await ctx.db
      .query("projectDownloads")
      .withIndex("by_project_client", (q) =>
        q.eq("projectId", args.projectId).eq("clientId", user._id)
      )
      .first();

    if (!existing) {
      // First download — always free
      return { allowed: true, fee: 0, reason: "first_download_free" };
    }

    // Free download already used
    if (existing.paidUntil && existing.paidUntil > Date.now()) {
      return { allowed: true, fee: 0, reason: "active_subscription", paidUntil: existing.paidUntil };
    }

    // Need to pay $15
    return { allowed: false, fee: 1500, reason: "subscription_required", downloadCount: existing.downloadCount };
  },
});

// ─── Record a download ───
export const recordDownload = mutation({
  args: { projectId: v.id("projects"), deliverableId: v.string() },
  handler: async (ctx, args) => {
    const userId = (await ctx.auth.getUserIdentity())?.subject;
    if (!userId) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", userId))
      .first();
    if (!user) throw new Error("User not found");

    const now = Date.now();
    const existing = await ctx.db
      .query("projectDownloads")
      .withIndex("by_project_client", (q) =>
        q.eq("projectId", args.projectId).eq("clientId", user._id)
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        downloadCount: existing.downloadCount + 1,
        lastDownloadAt: now,
      });
    } else {
      await ctx.db.insert("projectDownloads", {
        projectId: args.projectId,
        clientId: user._id,
        freeDownloadUsed: true,
        downloadCount: 1,
        lastDownloadAt: now,
        createdAt: now,
      });
    }
  },
});

// ─── Activate paid download subscription (after Paystack payment) ───
export const activateSubscription = mutation({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const userId = (await ctx.auth.getUserIdentity())?.subject;
    if (!userId) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", userId))
      .first();
    if (!user) throw new Error("User not found");

    const now = Date.now();
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;
    const existing = await ctx.db
      .query("projectDownloads")
      .withIndex("by_project_client", (q) =>
        q.eq("projectId", args.projectId).eq("clientId", user._id)
      )
      .first();

    if (existing) {
      // Extend from now (or from current paidUntil if still active)
      const base = existing.paidUntil && existing.paidUntil > now ? existing.paidUntil : now;
      await ctx.db.patch(existing._id, { paidUntil: base + thirtyDays });
    } else {
      await ctx.db.insert("projectDownloads", {
        projectId: args.projectId,
        clientId: user._id,
        freeDownloadUsed: true,
        downloadCount: 0,
        paidUntil: now + thirtyDays,
        createdAt: now,
      });
    }
  },
});

// ─── Get download record for a project ───
export const getDownloadRecord = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const userId = (await ctx.auth.getUserIdentity())?.subject;
    if (!userId) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", userId))
      .first();
    if (!user) return null;

    return await ctx.db
      .query("projectDownloads")
      .withIndex("by_project_client", (q) =>
        q.eq("projectId", args.projectId).eq("clientId", user._id)
      )
      .first();
  },
});
