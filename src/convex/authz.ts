/**
 * Server-side authorization for the admin panel.
 *
 * Every admin-facing Convex function is declared with `panelQuery` /
 * `panelMutation` (any staff account, narrowed by privileges) or
 * `rootQuery` / `rootMutation` (admin / super admin only). The guard runs
 * before the handler, so a public client cannot call these functions even
 * though the Convex deployment URL is embedded in the public bundle.
 */

import { getAuthUserId } from "@convex-dev/auth/server";
import type { MutationBuilder, QueryBuilder } from "convex/server";
import type { PropertyValidators } from "convex/values";
import type { DataModel, Doc } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import { roleCanUsePanel, roleIsRoot } from "./privileges";

export type SessionUser = Doc<"users">;

async function sessionUser(
  ctx: QueryCtx | MutationCtx,
): Promise<SessionUser | null> {
  const userId = await getAuthUserId(ctx);
  if (!userId) return null;
  const user = await ctx.db.get(userId);
  return (user as SessionUser | null) ?? null;
}

export function userIsActive(user: SessionUser | null): boolean {
  return !!user && user.status !== "suspended";
}

/** Throws unless a non-suspended user is signed in. */
export async function requireUser(
  ctx: QueryCtx | MutationCtx,
): Promise<SessionUser> {
  const user = await sessionUser(ctx);
  if (!user || !userIsActive(user)) {
    throw new Error("You need to sign in to continue.");
  }
  return user;
}

/** Throws unless the caller may open the admin panel. */
export async function requireStaff(
  ctx: QueryCtx | MutationCtx,
): Promise<SessionUser> {
  const user = await sessionUser(ctx);
  if (!user || !userIsActive(user)) {
    throw new Error("You need to sign in to continue.");
  }
  if (!roleCanUsePanel(user.role)) {
    throw new Error("This account does not have admin panel access.");
  }
  return user;
}

/** Throws unless the caller is an admin / super admin. */
export async function requireRoot(
  ctx: QueryCtx | MutationCtx,
): Promise<SessionUser> {
  const user = await sessionUser(ctx);
  if (!user || !userIsActive(user)) {
    throw new Error("You need to sign in to continue.");
  }
  if (!roleIsRoot(user.role)) {
    throw new Error("Only administrators can perform this action.");
  }
  return user;
}

/** True when the user may open a specific panel section. */
export function canOpenSection(
  user: SessionUser | null,
  section: string,
): boolean {
  if (!user || !userIsActive(user)) return false;
  if (roleIsRoot(user.role)) return true;
  if (!roleCanUsePanel(user.role)) return false;
  return (user.privileges ?? []).includes(section);
}

/**
 * The signed-in account, or null. Used by the client auth context to decide
 * between client, staff and admin experiences.
 */
export const session = query({
  args: {},
  handler: async (ctx) => {
    const user = await sessionUser(ctx);
    if (!user) return null;
    return {
      _id: user._id,
      name: user.name ?? null,
      email: user.email ?? null,
      role: user.role ?? "client",
      privileges: user.privileges ?? [],
      policyAcceptedAt: user.policyAcceptedAt ?? null,
      status: user.status ?? "active",
    };
  },
});

/** Record policy acceptance on the account itself (no browser storage). */
export const acceptPolicy = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await requireUser(ctx);
    if (user.policyAcceptedAt) return { acceptedAt: user.policyAcceptedAt };
    const acceptedAt = Date.now();
    await ctx.db.patch(user._id, { policyAcceptedAt: acceptedAt });
    return { acceptedAt };
  },
});

/*
 * Guarded builders.
 *
 * The casts are confined to these four adapters: they let every call site keep
 * the exact argument typing of `query` / `mutation` while the guard runs first.
 */
type Guard = (ctx: QueryCtx | MutationCtx) => Promise<SessionUser>;

interface GuardedConfig {
  args?: PropertyValidators;
  handler: (ctx: QueryCtx | MutationCtx, args: never) => Promise<unknown>;
}

function guardedQuery(config: GuardedConfig, guard: Guard) {
  return query({
    args: config.args,
    handler: async (ctx, args: never) => {
      await guard(ctx);
      return await config.handler(ctx, args);
    },
  });
}

function guardedMutation(config: GuardedConfig, guard: Guard) {
  return mutation({
    args: config.args,
    handler: async (ctx, args: never) => {
      await guard(ctx);
      return await config.handler(ctx, args);
    },
  });
}

/** Admin panel query for any staff account. */
export const panelQuery = ((config: GuardedConfig) =>
  guardedQuery(config, requireStaff)) as unknown as QueryBuilder<
  DataModel,
  "public"
>;

/** Admin panel mutation for any staff account. */
export const panelMutation = ((config: GuardedConfig) =>
  guardedMutation(config, requireStaff)) as unknown as MutationBuilder<
  DataModel,
  "public"
>;

/** Admin panel query restricted to admins / super admins. */
export const rootQuery = ((config: GuardedConfig) =>
  guardedQuery(config, requireRoot)) as unknown as QueryBuilder<
  DataModel,
  "public"
>;

/** Admin panel mutation restricted to admins / super admins. */
export const rootMutation = ((config: GuardedConfig) =>
  guardedMutation(config, requireRoot)) as unknown as MutationBuilder<
  DataModel,
  "public"
>;
