import '@vly-ai/integrations';
import { Toaster } from "@/components/ui/sonner";
import { RequireAuth } from "@/components/RequireAuth";
import { BackendOnly } from "@/components/BackendOnly";
import { AuthProvider, useAuth } from "@/lib/auth";
import { CONVEX_URL, isBackendConfigured } from "@/lib/backend";
import { VlyToolbar } from "../vly-toolbar-readonly.tsx";
import { ConvexAuthProvider, useAuthActions } from "@convex-dev/auth/react";
import { ConvexReactClient, useConvexAuth } from "convex/react";
import React, { StrictMode, useEffect, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes, useLocation } from "react-router";
import "./index.css";

// Lazy load route components for better code splitting
const Landing = lazy(() => import("./pages/Landing.tsx"));
const AuthPage = lazy(() => import("./pages/Auth.tsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const Contact = lazy(() => import("./pages/Contact.tsx"));
const Admin = lazy(() => import("./pages/Admin.tsx"));
const Catalog = lazy(() => import("./pages/Catalog.tsx"));
const ServiceDetail = lazy(() => import("./pages/ServiceDetail.tsx"));
const Pricing = lazy(() => import("./pages/Pricing.tsx"));
const About = lazy(() => import("./pages/About.tsx"));
const DemoCorporate = lazy(() => import("./pages/demos/DemoCorporate.tsx"));
const DemoWebapp = lazy(() => import("./pages/demos/DemoWebapp.tsx"));
const DemoEcommerce = lazy(() => import("./pages/demos/DemoEcommerce.tsx"));
const TabloidIndex = lazy(() => import("./pages/tabloid/TabloidIndex.tsx"));
const TabloidArticlePage = lazy(() => import("./pages/tabloid/TabloidArticlePage.tsx"));
const FinancialMarkets = lazy(() => import("./pages/tabloid/FinancialMarkets.tsx"));
const LiveForex = lazy(() => import("./pages/tabloid/LiveForex.tsx"));
const EditorialDashboard = lazy(() => import("./pages/tabloid/EditorialDashboard.tsx"));

// Simple loading fallback for route transitions
function RouteLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="animate-pulse text-muted-foreground text-sm">Loading...</div>
    </div>
  );
}

/** Silent error boundary — if VlyToolbar crashes it renders nothing instead of
 *  crashing the whole app (e.g. hook errors in WebContainer environment). */
class ToolbarErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(err: Error) {
    console.warn("[VlyToolbar] Caught error, toolbar disabled:", err.message);
  }
  render() {
    return this.state.hasError ? null : this.props.children;
  }
}

/** Hard guard so runtime errors never leave the preview as a blank page. */
class RootErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; message: string; stack: string }
> {
  state = { hasError: false, message: "", stack: "" };
  static getDerivedStateFromError(error: Error) {
    return {
      hasError: true,
      message: error.message || "Unknown runtime error",
      stack: error.stack || "",
    };
  }
  componentDidCatch(err: Error) {
    console.error("[WebContainer preview] Root crash:", err);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-6">
          <div className="max-w-lg text-center">
            <p className="text-sm font-semibold">Preview runtime error</p>
            <p className="mt-2 text-xs text-muted-foreground break-words">
              {this.state.message}
            </p>
            {this.state.stack && (
              <pre className="mt-3 text-left text-[10px] leading-4 text-muted-foreground/80 max-h-40 overflow-auto rounded border border-border/60 p-2">
                {this.state.stack}
              </pre>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

/** Created only when VITE_CONVEX_URL is set, so the static bundle can boot
 *  with no backend attached. */
const convex = isBackendConfigured ? new ConvexReactClient(CONVEX_URL) : null;

/**
 * Mirror the local sign-in with a Convex anonymous session when a backend is
 * configured. Purely additive: the static site works with or without it.
 */
function BackendSessionBridge() {
  const { isAuthenticated: hasLocalSession } = useAuth();
  const { isAuthenticated: hasBackendSession } = useConvexAuth();
  const { signIn: convexSignIn } = useAuthActions();

  useEffect(() => {
    if (!hasLocalSession || hasBackendSession) return;
    void convexSignIn("anonymous").catch((error: unknown) => {
      console.warn("Convex anonymous session unavailable:", error);
    });
  }, [hasLocalSession, hasBackendSession, convexSignIn]);

  return null;
}

/** Scroll to in-page anchors (e.g. /#fmcg) on navigation and hash changes. */
function HashScroller() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const id = decodeURIComponent(hash.slice(1));
    let attempts = 0;
    let timer: number | undefined;

    // Lazy route chunks can mount after the effect runs, so retry briefly.
    const scroll = () => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      if (attempts++ < 20) timer = window.setTimeout(scroll, 100);
    };

    const frame = requestAnimationFrame(scroll);
    return () => {
      cancelAnimationFrame(frame);
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, [pathname, hash]);

  return null;
}

function RouteSyncer() {
  const location = useLocation();
  useEffect(() => {
    window.parent.postMessage(
      { type: "iframe-route-change", path: location.pathname },
      "*",
    );
  }, [location.pathname]);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data?.type === "navigate") {
        if (event.data.direction === "back") window.history.back();
        if (event.data.direction === "forward") window.history.forward();
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return null;
}


const routes = (
  <BrowserRouter>
    <RouteSyncer />
    <HashScroller />
    <Suspense fallback={<RouteLoading />}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/services" element={<Catalog />} />
        <Route path="/services/:slug" element={<ServiceDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route
          path="/admin/*"
          element={
            <RequireAuth>
              <BackendOnly>
                <Admin />
              </BackendOnly>
            </RequireAuth>
          }
        />
        <Route
          path="/auth"
          element={<AuthPage redirectAfterAuth="/dashboard" />}
        />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />
        <Route path="/demo/corporate" element={<DemoCorporate />} />
        <Route path="/demo/webapp" element={<DemoWebapp />} />
        <Route path="/demo/ecommerce" element={<DemoEcommerce />} />
        <Route path="/tabloid" element={<TabloidIndex />} />
        <Route path="/tabloid/:id" element={<TabloidArticlePage />} />
        <Route path="/tabloid/markets" element={<FinancialMarkets />} />
        <Route path="/tabloid/forex" element={<LiveForex />} />
        <Route path="/tabloid/editorial" element={<EditorialDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);

const app = (
  <RootErrorBoundary>
    <ToolbarErrorBoundary>
      <VlyToolbar />
    </ToolbarErrorBoundary>
    <AuthProvider>
      {routes}
      <Toaster />
      {convex ? <BackendSessionBridge /> : null}
    </AuthProvider>
  </RootErrorBoundary>
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {convex ? (
      <ConvexAuthProvider client={convex}>{app}</ConvexAuthProvider>
    ) : (
      app
    )}
  </StrictMode>,
);
