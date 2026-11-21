import '@vly-ai/integrations';
import { Toaster } from "@/components/ui/sonner";
import { RequireAuth, RequireStaff } from "@/components/RequireAuth";
import { SectionGate } from "@/components/SectionGate";
import { BackendOnly } from "@/components/BackendOnly";
import { AuthProvider } from "@/lib/auth";
import { CONVEX_URL, isBackendConfigured } from "@/lib/backend";
import { VlyToolbar } from "../vly-toolbar-readonly.tsx";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
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
const BestIndex = lazy(() => import("./pages/BestIndex.tsx"));
const BestServiceInPlace = lazy(() => import("./pages/BestServiceInPlace.tsx"));
const OrderPortal = lazy(() => import("./pages/OrderPortal.tsx"));
const MarketExplorer = lazy(() => import("./pages/tabloid/MarketExplorer.tsx"));
const Pricing = lazy(() => import("./pages/Pricing.tsx"));
const Checkout = lazy(() => import("./pages/Checkout.tsx"));
const About = lazy(() => import("./pages/About.tsx"));
const Fmcg = lazy(() => import("./pages/Fmcg.tsx"));
const FmcgAccountFlow = lazy(() => import("./pages/FmcgAccountFlow.tsx"));
const Wholesale = lazy(() => import("./pages/Wholesale.tsx"));
const SupplierRegister = lazy(() => import("./pages/SupplierRegister.tsx"));
const SupplierDashboard = lazy(() => import("./pages/SupplierDashboard.tsx"));
const Legal = lazy(() => import("./pages/Legal.tsx"));
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
        <Route path="/" element={<SectionGate title="Home" slug="/"><Landing /></SectionGate>} />
        <Route path="/contact" element={<SectionGate title="Contact" slug="/contact"><Contact /></SectionGate>} />
        <Route path="/services" element={<SectionGate title="Services" slug="/services"><Catalog /></SectionGate>} />
        <Route path="/services/:slug" element={<ServiceDetail />} />
        <Route path="/best" element={<SectionGate title="Services by location" slug="/best"><BestIndex /></SectionGate>} />
        <Route path="/best/:serviceSlug/:placeSlug" element={<BestServiceInPlace />} />
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
        <Route
          path="/portal"
          element={
            <RequireAuth>
              <BackendOnly
                title="The order portal runs on the live backend"
                description="This static build has no Convex deployment attached, so order dashboards are unavailable. You can still browse the wholesale catalogue."
              >
                <OrderPortal />
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
                <RequireStaff>
                  <Admin />
                </RequireStaff>
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
        <Route path="/markets" element={<MarketExplorer />} />
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
