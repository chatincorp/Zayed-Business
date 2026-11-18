import { v } from "convex/values";
import { query } from "./_generated/server";
import { panelMutation, panelQuery } from "./authz";

// Get a setting by key
export const get = query({
  args: { key: v.string() },
  handler: async (ctx, args) => {
    const setting = await ctx.db
      .query("settings")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .first();
    return setting?.value ?? null;
  },
});

// Get all settings
export const list = panelQuery({
  handler: async (ctx) => {
    return await ctx.db.query("settings").collect();
  },
});

// Set a setting
export const set = panelMutation({
  args: {
    key: v.string(),
    value: v.any(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("settings")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        value: args.value,
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.insert("settings", {
        key: args.key,
        value: args.value,
        updatedAt: Date.now(),
      });
    }
  },
});

// Get default settings for site configuration
export const siteConfig = panelQuery({
  handler: async (ctx) => {
    const keys = [
      "site_name",
      "site_tagline",
      "contact_phones",
      "contact_emails",
      "security_website_url",
      "primary_color",
      "accent_color",
      "social_links",
      "seo_defaults",
    ];

    const config: Record<string, unknown> = {};
    for (const key of keys) {
      const setting = await ctx.db
        .query("settings")
        .withIndex("by_key", (q) => q.eq("key", key))
        .first();
      if (setting) {
        config[key] = setting.value;
      }
    }
    return config;
  },
});
