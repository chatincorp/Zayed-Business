/**
 * Public contact form intake.
 *
 * Anyone may submit the contact form; submissions land in the admin
 * "Contact Forms" inbox with status `unread`, and the business inbox is
 * emailed straight away (see `leadNotifications`).
 */

import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

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

    const name = clean(args.name, 160) || "Website visitor";
    const subject = clean(args.subject, 240) || "Website inquiry";
    const message = clean(args.message, 5000) || "(no description provided)";
    const department = clean(args.department, 120) || "General";
    const phone = clean(args.phone, 60) || undefined;
    const company = clean(args.company, 160) || undefined;
    const inquiryType = clean(args.inquiryType, 60) || undefined;

    await ctx.db.insert("formSubmissions", {
      name,
      email,
      subject,
      message,
      department,
      status: "unread",
      createdAt: Date.now(),
      phone,
      company,
      inquiryType,
    });

    await ctx.scheduler.runAfter(
      0,
      internal.leadNotifications.sendLeadNotification,
      {
        kind: "New website enquiry",
        subject,
        replyTo: email,
        lines: [
          `Name: ${name}`,
          `Email: ${email}`,
          ...(phone ? [`Phone: ${phone}`] : []),
          ...(company ? [`Company: ${company}`] : []),
          `Department: ${department}`,
          ...(inquiryType ? [`Inquiry type: ${inquiryType}`] : []),
          `Message: ${message}`,
        ],
      },
    );
  },
});
