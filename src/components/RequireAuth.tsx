import { useAuth } from "@/hooks/use-auth";
import { Loader2, ShieldAlert } from "lucide-react";
import type { ReactNode } from "react";
import { Link, Navigate, useLocation } from "react-router";

function CenteredSpinner() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background">
      <Loader2 className="size-6 animate-spin text-muted-foreground" />
    </main>
  );
}

/** Any signed-in account (clients, suppliers, staff, admins). */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { isLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (isLoading) return <CenteredSpinner />;

  if (!isAuthenticated) {
    const returnTo = `${location.pathname}${location.search}`;
    return <Navigate to={`/auth?returnTo=${encodeURIComponent(returnTo)}`} replace />;
  }

  return children;
}

/**
 * Admin panel gate. The session must belong to an active staff or admin
 * account; the Convex functions behind the panel enforce the same rule
 * server-side, so this is the user-facing half of the check.
 */
export function RequireStaff({ children }: { children: ReactNode }) {
  const { isLoading, isAuthenticated, isStaff, user, signOut } = useAuth();
  const location = useLocation();

  if (isLoading) return <CenteredSpinner />;

  if (!isAuthenticated) {
    const returnTo = `${location.pathname}${location.search}`;
    return <Navigate to={`/auth?returnTo=${encodeURIComponent(returnTo)}`} replace />;
  }

  if (!isStaff) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10">
            <ShieldAlert className="h-6 w-6 text-amber-500" />
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            No admin panel access
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {user?.email ? `${user.email} is ` : "This account is "}
            signed in as a client account. Staff access is created by an
            administrator — ask them to add you, then sign in again.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/dashboard"
              className="rounded-lg bg-electric px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-electric-dark"
            >
              Go to my dashboard
            </Link>
            <button
              onClick={() => void signOut()}
              className="rounded-lg border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
            >
              Sign out
            </button>
          </div>
        </div>
      </main>
    );
  }

  return children;
}
