import { v } from "convex/values";
import {
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "./_generated/server";

/* ══════════════════════════════════════════════════════════════
 *  PUBLIC QUERIES
 * ══════════════════════════════════════════════════════════════ */

/** Latest published tabloid articles (live feed), newest first. */
export const listPublishedNews = query({
  args: {
    limit: v.optional(v.number()),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const limit = Math.min(args.limit ?? 48, 200);
    const docs = await ctx.db
      .query("tabloidNews")
      .withIndex("by_published")
      .order("desc")
      .take(200);
    const published = docs.filter((d) => d.status === "published");
    const filtered = args.category
      ? published.filter((d) => d.category === args.category)
      : published;
    return filtered.slice(0, limit);
  },
});

/** Single article by id. */
export const getNewsItem = query({
  args: { id: v.id("tabloidNews") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

/** Feed-level stats for the live status bar. */
export const getNewsStats = query({
  handler: async (ctx) => {
    const docs = await ctx.db.query("tabloidNews").collect();
    const now = Date.now();
    return {
      total: docs.length,
      published: docs.filter((d) => d.status === "published").length,
      inPipeline: docs.filter(
        (d) => d.status !== "published" && d.status !== "rejected"
      ).length,
      last24h: docs.filter((d) => d.createdAt > now - 24 * 60 * 60 * 1000)
        .length,
      latestAt: docs.reduce<number | null>(
        (acc, d) => (acc === null || d.publishedAt > acc ? d.publishedAt : acc),
        null
      ),
    };
  },
});

/** All feeds (admin / status bar). */
export const listFeeds = query({
  handler: async (ctx) => {
    return await ctx.db.query("newsFeeds").collect();
  },
});

/** All items regardless of status (editorial dashboard). */
export const listAllNews = query({
  args: { status: v.optional(v.string()), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = Math.min(args.limit ?? 100, 300);
    const docs = await ctx.db
      .query("tabloidNews")
      .withIndex("by_published")
      .order("desc")
      .take(300);
    const filtered = args.status
      ? docs.filter((d) => d.status === args.status)
      : docs;
    return filtered.slice(0, limit);
  },
});

/* ══════════════════════════════════════════════════════════════
 *  FEED MANAGEMENT
 * ══════════════════════════════════════════════════════════════ */

/** Seed the 13 configured news sources. Idempotent — safe to call often. */
export const seedFeeds = mutation({
  args: {
    feeds: v.array(
      v.object({
        name: v.string(),
        url: v.string(),
        pageUrl: v.optional(v.string()),
        category: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("newsFeeds").collect();
    const byName = new Map(existing.map((f) => [f.name, f]));
    let inserted = 0;
    for (const feed of args.feeds) {
      if (byName.has(feed.name)) continue;
      await ctx.db.insert("newsFeeds", {
        name: feed.name,
        url: feed.url,
        pageUrl: feed.pageUrl,
        category: feed.category,
        active: true,
        createdAt: Date.now(),
      });
      inserted++;
    }
    return { inserted, total: existing.length + inserted };
  },
});

/** Toggle a feed active/inactive (admin). */
export const setFeedActive = mutation({
  args: { id: v.id("newsFeeds"), active: v.boolean() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { active: args.active });
  },
});

/** Remove a feed entirely (admin) — for endpoints that are dead or insecure. */
export const deleteFeed = mutation({
  args: { id: v.id("newsFeeds") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

/* ══════════════════════════════════════════════════════════════
 *  EDITORIAL PIPELINE
 * ══════════════════════════════════════════════════════════════ */

/** Move an item through: ingested → rewritten → pending_review → approved → published / rejected. */
export const setNewsStatus = mutation({
  args: {
    id: v.id("tabloidNews"),
    status: v.union(
      v.literal("ingested"),
      v.literal("rewritten"),
      v.literal("pending_review"),
      v.literal("approved"),
      v.literal("published"),
      v.literal("rejected")
    ),
    editor: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    await ctx.db.patch(args.id, {
      status: args.status,
      editor: args.editor,
      updatedAt: now,
      ...(args.status === "published" ? { publishedAt: now } : {}),
    });
  },
});

export const deleteNewsItem = mutation({
  args: { id: v.id("tabloidNews") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

/* ══════════════════════════════════════════════════════════════
 *  INTERNAL — used by the ingest action (tabloidIngest.ts)
 * ══════════════════════════════════════════════════════════════ */

const newsStatus = v.union(
  v.literal("ingested"),
  v.literal("rewritten"),
  v.literal("pending_review"),
  v.literal("approved"),
  v.literal("published"),
  v.literal("rejected")
);

export const getActiveFeedsInternal = internalQuery({
  handler: async (ctx) => {
    return await ctx.db
      .query("newsFeeds")
      .withIndex("by_active", (q) => q.eq("active", true))
      .collect();
  },
});

export const ingestNewsItemsInternal = internalMutation({
  args: {
    feedId: v.optional(v.id("newsFeeds")),
    publish: v.boolean(),
    items: v.array(
      v.object({
        dedupeKey: v.string(),
        sourceName: v.string(),
        sourceUrl: v.string(),
        originalTitle: v.string(),
        originalExcerpt: v.optional(v.string()),
        title: v.string(),
        excerpt: v.string(),
        aiRewrite: v.string(),
        body: v.string(),
        image: v.optional(v.string()),
        category: v.string(),
        tags: v.array(v.string()),
        seoTitle: v.optional(v.string()),
        seoDescription: v.optional(v.string()),
        seoKeywords: v.optional(v.string()),
        readTime: v.string(),
        author: v.string(),
        editor: v.optional(v.string()),
        status: newsStatus,
        publishedAt: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    let inserted = 0;

    for (const item of args.items) {
      const existing = await ctx.db
        .query("tabloidNews")
        .withIndex("by_dedupe", (q) => q.eq("dedupeKey", item.dedupeKey))
        .unique();
      if (existing) continue;

      await ctx.db.insert("tabloidNews", {
        feedId: args.feedId,
        sourceName: item.sourceName,
        sourceUrl: item.sourceUrl,
        dedupeKey: item.dedupeKey,
        originalTitle: item.originalTitle,
        originalExcerpt: item.originalExcerpt,
        title: item.title,
        excerpt: item.excerpt,
        aiRewrite: item.aiRewrite,
        body: item.body,
        image: item.image,
        category: item.category,
        tags: item.tags,
        seoTitle: item.seoTitle,
        seoDescription: item.seoDescription,
        seoKeywords: item.seoKeywords,
        readTime: item.readTime,
        author: item.author,
        editor: item.editor,
        status: item.status,
        publishedAt: item.publishedAt,
        rewrittenAt: now,
        createdAt: now,
        updatedAt: now,
      });
      inserted++;
    }

    // Prune: keep the newest 300 items so the table never grows unbounded.
    if (inserted > 0) {
      const all = await ctx.db
        .query("tabloidNews")
        .withIndex("by_published")
        .order("desc")
        .collect();
      for (const doc of all.slice(300)) {
        await ctx.db.delete(doc._id);
      }
    }

    return { inserted };
  },
});

export const markFeedFetchedInternal = internalMutation({
  args: {
    feedId: v.id("newsFeeds"),
    itemCount: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.feedId, {
      lastFetchedAt: Date.now(),
      itemCount: args.itemCount,
    });
  },
});

/**
 * Maintenance: rebuild SEO titles/descriptions for stored articles.
 * Earlier ingests could cut a title mid-word and append a duplicate brand
 * suffix, which the article page then combined with "| Yasir Zayed".
 */
export const repairSeoMetadata = internalMutation({
  args: {},
  handler: async (ctx) => {
    const clamp = (value: string, max: number) => {
      const text = value.replace(/\s+/g, " ").trim();
      if (text.length <= max) return text;
      const cut = text.slice(0, max);
      const lastSpace = cut.lastIndexOf(" ");
      const base = lastSpace > max * 0.5 ? cut.slice(0, lastSpace) : cut;
      return base.replace(/[\s,;:.\-–—]+$/, "");
    };

    const firstSentence = (value: string) => {
      const text = value.replace(/\s+/g, " ").trim();
      return text.split(/(?<=[.!?])\s/)[0] ?? text;
    };

    const items = await ctx.db.query("tabloidNews").collect();
    let updated = 0;

    for (const item of items) {
      const headline = item.title.replace(/\s*\|\s*Zayed Tabloid\s*$/i, "");
      const seoTitle = clamp(headline, 65);
      const seoDescription = clamp(
        firstSentence(item.body || item.excerpt || item.title),
        155,
      );

      if (seoTitle !== item.seoTitle || seoDescription !== item.seoDescription) {
        await ctx.db.patch(item._id, { seoTitle, seoDescription });
        updated++;
      }
    }

    return { updated, total: items.length };
  },
});
