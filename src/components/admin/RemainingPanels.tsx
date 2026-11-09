import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus, Trash2, Edit3, Eye, EyeOff, GripVertical, ArrowUp, ArrowDown,
  Bot, Sparkles, FileText, Wand2, Search,  Zap,
  Shield, Ban, Clock, CheckCircle2, XCircle,
  Target, Mail, Image, Layers, Globe,
  MessageSquare, Megaphone,
} from "lucide-react";

/* ══════════════════════════════════════════════════════════════
 *  HOMEPAGE MANAGER
 * ══════════════════════════════════════════════════════════════ */

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  visible: boolean;
  order: number;
}

interface SectionItem {
  id: string;
  name: string;
  visible: boolean;
  order: number;
}

const initialSlides: HeroSlide[] = [
  { id: "1", title: "Building Stronger Businesses", subtitle: "Main hero — business development focus", visible: true, order: 1 },
  { id: "2", title: "Smarter Systems", subtitle: "Technology and AI focus", visible: true, order: 2 },
  { id: "3", title: "Secure Futures", subtitle: "Security solutions focus", visible: true, order: 3 },
];

const initialSections: SectionItem[] = [
  { id: "intro", name: "Introduction", visible: true, order: 1 },
  { id: "services", name: "Services Overview", visible: true, order: 2 },
  { id: "ai-preview", name: "AI Integration Preview", visible: true, order: 3 },
  { id: "business-dev", name: "Business Development", visible: true, order: 4 },
  { id: "sales", name: "Sales & Marketing", visible: true, order: 5 },
  { id: "technology", name: "Technology", visible: true, order: 6 },
  { id: "security", name: "Security Solutions", visible: true, order: 7 },
  { id: "chatbot-demo", name: "Chatbot Demo", visible: true, order: 8 },
  { id: "workflow", name: "Workflow Automation", visible: true, order: 9 },
  { id: "live-demos", name: "Live Demo Previews", visible: true, order: 10 },
  { id: "case-studies", name: "Case Studies", visible: true, order: 11 },
  { id: "testimonials", name: "Testimonials", visible: true, order: 12 },
  { id: "process", name: "How We Work", visible: true, order: 13 },
  { id: "final-cta", name: "Final CTA", visible: true, order: 14 },
];

export function HomepageManagerPanel() {
  const [slides, setSlides] = useState(initialSlides);
  const [sections, setSections] = useState(initialSections);

  const toggleSlide = (id: string) => setSlides((prev) => prev.map((s) => (s.id === id ? { ...s, visible: !s.visible } : s)));
  const toggleSection = (id: string) => setSections((prev) => prev.map((s) => (s.id === id ? { ...s, visible: !s.visible } : s)));
  const moveSection = (id: string, dir: -1 | 1) => setSections((prev) => {
    const idx = prev.findIndex((s) => s.id === id);
    if (idx < 0) return prev;
    const arr = [...prev];
    const target = arr[idx + dir];
    if (!target) return prev;
    [arr[idx], arr[idx + dir]] = [arr[idx + dir], arr[idx]];
    return arr;
  });

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Homepage Manager</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage hero carousel slides and section visibility.</p>
      </div>

      {/* Hero Slides */}
      <div className="rounded-xl bg-card border border-border p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-sm">Hero Carousel Slides</h3>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-electric text-white rounded-lg text-xs font-medium hover:bg-electric-dark"><Plus className="w-3 h-3" /> Add Slide</button>
        </div>
        <div className="space-y-2">
          {slides.map((slide) => (
            <div key={slide.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
              <GripVertical className="w-4 h-4 text-muted-foreground/30 cursor-grab" />
              <span className="text-xs font-bold text-muted-foreground w-6">#{slide.order}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{slide.title}</p>
                <p className="text-[10px] text-muted-foreground">{slide.subtitle}</p>
              </div>
              <button onClick={() => toggleSlide(slide.id)} className={`p-1.5 rounded-lg transition-colors ${slide.visible ? "text-emerald-500" : "text-muted-foreground"}`}>
                {slide.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
              <button className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"><Edit3 className="w-3.5 h-3.5" /></button>
            </div>
          ))}
        </div>
      </div>

      {/* Page Sections */}
      <div className="rounded-xl bg-card border border-border p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-sm">Page Sections (order = display order)</h3>
          <span className="text-xs text-muted-foreground">{sections.filter((s) => s.visible).length} of {sections.length} visible</span>
        </div>
        <div className="space-y-1.5">
          {sections.map((sec) => (
            <div key={sec.id} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted/30 transition-colors group">
              <GripVertical className="w-4 h-4 text-muted-foreground/30 cursor-grab" />
              <div className="flex items-center gap-1">
                <button onClick={() => moveSection(sec.id, -1)} className="p-0.5 rounded text-muted-foreground/40 hover:text-muted-foreground"><ArrowUp className="w-3 h-3" /></button>
                <button onClick={() => moveSection(sec.id, 1)} className="p-0.5 rounded text-muted-foreground/40 hover:text-muted-foreground"><ArrowDown className="w-3 h-3" /></button>
              </div>
              <span className="text-xs text-muted-foreground w-5">{sec.order}</span>
              <span className="text-sm text-foreground flex-1">{sec.name}</span>
              <button onClick={() => toggleSection(sec.id)} className={`p-1 rounded transition-colors ${sec.visible ? "text-emerald-500" : "text-muted-foreground/40"}`}>
                {sec.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════
 *  AI ASSISTANT
 * ══════════════════════════════════════════════════════════════ */

const aiTools = [
  { name: "Content Writer", description: "Generate blog posts, articles, and page content from prompts.", icon: FileText, color: "text-electric" },
  { name: "SEO Optimizer", description: "Rewrite content for better search engine rankings.", icon: Search, color: "text-emerald-500" },
  { name: "Social Media Creator", description: "Create posts for Twitter, LinkedIn, Facebook, Instagram.", icon: Megaphone, color: "text-violet-500" },
  { name: "Email Composer", description: "Draft professional emails, newsletters, and campaigns.", icon: Mail, color: "text-amber-500" },
  { name: "Proposal Generator", description: "Generate business proposals and quotes.", icon: FileText, color: "text-blue-500" },
  { name: "Image Prompter", description: "Create detailed prompts for AI image generation.", icon: Image, color: "text-rose-500" },
];

export function AIAssistantPanel() {
  const [prompt, setPrompt] = useState("");
  const [selectedTool, setSelectedTool] = useState("Content Writer");

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">AI Assistant</h1>
        <p className="text-muted-foreground text-sm mt-1">AI-powered content assistance for all your writing needs.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {aiTools.map((tool) => (
          <button key={tool.name} onClick={() => setSelectedTool(tool.name)} className={`p-4 rounded-xl border text-left transition-all ${selectedTool === tool.name ? "border-electric bg-electric/5" : "bg-card border-border hover:border-border/80"}`}>
            <tool.icon className={`w-5 h-5 mb-2 ${tool.color}`} />
            <p className="text-xs font-semibold text-foreground">{tool.name}</p>
            <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">{tool.description}</p>
          </button>
        ))}
      </div>

      <div className="rounded-xl bg-card border border-border p-6">
        <div className="flex items-center gap-2 mb-4">
          <Bot className="w-5 h-5 text-electric" />
          <h3 className="font-semibold text-sm">{selectedTool}</h3>
        </div>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={6}
          placeholder={`Describe what you want the ${selectedTool} to create...`}
          className="w-full px-4 py-3 rounded-lg border bg-background text-sm resize-none mb-4"
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Sparkles className="w-3.5 h-3.5 text-electric" />
            Powered by OpenAI GPT-4
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-electric text-white rounded-lg text-sm font-medium hover:bg-electric-dark transition-colors">
            <Zap className="w-4 h-4" /> Generate
          </button>
        </div>
        <div className="mt-6 p-6 rounded-lg bg-muted/30 text-center">
          <Wand2 className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">AI-generated content will appear here.</p>
        </div>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════
 *  YASIR VERIFY
 * ══════════════════════════════════════════════════════════════ */

export function YasirVerifyPanel() {
  const [enabled, setEnabled] = useState(true);
  const [threshold, setThreshold] = useState("medium");
  const [blockBots, setBlockBots] = useState(true);
  const [logPassed, setLogPassed] = useState(true);

  const stats = [
    { label: "Total Checks", value: "12,847", icon: Shield, color: "text-electric" },
    { label: "Passed", value: "12,456", icon: CheckCircle2, color: "text-emerald-500" },
    { label: "Failed", value: "289", icon: XCircle, color: "text-red-500" },
    { label: "Blocked", value: "102", icon: Ban, color: "text-amber-500" },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">YASIR VERIFY&trade;</h1>
        <p className="text-muted-foreground text-sm mt-1">Human verification, bot protection, and risk scoring.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {stats.map((s) => (
          <div key={s.label} className="p-4 rounded-xl bg-card border border-border">
            <s.icon className={`w-4 h-4 mb-2 ${s.color}`} />
            <p className="text-xl font-bold text-foreground">{s.value}</p>
            <p className="text-[10px] text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl bg-card border border-border p-6">
          <h3 className="font-semibold text-sm mb-4">Verification Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm text-foreground">Enable YASIR VERIFY</label>
              <div onClick={() => setEnabled(!enabled)} className={`w-11 h-6 rounded-full cursor-pointer relative transition-all ${enabled ? "bg-electric" : "bg-muted border border-border"}`}>
                <div className={`w-5 h-5 rounded-full bg-white shadow-sm absolute top-0.5 transition-all ${enabled ? "left-[22px]" : "left-0.5"}`} />
              </div>
            </div>
            <div>
              <label className="block text-sm text-foreground mb-1.5">Risk Threshold</label>
              <select value={threshold} onChange={(e) => setThreshold(e.target.value)} className="w-full px-3 py-2 rounded-lg border bg-background text-sm">
                <option value="low">Low — Block only obvious bots</option>
                <option value="medium">Medium — Balanced detection</option>
                <option value="high">High — Strict verification</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm text-foreground">Auto-block known bots</label>
              <div onClick={() => setBlockBots(!blockBots)} className={`w-11 h-6 rounded-full cursor-pointer relative transition-all ${blockBots ? "bg-electric" : "bg-muted border border-border"}`}>
                <div className={`w-5 h-5 rounded-full bg-white shadow-sm absolute top-0.5 transition-all ${blockBots ? "left-[22px]" : "left-0.5"}`} />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm text-foreground">Log passed verifications</label>
              <div onClick={() => setLogPassed(!logPassed)} className={`w-11 h-6 rounded-full cursor-pointer relative transition-all ${logPassed ? "bg-electric" : "bg-muted border border-border"}`}>
                <div className={`w-5 h-5 rounded-full bg-white shadow-sm absolute top-0.5 transition-all ${logPassed ? "left-[22px]" : "left-0.5"}`} />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-card border border-border p-6">
          <h3 className="font-semibold text-sm mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {[
              { msg: "Passed — James Mwangi (Kenya)", time: "2 min ago", type: "pass" },
              { msg: "Blocked — bot scraper detected", time: "15 min ago", type: "block" },
              { msg: "Passed — Sarah Williams (UK)", time: "1 hr ago", type: "pass" },
              { msg: "Failed — suspicious fingerprint", time: "2 hrs ago", type: "fail" },
              { msg: "Passed — Ahmed Hassan (UAE)", time: "3 hrs ago", type: "pass" },
            ].map((log, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                {log.type === "pass" ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> :
                 log.type === "block" ? <Ban className="w-3.5 h-3.5 text-red-500 shrink-0" /> :
                 <XCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                <span className="text-foreground flex-1">{log.msg}</span>
                <span className="text-muted-foreground shrink-0">{log.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════
 *  CAMPAIGNS MANAGER
 * ══════════════════════════════════════════════════════════════ */

interface Campaign {
  id: string;
  name: string;
  type: "email" | "social" | "ads" | "sms";
  status: "draft" | "active" | "paused" | "completed";
  sent: number;
  opened: number;
  clicked: number;
  createdAt: string;
}

const mockCampaigns: Campaign[] = [
  { id: "1", name: "September Welcome Series", type: "email", status: "active", sent: 2450, opened: 1230, clicked: 340, createdAt: "2026-09-01" },
  { id: "2", name: "LinkedIn Thought Leadership", type: "social", status: "active", sent: 0, opened: 0, clicked: 0, createdAt: "2026-08-28" },
  { id: "3", name: "Google Ads — AI Services", type: "ads", status: "paused", sent: 0, opened: 0, clicked: 1890, createdAt: "2026-08-20" },
  { id: "4", name: "August Newsletter", type: "email", status: "completed", sent: 3200, opened: 1890, clicked: 567, createdAt: "2026-08-01" },
];

const campaignTypeIcons: Record<string, typeof Mail> = { email: Mail, social: Globe, ads: Target, sms: MessageSquare };
const campaignStatusColors: Record<string, string> = { draft: "bg-muted text-muted-foreground", active: "bg-emerald-500/10 text-emerald-500", paused: "bg-amber-500/10 text-amber-500", completed: "bg-blue-500/10 text-blue-500" };

export function CampaignsPanel() {
  const [campaigns] = useState(mockCampaigns);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Campaigns</h1>
          <p className="text-muted-foreground text-sm mt-1">{campaigns.length} campaigns · {campaigns.filter((c) => c.status === "active").length} active</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-electric text-white rounded-lg text-sm font-medium hover:bg-electric-dark transition-colors">
          <Plus className="w-4 h-4" /> New Campaign
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {campaigns.map((c) => {
          const TypeIcon = campaignTypeIcons[c.type] || Megaphone;
          return (
            <div key={c.id} className="p-5 rounded-xl bg-card border border-border hover:border-border/80 transition-all">
              <div className="flex items-center justify-between mb-3">
                <TypeIcon className="w-5 h-5 text-muted-foreground" />
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium capitalize ${campaignStatusColors[c.status]}`}>{c.status}</span>
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-1">{c.name}</h3>
              <p className="text-[10px] text-muted-foreground capitalize mb-3">{c.type} campaign · {c.createdAt}</p>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center"><p className="text-sm font-bold text-foreground">{c.sent.toLocaleString()}</p><p className="text-[9px] text-muted-foreground">Sent</p></div>
                <div className="text-center"><p className="text-sm font-bold text-foreground">{c.opened.toLocaleString()}</p><p className="text-[9px] text-muted-foreground">Opened</p></div>
                <div className="text-center"><p className="text-sm font-bold text-foreground">{c.clicked.toLocaleString()}</p><p className="text-[9px] text-muted-foreground">Clicked</p></div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════
 *  EMAIL TEMPLATES
 * ══════════════════════════════════════════════════════════════ */

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  category: string;
  lastEdited: string;
}

const mockTemplates: EmailTemplate[] = [
  { id: "1", name: "Welcome Email", subject: "Welcome to Yasir Zayed!", category: "Onboarding", lastEdited: "2026-08-28" },
  { id: "2", name: "Quotation Response", subject: "Your Quotation from Yasir Zayed", category: "Sales", lastEdited: "2026-08-25" },
  { id: "3", name: "Meeting Confirmation", subject: "Meeting Confirmed — {{date}}", category: "Scheduling", lastEdited: "2026-08-20" },
  { id: "4", name: "Project Update", subject: "Project Update — {{project_name}}", category: "Client", lastEdited: "2026-08-15" },
  { id: "5", name: "Invoice", subject: "Invoice #{{invoice_number}}", category: "Billing", lastEdited: "2026-08-10" },
  { id: "6", name: "Newsletter", subject: "Zayed Tabloid Monthly Digest", category: "Marketing", lastEdited: "2026-09-01" },
  { id: "7", name: "Lead Follow-up", subject: "Following up on your inquiry", category: "Sales", lastEdited: "2026-08-22" },
  { id: "8", name: "Security Alert", subject: "Security Alert — {{alert_type}}", category: "Security", lastEdited: "2026-08-18" },
];

const categoryColors: Record<string, string> = { Onboarding: "bg-electric/10 text-electric", Sales: "bg-emerald-500/10 text-emerald-500", Scheduling: "bg-amber-500/10 text-amber-500", Client: "bg-violet-500/10 text-violet-500", Billing: "bg-blue-500/10 text-blue-500", Marketing: "bg-rose-500/10 text-rose-500", Security: "bg-red-500/10 text-red-500" };

export function EmailTemplatesPanel() {
  const [templates] = useState(mockTemplates);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Email Templates</h1>
          <p className="text-muted-foreground text-sm mt-1">{templates.length} templates across {Object.keys(categoryColors).length} categories</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-electric text-white rounded-lg text-sm font-medium hover:bg-electric-dark transition-colors">
          <Plus className="w-4 h-4" /> New Template
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {templates.map((t) => (
          <div key={t.id} className="p-5 rounded-xl bg-card border border-border hover:border-border/80 transition-all group cursor-pointer">
            <div className="flex items-center justify-between mb-3">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${categoryColors[t.category] || "bg-muted text-muted-foreground"}`}>{t.category}</span>
            </div>
            <h3 className="text-sm font-semibold text-foreground mb-1">{t.name}</h3>
            <p className="text-[10px] text-muted-foreground mb-3 truncate">{t.subject}</p>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground">Edited {t.lastEdited}</span>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1 rounded text-muted-foreground hover:text-foreground"><Edit3 className="w-3 h-3" /></button>
                <button className="p-1 rounded text-muted-foreground hover:text-destructive"><Trash2 className="w-3 h-3" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════
 *  CTAs MANAGER
 * ══════════════════════════════════════════════════════════════ */

interface CTA {
  id: string;
  label: string;
  url: string;
  style: string;
  clicks: number;
  visible: boolean;
}

const mockCTAs: CTA[] = [
  { id: "1", label: "Get Started", url: "/contact", style: "Primary Blue", clicks: 1234, visible: true },
  { id: "2", label: "View Services", url: "/services", style: "Outline", clicks: 890, visible: true },
  { id: "3", label: "Request Quote", url: "/pricing", style: "Primary Green", clicks: 567, visible: true },
  { id: "4", label: "Book Meeting", url: "/contact", style: "Secondary", clicks: 345, visible: true },
  { id: "5", label: "Download Brochure", url: "#", style: "Ghost", clicks: 234, visible: false },
];

export function CTAsPanel() {
  const [ctas, setCtas] = useState<CTA[]>(mockCTAs);

  const addCta = () => {
    const label = window.prompt("New CTA label", "Get Started");
    if (!label?.trim()) return;
    setCtas((prev) => [
      ...prev,
      {
        id: `cta-${Date.now()}`,
        label: label.trim(),
        url: "/contact",
        style: "Primary Blue",
        clicks: 0,
        visible: true,
      },
    ]);
  };

  const editCta = (cta: CTA) => {
    const label = window.prompt("CTA label", cta.label);
    if (label === null) return;
    const url = window.prompt("Destination URL", cta.url);
    if (url === null) return;
    setCtas((prev) =>
      prev.map((item) =>
        item.id === cta.id
          ? { ...item, label: label.trim() || item.label, url: url.trim() || item.url }
          : item,
      ),
    );
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">CTAs</h1>
          <p className="text-muted-foreground text-sm mt-1">{ctas.length} call-to-action buttons</p>
        </div>
        <button onClick={addCta} className="flex items-center gap-2 px-4 py-2 bg-electric text-white rounded-lg text-sm font-medium hover:bg-electric-dark transition-colors"><Plus className="w-4 h-4" /> New CTA</button>
      </div>
      <div className="rounded-xl bg-card border border-border overflow-hidden">
        <div className="divide-y divide-border">
          {ctas.map((cta) => (
            <div key={cta.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-muted/30 transition-colors">
              <button onClick={() => setCtas((prev) => prev.map((item) => item.id === cta.id ? { ...item, visible: !item.visible } : item))} title={cta.visible ? "Hide CTA" : "Show CTA"} className={`p-1 rounded ${cta.visible ? "text-emerald-500" : "text-muted-foreground"}`}>{cta.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}</button>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{cta.label}</p>
                <p className="text-[10px] text-muted-foreground">{cta.url}</p>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{cta.style}</span>
              <span className="text-xs text-muted-foreground">{cta.clicks} clicks</span>
              <button onClick={() => editCta(cta)} title="Edit CTA" className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"><Edit3 className="w-3.5 h-3.5" /></button>
              <button onClick={() => setCtas((prev) => prev.filter((item) => item.id !== cta.id))} title="Delete CTA" className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════
 *  PARTNERS MANAGER
 * ══════════════════════════════════════════════════════════════ */

interface Partner {
  id: string;
  name: string;
  type: string;
  visible: boolean;
}

const mockPartners: Partner[] = [
  { id: "1", name: "Dahua", type: "Security Hardware", visible: true },
  { id: "2", name: "OpenAI", type: "AI Provider", visible: true },
  { id: "3", name: "Amazon AWS", type: "Cloud Infrastructure", visible: true },
  { id: "4", name: "Google Cloud", type: "Cloud Platform", visible: true },
  { id: "5", name: "Cisco", type: "Networking", visible: true },
  { id: "6", name: "HP", type: "Hardware", visible: true },
  { id: "7", name: "Shopify", type: "E-Commerce", visible: true },
  { id: "8", name: "WordPress", type: "CMS", visible: true },
];

export function PartnersPanel() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Partners</h1>
          <p className="text-muted-foreground text-sm mt-1">{mockPartners.length} partner/supplier brands</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-electric text-white rounded-lg text-sm font-medium hover:bg-electric-dark transition-colors"><Plus className="w-4 h-4" /> Add Partner</button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {mockPartners.map((p) => (
          <div key={p.id} className="p-4 rounded-xl bg-card border border-border flex items-center gap-3 hover:border-border/80 transition-all">
            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-xs font-bold text-gray-700 shrink-0">{p.name.slice(0, 2)}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{p.name}</p>
              <p className="text-[10px] text-muted-foreground">{p.type}</p>
            </div>
            <button className={`p-1 rounded ${p.visible ? "text-emerald-500" : "text-muted-foreground"}`}>{p.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}</button>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════
 *  RATE LIMITING
 * ══════════════════════════════════════════════════════════════ */

export function RateLimitingPanel() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Rate Limiting</h1>
        <p className="text-muted-foreground text-sm mt-1">Configure API and form submission rate limits.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl bg-card border border-border p-6">
          <h3 className="font-semibold text-sm mb-4">Rate Limit Rules</h3>
          <div className="space-y-4">
            {[{ route: "/api/contact", limit: "10 req/min", blocked: 45 },
              { route: "/api/leads", limit: "5 req/min", blocked: 23 },
              { route: "/api/login", limit: "5 req/5min", blocked: 12 },
              { route: "/api/payments", limit: "3 req/min", blocked: 2 },
            ].map((rule) => (
              <div key={rule.route} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div><p className="text-sm font-mono text-foreground">{rule.route}</p><p className="text-[10px] text-muted-foreground">{rule.limit}</p></div>
                <div className="text-right"><p className="text-xs text-amber-500">{rule.blocked} blocked today</p></div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl bg-card border border-border p-6">
          <h3 className="font-semibold text-sm mb-4">Add New Rule</h3>
          <div className="space-y-3">
            <input placeholder="Route (e.g. /api/newsletter)" className="w-full px-3 py-2 rounded-lg border bg-background text-sm" />
            <input placeholder="Rate limit (e.g. 10 req/min)" className="w-full px-3 py-2 rounded-lg border bg-background text-sm" />
            <select className="w-full px-3 py-2 rounded-lg border bg-background text-sm">
              <option>Block IP</option>
              <option>Return 429</option>
              <option>Captcha challenge</option>
            </select>
            <button className="px-4 py-2 bg-electric text-white rounded-lg text-sm font-medium hover:bg-electric-dark">Add Rule</button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════
 *  BLOCKED ACTIVITY
 * ══════════════════════════════════════════════════════════════ */

export function BlockedActivityPanel() {
  const blocked = [
    { ip: "185.220.xx.xx", reason: "Bot scraping detected", time: "15 min ago", type: "bot" },
    { ip: "196.216.xx.xx", reason: "Spam form submission", time: "4 hrs ago", type: "spam" },
    { ip: "41.204.xx.xx", reason: "Brute force login attempt", time: "1 day ago", type: "attack" },
    { ip: "102.89.xx.xx", reason: "Rate limit exceeded — 50 req/min", time: "2 days ago", type: "rate" },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Blocked Activity</h1>
        <p className="text-muted-foreground text-sm mt-1">{blocked.length} blocked IPs today</p>
      </div>
      <div className="rounded-xl bg-card border border-border divide-y divide-border">
        {blocked.map((b, i) => (
          <div key={i} className="flex items-center gap-3 px-5 py-4">
            <Ban className="w-4 h-4 text-red-500 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{b.reason}</p>
              <p className="text-[10px] text-muted-foreground">{b.ip} · {b.time}</p>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 capitalize">{b.type}</span>
            <button className="text-xs text-electric hover:underline">Unblock</button>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════
 *  AUDIT LOGS
 * ══════════════════════════════════════════════════════════════ */

export function AuditLogsPanel() {
  const logs = [
    { user: "Yasir Zayed", action: "Updated Global Settings", time: "2 min ago" },
    { user: "Content Desk", action: "Published article: AI in Africa", time: "30 min ago" },
    { user: "Tech Lead", action: "Deployed website update", time: "1 hr ago" },
    { user: "Admin", action: "Created new staff account", time: "2 hrs ago" },
    { user: "Security Ops", action: "Updated rate limiting rules", time: "3 hrs ago" },
    { user: "Yasir Zayed", action: "Approved campaign: September Welcome", time: "5 hrs ago" },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Audit Logs</h1>
        <p className="text-muted-foreground text-sm mt-1">System activity and user action history.</p>
      </div>
      <div className="rounded-xl bg-card border border-border divide-y divide-border">
        {logs.map((log, i) => (
          <div key={i} className="flex items-center gap-3 px-5 py-3.5 hover:bg-muted/30 transition-colors">
            <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground"><span className="font-medium">{log.user}</span> {log.action}</p>
            </div>
            <span className="text-[10px] text-muted-foreground shrink-0">{log.time}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════
 *  AI SETTINGS
 * ══════════════════════════════════════════════════════════════ */

export function AISettingsPanel() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">AI Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Configure OpenAI integration, model selection, and API keys.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl bg-card border border-border p-6">
          <h3 className="font-semibold text-sm mb-4">OpenAI Configuration</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-foreground mb-1.5">API Key</label>
              <input type="password" placeholder="sk-..." className="w-full px-3 py-2 rounded-lg border bg-background text-sm" defaultValue="sk-xxxxx...xxxxx" />
            </div>
            <div>
              <label className="block text-sm text-foreground mb-1.5">Default Model</label>
              <select className="w-full px-3 py-2 rounded-lg border bg-background text-sm">
                <option>GPT-4o</option>
                <option>GPT-4o Mini</option>
                <option>GPT-4 Turbo</option>
                <option>GPT-3.5 Turbo</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-foreground mb-1.5">Temperature</label>
              <input type="number" step="0.1" min="0" max="2" defaultValue="0.7" className="w-full px-3 py-2 rounded-lg border bg-background text-sm" />
            </div>
            <div>
              <label className="block text-sm text-foreground mb-1.5">Max Tokens</label>
              <input type="number" defaultValue="2048" className="w-full px-3 py-2 rounded-lg border bg-background text-sm" />
            </div>
            <button className="px-4 py-2 bg-electric text-white rounded-lg text-sm font-medium hover:bg-electric-dark">Save Settings</button>
          </div>
        </div>
        <div className="rounded-xl bg-card border border-border p-6">
          <h3 className="font-semibold text-sm mb-4">YasBot Configuration</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-foreground mb-1.5">Bot Name</label>
              <input defaultValue="YasBot" className="w-full px-3 py-2 rounded-lg border bg-background text-sm" />
            </div>
            <div>
              <label className="block text-sm text-foreground mb-1.5">Welcome Message</label>
              <textarea defaultValue="Hello! I'm YasBot, your AI assistant. How can I help you today?" rows={3} className="w-full px-3 py-2 rounded-lg border bg-background text-sm resize-none" />
            </div>
            <div>
              <label className="block text-sm text-foreground mb-1.5">System Prompt</label>
              <textarea rows={4} className="w-full px-3 py-2 rounded-lg border bg-background text-sm resize-none" placeholder="Instructions for the AI on how to behave..." />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════
 *  GENERIC PLACEHOLDER for remaining sections
 * ══════════════════════════════════════════════════════════════ */

export function GenericAdminPanel({ title, description }: { title: string; description: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        <p className="text-muted-foreground text-sm mt-1">{description}</p>
      </div>
      <div className="rounded-xl bg-card border border-border p-12 text-center">
        <div className="w-16 h-16 mx-auto rounded-xl bg-muted flex items-center justify-center mb-4">
          <Layers className="w-7 h-7 text-muted-foreground/40" />
        </div>
        <h3 className="font-semibold text-foreground mb-2">Coming Soon</h3>
        <p className="text-muted-foreground text-sm max-w-sm mx-auto">This section will be connected to the backend for full management capabilities.</p>
      </div>
    </motion.div>
  );
}
