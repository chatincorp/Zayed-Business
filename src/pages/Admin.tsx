import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Eye,
  Edit3,
  Trash2,
  Calendar,
  HelpCircle,
  FileSearch,
  Map,
  Gauge,
  ArrowRight,
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
            {activeSection === "homepage" && <PlaceholderContent key="homepage" title="Homepage Manager" description="Manage hero carousel slides, section ordering, visibility and content blocks." />}
            {activeSection === "services" && <PlaceholderContent key="services" title="Service Manager" description="Create, edit and manage services across all categories." />}
            {activeSection === "leads" && <PlaceholderContent key="leads" title="Lead Management" description="View, filter, assign and manage all incoming leads and inquiries." />}
            {activeSection === "security" && <PlaceholderContent key="security" title="Security Solutions" description="Manage security categories, solutions, industries and CTA content." />}
            {activeSection === "pages" && <PlaceholderContent key="pages" title="Pages" description="Create, edit and manage website pages with the block builder." />}
            {activeSection === "media" && <PlaceholderContent key="media" title="Media Library" description="Upload, search, filter and manage all media assets." />}
            {activeSection === "tabloid" && <PlaceholderContent key="tabloid" title="Zayed Tabloid" description="Create and manage articles for the Zayed Tabloid news section." />}
            {activeSection === "seo-dashboard" && <PlaceholderContent key="seo" title="SEO Dashboard" description="Monitor SEO health, keywords, technical issues and regional targeting." />}
            {activeSection === "ai-assistant" && <PlaceholderContent key="ai-assist" title="AI Assistant" description="AI-powered content assistance for writing, rewriting, improving and generating content." />}
            {activeSection === "yasir-verify" && <PlaceholderContent key="verify" title="YASIR VERIFY™" description="Configure human verification, risk thresholds and bot protection settings." />}
            {activeSection === "users" && <PlaceholderContent key="users" title="User Management" description="Manage users, roles, permissions and access controls." />}
            {activeSection === "global-settings" && <PlaceholderContent key="settings" title="Global Settings" description="Brand, contact, social, navigation, footer, SEO, email and security settings." />}
            {!["dashboard", "homepage", "services", "leads", "security", "pages", "media", "tabloid", "seo-dashboard", "ai-assistant", "yasir-verify", "users", "global-settings"].includes(activeSection) && (
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
