import { v } from "convex/values";
import { panelMutation, panelQuery, rootMutation } from "./authz";

/* ══════════════════════════════════════════════════════════════
 *  DEPARTMENTS
 * ══════════════════════════════════════════════════════════════ */

export const listDepartments = panelQuery({
  handler: async (ctx) => {
    return await ctx.db.query("departments").collect();
  },
});

export const createDepartment = panelMutation({
  args: {
    name: v.string(),
    head: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("departments", {
      name: args.name,
      head: args.head,
      description: args.description,
      staffCount: 0,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const deleteDepartment = panelMutation({
  args: { id: v.id("departments") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

/* ══════════════════════════════════════════════════════════════
 *  STAFF
 * ══════════════════════════════════════════════════════════════ */

export const listStaff = panelQuery({
  handler: async (ctx) => {
    return await ctx.db.query("staff").collect();
  },
});

export const createStaff = rootMutation({
  args: {
    name: v.string(),
    email: v.string(),
    role: v.union(v.literal("admin"), v.literal("manager"), v.literal("staff")),
    department: v.string(),
    responsibilities: v.array(v.string()),
    joinedAt: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("staff", {
      ...args,
      status: "pending",
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateStaffStatus = rootMutation({
  args: {
    id: v.id("staff"),
    status: v.union(v.literal("active"), v.literal("pending"), v.literal("suspended")),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status, updatedAt: Date.now() });
  },
});

export const deleteStaff = rootMutation({
  args: { id: v.id("staff") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

/* ══════════════════════════════════════════════════════════════
 *  CAMPAIGNS
 * ══════════════════════════════════════════════════════════════ */

export const listCampaigns = panelQuery({
  handler: async (ctx) => {
    return await ctx.db.query("campaigns").collect();
  },
});

export const createCampaign = panelMutation({
  args: {
    name: v.string(),
    type: v.union(v.literal("email"), v.literal("social"), v.literal("ads"), v.literal("sms")),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("campaigns", {
      ...args,
      status: "draft",
      sent: 0,
      opened: 0,
      clicked: 0,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateCampaignStatus = panelMutation({
  args: {
    id: v.id("campaigns"),
    status: v.union(v.literal("draft"), v.literal("active"), v.literal("paused"), v.literal("completed")),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status, updatedAt: Date.now() });
  },
});

export const deleteCampaign = panelMutation({
  args: { id: v.id("campaigns") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

/* ══════════════════════════════════════════════════════════════
 *  EMAIL TEMPLATES
 * ══════════════════════════════════════════════════════════════ */

export const listEmailTemplates = panelQuery({
  handler: async (ctx) => {
    return await ctx.db.query("emailTemplates").collect();
  },
});

export const createEmailTemplate = panelMutation({
  args: {
    name: v.string(),
    subject: v.string(),
    body: v.optional(v.string()),
    category: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("emailTemplates", {
      ...args,
      lastEdited: now,
      createdAt: now,
    });
  },
});

export const deleteEmailTemplate = panelMutation({
  args: { id: v.id("emailTemplates") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

/* ══════════════════════════════════════════════════════════════
 *  CTAs
 * ══════════════════════════════════════════════════════════════ */

export const listCTAs = panelQuery({
  handler: async (ctx) => {
    return await ctx.db.query("ctas").collect();
  },
});

export const createCTA = panelMutation({
  args: {
    label: v.string(),
    url: v.string(),
    style: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("ctas", {
      ...args,
      clicks: 0,
      visible: true,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const toggleCTAVisibility = panelMutation({
  args: { id: v.id("ctas"), visible: v.boolean() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { visible: args.visible, updatedAt: Date.now() });
  },
});

export const deleteCTA = panelMutation({
  args: { id: v.id("ctas") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

/* ══════════════════════════════════════════════════════════════
 *  FORM SUBMISSIONS
 * ══════════════════════════════════════════════════════════════ */

export const listFormSubmissions = panelQuery({
  handler: async (ctx) => {
    return await ctx.db.query("formSubmissions").collect();
  },
});

export const updateSubmissionStatus = panelMutation({
  args: {
    id: v.id("formSubmissions"),
    status: v.union(v.literal("unread"), v.literal("replied"), v.literal("escalated")),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: args.status,
      repliedAt: args.status === "replied" ? Date.now() : undefined,
    });
  },
});

/* ══════════════════════════════════════════════════════════════
 *  LIVE CHATS
 * ══════════════════════════════════════════════════════════════ */

export const deleteSubmission = panelMutation({
  args: { id: v.id("formSubmissions") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const listChats = panelQuery({
  handler: async (ctx) => {
    return await ctx.db.query("chats").collect();
  },
});

export const addChatMessage = panelMutation({
  args: {
    chatId: v.id("chats"),
    from: v.string(),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    const chat = await ctx.db.get(args.chatId);
    if (!chat) return;
    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
    await ctx.db.patch(args.chatId, {
      messages: [...chat.messages, { from: args.from, text: args.text, time }],
      updatedAt: Date.now(),
    });
  },
});

export const escalateChat = panelMutation({
  args: {
    chatId: v.id("chats"),
    assignTo: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.chatId, {
      assignedTo: args.assignTo,
      status: "escalated",
      updatedAt: Date.now(),
    });
  },
});

export const updateChatStatus = panelMutation({
  args: {
    chatId: v.id("chats"),
    status: v.union(v.literal("active"), v.literal("waiting"), v.literal("resolved"), v.literal("escalated")),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.chatId, { status: args.status, updatedAt: Date.now() });
  },
});

/* ══════════════════════════════════════════════════════════════
 *  ORDER-DESK TEAM
 * ══════════════════════════════════════════════════════════════ */

/**
 * Real (non-anonymous) accounts with a role, so the order desk can name a
 * sales rep. Staff-only: the panel decides who may be assigned.
 */
export const listAppUsers = panelQuery({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    return users
      .filter((user) => !user.isAnonymous && Boolean(user.email))
      .map((user) => ({
        _id: user._id,
        name: user.name ?? null,
        email: user.email ?? null,
        role: user.role ?? "client",
      }))
      .sort((a, b) => (a.email ?? "").localeCompare(b.email ?? ""));
  },
});
