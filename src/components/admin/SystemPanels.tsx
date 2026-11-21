import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { CONVEX_URL, isBackendConfigured } from "@/lib/backend";
import { indexablePairs, LOCAL_PLACES, LOCAL_SERVICES } from "@/data/localSeo";
import {
  CheckCircle2,
  AlertTriangle,
  Shield,
  Globe,
  Gauge,
  FileSearch,
  Image as ImageIcon,
  ExternalLink,
} from "lucide-react";

/* ── shared ──────────────────────────────────────────────────── */

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      {children}
    </motion.div>
  );
}

function Notice({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground mb-6">
      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
      <span>{children}</span>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground font-mono">{value}</span>
    </div>
  );
}

/* ── System Health ───────────────────────────────────────────── */

export function SystemHealthPanel() {
  const [online, setOnline] = useState(() => navigator.onLine);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
      window.clearInterval(timer);
    };
  }, []);

  let backendHost = "not configured";
  try {
    backendHost = CONVEX_URL ? new URL(CONVEX_URL).host : backendHost;
  } catch {
    backendHost = CONVEX_URL;
  }

  return (
    <Panel>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">System Health</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Live facts about this session. Uptime, latency and error-rate monitoring live in the hosting
          provider&apos;s dashboard, so this panel does not display invented numbers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl">
        <div className="rounded-xl bg-card border border-border p-6">
          <h2 className="font-semibold text-sm mb-4">This session</h2>
          <Fact label="Network" value={online ? "online" : "offline"} />
          <Fact label="Backend" value={isBackendConfigured ? "configured" : "not configured"} />
          <Fact label="Deployment" value={backendHost} />
          <Fact label="Build mode" value={import.meta.env.PROD ? "production" : "development"} />
          <Fact label="Local time" value={now.toLocaleTimeString()} />
        </div>

        <div className="rounded-xl bg-card border border-border p-6">
          <h2 className="font-semibold text-sm mb-4">Where the real signals live</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              Convex dashboard → Logs, for database functions and scheduler health.
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              Hosting provider analytics, for request volume, latency and error rates.
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              Google Search Console, for crawl errors and indexing status.
            </li>
          </ul>
        </div>
      </div>
    </Panel>
  );
}

/* ── Security Logs ───────────────────────────────────────────── */

export function SecurityLogsPanel() {
  const logs = useQuery(api.adminRbac.listSecurityLogs);

  return (
    <Panel>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Security Logs</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Events recorded in the <code className="text-xs">securityLogs</code> table by the backend
          (verification challenges, blocked requests, failed sign-ins).
        </p>
      </div>

      <div className="rounded-xl bg-card border border-border overflow-hidden">
        <div className="grid grid-cols-12 gap-2 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground border-b border-border bg-muted/30">
          <div className="col-span-3">Time</div>
          <div className="col-span-4">Endpoint</div>
          <div className="col-span-3">Event</div>
          <div className="col-span-2 text-right">Risk</div>
        </div>
        <div className="divide-y divide-border">
          {(logs ?? []).map((log) => (
            <div key={log._id} className="grid grid-cols-12 gap-2 px-4 py-3 text-sm">
              <div className="col-span-3 text-muted-foreground text-xs">
                {new Date(log.timestamp).toLocaleString()}
              </div>
              <div className="col-span-4 font-mono text-xs truncate">{log.endpoint}</div>
              <div className="col-span-3 text-xs">{log.eventType}</div>
              <div className="col-span-2 text-right text-xs capitalize">{log.riskLevel}</div>
            </div>
          ))}
          {logs !== undefined && logs.length === 0 && (
            <div className="py-12 text-center text-muted-foreground text-sm">
              No security events have been recorded yet.
            </div>
          )}
          {logs === undefined && (
            <div className="py-12 text-center text-muted-foreground text-sm">Loading events…</div>
          )}
        </div>
      </div>
    </Panel>
  );
}

/* ── Integrations ────────────────────────────────────────────── */

const integrations = [
  { name: "OpenAI", description: "AI content generation and YasBot replies", env: "OPENAI_API_KEY" },
  { name: "Paystack", description: "Card payments and subscriptions", env: "PAYSTACK_SECRET_KEY" },
  { name: "Resend / SMTP", description: "Transactional email delivery", env: "RESEND_API_KEY" },
  { name: "Google Search Console", description: "Indexing and query reporting", env: "search-console property" },
  { name: "Convex", description: "Database, auth and scheduled functions", env: "VITE_CONVEX_URL" },
];

export function IntegrationsPanel() {
  return (
    <Panel>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Integrations</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Each integration is enabled by the presence of a server-side key. Keys are held in the
          deployment environment (Sites → Secrets or the project&apos;s env file) and are never stored in
          the database or shown in the browser.
        </p>
      </div>

      <div className="rounded-xl bg-card border border-border divide-y divide-border max-w-3xl">
        {integrations.map((item) => (
          <div key={item.name} className="flex flex-wrap items-center gap-3 px-5 py-4">
            <div className="flex-1 min-w-40">
              <p className="text-sm font-semibold text-foreground">{item.name}</p>
              <p className="text-[11px] text-muted-foreground">{item.description}</p>
            </div>
            <code className="text-[11px] px-2 py-1 rounded bg-muted text-muted-foreground">{item.env}</code>
          </div>
        ))}
      </div>
    </Panel>
  );
}

/* ── SEO Toolkit ─────────────────────────────────────────────── */

export function SEOToolkitPanel() {
  const links = [
    { label: "sitemap.xml", href: "/sitemap.xml", detail: "Every page, regenerated on each build" },
    { label: "robots.txt", href: "/robots.txt", detail: "Crawler rules and sitemap reference" },
    { label: "Structured data", href: "/", detail: "Organization, WebSite, Service, FAQ and breadcrumb JSON-LD" },
    {
      label: "Local landing pages",
      href: "/best",
      detail: `${indexablePairs().length} pages across ${LOCAL_PLACES.length} locations (${LOCAL_SERVICES.length} services)`,
    },
  ];

  return (
    <Panel>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">SEO</h1>
        <p className="text-muted-foreground text-sm mt-1">
          What the build actually ships. Rankings themselves are measured in Google Search Console and
          third-party rank trackers — this panel does not display sample positions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl bg-card border border-border p-6">
          <h2 className="font-semibold text-sm mb-4">Shipped SEO surface</h2>
          <div className="space-y-3">
            {links.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <ExternalLink className="w-4 h-4 text-electric shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">{item.label}</p>
                  <p className="text-[11px] text-muted-foreground">{item.detail}</p>
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-card border border-border p-6">
          <h2 className="font-semibold text-sm mb-4">To move a query into the top 10</h2>
          <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
            <li>Verify the domain in Google Search Console and submit /sitemap.xml.</li>
            <li>Request indexing for the highest-value /best pages.</li>
            <li>Earn local citations and backlinks (directories, partners, press).</li>
            <li>Collect Google Business Profile reviews for the physical location.</li>
            <li>Publish case studies so each service page has proof, not just copy.</li>
            <li>Track positions per query and iterate on the pages that stall on page two.</li>
          </ol>
        </div>
      </div>
    </Panel>
  );
}

/* ── Media Library ───────────────────────────────────────────── */

const bundledAssets = [
  { name: "logo.svg", type: "image", note: "Primary brand mark" },
  { name: "og-image.png", type: "image", note: "Social share card (1200×630)" },
  { name: "og-image.svg", type: "image", note: "Vector source for the share card" },
  { name: "manifest.webmanifest", type: "document", note: "Install metadata" },
];

export function MediaLibraryPanel() {
  return (
    <Panel>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Media Library</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Assets served straight from <code className="text-xs">/public</code> and versioned with the site.
        </p>
      </div>

      <Notice>
        Service photography is loaded from the source URLs referenced in the page components, and brand
        assets live in the repository. Uploading new files needs object storage wired to a real table, so
        this panel lists what is actually bundled instead of offering an upload button that goes nowhere.
      </Notice>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl">
        {bundledAssets.map((asset) => (
          <a
            key={asset.name}
            href={`/${asset.name}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl bg-card border border-border p-4 hover:border-electric/40 transition-colors"
          >
            <div className="h-24 rounded-lg bg-muted flex items-center justify-center mb-3">
              {asset.type === "image" ? (
                <ImageIcon className="w-8 h-8 text-muted-foreground/40" />
              ) : (
                <FileSearch className="w-8 h-8 text-muted-foreground/40" />
              )}
            </div>
            <p className="text-xs font-medium text-foreground truncate flex items-center gap-1">
              {asset.name}
              <ExternalLink className="w-3 h-3 text-muted-foreground" />
            </p>
            <p className="text-[10px] text-muted-foreground mt-1">{asset.note}</p>
          </a>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-5xl">
        {[
          { icon: Shield, label: "Brand assets", value: "/public" },
          { icon: Globe, label: "Served from", value: window.location.host },
          { icon: Gauge, label: "Formats", value: "SVG · PNG · WebP" },
        ].map((item) => (
          <div key={item.label} className="rounded-xl bg-card border border-border p-4">
            <item.icon className="w-4 h-4 text-electric mb-2" />
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{item.label}</p>
            <p className="text-sm font-medium text-foreground truncate">{item.value}</p>
          </div>
        ))}
      </div>
    </Panel>
  );
}
