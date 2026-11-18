/**
 * Public contact form intake.
 *
 * Anyone may submit the contact form; submissions land in the admin
 * "Contact Forms" inbox with status `unread`.
 */

import { mutation } from "./_generated/server";
import { v } from "convex/values";

const clean = (value: string | undefined, max: number) =>
  (value ?? "").trim().slice(0, max);

export const submitContact = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    subject: v.string(),
    message: v.string(),
    phone: v.optional(v.string()),
    company: v.optional(v.string()),
    inquiryType: v.optional(v.string()),
    department: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const email = clean(args.email, 200);
    if (!email.includes("@")) throw new Error("A valid email address is required.");

    await ctx.db.insert("formSubmissions", {
      name: clean(args.name, 160) || "Website visitor",
      email,
      subject: clean(args.subject, 240) || "Website inquiry",
      message: clean(args.message, 5000) || "(no description provided)",
      department: clean(args.department, 120) || "General",
      status: "unread",
      createdAt: Date.now(),
      phone: clean(args.phone, 60) || undefined,
      company: clean(args.company, 160) || undefined,
      inquiryType: clean(args.inquiryType, 60) || undefined,
    });
  },
});
