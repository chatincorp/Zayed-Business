import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";

/**
 * Email + password authentication, stored and verified by Convex Auth.
 *
 * - Clients/customers sign themselves up from /auth ("Create account").
 * - Staff and admin accounts are created by an administrator in the admin
 *   panel; there is no staff sign-up path.
 * - The Anonymous provider is deliberately not registered: every backend
 *   identity must belong to a real, password-verified account.
 */
export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Password],
});
