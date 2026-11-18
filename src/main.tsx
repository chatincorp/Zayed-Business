import '@vly-ai/integrations';
import { Toaster } from "@/components/ui/sonner";
import { RequireAuth } from "@/components/RequireAuth";
import { SectionGate } from "@/components/SectionGate";
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

// Route chunk loaders, declared once so the same imports can be warmed in the
// background (see RoutePrefetcher) as well as split by React.lazy.
const routeLoaders = {
  Landing: () => import("./pages/Landing.tsx"),
  AuthPage: () => import("./pages/Auth.tsx"),
  Dashboard: () => import("./pages/Dashboard.tsx"),
  NotFound: () => import("./pages/NotFound.tsx"),
  Contact: () => import("./pages/Contact.tsx"),
  Admin: () => import("./pages/Admin.tsx"),
  Catalog: () => import("./pages/Catalog.tsx"),
  ServiceDetail: () => import("./pages/ServiceDetail.tsx"),
  Pricing: () => import("./pages/Pricing.tsx"),
  Checkout: () => import("./pages/Checkout.tsx"),
  About: () => import("./pages/About.tsx"),
  Fmcg: () => import("./pages/Fmcg.tsx"),
  FmcgAccountFlow: () => import("./pages/FmcgAccountFlow.tsx"),
  Wholesale: () => import("./pages/Wholesale.tsx"),
  SupplierRegister: () => import("./pages/SupplierRegister.tsx"),
  SupplierDashboard: () => import("./pages/SupplierDashboard.tsx"),
  Legal: () => import("./pages/Legal.tsx"),
  DemoCorporate: () => import("./pages/demos/DemoCorporate.tsx"),
  DemoWebapp: () => import("./pages/demos/DemoWebapp.tsx"),
  DemoEcommerce: () => import("./pages/demos/DemoEcommerce.tsx"),
  TabloidIndex: () => import("./pages/tabloid/TabloidIndex.tsx"),
  TabloidArticlePage: () => import("./pages/tabloid/TabloidArticlePage.tsx"),
  FinancialMarkets: () => import("./pages/tabloid/FinancialMarkets.tsx"),
  LiveForex: () => import("./pages/tabloid/LiveForex.tsx"),
  EditorialDashboard: () => import("./pages/tabloid/EditorialDashboard.tsx"),
};

// Lazy load route components for better code splitting
const Landing = lazy(routeLoaders.Landing);
const AuthPage = lazy(routeLoaders.AuthPage);
const Dashboard = lazy(routeLoaders.Dashboard);
const NotFound = lazy(routeLoaders.NotFound);
const Contact = lazy(routeLoaders.Contact);
const Admin = lazy(routeLoaders.Admin);
const Catalog = lazy(routeLoaders.Catalog);
const ServiceDetail = lazy(routeLoaders.ServiceDetail);
const Pricing = lazy(routeLoaders.Pricing);
const Checkout = lazy(routeLoaders.Checkout);
const About = lazy(routeLoaders.About);
const Fmcg = lazy(routeLoaders.Fmcg);
const FmcgAccountFlow = lazy(routeLoaders.FmcgAccountFlow);
const Wholesale = lazy(routeLoaders.Wholesale);
const SupplierRegister = lazy(routeLoaders.SupplierRegister);
const SupplierDashboard = lazy(routeLoaders.SupplierDashboard);
const Legal = lazy(routeLoaders.Legal);
const DemoCorporate = lazy(routeLoaders.DemoCorporate);
const DemoWebapp = lazy(routeLoaders.DemoWebapp);
const DemoEcommerce = lazy(routeLoaders.DemoEcommerce);
const TabloidIndex = lazy(routeLoaders.TabloidIndex);
const TabloidArticlePage = lazy(routeLoaders.TabloidArticlePage);
const FinancialMarkets = lazy(routeLoaders.FinancialMarkets);
const LiveForex = lazy(routeLoaders.LiveForex);
const EditorialDashboard = lazy(routeLoaders.EditorialDashboard);

/**
 * Warms the lazily-loaded route chunks once the first screen is idle, so
 * opening /tabloid, /pricing, /contact … does not sit on the "Loading…"
 * fallback while Vite transforms (dev) or downloads (prod) the chunk.
 */
function RoutePrefetcher() {
  useEffect(() => {
    const queue = Object.values(routeLoaders);
    let cancelled = false;
    let timer = 0;

    const run = () => {
      if (cancelled) return;
      const load = queue.shift();
      if (!load) return;
      load().catch(() => {
        /* a failed prefetch must never break navigation */
      });
      timer = window.setTimeout(run, 350);
    };

    timer = window.setTimeout(run, 1500);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, []);

  return null;
}

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
    <RoutePrefetcher />
    <HashScroller />
    <Suspense fallback={<RouteLoading />}>
      <Routes>
        <Route path="/" element={<SectionGate title="Home" slug="/"><Landing /></SectionGate>} />
        <Route path="/contact" element={<SectionGate title="Contact" slug="/contact"><Contact /></SectionGate>} />
        <Route path="/services" element={<SectionGate title="Services" slug="/services"><Catalog /></SectionGate>} />
        <Route path="/services/:slug" element={<ServiceDetail />} />
        <Route path="/fmcg" element={<SectionGate title="FMCG Services" section="fmcg" slug="/fmcg"><Fmcg /></SectionGate>} />
        <Route path="/fmcg/account" element={<FmcgAccountFlow />} />
        <Route path="/wholesale" element={<SectionGate title="Wholesale Ordering" section="wholesale" slug="/wholesale"><Wholesale /></SectionGate>} />
        <Route
          path="/supplier/register"
          element={
            <SectionGate title="Supplier Registration" section="supplier_register" slug="/supplier/register">
              <RequireAuth>
                <BackendOnly
                  title="Supplier registration runs on the live backend"
                  description="This static build has no Convex deployment attached, so document uploads and supplier accounts are unavailable. You can still explore FMCG services and the wholesale catalogue."
                >
                  <SupplierRegister />
                </BackendOnly>
              </RequireAuth>
            </SectionGate>
          }
        />
        <Route
          path="/supplier/dashboard"
          element={
            <RequireAuth>
              <BackendOnly
                title="The supplier dashboard runs on the live backend"
                description="This static build has no Convex deployment attached, so supplier listings are unavailable. You can still explore FMCG services and the wholesale catalogue."
              >
                <SupplierDashboard />
              </BackendOnly>
            </RequireAuth>
          }
        />
        <Route path="/about" element={<SectionGate title="About Us" slug="/about"><About /></SectionGate>} />
        <Route path="/pricing" element={<SectionGate title="Pricing" section="pricing" slug="/pricing"><Pricing /></SectionGate>} />
        <Route path="/checkout" element={<SectionGate title="Checkout" section="checkout" slug="/checkout"><Checkout /></SectionGate>} />
        <Route path="/privacy" element={<Legal />} />
        <Route path="/terms" element={<Legal />} />
        <Route path="/cookies" element={<Legal />} />
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
        <Route path="/demo/corporate" element={<SectionGate title="Live Demos" section="ai_demos"><DemoCorporate /></SectionGate>} />
        <Route path="/demo/webapp" element={<SectionGate title="Live Demos" section="ai_demos"><DemoWebapp /></SectionGate>} />
        <Route path="/demo/ecommerce" element={<SectionGate title="Live Demos" section="ai_demos"><DemoEcommerce /></SectionGate>} />
        <Route path="/tabloid" element={<SectionGate title="Zayed Tabloid" section="tabloid" slug="/tabloid"><TabloidIndex /></SectionGate>} />
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
