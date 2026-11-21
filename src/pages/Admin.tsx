/* eslint-disable @typescript-eslint/no-explicit-any -- Admin panel uses intentional type-unsafe casts for demo select values */
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import ServicesManager from "@/components/admin/ServicesManager";
import LeadsTable from "@/components/admin/LeadsTable";
import AnalyticsDashboard from "@/components/admin/AnalyticsDashboard";
import FmcgAdmin from "@/components/admin/FmcgAdmin";
import YasirZayedLogo from "@/components/YasirZayedLogo";
import UsersManager from "@/components/admin/UsersManager";
import RBACPanel from "@/components/admin/RBACPanel";
import { SystemHealthPanel, SecurityLogsPanel, IntegrationsPanel, SEOToolkitPanel, MediaLibraryPanel } from "@/components/admin/SystemPanels";
import { HomepageManagerPanel, AIAssistantPanel, YasirVerifyPanel, CampaignsPanel, EmailTemplatesPanel, CTAsPanel, RateLimitingPanel, BlockedActivityPanel, AuditLogsPanel, AISettingsPanel, GenericAdminPanel } from "@/components/admin/RemainingPanels";
import { PagesPanel, NavigationPanel, LandingPagesPanel, PlansPanel, FaqsPanel, TestimonialsPanel, PartnersPanel, SiteSectionsPanel, CategoryServicesPanel, FormsPanel } from "@/components/admin/ContentPanels";
import InternationalSourcingPanel from "@/pages/InternationalSourcingPanel";
import { HOME_SECTIONS } from "@/lib/siteContent";
import { INTERNATIONAL_SOURCING_SECTORS, INTERNATIONAL_SOURCING_COUNTRIES } from "@/data/internationalSourcing";
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
  ShoppingCart,
  Package,
  Store,
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
      { icon: Settings, label: "Site Sections", id: "site-sections" },
      { icon: Target, label: "Services", id: "services" },
      { icon: ShoppingCart, label: "Checkout", id: "checkout" },
      { icon: Globe, label: "Industries & Sectors", id: "industries" },
      { icon: Globe, label: "Target Countries", id: "countries" },
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
    items: [      { icon: BookOpen, label: "Zayed Tabloid", id: "tabloid" },
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
    label: "FMCG COMMERCE",
    items: [
      { icon: Store, label: "Suppliers", id: "fmcg-suppliers" },
      { icon: Package, label: "Products", id: "fmcg-products" },
      { icon: ShoppingCart, label: "Wholesale Orders", id: "fmcg-orders" },
      { icon: MessageSquare, label: "FMCG Enquiries", id: "fmcg-enquiries" },
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
  { label: "New Page", icon: FileText, color: "electric", section: "pages" },
  { label: "New Staff Account", icon: Users, color: "electric", section: "staff" },
  { label: "New Service", icon: Target, color: "emerald-500", section: "services" },
  { label: "New Article", icon: BookOpen, color: "violet-500", section: "blog" },
  { label: "New Partner", icon: Handshake, color: "blue-500", section: "partners" },
  { label: "New Landing Page", icon: Layers, color: "amber-500", section: "landing-pages" },
  { label: "New CTA", icon: Tag, color: "rose-500", section: "ctas" },
  { label: "New Checkout Plan", icon: ShoppingCart, color: "emerald-500", section: "checkout" },
];

export default function Admin() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const content = useQuery(api.content.adminContent);
  const seedContent = useMutation(api.content.seedDefaults);

  // First run: mirror the bundled website content into Convex so every panel
  // (and the public site) starts populated and editable.
  useEffect(() => {
    if (content && content.pages.length === 0) void seedContent();
  }, [content, seedContent]);

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-30 bg-navy-dark border-r border-white/5 transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-16"
        } hidden lg:block`}
      >
        {/* Logo — links to homepage */}
        <Link to="/" className="h-16 flex items-center px-4 border-b border-white/5 hover:bg-white/5 transition-colors">
          <div className="flex items-center gap-2.5">
            <YasirZayedLogo height={30} className="shrink-0" />
            {sidebarOpen && (
              <div>
                <span className="text-white font-bold text-xs tracking-tight block leading-none">
                  YASIR ZAYED
                </span>
                <span className="text-[9px] text-white/40 uppercase tracking-wider">Admin</span>
              </div>
            )}
          </div>
        </Link>

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
            <Link
              to="/"
              className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              View site
            </Link>
            <div className="flex items-center gap-2 p-1.5">
              <div className="w-8 h-8 rounded-full bg-electric/20 flex items-center justify-center">
                <span className="text-electric text-xs font-bold">A</span>
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-foreground text-xs font-medium">Admin</p>
                <p className="text-muted-foreground text-[10px]">Signed in</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {activeSection === "dashboard" && <DashboardContent key="dashboard" onNavigate={setActiveSection} />}
            {activeSection === "services" && <ServicesManager key="services" />}
            {activeSection === "leads" && <LeadsTable key="leads" />}
            {activeSection === "testimonials" && <TestimonialsPanel key="testimonials" />}
            {activeSection === "faq" && <FaqsPanel key="faq" />}
            {activeSection === "blog" && <GenericAdminPanel title="Blog / Insights" description="No blog module configured for this site." reason={DISABLED_MODULES.blog ?? "No blog module configured."} />}
            {activeSection === "analytics" && <AnalyticsDashboard key="analytics" />}
            {activeSection === "users" && <UsersManager key="users" />}
            {activeSection === "staff" && <RBACPanel key="staff" />}
            {activeSection === "roles" && <RBACPanel key="roles" />}
            {activeSection === "checkout" && <PlansPanel key="checkout" />}
            {activeSection === "pages" && <PagesPanel key="pages" />}
            {activeSection === "navigation" && <NavigationPanel key="navigation" />}
            {activeSection === "landing-pages" && <LandingPagesPanel key="landing-pages" />}
            {activeSection === "site-sections" && <SiteSectionsPanel key="site-sections" />}
            {activeSection === "security" && <CategoryServicesPanel key="security" category="security" title="Security Solutions" subtitle="Security services published on the website." />}
            {activeSection === "technology" && <CategoryServicesPanel key="technology" category="digital" title="Technology" subtitle="Web, platform and technology services published on the website." />}
            {activeSection === "ai" && <CategoryServicesPanel key="ai" category="ai" title="AI Solutions" subtitle="AI and automation services published on the website." />}
            {activeSection === "forms" && <FormsPanel key="forms" />}
            {activeSection === "system-health" && <SystemHealthPanel key="system-health" />}
            {activeSection === "security-logs" && <SecurityLogsPanel key="security-logs" />}
            {activeSection === "integrations" && <IntegrationsPanel key="integrations" />}
            {activeSection === "industries" && <IndustriesPanel key="industries" />}
            {activeSection === "countries" && <CountriesPanel key="countries" />}
            {activeSection === "international-sourcing" && (
              <InternationalSourcingPanel
                key="international-sourcing"
                hosts={INTERNATIONAL_SOURCING_SECTORS}
                countries={INTERNATIONAL_SOURCING_COUNTRIES}
              />
            )}
            {(activeSection === "seo-dashboard" || activeSection === "page-seo" || activeSection === "keywords" || activeSection === "regional-seo" || activeSection === "technical-seo") && <SEOToolkitPanel key="seo" />}
            {activeSection === "media" && <MediaLibraryPanel key="media" />}
            {activeSection === "global-settings" && <GlobalSettingsContent key="settings" />}
            {activeSection === "projects" && <AdminProjectsContent key="projects" />}
            {/* FMCG commerce */}
            {activeSection.startsWith("fmcg-") && (
              <FmcgAdmin
                key={activeSection}
                initialTab={activeSection.replace("fmcg-", "") as "suppliers" | "products" | "orders" | "enquiries"}
              />
            )}
            {/* Homepage */}
            {activeSection === "homepage" && <HomepageManagerPanel key="homepage" />}
            {/* AI */}
            {activeSection === "ai-assistant" && <AIAssistantPanel key="ai-assistant" />}
            {activeSection === "ai-settings" && <AISettingsPanel key="ai-settings" />}
            {/* Security */}
            {activeSection === "yasir-verify" && <YasirVerifyPanel key="yasir-verify" />}
            {activeSection === "rate-limiting" && <RateLimitingPanel key="rate-limiting" />}
            {activeSection === "blocked" && <BlockedActivityPanel key="blocked" />}
            {/* Marketing */}
            {activeSection === "campaigns" && <CampaignsPanel key="campaigns" />}
            {activeSection === "email-templates" && <EmailTemplatesPanel key="email-templates" />}
            {activeSection === "ctas" && <CTAsPanel key="ctas" />}
            {/* Website */}
            {activeSection === "partners" && <PartnersPanel key="partners" />}
            {activeSection === "tabloid" && <TabloidPanel key="tabloid" />}
            {/* System */}
            {activeSection === "audit-logs" && <AuditLogsPanel key="audit-logs" />}
            {/* Catch-all for remaining sections */}
            {!["dashboard", "homepage", "services", "leads", "testimonials", "faq", "blog", "analytics", "users", "staff", "roles", "system-health", "security-logs", "integrations", "seo-dashboard", "page-seo", "keywords", "regional-seo", "technical-seo", "media", "global-settings", "projects", "fmcg-suppliers", "fmcg-products", "fmcg-orders", "fmcg-enquiries", "ai-assistant", "ai-settings", "yasir-verify", "rate-limiting", "blocked", "campaigns", "email-templates", "ctas", "partners", "tabloid", "audit-logs", "pages", "navigation", "landing-pages", "checkout", "site-sections", "security", "technology", "ai", "forms"].includes(activeSection) && (
              <GenericAdminPanel
                key={activeSection}
                title={sidebarSections.flatMap(s => s.items).find(i => i.id === activeSection)?.label || activeSection}
                description="Content management for this section."
                reason={DISABLED_MODULES[activeSection]}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function IndustriesPanel() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Industries &amp; Sectors</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {INTERNATIONAL_SOURCING_SECTORS.length} sourcing sectors offered on the International Sourcing panel.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {INTERNATIONAL_SOURCING_SECTORS.map((sector) => (
          <div key={sector} className="rounded-xl bg-card border border-border p-5 flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-foreground">{sector}</p>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500">Active</span>
          </div>
        ))}
      </div>
      <p className="mt-6 text-xs text-muted-foreground">
        Sector details, media and sourcing requests are managed in the International Sourcing panel.
      </p>
    </motion.div>
  );
}

function CountriesPanel() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Target Countries</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {INTERNATIONAL_SOURCING_COUNTRIES.length} target countries · {INTERNATIONAL_SOURCING_COUNTRIES.filter((c) => c.enabled).length} enabled
        </p>
      </div>
      <div className="rounded-xl bg-card border border-border overflow-hidden divide-y divide-border">
        {INTERNATIONAL_SOURCING_COUNTRIES.map((country) => (
          <div key={country.code} className="flex flex-wrap items-center gap-3 px-5 py-3.5 hover:bg-muted/30">
            <span className="text-lg">{country.flag}</span>
            <div className="flex-1 min-w-32">
              <p className="text-sm font-medium text-foreground">{country.name}</p>
              <p className="text-[10px] text-muted-foreground">{country.region} · {country.dial}</p>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full ${country.enabled ? "bg-emerald-500/10 text-emerald-500" : "bg-muted text-muted-foreground"}`}>
              {country.enabled ? "Enabled" : "Disabled"}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}



const DISABLED_MODULES: Record<string, string> = {
  blocks:
    "Reusable blocks aren't part of this site's content model yet. Sections are edited directly under Pages, Site Sections and Homepage.",
  "content-gen": "AI content generation needs a provider key. Configure one under AI Settings to turn this on.",
  "page-gen": "AI page generation needs a provider key. Configure one under AI Settings to turn this on.",
  "seo-assistant": "The SEO assistant needs a provider key. Configure one under AI Settings to turn this on.",
  "tabloid-rewriter": "The AI rewriter needs a provider key. Configure one under AI Settings to turn this on.",
};

function TabloidPanel() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Zayed Tabloid</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Editorial workflow for articles, markets and forex coverage.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl">
        <a href="/tabloid/editorial" className="rounded-xl bg-card border border-border p-6 hover:border-electric/40 hover:shadow-sm transition-all">
          <p className="font-semibold text-foreground">Editorial Dashboard</p>
          <p className="text-xs text-muted-foreground mt-1">Drafts, review queue and publishing controls.</p>
        </a>
        <a href="/tabloid" className="rounded-xl bg-card border border-border p-6 hover:border-electric/40 hover:shadow-sm transition-all">
          <p className="font-semibold text-foreground">View Public Tabloid</p>
          <p className="text-xs text-muted-foreground mt-1">Opens the reader-facing edition in a new tab.</p>
        </a>
      </div>
    </motion.div>
  );
}

function DashboardContent({ onNavigate }: { onNavigate: (section: string) => void }) {
  const content = useQuery(api.content.adminContent);
  const staff = useQuery(api.adminRbac.listStaff);
  const leads = useQuery(api.leads.list, { limit: 5 });
  const leadCounts = useQuery(api.leads.counts);

  const kpis = [
    { label: "Staff Accounts", value: String(staff?.length ?? 0) },
    { label: "Active Staff", value: String(staff?.filter((s) => s.status === "active").length ?? 0) },
    { label: "Total Leads", value: String(leadCounts?.total ?? 0) },
    { label: "Live Plans", value: String(content?.plans.filter((p) => p.active).length ?? 0) },
    { label: "Published Services", value: String(content?.services.filter((s) => s.status === "published").length ?? 0) },
    { label: "Published Pages", value: String(content?.pages.filter((p) => p.status === "published").length ?? 0) },
  ];

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
            onClick={() => onNavigate(action.section)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border hover:border-border/80 hover:shadow-sm transition-all text-sm font-medium text-foreground"
          >
            <Plus className="w-3.5 h-3.5 text-muted-foreground" />
            {action.label}
          </button>
        ))}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {kpis.map((kpi) => (
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
            <button onClick={() => onNavigate("leads")} className="text-electric text-xs font-medium hover:underline">View All</button>
          </div>
          {leads && leads.length > 0 ? (
            <div className="divide-y divide-border">
              {leads.map((lead) => (
                <div key={lead._id} className="flex items-center gap-3 py-2.5">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{lead.name}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{lead.service ?? lead.leadType}</p>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-electric/10 text-electric">{lead.status}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-muted-foreground text-sm">No leads yet.</p>
              <p className="text-muted-foreground/60 text-xs mt-1">Leads will appear here once contact forms are submitted.</p>
            </div>
          )}
        </div>

        {/* Upcoming Appointments */}
        <div className="rounded-xl bg-card border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground text-sm">Upcoming Appointments</h3>
            <button onClick={() => onNavigate("leads")} className="text-electric text-xs font-medium hover:underline">View All</button>
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
            <button onClick={() => onNavigate("leads")} className="text-electric text-xs font-medium hover:underline">View All</button>
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
            <button onClick={() => onNavigate("yasir-verify")} className="text-electric text-xs font-medium hover:underline">View Dashboard</button>
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
            <button onClick={() => onNavigate("homepage")} className="text-electric text-xs font-medium hover:underline">View Pages</button>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/50">
              <span className="text-sm text-foreground">Draft Pages</span>
              <span className="text-sm font-medium text-foreground">{content?.pages.filter((p) => p.status !== "published").length ?? 0}</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/50">
              <span className="text-sm text-foreground">Draft Landing Pages</span>
              <span className="text-sm font-medium text-foreground">{content?.landingPages.filter((p) => p.status !== "published").length ?? 0}</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/50">
              <span className="text-sm text-foreground">Hidden FAQs</span>
              <span className="text-sm font-medium text-foreground">{content?.faqs.filter((f) => !f.visible).length ?? 0}</span>
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



function GlobalSettingsContent() {
  const saved = useQuery(api.content.homepageSettings);
  const save = useMutation(api.content.setHomepageSettings);
  const [enabledDraft, setEnabledDraft] = useState<boolean | null>(null);
  const [messageDraft, setMessageDraft] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const sections = HOME_SECTIONS.map((base) => {
    const row = saved?.sections?.find((s) => s.id === base.id);
    return { id: base.id, visible: row?.visible ?? base.visible, order: row?.order ?? base.order };
  });

  const notificationEnabled = enabledDraft ?? saved?.notification?.enabled ?? false;
  const notificationMessage = messageDraft ?? saved?.notification?.message ?? "";
  const dirty = enabledDraft !== null || messageDraft !== null;

  const handleSave = async () => {
    setSaving(true);
    try {
      await save({
        sections: sections.map((s, i) => ({ id: s.id, visible: s.visible, order: i + 1 })),
        notification: { enabled: notificationEnabled, message: notificationMessage },
      });
      setEnabledDraft(null);
      setMessageDraft(null);
      setSavedAt(new Date().toLocaleTimeString());
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-electric/30 focus:border-electric transition-all";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Global Settings</h1>
          <p className="text-muted-foreground text-sm mt-1">Site-wide announcement bar. Changes go live immediately after saving.</p>
          {savedAt && <p className="text-xs text-emerald-500 mt-1">Saved at {savedAt}</p>}
        </div>
        <button
          onClick={() => void handleSave()}
          disabled={!dirty || saving}
          className="flex items-center gap-2 px-4 py-2 bg-electric text-white rounded-lg text-sm font-medium hover:bg-electric-dark disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notification Bar */}
        <div className="rounded-xl bg-card border border-border p-6">
          <h3 className="font-semibold text-foreground text-sm mb-4">Promotional Notification Bar</h3>
          <p className="text-muted-foreground text-xs mb-4">Display a site-wide promotional banner at the top of the website.</p>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">Enable Notification Bar</label>
              <div
                onClick={() => setEnabledDraft(!notificationEnabled)}
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
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Promotional Message</label>
                <textarea
                  rows={3}
                  value={notificationMessage}
                  onChange={(e) => setMessageDraft(e.target.value)}
                  className={`${inputClass} resize-none`}
                  placeholder="e.g., New: AI-Powered Business Intelligence — 20% off for early adopters"
                />
              </div>
            )}
          </div>

          {/* Preview */}
          <div className="mt-6 rounded-xl overflow-hidden border border-border">
            <div className={`px-4 py-2 text-center text-xs font-medium ${
              notificationEnabled ? "bg-electric text-white" : "bg-muted text-muted-foreground"
            }`}>
              {notificationEnabled
                ? notificationMessage || "Your promotional message will appear here"
                : "Notification bar is disabled"}
            </div>
          </div>
        </div>

        {/* Brand identity */}
        <div className="rounded-xl bg-card border border-border p-6">
          <h3 className="font-semibold text-foreground text-sm mb-4">Brand Identity</h3>
          <p className="text-muted-foreground text-xs leading-relaxed">
            The wordmark, logo and tagline are part of the site build (Navigation, Footer and the auth screens),
            so they are versioned with the code instead of being editable here. Rename them in
            <code className="mx-1 rounded bg-muted px-1.5 py-0.5 text-[11px]">src/components/Navigation.tsx</code>
            and
            <code className="mx-1 rounded bg-muted px-1.5 py-0.5 text-[11px]">src/components/Footer.tsx</code>
            and commit the change.
          </p>
          <div className="mt-5 rounded-xl bg-navy-dark p-4">
            <span className="text-white font-bold text-sm tracking-tight">YASIR ZAYED</span>
            <p className="text-white/40 text-[10px]">Business Development • Consultancy • Security • Technology</p>
          </div>
          <p className="mt-5 text-xs text-muted-foreground">
            Section order, visibility and the announcement bar live in{" "}
            <span className="font-medium text-foreground">Homepage</span>. Email routing, AI providers and
            integrations are configured through project secrets, not from this screen.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
function AdminProjectsContent() {
  const projects = useQuery(api.projects.list);
  const clients = useQuery(api.adminRbac.listAppUsers);
  const createProject = useMutation(api.projects.create);
  const updateProject = useMutation(api.projects.update);
  const deleteProject = useMutation(api.projects.remove);
  const addTracking = useMutation(api.projects.addTracking);
  const addDeliverable = useMutation(api.projects.addDeliverable);

  const [showCreate, setShowCreate] = useState(false);
  const [selectedId, setSelectedId] = useState<Id<"projects"> | null>(null);
  const [newClientId, setNewClientId] = useState("");
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

  // Guest sessions are created automatically by the auth provider; a project
  // must belong to a real account, so only identified users can be selected.
  const clientOptions = (clients ?? []).filter((client) => !client.isAnonymous);

  const handleCreate = async () => {
    if (!newTitle.trim() || !newClientId) return;
    await createProject({
      clientId: newClientId as Id<"users">,
      title: newTitle.trim(),
      description: newDesc || undefined,
      status: newStatus,
      projectType: newType,
    });
    setShowCreate(false);
    setNewClientId("");
    setNewTitle("");
    setNewDesc("");
  };

  const handleAddTracking = async () => {
    if (!selectedId || !trackingTitle.trim()) return;
    await addTracking({
      projectId: selectedId,
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
      projectId: selectedId,
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
            <select value={newClientId} onChange={(e) => setNewClientId(e.target.value)} className="px-3 py-2 rounded-lg border bg-background text-sm">
              <option value="">Select a client account…</option>
              {clientOptions.map((client) => (
                <option key={client._id} value={client._id}>
                  {client.name ?? client.email ?? client._id}
                </option>
              ))}
            </select>
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
          {clientOptions.length === 0 && (
            <p className="text-xs text-amber-600">
              No client accounts exist yet. A client signs up on /auth first; the project is then attached to that account.
            </p>
          )}
          <div className="flex gap-2">
            <button onClick={handleCreate} disabled={!newClientId || !newTitle.trim()} className="px-4 py-2 bg-electric text-white rounded-lg text-sm font-medium hover:bg-electric-dark disabled:opacity-50 disabled:cursor-not-allowed">Create</button>
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
