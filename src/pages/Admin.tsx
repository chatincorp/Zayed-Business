/* eslint-disable @typescript-eslint/no-explicit-any -- Admin panel uses intentional type-unsafe casts for demo select values */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import ServicesManager from "@/components/admin/ServicesManager";
import LeadsTable from "@/components/admin/LeadsTable";
import TestimonialsManager from "@/components/admin/TestimonialsManager";
import FAQManager from "@/components/admin/FAQManager";
import BlogManager from "@/components/admin/BlogManager";
import AnalyticsDashboard from "@/components/admin/AnalyticsDashboard";
import UsersManager from "@/components/admin/UsersManager";
import { SystemHealthPanel, SecurityLogsPanel, IntegrationsPanel, SEOToolkitPanel, MediaLibraryPanel } from "@/components/admin/SystemPanels";
import {
  LayoutDashboard,
  FileText,
  Layers,
  Shield,
  Cpu,
  Users,
  Settings,
  BarChart3,
  Globe,
  MessageSquare,
  Image,
  Search,
  Bell,
  ChevronDown,
  ChevronRight,
  Home,
  Navigation,
  Handshake,
  Target,
  Megaphone,
  Tag,
  Mail,
  TrendingUp,
  BookOpen,
  Bot,
  Lock,
  AlertTriangle,
  Zap,
  Plus,
  Calendar,
  HelpCircle,
  FileSearch,
  Map,
  Gauge,
} from "lucide-react";

const sidebarSections = [
  {
    label: "MAIN",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
    ],
  },
  {
    label: "WEBSITE",
    items: [
      { icon: Home, label: "Homepage", id: "homepage" },
      { icon: FileText, label: "Pages", id: "pages" },
      { icon: Layers, label: "Landing Pages", id: "landing-pages" },
      { icon: Navigation, label: "Navigation", id: "navigation" },
      { icon: Target, label: "Services", id: "services" },
      { icon: Globe, label: "Industries", id: "industries" },
      { icon: Shield, label: "Security Solutions", id: "security" },
      { icon: Cpu, label: "Technology", id: "technology" },
      { icon: Bot, label: "AI Solutions", id: "ai" },
      { icon: Handshake, label: "Partners", id: "partners" },
      { icon: MessageSquare, label: "Testimonials", id: "testimonials" },
      { icon: HelpCircle, label: "FAQ", id: "faq" },
    ],
  },
  {
    label: "CONTENT",
    items: [
      { icon: BookOpen, label: "Zayed Tabloid", id: "tabloid" },
      { icon: FileText, label: "Blog / Insights", id: "blog" },
      { icon: Image, label: "Media Library", id: "media" },
      { icon: Layers, label: "Reusable Blocks", id: "blocks" },
    ],
  },
  {
    label: "MARKETING",
    items: [
      { icon: Users, label: "Leads", id: "leads" },
      { icon: MessageSquare, label: "Contact Forms", id: "forms" },
      { icon: Megaphone, label: "Campaigns", id: "campaigns" },
      { icon: Tag, label: "CTAs", id: "ctas" },
      { icon: Mail, label: "Email Templates", id: "email-templates" },
      { icon: BarChart3, label: "Analytics", id: "analytics" },
    ],
  },
  {
    label: "SEO",
    items: [
      { icon: TrendingUp, label: "SEO Dashboard", id: "seo-dashboard" },
      { icon: FileSearch, label: "Page SEO", id: "page-seo" },
      { icon: Search, label: "Keywords", id: "keywords" },
      { icon: Map, label: "Regional SEO", id: "regional-seo" },
      { icon: Gauge, label: "Technical SEO", id: "technical-seo" },
    ],
  },
  {
    label: "AI",
    items: [
      { icon: Bot, label: "AI Assistant", id: "ai-assistant" },
      { icon: FileText, label: "Content Generator", id: "content-gen" },
      { icon: Layers, label: "Page Generator", id: "page-gen" },
      { icon: Search, label: "SEO Assistant", id: "seo-assistant" },
      { icon: BookOpen, label: "Tabloid Rewriter", id: "tabloid-rewriter" },
      { icon: Settings, label: "AI Settings", id: "ai-settings" },
    ],
  },
  {
    label: "SECURITY",
    items: [
      { icon: Shield, label: "YASIR VERIFY™", id: "yasir-verify" },
      { icon: FileText, label: "Security Logs", id: "security-logs" },
      { icon: Lock, label: "Rate Limiting", id: "rate-limiting" },
      { icon: AlertTriangle, label: "Blocked Activity", id: "blocked" },
    ],
  },
  {
    label: "CLIENTS",
    items: [
      { icon: Layers, label: "Projects", id: "projects" },
    ],
  },
  {
    label: "SYSTEM",
    items: [
      { icon: Users, label: "Users", id: "users" },
      { icon: Shield, label: "Roles & Permissions", id: "roles" },
      { icon: FileText, label: "Audit Logs", id: "audit-logs" },
      { icon: Settings, label: "Global Settings", id: "global-settings" },
      { icon: Mail, label: "Email Configuration", id: "email-config" },
      { icon: Zap, label: "Integrations", id: "integrations" },
      { icon: Gauge, label: "System Health", id: "system-health" },
    ],
  },
];

const quickActions = [
  { label: "New Page", icon: FileText, color: "electric" },
  { label: "New Service", icon: Target, color: "emerald-500" },
  { label: "New Article", icon: BookOpen, color: "violet-500" },
  { label: "New Partner", icon: Handshake, color: "blue-500" },
  { label: "New Landing Page", icon: Layers, color: "amber-500" },
  { label: "New CTA", icon: Tag, color: "rose-500" },
];

const kpiCards = [
  { label: "Total Leads", value: "—", change: "", color: "electric" },
  { label: "Verified Leads", value: "—", change: "", color: "emerald-500" },
  { label: "Appointments", value: "—", change: "", color: "blue-500" },
  { label: "Meeting Requests", value: "—", change: "", color: "violet-500" },
  { label: "Quotation Requests", value: "—", change: "", color: "amber-500" },
  { label: "Conversion Rate", value: "—", change: "", color: "rose-500" },
];

export default function Admin() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-30 bg-navy-dark border-r border-white/5 transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-16"
        } hidden lg:block`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-electric to-electric-dark flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-xs">YZ</span>
            </div>
            {sidebarOpen && (
              <div>
                <span className="text-white font-bold text-xs tracking-tight block leading-none">
                  YASIR ZAYED
                </span>
                <span className="text-[9px] text-white/40 uppercase tracking-wider">Admin</span>
              </div>
            )}
          </div>
        </div>

        {/* Nav items */}
        <nav className="h-[calc(100vh-64px)] overflow-y-auto py-4 px-2 scrollbar-thin">
          {sidebarSections.map((section) => (
            <div key={section.label} className="mb-4">
              {sidebarOpen && (
                <p className="px-3 mb-1.5 text-[10px] font-semibold text-white/30 uppercase tracking-widest">
                  {section.label}
                </p>
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 ${
                      activeSection === item.id
                        ? "bg-electric/10 text-electric"
                        : "text-white/50 hover:text-white/80 hover:bg-white/5"
                    }`}
                    title={item.label}
                  >
                    <item.icon className="w-4 h-4 shrink-0" />
                    {sidebarOpen && <span>{item.label}</span>}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute top-20 -right-3 w-6 h-6 rounded-full bg-navy-dark border border-white/10 flex items-center justify-center text-white/40 hover:text-white/80 transition-colors"
        >
          {sidebarOpen ? <ChevronRight className="w-3 h-3" /> : <ChevronRight className="w-3 h-3 rotate-180" />}
        </button>
      </aside>

      {/* Main content area */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? "lg:ml-64" : "lg:ml-16"}`}>
        {/* Top header */}
        <header className="sticky top-0 z-20 h-16 bg-card/80 backdrop-blur-xl border-b border-border flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search everything… (⌘K)"
                className="w-72 pl-9 pr-4 py-2 rounded-lg bg-muted text-foreground text-sm placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-electric/20"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-electric rounded-full" />
            </button>

            <button className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-muted transition-colors">
              <div className="w-8 h-8 rounded-full bg-electric/20 flex items-center justify-center">
                <span className="text-electric text-xs font-bold">A</span>
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-foreground text-xs font-medium">Admin</p>
                <p className="text-muted-foreground text-[10px]">Super Admin</p>
              </div>
              <ChevronDown className="w-3 h-3 text-muted-foreground hidden sm:block" />
            </button>
          </div>
        </header>

        {/* Dashboard content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {activeSection === "dashboard" && <DashboardContent key="dashboard" />}
            {activeSection === "services" && <ServicesManager key="services" />}
            {activeSection === "leads" && <LeadsTable key="leads" />}
            {activeSection === "testimonials" && <TestimonialsManager key="testimonials" />}
            {activeSection === "faq" && <FAQManager key="faq" />}
            {activeSection === "blog" && <BlogManager key="blog" />}
            {activeSection === "analytics" && <AnalyticsDashboard key="analytics" />}
            {activeSection === "users" && <UsersManager key="users" />}
            {activeSection === "system-health" && <SystemHealthPanel key="system-health" />}
            {activeSection === "security-logs" && <SecurityLogsPanel key="security-logs" />}
            {activeSection === "integrations" && <IntegrationsPanel key="integrations" />}
            {(activeSection === "seo-dashboard" || activeSection === "page-seo" || activeSection === "keywords" || activeSection === "regional-seo" || activeSection === "technical-seo") && <SEOToolkitPanel key="seo" />}
            {activeSection === "media" && <MediaLibraryPanel key="media" />}
            {activeSection === "global-settings" && <GlobalSettingsContent key="settings" />}
            {activeSection === "projects" && <AdminProjectsContent key="projects" />}
            {!["dashboard", "services", "leads", "testimonials", "faq", "blog", "analytics", "users", "system-health", "security-logs", "integrations", "seo-dashboard", "page-seo", "keywords", "regional-seo", "technical-seo", "media", "global-settings", "projects"].includes(activeSection) && (
              <PlaceholderContent key={activeSection} title={sidebarSections.flatMap(s => s.items).find(i => i.id === activeSection)?.label || activeSection} description="Content management for this section." />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function DashboardContent() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Welcome back. Here's what's happening.</p>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2 mb-8">
        {quickActions.map((action) => (
          <button
            key={action.label}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border hover:border-border/80 hover:shadow-sm transition-all text-sm font-medium text-foreground"
          >
            <Plus className="w-3.5 h-3.5 text-muted-foreground" />
            {action.label}
          </button>
        ))}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {kpiCards.map((kpi) => (
          <div key={kpi.label} className="p-4 rounded-xl bg-card border border-border">
            <p className="text-muted-foreground text-xs font-medium mb-2">{kpi.label}</p>
            <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Dashboard widgets grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Leads */}
        <div className="rounded-xl bg-card border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground text-sm">Recent Leads</h3>
            <button className="text-electric text-xs font-medium hover:underline">View All</button>
          </div>
          <div className="text-center py-8">
            <Users className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-muted-foreground text-sm">No leads yet.</p>
            <p className="text-muted-foreground/60 text-xs mt-1">Leads will appear here once contact forms are submitted.</p>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="rounded-xl bg-card border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground text-sm">Upcoming Appointments</h3>
            <button className="text-electric text-xs font-medium hover:underline">View All</button>
          </div>
          <div className="text-center py-8">
            <Calendar className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-muted-foreground text-sm">No appointments scheduled.</p>
          </div>
        </div>

        {/* Recent Quotations */}
        <div className="rounded-xl bg-card border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground text-sm">Recent Quotation Requests</h3>
            <button className="text-electric text-xs font-medium hover:underline">View All</button>
          </div>
          <div className="text-center py-8">
            <FileText className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-muted-foreground text-sm">No quotation requests yet.</p>
          </div>
        </div>

        {/* YASIR VERIFY™ */}
        <div className="rounded-xl bg-card border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground text-sm">YASIR VERIFY™ Security</h3>
            <button className="text-electric text-xs font-medium hover:underline">View Dashboard</button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <p className="text-lg font-bold text-foreground">—</p>
              <p className="text-xs text-muted-foreground">Passed</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <p className="text-lg font-bold text-foreground">—</p>
              <p className="text-xs text-muted-foreground">Failed</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <p className="text-lg font-bold text-foreground">—</p>
              <p className="text-xs text-muted-foreground">Blocked</p>
            </div>
          </div>
        </div>

        {/* Content Status */}
        <div className="rounded-xl bg-card border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground text-sm">Content Status</h3>
            <button className="text-electric text-xs font-medium hover:underline">View Pages</button>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/50">
              <span className="text-sm text-foreground">Draft Pages</span>
              <span className="text-sm font-medium text-foreground">0</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/50">
              <span className="text-sm text-foreground">Scheduled Articles</span>
              <span className="text-sm font-medium text-foreground">0</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/50">
              <span className="text-sm text-foreground">Pending Reviews</span>
              <span className="text-sm font-medium text-foreground">0</span>
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="rounded-xl bg-card border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground text-sm">System Health</h3>
            <span className="text-xs font-medium text-emerald-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              All Systems Operational
            </span>
          </div>
          <div className="space-y-2">
            {["Website", "Database", "Email", "Storage", "AI Services"].map((item) => (
              <div key={item} className="flex items-center justify-between py-1.5">
                <span className="text-sm text-foreground">{item}</span>
                <span className="text-xs font-medium text-emerald-500 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Operational
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function PlaceholderContent({ title, description }: { title: string; description: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        <p className="text-muted-foreground text-sm mt-1">{description}</p>
      </div>

      <div className="rounded-xl bg-card border border-border p-12 text-center">
        <div className="w-16 h-16 mx-auto rounded-xl bg-muted flex items-center justify-center mb-4">
          <Layers className="w-7 h-7 text-muted-foreground/40" />
        </div>
        <h3 className="font-semibold text-foreground mb-2">Coming Soon</h3>
        <p className="text-muted-foreground text-sm max-w-sm mx-auto">
          This section will be connected to the Convex backend for full content management capabilities.
        </p>
      </div>
    </motion.div>
  );
}

function GlobalSettingsContent() {
  const [brandName, setBrandName] = useState("YASIR ZAYED");
  const [nameStyle, setNameStyle] = useState("uppercase");
  const [tagline, setTagline] = useState("Business Development • Consultancy • Security • Technology");
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationBg, setNotificationBg] = useState("electric");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-electric/30 focus:border-electric transition-all";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Global Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Brand, logo, name style, notification bar, and site-wide configuration.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Logo & Brand */}
        <div className="rounded-xl bg-card border border-border p-6">
          <h3 className="font-semibold text-foreground text-sm mb-4">Logo & Brand Identity</h3>
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 rounded-xl bg-muted flex items-center justify-center border-2 border-dashed border-border overflow-hidden shrink-0">
              {logoPreview ? (
                <img src={logoPreview} alt="Logo" className="w-full h-full object-contain" />
              ) : (
                <Image className="w-7 h-7 text-muted-foreground/30" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-muted-foreground text-xs mb-2">Upload your company logo (PNG, SVG, or JPG)</p>
              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted text-foreground text-sm font-medium cursor-pointer hover:bg-muted/80 transition-colors">
                <Plus className="w-3.5 h-3.5" />
                Choose File
                <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
              </label>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Brand Name</label>
              <input type="text" value={brandName} onChange={(e) => setBrandName(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Tagline</label>
              <input type="text" value={tagline} onChange={(e) => setTagline(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Name Display Style</label>
              <select value={nameStyle} onChange={(e) => setNameStyle(e.target.value)} className={inputClass}>
                <option value="uppercase">UPPERCASE — YASIR ZAYED</option>
                <option value="titlecase">Title Case — Yasir Zayed</option>
                <option value="lowercase">lowercase — yasir zayed</option>
                <option value="bold">Bold Caps — <strong>YASIR ZAYED</strong></option>
                <option value="light">Light Weight — <em>Yasir Zayed</em></option>
              </select>
            </div>
          </div>

          {/* Preview */}
          <div className="mt-6 p-4 rounded-xl bg-navy-dark flex items-center gap-3">
            {logoPreview && <img src={logoPreview} alt="Logo" className="w-8 h-8 rounded object-contain" />}
            <div>
              <span className="text-white font-bold text-sm" style={{
                textTransform: nameStyle === "uppercase" ? "uppercase" : nameStyle === "lowercase" ? "lowercase" : "none",
                fontWeight: nameStyle === "bold" ? 900 : nameStyle === "light" ? 300 : 700,
                letterSpacing: nameStyle === "bold" ? "0.1em" : "normal",
              }}>
                {brandName}
              </span>
              <p className="text-white/40 text-[10px]">{tagline}</p>
            </div>
          </div>
        </div>

        {/* Notification Bar */}
        <div className="rounded-xl bg-card border border-border p-6">
          <h3 className="font-semibold text-foreground text-sm mb-4">Promotional Notification Bar</h3>
          <p className="text-muted-foreground text-xs mb-4">Display a site-wide promotional banner at the top of the website.</p>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">Enable Notification Bar</label>
              <div
                onClick={() => setNotificationEnabled(!notificationEnabled)}
                className={`w-11 h-6 rounded-full transition-all cursor-pointer relative ${
                  notificationEnabled ? "bg-electric" : "bg-muted border border-border"
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-sm absolute top-0.5 transition-all ${
                  notificationEnabled ? "left-[22px]" : "left-0.5"
                }`} />
              </div>
            </div>

            {notificationEnabled && (
              <>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Promotional Message</label>
                  <textarea
                    rows={3}
                    value={notificationMessage}
                    onChange={(e) => setNotificationMessage(e.target.value)}
                    className={`${inputClass} resize-none`}
                    placeholder="e.g., 🎉 New: AI-Powered Business Intelligence — 20% off for early adopters"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Banner Color</label>
                  <select value={notificationBg} onChange={(e) => setNotificationBg(e.target.value)} className={inputClass}>
                    <option value="electric">Electric Blue</option>
                    <option value="emerald">Emerald Green</option>
                    <option value="violet">Violet</option>
                    <option value="amber">Amber/Gold</option>
                    <option value="rose">Rose</option>
                    <option value="navy">Navy (Default)</option>
                  </select>
                </div>
              </>
            )}
          </div>

          {/* Preview */}
          <div className="mt-6 rounded-xl overflow-hidden border border-border">
            <div className={`px-4 py-2 text-center text-xs font-medium ${
              !notificationEnabled ? "bg-muted text-muted-foreground" :
              notificationBg === "electric" ? "bg-electric text-white" :
              notificationBg === "emerald" ? "bg-emerald-500 text-white" :
              notificationBg === "violet" ? "bg-violet-500 text-white" :
              notificationBg === "amber" ? "bg-amber-500 text-white" :
              notificationBg === "rose" ? "bg-rose-500 text-white" :
              "bg-navy text-white"
            }`}>
              {notificationEnabled && notificationMessage
                ? notificationMessage
                : notificationEnabled
                ? "Your promotional message will appear here"
                : "Notification bar is disabled"
              }
            </div>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-muted/50">
            <p className="text-muted-foreground text-xs leading-relaxed">
              The notification bar is displayed at the very top of the website. Use it for promotions, announcements, event reminders, seasonal offers or urgent notices.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function AdminProjectsContent() {
  const projects = useQuery(api.projects.list);
  const createProject = useMutation(api.projects.create);
  const updateProject = useMutation(api.projects.update);
  const deleteProject = useMutation(api.projects.remove);
  const addTracking = useMutation(api.projects.addTracking);
  const addDeliverable = useMutation(api.projects.addDeliverable);

  const [showCreate, setShowCreate] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newType, setNewType] = useState<"completed" | "phased">("completed");
  const [newStatus, setNewStatus] = useState<"planning" | "in_progress" | "review" | "completed" | "delivered" | "on_hold">("planning");
  const [trackingTitle, setTrackingTitle] = useState("");
  const [trackingDesc, setTrackingDesc] = useState("");
  const [trackingStatus, setTrackingStatus] = useState<"info" | "update" | "success" | "warning">("info");
  const [deliverableName, setDeliverableName] = useState("");
  const [deliverableUrl, setDeliverableUrl] = useState("");

  const STATUS_COLORS_ADMIN: Record<string, string> = {
    planning: "bg-slate-500/10 text-slate-400",
    in_progress: "bg-blue-500/10 text-blue-400",
    review: "bg-amber-500/10 text-amber-400",
    completed: "bg-emerald-500/10 text-emerald-400",
    delivered: "bg-electric/10 text-electric",
    on_hold: "bg-red-500/10 text-red-400",
  };

  const selected = projects?.find((p) => p._id === selectedId);

  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    // For demo, use first user as client

    await createProject({
      clientId: "" as any, // demo placeholder
      title: newTitle,
      description: newDesc || undefined,
      status: newStatus,
      projectType: newType,
    });
    setShowCreate(false);
    setNewTitle("");
    setNewDesc("");
  };

  const handleAddTracking = async () => {
    if (!selectedId || !trackingTitle.trim()) return;
    await addTracking({
      projectId: selectedId as any,
      title: trackingTitle,
      description: trackingDesc || undefined,
      status: trackingStatus,
      author: "Admin",
    });
    setTrackingTitle("");
    setTrackingDesc("");
  };

  const handleAddDeliverable = async () => {
    if (!selectedId || !deliverableName.trim()) return;
    await addDeliverable({
      projectId: selectedId as any,
      name: deliverableName,
      fileUrl: deliverableUrl || undefined,
    });
    setDeliverableName("");
    setDeliverableUrl("");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Project Management</h2>
          <p className="text-sm text-muted-foreground">Manage client projects, deliverables, and tracking updates.</p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-2 px-4 py-2 bg-electric text-white rounded-lg text-sm font-medium hover:bg-electric-dark transition-colors"
        >
          <Plus className="w-4 h-4" /> New Project
        </button>
      </div>

      {showCreate && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-5 rounded-xl border bg-card space-y-4">
          <h3 className="font-semibold text-sm">Create New Project</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input placeholder="Project title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="px-3 py-2 rounded-lg border bg-background text-sm" />
            <input placeholder="Description (optional)" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} className="px-3 py-2 rounded-lg border bg-background text-sm" />
            <select value={newType} onChange={(e) => setNewType(e.target.value as any)} className="px-3 py-2 rounded-lg border bg-background text-sm">
              <option value="completed">Completed (single delivery)</option>
              <option value="phased">Phased (multi-phase, free downloads)</option>
            </select>
            <select value={newStatus} onChange={(e) => setNewStatus(e.target.value as any)} className="px-3 py-2 rounded-lg border bg-background text-sm">
              <option value="planning">Planning</option>
              <option value="in_progress">In Progress</option>
              <option value="review">Review</option>
              <option value="completed">Completed</option>
              <option value="delivered">Delivered</option>
              <option value="on_hold">On Hold</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button onClick={handleCreate} className="px-4 py-2 bg-electric text-white rounded-lg text-sm font-medium hover:bg-electric-dark">Create</button>
            <button onClick={() => setShowCreate(false)} className="px-4 py-2 border rounded-lg text-sm">Cancel</button>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project List */}
        <div className="lg:col-span-1 space-y-2 max-h-[600px] overflow-y-auto">
          {projects === undefined ? (
            <p className="text-muted-foreground text-sm">Loading…</p>
          ) : projects.length === 0 ? (
            <p className="text-muted-foreground text-sm py-8 text-center">No projects yet. Create one to get started.</p>
          ) : (
            projects.map((p) => (
              <button
                key={p._id}
                onClick={() => setSelectedId(p._id)}
                className={`w-full text-left p-4 rounded-lg border transition-all ${selectedId === p._id ? "border-electric bg-electric/5" : "hover:border-border/80"}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm truncate">{p.title}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${STATUS_COLORS_ADMIN[p.status]}`}>{p.status.replace("_", " ")}</span>
                </div>
                <p className="text-xs text-muted-foreground">{p.projectType === "phased" ? "Multi-phase" : "Single delivery"} · {(p.deliverables ?? []).length} files</p>
              </button>
            ))
          )}
        </div>

        {/* Project Detail */}
        <div className="lg:col-span-2">
          {!selected ? (
            <div className="text-center py-20 text-muted-foreground text-sm">Select a project to view details.</div>
          ) : (
            <div className="space-y-5">
              <div className="p-5 rounded-xl border bg-card">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-lg">{selected.title}</h3>
                  <div className="flex items-center gap-2">
                    <select
                      value={selected.status}
                      onChange={(e) => updateProject({ projectId: selected._id, status: e.target.value as any })}
                      className="px-3 py-1.5 rounded-lg border bg-background text-xs"
                    >
                      {["planning", "in_progress", "review", "completed", "delivered", "on_hold"].map((s) => (
                        <option key={s} value={s}>{s.replace("_", " ")}</option>
                      ))}
                    </select>
                    <select
                      value={selected.projectType}
                      onChange={(e) => updateProject({ projectId: selected._id, projectType: e.target.value as any })}
                      className="px-3 py-1.5 rounded-lg border bg-background text-xs"
                    >
                      <option value="completed">Completed</option>
                      <option value="phased">Phased</option>
                    </select>
                  </div>
                </div>
                {selected.description && <p className="text-sm text-muted-foreground mb-3">{selected.description}</p>}
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span>Client: {selected.clientId}</span>
                  <span>·</span>
                  <span>{(selected.deliverables ?? []).length} deliverables</span>
                  <span>·</span>
                  <span>{(selected.tracking ?? []).length} tracking updates</span>
                </div>
              </div>

              {/* Add Tracking */}
              <div className="p-5 rounded-xl border bg-card">
                <h4 className="font-semibold text-sm mb-3">Add Tracking Update</h4>
                <div className="flex flex-col sm:flex-row gap-2 mb-3">
                  <input placeholder="Title" value={trackingTitle} onChange={(e) => setTrackingTitle(e.target.value)} className="flex-1 px-3 py-2 rounded-lg border bg-background text-sm" />
                  <select value={trackingStatus} onChange={(e) => setTrackingStatus(e.target.value as any)} className="px-3 py-2 rounded-lg border bg-background text-sm">
                    <option value="info">Info</option>
                    <option value="update">Update</option>
                    <option value="success">Success</option>
                    <option value="warning">Warning</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <input placeholder="Description (optional)" value={trackingDesc} onChange={(e) => setTrackingDesc(e.target.value)} className="flex-1 px-3 py-2 rounded-lg border bg-background text-sm" />
                  <button onClick={handleAddTracking} className="px-4 py-2 bg-electric text-white rounded-lg text-sm font-medium hover:bg-electric-dark">Add</button>
                </div>
              </div>

              {/* Add Deliverable */}
              <div className="p-5 rounded-xl border bg-card">
                <h4 className="font-semibold text-sm mb-3">Add Deliverable</h4>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input placeholder="File name" value={deliverableName} onChange={(e) => setDeliverableName(e.target.value)} className="flex-1 px-3 py-2 rounded-lg border bg-background text-sm" />
                  <input placeholder="File URL (optional)" value={deliverableUrl} onChange={(e) => setDeliverableUrl(e.target.value)} className="flex-1 px-3 py-2 rounded-lg border bg-background text-sm" />
                  <button onClick={handleAddDeliverable} className="px-4 py-2 bg-electric text-white rounded-lg text-sm font-medium hover:bg-electric-dark">Upload</button>
                </div>
              </div>

              {/* Tracking Timeline */}
              <div className="p-5 rounded-xl border bg-card">
                <h4 className="font-semibold text-sm mb-3">Tracking Timeline</h4>
                {(selected.tracking ?? []).length === 0 ? (
                  <p className="text-muted-foreground text-xs">No updates yet.</p>
                ) : (
                  <div className="space-y-3">
                    {[...(selected.tracking ?? [])].reverse().map((t) => (
                      <div key={t.id} className="flex gap-3">
                        <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${t.status === "success" ? "bg-emerald-400" : t.status === "warning" ? "bg-amber-400" : t.status === "update" ? "bg-blue-400" : "bg-white/30"}`} />
                        <div>
                          <p className="text-sm font-medium">{t.title}</p>
                          {t.description && <p className="text-xs text-muted-foreground">{t.description}</p>}
                          <p className="text-[10px] text-muted-foreground mt-0.5">{t.author} · {new Date(t.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Deliverables List */}
              <div className="p-5 rounded-xl border bg-card">
                <h4 className="font-semibold text-sm mb-3">Deliverables ({(selected.deliverables ?? []).length})</h4>
                {(selected.deliverables ?? []).length === 0 ? (
                  <p className="text-muted-foreground text-xs">No files uploaded yet.</p>
                ) : (
                  <div className="space-y-2">
                    {(selected.deliverables ?? []).map((d) => (
                      <div key={d.id} className="flex items-center justify-between p-3 rounded-lg bg-background border">
                        <div>
                          <p className="text-sm font-medium">{d.name}</p>
                          <p className="text-xs text-muted-foreground">{d.fileType || "file"} · {new Date(d.uploadedAt).toLocaleDateString()}</p>
                        </div>
                        <button onClick={() => deleteProject({ projectId: selected._id })} className="text-xs text-destructive hover:underline">Delete</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Delete */}
              <button
                onClick={() => { deleteProject({ projectId: selected._id }); setSelectedId(null); }}
                className="text-xs text-destructive hover:underline"
              >
                Delete Project
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
