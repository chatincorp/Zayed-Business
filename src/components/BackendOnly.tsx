import { isBackendConfigured } from "@/lib/backend";
import { Database, ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router";

/**
 * Renders backend-driven screens only when a Convex deployment is configured.
 * On a purely static deployment this shows a friendly notice instead of
 * mounting components that expect a Convex client.
 */
export function BackendOnly({ children }: { children: ReactNode }) {
  if (isBackendConfigured) return children;

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
          <Database className="h-6 w-6 text-muted-foreground" />
        </div>
        <h1 className="font-display text-2xl font-bold text-foreground">
          Admin runs on the live backend
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          This static build has no Convex deployment attached, so management
          screens are unavailable. The public site, services and tabloid all
          work without it.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-electric px-5 py-2.5 text-sm font-semibold text-white hover:bg-electric-dark transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to the site
        </Link>
      </div>
    </main>
  );
}
