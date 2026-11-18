/**
 * Account management for staff and administrators.
 *
 * Staff accounts are created here by an administrator — never through public
 * sign-up. Each account is a real Convex Auth password account, so the same
 * /auth page signs in clients, staff and admins; the account's `role` and
 * `privileges` decide what it can reach afterwards.
 */

import { createAccount } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { api, internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import {
  action,
  internalAction,
  internalMutation,
  internalQuery,
} from "./_generated/server";
import { ALL_PRIVILEGES } from "./privileges";
import { panelQuery, rootMutation } from "./authz";

const MIN_PASSWORD_LENGTH = 8;

function assertPassword(password: string) {
  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new Error(
      `Passwords must be at least ${MIN_PASSWORD_LENGTH} characters long.`,
    );
  }
}

/** Every staff / admin / client account, for the admin panel. */
export const listAccounts = panelQuery({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    return users
      .filter((u) => !u.isAnonymous)
      .map((u) => ({
        _id: u._id,
        name: u.name ?? "",
        email: u.email ?? "",
        role: u.role ?? "client",
        privileges: u.privileges ?? [],
        status: u.status ?? "active",
        department: u.department ?? "",
        policyAcceptedAt: u.policyAcceptedAt ?? null,
        createdAt: u.createdAt ?? null,
      }))
      .sort((a, b) => a.email.localeCompare(b.email));
  },
});

/** Create a staff account (or promote an existing email) with a password. */
export const createStaffAccount = action({
  args: {
    name: v.string(),
    email: v.string(),
    password: v.string(),
    role: v.union(v.literal("staff"), v.literal("admin")),
    privileges: v.array(v.string()),
    department: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<{ userId: Id<"users"> }> => {
    const me = await ctx.runQuery(api.authz.session, {});
    if (!me || (me.role !== "admin" && me.role !== "super_admin")) {
      throw new Error("Only administrators can create staff accounts.");
    }

    const email = args.email.trim().toLowerCase();
    if (!email.includes("@")) throw new Error("Enter a valid email address.");
    assertPassword(args.password);

    const existing = await ctx.runQuery(internal.adminAccounts.findUserByEmail, {
      email,
    });
    if (existing) {
      throw new Error(
        "An account with that email already exists. Update its access instead.",
      );
    }

    // Admins implicitly hold every privilege; staff get exactly what is ticked.
    const privileges =
      args.role === "admin" ? ALL_PRIVILEGES : args.privileges;

    const { user } = await createAccount(ctx, {
      provider: "password",
      account: { id: email, secret: args.password },
      profile: {
        email,
        name: args.name.trim() || email,
        role: args.role,
        privileges,
        status: "active",
        department: args.department,
        policyAcceptedAt: Date.now(),
        createdAt: Date.now(),
      },
      shouldLinkViaEmail: false,
      shouldLinkViaPhone: false,
    });

    // Keep the staff directory in step with the account.
    await ctx.runMutation(internal.adminAccounts.upsertStaffRecord, {
      name: args.name.trim() || email,
      email,
      role: args.role,
      department: args.department ?? "Operations",
    });

    return { userId: user._id };
  },
});

/** Change an account's role, privileges or suspension state. */
export const updateAccountAccess = rootMutation({
  args: {
    userId: v.id("users"),
    role: v.union(
      v.literal("admin"),
      v.literal("staff"),
      v.literal("client"),
    ),
    privileges: v.array(v.string()),
    status: v.union(v.literal("active"), v.literal("suspended")),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      role: args.role,
      privileges: args.role === "admin" ? ALL_PRIVILEGES : args.privileges,
      status: args.status,
    });
    return null;
  },
});

/* ── internals ─────────────────────────────────────────────── */

export const findUserByEmail = internalQuery({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const email = args.email.trim().toLowerCase();
    return await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", email))
      .first();
  },
});

export const upsertStaffRecord = internalMutation({
  args: {
    name: v.string(),
    email: v.string(),
    role: v.union(v.literal("admin"), v.literal("staff")),
    department: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const existing = await ctx.db
      .query("staff")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, {
        name: args.name,
        role: args.role,
        department: args.department,
        updatedAt: now,
      });
      return existing._id;
    }
    return await ctx.db.insert("staff", {
      name: args.name,
      email: args.email,
      role: args.role,
      department: args.department,
      responsibilities: [],
      joinedAt: new Date(now).toISOString().slice(0, 10),
      status: "active",
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const promoteUser = internalMutation({
  args: {
    userId: v.id("users"),
    role: v.union(v.literal("admin"), v.literal("staff")),
    privileges: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      role: args.role,
      privileges: args.privileges,
      status: "active",
      policyAcceptedAt: Date.now(),
    });
    return null;
  },
});

/**
 * One-shot bootstrap for the primary administrator. Run from the CLI:
 *   npx convex run adminAccounts:seedAdminAccount \
 *     '{"email":"…","password":"…","name":"…"}'
 * It creates the account only when that email does not exist yet.
 */
export const seedAdminAccount = internalAction({
  args: {
    email: v.string(),
    password: v.string(),
    name: v.optional(v.string()),
  },
  handler: async (
    ctx,
    args,
  ): Promise<{ created: boolean; userId: Id<"users"> }> => {
    const email = args.email.trim().toLowerCase();
    assertPassword(args.password);

    const existing = await ctx.runQuery(internal.adminAccounts.findUserByEmail, {
      email,
    });

    if (existing) {
      await ctx.runMutation(internal.adminAccounts.promoteUser, {
        userId: existing._id,
        role: "admin",
        privileges: ALL_PRIVILEGES,
      });
      return { created: false, userId: existing._id };
    }

    const { user } = await createAccount(ctx, {
      provider: "password",
      account: { id: email, secret: args.password },
      profile: {
        email,
        name: args.name ?? "Yasir Zayed",
        role: "admin",
        privileges: ALL_PRIVILEGES,
        status: "active",
        policyAcceptedAt: Date.now(),
        createdAt: Date.now(),
      },
      shouldLinkViaEmail: false,
      shouldLinkViaPhone: false,
    });

    await ctx.runMutation(internal.adminAccounts.upsertStaffRecord, {
      name: args.name ?? "Yasir Zayed",
      email,
      role: "admin",
      department: "Executive",
    });

    return { created: true, userId: user._id };
  },
});
