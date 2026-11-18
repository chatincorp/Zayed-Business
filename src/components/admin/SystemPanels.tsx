import { motion } from "framer-motion";
import {
  CheckCircle2, AlertTriangle, XCircle, Shield, Eye,
  Globe, TrendingUp, FileSearch, Gauge,
  Zap, Settings, Image, Upload, Trash2,
} from "lucide-react";

/* ── System Health ───────────────────────────────────────────── */

const healthServices = [
  { name: "Website", status: "operational", latency: "45ms", uptime: "99.98%" },
  { name: "Database (Convex)", status: "operational", latency: "12ms", uptime: "99.99%" },
  { name: "Email Service", status: "operational", latency: "230ms", uptime: "99.95%" },
  { name: "File Storage", status: "operational", latency: "89ms", uptime: "99.97%" },
  { name: "AI Services", status: "operational", latency: "1.2s", uptime: "99.90%" },
  { name: "CDN", status: "operational", latency: "8ms", uptime: "100%" },
  { name: "YASIR VERIFY", status: "operational", latency: "34ms", uptime: "99.96%" },
  { name: "Domain DNS", status: "operational", latency: "—", uptime: "100%" },
];

const statusDot = { operational: "bg-emerald-500", degraded: "bg-amber-500", down: "bg-red-500" };

export function SystemHealthPanel() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">System Health</h1>
        <p className="text-muted-foreground text-sm mt-1">All services operational. Last checked: just now.</p>
      </div>
      <div className="rounded-xl bg-card border border-border divide-y divide-border">
        {healthServices.map((s) => (
          <div key={s.name} className="flex items-center justify-between px-5 py-3.5">
            <div className="flex items-center gap-3">
              <span className={`w-2 h-2 rounded-full ${statusDot[s.status as keyof typeof statusDot]}`} />
              <span className="text-sm font-medium text-foreground">{s.name}</span>
            </div>
            <div className="flex items-center gap-6 text-xs text-muted-foreground">
              <span>Latency: {s.latency}</span>
              <span>Uptime: {s.uptime}</span>
              <span className="text-emerald-500 font-medium capitalize">{s.status}</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ── Security Logs ───────────────────────────────────────────── */

const securityLogs = [
  { id: "1", type: "pass", message: "YASIR VERIFY passed — James Mwangi (Kenya)", time: "2 min ago", ip: "41.89.xx.xx" },
  { id: "2", type: "block", message: "Bot activity blocked — automated scraping detected", time: "15 min ago", ip: "185.220.xx.xx" },
  { id: "3", type: "pass", message: "Login successful — Admin user", time: "1 hour ago", ip: "41.89.xx.xx" },
  { id: "4", type: "warn", message: "Rate limit triggered — /api/contact (12 requests/min)", time: "2 hours ago", ip: "102.89.xx.xx" },
  { id: "5", type: "pass", message: "YASIR VERIFY passed — Sarah Williams (UK)", time: "3 hours ago", ip: "82.132.xx.xx" },
  { id: "6", type: "block", message: "Blocked — suspicious form submission (spam keywords)", time: "4 hours ago", ip: "196.216.xx.xx" },
  { id: "7", type: "pass", message: "Payment verified — Paystack (NGN 150,000)", time: "5 hours ago", ip: "41.204.xx.xx" },
];

const logIcons = { pass: CheckCircle2, warn: AlertTriangle, block: XCircle };
const logColors = { pass: "text-emerald-500", warn: "text-amber-500", block: "text-red-500" };

export function SecurityLogsPanel() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Security Logs</h1>
        <p className="text-muted-foreground text-sm mt-1">YASIR VERIFY activity, rate limiting, and blocked requests.</p>
      </div>
      <div className="rounded-xl bg-card border border-border divide-y divide-border">
        {securityLogs.map((log) => {
          const Icon = logIcons[log.type as keyof typeof logIcons];
          return (
            <div key={log.id} className="flex items-start gap-3 px-5 py-3.5">
              <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${logColors[log.type as keyof typeof logColors]}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">{log.message}</p>
                <div className="flex items-center gap-3 mt-1 text-[10px] text-muted-foreground">
                  <span>{log.time}</span>
                  <span>{log.ip}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

/* ── Integrations Panel ──────────────────────────────────────── */

const integrations = [
  { name: "Convex", description: "Backend database and serverless functions", status: "connected", icon: Zap, color: "text-violet-500" },
  { name: "Paystack", description: "Payment processing for Kenya, Nigeria, Ghana", status: "connected", icon: Zap, color: "text-emerald-500" },
  { name: "WhatsApp Business", description: "Direct messaging integration", status: "connected", icon: Zap, color: "text-emerald-500" },
  { name: "Google Analytics", description: "Website traffic and behavior analytics", status: "not_connected", icon: TrendingUp, color: "text-amber-500" },
  { name: "Mailchimp", description: "Email marketing and newsletter automation", status: "not_connected", icon: Settings, color: "text-muted-foreground" },
  { name: "OpenAI", description: "AI content generation and chatbot power", status: "connected", icon: Zap, color: "text-emerald-500" },
  { name: "Cloudflare", description: "CDN, DDoS protection, and DNS management", status: "connected", icon: Shield, color: "text-emerald-500" },
  { name: "Google Search Console", description: "SEO monitoring and indexing", status: "not_connected", icon: Globe, color: "text-muted-foreground" },
];

export function IntegrationsPanel() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Integrations</h1>
        <p className="text-muted-foreground text-sm mt-1">Connect and manage third-party services.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrations.map((int) => (
          <div key={int.name} className="p-5 rounded-xl bg-card border border-border hover:border-border/80 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center ${int.color}`}><int.icon className="w-5 h-5" /></div>
              <div>
                <p className="text-sm font-semibold text-foreground">{int.name}</p>
                <p className="text-[10px] text-muted-foreground">{int.description}</p>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4">
              <span className={`text-xs font-medium ${int.status === "connected" ? "text-emerald-500" : "text-muted-foreground"}`}>
                {int.status === "connected" ? "Connected" : "Not Connected"}
              </span>
              <button className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${int.status === "connected" ? "bg-muted text-foreground hover:bg-muted/80" : "bg-electric text-white hover:bg-electric-dark"}`}>
                {int.status === "connected" ? "Manage" : "Connect"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ── SEO Toolkit ─────────────────────────────────────────────── */

const seoPages = [
  { page: "/", title: "Yasir Zayed — Business Development & Consultancy", score: 92, issues: 1 },
  { page: "/services", title: "Our Services — Business, Technology, Security", score: 88, issues: 3 },
  { page: "/about", title: "About Us — The Zayed Brief", score: 85, issues: 4 },
  { page: "/pricing", title: "Pricing — Packages & Plans", score: 90, issues: 2 },
  { page: "/contact", title: "Contact Us — Get in Touch", score: 95, issues: 0 },
  { page: "/tabloid", title: "Zayed Tabloid — News & Insights", score: 78, issues: 6 },
];

const topKeywords = [
  { keyword: "business development kenya", position: 3, volume: "1.2K", trend: "up" },
  { keyword: "ai chatbot development", position: 8, volume: "2.4K", trend: "up" },
  { keyword: "digital transformation africa", position: 5, volume: "890", trend: "up" },
  { keyword: "cctv installation nairobi", position: 2, volume: "3.1K", trend: "stable" },
  { keyword: "wordpress development kenya", position: 12, volume: "1.8K", trend: "up" },
  { keyword: "security solutions kenya", position: 4, volume: "950", trend: "up" },
];

export function SEOToolkitPanel() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">SEO Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Page scores, keyword rankings, and technical SEO health.</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Avg. Score", value: "88", icon: Gauge, color: "text-emerald-500" },
          { label: "Keywords Tracked", value: "6", icon: TrendingUp, color: "text-electric" },
          { label: "Pages Indexed", value: "14", icon: Globe, color: "text-violet-500" },
          { label: "Total Issues", value: "16", icon: AlertTriangle, color: "text-amber-500" },
        ].map((s) => (
          <div key={s.label} className="p-4 rounded-xl bg-card border border-border">
            <s.icon className={`w-4 h-4 mb-2 ${s.color}`} />
            <p className="text-xl font-bold text-foreground">{s.value}</p>
            <p className="text-[10px] text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Page SEO scores */}
        <div className="rounded-xl bg-card border border-border p-5">
          <h3 className="font-semibold text-foreground text-sm mb-4">Page SEO Scores</h3>
          <div className="space-y-3">
            {seoPages.map((p) => (
              <div key={p.page} className="flex items-center gap-3">
                <span className="text-sm text-foreground font-mono w-24 truncate">{p.page}</span>
                <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                  <div className={`h-full rounded-full ${p.score >= 90 ? "bg-emerald-500" : p.score >= 80 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${p.score}%` }} />
                </div>
                <span className={`text-xs font-bold ${p.score >= 90 ? "text-emerald-500" : p.score >= 80 ? "text-amber-500" : "text-red-500"}`}>{p.score}</span>
                {p.issues > 0 && <span className="text-[10px] text-amber-500">{p.issues} issues</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Top Keywords */}
        <div className="rounded-xl bg-card border border-border p-5">
          <h3 className="font-semibold text-foreground text-sm mb-4">Keyword Rankings</h3>
          <div className="space-y-3">
            {topKeywords.map((k) => (
              <div key={k.keyword} className="flex items-center gap-3">
                <span className="text-xs font-bold text-electric w-8 text-center">#{k.position}</span>
                <span className="text-sm text-foreground flex-1 truncate">{k.keyword}</span>
                <span className="text-[10px] text-muted-foreground w-12 text-right">{k.volume}/mo</span>
                <TrendingUp className={`w-3 h-3 ${k.trend === "up" ? "text-emerald-500" : k.trend === "down" ? "text-red-500" : "text-muted-foreground"}`} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Media Library ───────────────────────────────────────────── */

const mockMedia = [
  { id: "1", name: "hero-bg.jpg", type: "image", size: "2.4 MB", uploaded: "2026-08-28", color: "bg-electric/10" },
  { id: "2", name: "logo-white.svg", type: "image", size: "12 KB", uploaded: "2026-08-20", color: "bg-emerald-500/10" },
  { id: "3", name: "team-photo.jpg", type: "image", size: "1.8 MB", uploaded: "2026-08-15", color: "bg-violet-500/10" },
  { id: "4", name: "brochure-2026.pdf", type: "document", size: "4.2 MB", uploaded: "2026-08-10", color: "bg-amber-500/10" },
  { id: "5", name: "partner-dahua.png", type: "image", size: "224 KB", uploaded: "2026-09-01", color: "bg-electric/10" },
  { id: "6", name: "partner-openai.png", type: "image", size: "9.7 KB", uploaded: "2026-09-01", color: "bg-emerald-500/10" },
  { id: "7", name: "case-study-report.pdf", type: "document", size: "1.1 MB", uploaded: "2026-08-05", color: "bg-amber-500/10" },
  { id: "8", name: "testimonial-video.mp4", type: "video", size: "18.3 MB", uploaded: "2026-07-28", color: "bg-rose-500/10" },
];

export function MediaLibraryPanel() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Media Library</h1>
          <p className="text-muted-foreground text-sm mt-1">{mockMedia.length} files uploaded</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-electric text-white rounded-lg text-sm font-medium hover:bg-electric-dark transition-colors">
          <Upload className="w-4 h-4" /> Upload File
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {mockMedia.map((file) => (
          <div key={file.id} className="group rounded-xl bg-card border border-border overflow-hidden hover:border-electric/30 transition-all">
            <div className={`h-32 ${file.color} flex items-center justify-center`}>
              {file.type === "image" ? <Image className="w-10 h-10 text-muted-foreground/30" /> :
               file.type === "video" ? <Eye className="w-10 h-10 text-muted-foreground/30" /> :
               <FileSearch className="w-10 h-10 text-muted-foreground/30" />}
            </div>
            <div className="p-3">
              <p className="text-xs font-medium text-foreground truncate">{file.name}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[10px] text-muted-foreground">{file.size}</span>
                <span className="text-[10px] text-muted-foreground">{file.uploaded}</span>
              </div>
            </div>
            <div className="px-3 pb-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="flex-1 px-2 py-1 rounded text-[10px] bg-muted text-foreground hover:bg-muted/80">View</button>
              <button className="px-2 py-1 rounded text-[10px] bg-destructive/10 text-destructive hover:bg-destructive/20"><Trash2 className="w-3 h-3" /></button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
