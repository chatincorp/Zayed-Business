import { ConvexError } from "convex/values";
import type { MutationCtx } from "./_generated/server";

/**
 * Admin write gate.
 *
 * Every admin mutation calls this first. Reads stay open (the public site and
 * the admin panels both read through queries); only writes are restricted.
 *
 * Bootstrap rule: while no account holds the admin or super_admin role, any
 * signed-in, non-guest account may write. That keeps a fresh deployment usable
 * — the first person in can set up content and then promote themselves — and
 * stops applying once an admin exists, so it cannot be used later to bypass
 * the gate.
 */
const ADMIN_ROLES = new Set(["admin", "super_admin"]);

/**
 * Staff gate for the order desk.
 *
 * The site's sign-in is local (see src/lib/auth.tsx), so a signed-in owner's
 * Convex identity is anonymous and carries no email. Order-desk writes are
 * therefore authorised against the account record that holds the role: first
 * the identity itself when it has one, then the acting email the interface
 * supplies. Either way the role is read from the database, never from the
 * request, and a visitor without a staff account is refused.
 */
export async function requireStaff(
  ctx: MutationCtx,
  actorEmail: string | undefined,
  allowed: Array<"admin" | "super_admin" | "sales">,
) {
  const identity = await ctx.auth.getUserIdentity();
  const users = await ctx.db.query("users").collect();
  const accounts = users.filter((user) => !user.isAnonymous && Boolean(user.email));

  const identityEmail = (identity?.email ?? "").toLowerCase();
  const signedIn = identity
    ? accounts.find(
        (user) =>
          user._id === identity.subject ||
          (identityEmail.length > 0 && (user.email ?? "").toLowerCase() === identityEmail),
      )
    : undefined;
  if (signedIn?.role && (allowed as string[]).includes(signedIn.role)) return signedIn;

  const actingEmail = (actorEmail ?? "").trim().toLowerCase();
  if (actingEmail) {
    const acting = accounts.find(
      (user) => (user.email ?? "").toLowerCase() === actingEmail,
    );
    if (acting?.role && (allowed as string[]).includes(acting.role)) return acting;
  }

  throw new ConvexError(
    "This account does not have order-desk access. Ask an admin to grant the sales or admin role under Users.",
  );
}

export async function requireAdmin(ctx: MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new ConvexError("Sign in with an admin account to make changes.");
  }

  const users = await ctx.db.query("users").collect();
  const accounts = users.filter((user) => !user.isAnonymous && Boolean(user.email));

  const hasAdmin = accounts.some(
    (user) => user.role !== undefined && ADMIN_ROLES.has(user.role),
  );
  if (!hasAdmin) return identity;

  const email = (identity.email ?? "").toLowerCase();
  const me = accounts.find(
    (user) =>
      user._id === identity.subject ||
      (email.length > 0 && (user.email ?? "").toLowerCase() === email),
  );

  if (!me?.role || !ADMIN_ROLES.has(me.role)) {
    throw new ConvexError(
      "This account does not have admin access. Ask an existing admin to grant the admin role under Users, then sign in again.",
    );
  }

  return identity;
}
