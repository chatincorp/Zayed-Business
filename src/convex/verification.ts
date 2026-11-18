/**
 * Verification Code Engine
 *
 * Internal engine for generating, storing, validating, and managing
 * verification codes for login, signup, password reset, and email verification.
 *
 * Features:
 * - Cryptographically random 6-digit codes
 * - Configurable expiry (default 15 minutes)
 * - Attempt limiting (default 5 attempts)
 * - Rate limiting (cooldown between sends)
 * - Session-based tracking
 * - Purpose-specific codes (login, signup, reset, verify)
 * - Automatic cleanup of expired codes
 */

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { panelMutation, panelQuery } from "./authz";
import { sendEmail, buildVerificationEmailHtml, buildVerificationEmailText } from "./emailHook";

// ─── Constants ─────────────────────────────────────────────────────

const CODE_LENGTH = 6;
const CODE_EXPIRY_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;
const COOLDOWN_MS = 60 * 1000; // 1 minute between sends
const MAX_CODES_PER_HOUR = 5;

// ─── Code Generation ───────────────────────────────────────────────

function generateCode(): string {
  const array = new Uint8Array(CODE_LENGTH);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte % 10).join("");
}

function generateSessionId(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
}

// ─── Queries ───────────────────────────────────────────────────────

/**
 * Get a pending verification code for an email and purpose
 */
export const getPendingCode = query({
  args: {
    email: v.string(),
    purpose: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const codes = await ctx.db
      .query("verificationCodes")
      .withIndex("by_email_purpose", (q) =>
        q.eq("email", args.email).eq("purpose", args.purpose)
      )
      .collect();

    // Find the most recent pending, non-expired code
    const pending = codes
      .filter(
        (c) =>
          c.status === "pending" && c.expiresAt > now
      )
      .sort((a, b) => b.createdAt - a.createdAt)[0];

    return pending || null;
  },
});

/**
 * Check rate limiting for an email
 */
export const checkRateLimit = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const oneHourAgo = now - 60 * 60 * 1000;

    const recentCodes = await ctx.db
      .query("verificationCodes")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .filter((q) => q.gt(q.field("createdAt"), oneHourAgo))
      .collect();

    const lastCode = recentCodes.sort(
      (a, b) => b.createdAt - a.createdAt
    )[0];

    const codesThisHour = recentCodes.length;
    const cooldownRemaining = lastCode
      ? Math.max(0, COOLDOWN_MS - (now - lastCode.createdAt))
      : 0;

    return {
      allowed: codesThisHour < MAX_CODES_PER_HOUR && cooldownRemaining === 0,
      codesThisHour,
      maxCodesPerHour: MAX_CODES_PER_HOUR,
      cooldownRemaining,
      lastSentAt: lastCode?.createdAt || null,
    };
  },
});

/**
 * Get verification stats for an email (admin use)
 */
export const getStats = panelQuery({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const codes = await ctx.db
      .query("verificationCodes")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .collect();

    return {
      total: codes.length,
      pending: codes.filter((c) => c.status === "pending").length,
      verified: codes.filter((c) => c.status === "verified").length,
      expired: codes.filter((c) => c.status === "expired").length,
      revoked: codes.filter((c) => c.status === "revoked").length,
    };
  },
});

// ─── Mutations ─────────────────────────────────────────────────────

/**
 * Create and send a new verification code
 */
export const sendCode = mutation({
  args: {
    email: v.string(),
    purpose: v.string(),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // ── Rate limiting ──
    const oneHourAgo = now - 60 * 60 * 1000;
    const recentCodes = await ctx.db
      .query("verificationCodes")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .filter((q) => q.gt(q.field("createdAt"), oneHourAgo))
      .collect();

    if (recentCodes.length >= MAX_CODES_PER_HOUR) {
      return {
        success: false,
        error: "Too many verification codes requested. Please try again later.",
        cooldownRemaining: 0,
      };
    }

    // Check cooldown
    const lastCode = recentCodes.sort(
      (a, b) => b.createdAt - a.createdAt
    )[0];
    if (lastCode && now - lastCode.createdAt < COOLDOWN_MS) {
      const remaining = Math.ceil(
        (COOLDOWN_MS - (now - lastCode.createdAt)) / 1000
      );
      return {
        success: false,
        error: `Please wait ${remaining} seconds before requesting a new code.`,
        cooldownRemaining: remaining,
      };
    }

    // ── Revoke any existing pending codes for this email+purpose ──
    const existingPending = await ctx.db
      .query("verificationCodes")
      .withIndex("by_email_purpose", (q) =>
        q.eq("email", args.email).eq("purpose", args.purpose)
      )
      .filter((q) => q.eq(q.field("status"), "pending"))
      .collect();

    for (const code of existingPending) {
      await ctx.db.patch(code._id, { status: "revoked" });
    }

    // ── Generate new code ──
    const code = generateCode();
    const sessionId = generateSessionId();

    const codeId = await ctx.db.insert("verificationCodes", {
      email: args.email,
      code,
      purpose: args.purpose,
      status: "pending",
      attempts: 0,
      maxAttempts: MAX_ATTEMPTS,
      createdAt: now,
      expiresAt: now + CODE_EXPIRY_MS,
      ipAddress: args.ipAddress,
      userAgent: args.userAgent,
      sessionId,
    });

    // ── Send email (fire and forget — we don't block on email delivery) ──
    // The email sending happens asynchronously
    const appName = "Yasir Zayed";
    const html = buildVerificationEmailHtml(code, appName, args.purpose);
    const text = buildVerificationEmailText(code, appName, args.purpose);

    try {
      const result = await sendEmail({
        to: args.email,
        subject: `Your ${appName} verification code: ${code}`,
        html,
        text,
      });

      // Log the email
      await ctx.db.insert("emailLogs", {
        to: args.email,
        subject: `Your ${appName} verification code: ${code}`,
        body: html,
        provider: result.provider,
        status: result.success ? "sent" : "failed",
        error: result.error,
        sentAt: now,
      });
    } catch (error) {
      // Email failure shouldn't block code creation
      // The code is still valid — user can request another if needed
      console.error("Failed to send verification email:", error);
    }

    return {
      success: true,
      codeId,
      sessionId,
      expiresAt: now + CODE_EXPIRY_MS,
      // In development, return the code for debugging
      // In production, remove this line
      ...(process.env.NODE_ENV === "development" && { code }),
    };
  },
});

/**
 * Verify a code
 */
export const verifyCode = mutation({
  args: {
    email: v.string(),
    code: v.string(),
    purpose: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Find the most recent pending code
    const codes = await ctx.db
      .query("verificationCodes")
      .withIndex("by_email_purpose", (q) =>
        q.eq("email", args.email).eq("purpose", args.purpose)
      )
      .collect();

    const pending = codes
      .filter((c) => c.status === "pending")
      .sort((a, b) => b.createdAt - a.createdAt)[0];

    if (!pending) {
      return {
        success: false,
        error: "No pending verification code found. Please request a new one.",
      };
    }

    // Check expiry
    if (pending.expiresAt < now) {
      await ctx.db.patch(pending._id, { status: "expired" });
      return {
        success: false,
        error: "This verification code has expired. Please request a new one.",
      };
    }

    // Check attempts
    if (pending.attempts >= pending.maxAttempts) {
      await ctx.db.patch(pending._id, { status: "revoked" });
      return {
        success: false,
        error: "Too many failed attempts. This code has been revoked. Please request a new one.",
      };
    }

    // Increment attempts
    await ctx.db.patch(pending._id, {
      attempts: pending.attempts + 1,
    });

    // Verify code
    if (pending.code !== args.code) {
      const remainingAttempts = pending.maxAttempts - (pending.attempts + 1);
      return {
        success: false,
        error: `Incorrect code. ${remainingAttempts} attempt${remainingAttempts !== 1 ? "s" : ""} remaining.`,
        attemptsRemaining: remainingAttempts,
      };
    }

    // Success — mark as verified
    await ctx.db.patch(pending._id, {
      status: "verified",
      verifiedAt: now,
    });

    return {
      success: true,
      codeId: pending._id,
      sessionId: pending.sessionId,
    };
  },
});

/**
 * Revoke a verification code
 */
export const revokeCode = panelMutation({
  args: {
    codeId: v.id("verificationCodes"),
  },
  handler: async (ctx, args) => {
    const code = await ctx.db.get(args.codeId);
    if (!code) {
      return { success: false, error: "Code not found" };
    }

    await ctx.db.patch(args.codeId, { status: "revoked" });
    return { success: true };
  },
});

/**
 * Cleanup expired codes (run periodically)
 */
export const cleanupExpired = panelMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const expired = await ctx.db
      .query("verificationCodes")
      .withIndex("by_expires", (q) => q.lt("expiresAt", now))
      .collect();

    let cleaned = 0;
    for (const code of expired) {
      if (code.status === "pending") {
        await ctx.db.patch(code._id, { status: "expired" });
        cleaned++;
      }
    }

    return { cleaned, total: expired.length };
  },
});

/**
 * Get verification code by session ID (for callback flow)
 */
export const getBySessionId = query({
  args: {
    sessionId: v.string(),
  },
  handler: async (ctx, args) => {
    const codes = await ctx.db
      .query("verificationCodes")
      .filter((q) => q.eq(q.field("sessionId"), args.sessionId))
      .collect();

    return codes[0] || null;
  },
});
