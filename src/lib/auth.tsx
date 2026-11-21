/**
 * Client authentication.
 *
 * Sessions, roles, privileges and policy acceptance all live in Convex Auth /
 * the `users` table. Nothing about the signed-in user is stored in the browser,
 * so signing in on a new device, revoking access from the admin panel and
 * role changes all take effect immediately.
 *
 * The public marketing site still boots without a backend; in that case there
 * is simply no signed-in user.
 */

import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { useCallback, useMemo } from "react";
import { api } from "@/convex/_generated/api";
import { roleCanUsePanel, roleIsRoot } from "@/convex/privileges";
import { isBackendConfigured } from "./backend";

export interface AuthUser {
  name?: string;
  email?: string;
  role?: string;
  privileges?: string[];
}

export interface AuthContextValue {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: AuthUser | null;
  role: string | null;
  /** May open the admin panel at all. */
  isStaff: boolean;
  /** Full administrator (every panel section). */
  isAdmin: boolean;
  privileges: string[];
  /** May open one specific panel section. */
  canOpen: (section: string) => boolean;
  policyAccepted: boolean;
  signIn: (details: { email: string; password: string }) => Promise<void>;
  signUp: (details: {
    email: string;
    password: string;
    name?: string;
  }) => Promise<void>;
  signOut: () => Promise<void>;
  acceptPolicy: () => Promise<void>;
}

const OFFLINE_AUTH: AuthContextValue = {
  isLoading: false,
  isAuthenticated: false,
  user: null,
  role: null,
  isStaff: false,
  isAdmin: false,
  privileges: [],
  canOpen: () => false,
  policyAccepted: false,
  signIn: async () => {
    throw new Error("Sign-in requires the live backend.");
  },
  signUp: async () => {
    throw new Error("Sign-up requires the live backend.");
  },
  signOut: async () => {},
  acceptPolicy: async () => {},
};

function useBackendAuth(): AuthContextValue {
  const { isLoading: authLoading, isAuthenticated } = useConvexAuth();
  const session = useQuery(
    api.authz.session,
    isAuthenticated ? {} : "skip",
  );
  const acceptPolicyMut = useMutation(api.authz.acceptPolicy);
  const { signIn: authSignIn, signOut: authSignOut } = useAuthActions();

  const role = (session?.role as string | undefined) ?? null;
  const privileges = useMemo(
    () => (session?.privileges as string[] | undefined) ?? [],
    [session?.privileges],
  );
  const isAdmin = roleIsRoot(role);
  const isStaff = roleCanUsePanel(role);

  const canOpen = useCallback(
    (section: string) => {
      if (!isStaff) return false;
      if (isAdmin) return true;
      return privileges.includes(section);
    },
    [isAdmin, isStaff, privileges],
  );

  const signIn = useCallback(
    async ({ email, password }: { email: string; password: string }) => {
      await authSignIn("password", {
        email: email.trim().toLowerCase(),
        password,
        flow: "signIn",
      });
    },
    [authSignIn],
  );

  const signUp = useCallback(
    async ({
      email,
      password,
      name,
    }: {
      email: string;
      password: string;
      name?: string;
    }) => {
      await authSignIn("password", {
        email: email.trim().toLowerCase(),
        password,
        flow: "signUp",
        ...(name?.trim() ? { name: name.trim() } : {}),
      });
    },
    [authSignIn],
  );

  const signOut = useCallback(async () => {
    await authSignOut();
  }, [authSignOut]);

  const acceptPolicy = useCallback(async () => {
    await acceptPolicyMut({});
  }, [acceptPolicyMut]);

  const user: AuthUser | null = session
    ? {
        name: session.name ?? undefined,
        email: session.email ?? undefined,
        role: session.role,
        privileges,
      }
    : null;

  return {
    isLoading: authLoading || (isAuthenticated && session === undefined),
    isAuthenticated: !!session,
    user,
    role,
    isStaff,
    isAdmin,
    privileges,
    canOpen,
    policyAccepted: !!session?.policyAcceptedAt,
    signIn,
    signUp,
    signOut,
    acceptPolicy,
  };
}

/**
 * `isBackendConfigured` is a build-time constant, so this branch never changes
 * between renders and hook order stays stable.
 */
export function useAuth(): AuthContextValue {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return isBackendConfigured ? useBackendAuth() : OFFLINE_AUTH;
}

/** Kept for compatibility: auth state comes from Convex, not a local provider. */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
