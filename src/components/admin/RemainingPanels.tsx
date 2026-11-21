import { useState } from "react";
import { motion } from "framer-motion";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import { HOME_SECTIONS, type HomeSection } from "@/lib/siteContent";
import {
  Plus, Trash2, Eye, EyeOff, GripVertical, ArrowUp, ArrowDown,
  Bot, Sparkles, FileText, Wand2, Search,  Zap,
  Shield, Ban, CheckCircle2, XCircle,
  Target, Mail, Image, Layers, Globe,
  MessageSquare, Megaphone,
} from "lucide-react";

/* ══════════════════════════════════════════════════════════════
 *  HOMEPAGE MANAGER
 * ══════════════════════════════════════════════════════════════ */

export function HomepageManagerPanel() {
  const saved = useQuery(api.content.homepageSettings);
  const save = useMutation(api.content.setHomepageSettings);

  const [draft, setDraft] = useState<HomeSection[] | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const stored: HomeSection[] = HOME_SECTIONS.map((base) => {
    const row = saved?.sections?.find((s) => s.id === base.id);
    return { ...base, visible: row?.visible ?? base.visible, order: row?.order ?? base.order };
  }).sort((a, b) => a.order - b.order);

  const sections = draft ?? stored;
  const notificationMessage = message ?? saved?.notification?.message ?? "";
  const notificationEnabled = enabled ?? saved?.notification?.enabled ?? true;

  const update = (fn: (items: HomeSection[]) => HomeSection[]) => setDraft(fn(sections));
  const toggleSection = (id: string) =>
    update((items) => items.map((s) => (s.id === id ? { ...s, visible: !s.visible } : s)));
  const moveSection = (id: string, dir: -1 | 1) =>
    update((items) => {
      const idx = items.findIndex((s) => s.id === id);
      const target = items[idx + dir];
      if (idx < 0 || !target) return items;
      const arr = [...items];
      [arr[idx], arr[idx + dir]] = [arr[idx + dir], arr[idx]];
      return arr;
    });

  const handleSave = async () => {
    setSaving(true);
    try {
      await save({
        sections: sections.map((s, i) => ({ id: s.id, visible: s.visible, order: i + 1 })),
        notification: { enabled: notificationEnabled, message: notificationMessage },
      });
      setDraft(null);
      setMessage(null);
      setEnabled(null);
      setSavedAt(new Date().toLocaleTimeString());
    } finally {
      setSaving(false);
    }
  };

  const dirty = draft !== null || message !== null || enabled !== null;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Homepage Manager</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Control homepage section order, visibility and the announcement bar. Changes go live immediately after saving.
          </p>
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

      <div className="rounded-xl bg-card border border-border p-5 mb-6">
        <h3 className="font-semibold text-sm mb-1">Announcement Bar</h3>
        <p className="text-xs text-muted-foreground mb-4">Shown at the very top of every public page.</p>
        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={notificationEnabled} onChange={(e) => setEnabled(e.target.checked)} />
            Show the announcement bar
          </label>
          <input
            value={notificationMessage}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Announcement message"
            className="w-full px-3 py-2 rounded-lg border bg-background text-sm"
          />
        </div>
      </div>

      <div className="rounded-xl bg-card border border-border p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-sm">Sections (order = display order)</h3>
          <span className="text-xs text-muted-foreground">
            {sections.filter((s) => s.visible).length} of {sections.length} visible
          </span>
        </div>
        <div className="space-y-1.5">
          {sections.map((sec, i) => (
            <div key={sec.id} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted/30 transition-colors">
              <GripVertical className="w-4 h-4 text-muted-foreground/30" />
              <div className="flex items-center gap-1">
                <button onClick={() => moveSection(sec.id, -1)} disabled={i === 0} className="p-0.5 rounded text-muted-foreground/40 hover:text-muted-foreground disabled:opacity-30"><ArrowUp className="w-3 h-3" /></button>
                <button onClick={() => moveSection(sec.id, 1)} disabled={i === sections.length - 1} className="p-0.5 rounded text-muted-foreground/40 hover:text-muted-foreground disabled:opacity-30"><ArrowDown className="w-3 h-3" /></button>
              </div>
              <span className="text-xs text-muted-foreground w-5">{i + 1}</span>
              <span className="text-sm text-foreground flex-1">{sec.label}</span>
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

const campaignTypeIcons: Record<string, typeof Mail> = { email: Mail, social: Globe, ads: Target, sms: MessageSquare };
const campaignStatusColors: Record<string, string> = { draft: "bg-muted text-muted-foreground", active: "bg-emerald-500/10 text-emerald-500", paused: "bg-amber-500/10 text-amber-500", completed: "bg-blue-500/10 text-blue-500" };
const campaignStatuses: Doc<"campaigns">["status"][] = ["draft", "active", "paused", "completed"];

export function CampaignsPanel() {
  const campaigns = useQuery(api.adminRbac.listCampaigns);
  const create = useMutation(api.adminRbac.createCampaign);
  const setStatus = useMutation(api.adminRbac.updateCampaignStatus);
  const remove = useMutation(api.adminRbac.deleteCampaign);

  const [name, setName] = useState("");
  const [type, setType] = useState<Doc<"campaigns">["type"]>("email");
  const [error, setError] = useState<string | null>(null);

  const rows = campaigns ?? [];

  const submit = async () => {
    if (!name.trim()) return;
    try {
      await create({ name: name.trim(), type });
      setName("");
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create the campaign.");
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Campaigns</h1>
          <p className="text-muted-foreground text-sm mt-1">{rows.length} campaigns · {rows.filter((c) => c.status === "active").length} active</p>
        </div>
      </div>

      <div className="p-5 rounded-xl bg-card border border-border mb-6 space-y-3">
        <h3 className="font-semibold text-sm">New campaign</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Campaign name" className="flex-1 px-3 py-2 rounded-lg border bg-background text-sm" />
          <select value={type} onChange={(e) => setType(e.target.value as Doc<"campaigns">["type"])} className="px-3 py-2 rounded-lg border bg-background text-sm">
            <option value="email">Email</option>
            <option value="social">Social</option>
            <option value="ads">Ads</option>
            <option value="sms">SMS</option>
          </select>
          <button onClick={() => void submit()} disabled={!name.trim()} className="flex items-center gap-2 px-4 py-2 bg-electric text-white rounded-lg text-sm font-medium hover:bg-electric-dark disabled:opacity-50">
            <Plus className="w-4 h-4" /> Create
          </button>
        </div>
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>

      {rows.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          No campaigns yet. Create one above to start tracking it.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {rows.map((c) => {
            const TypeIcon = campaignTypeIcons[c.type] || Megaphone;
            return (
              <div key={c._id} className="p-5 rounded-xl bg-card border border-border hover:border-border/80 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <TypeIcon className="w-5 h-5 text-muted-foreground" />
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium capitalize ${campaignStatusColors[c.status]}`}>{c.status}</span>
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-1">{c.name}</h3>
                <p className="text-[10px] text-muted-foreground capitalize mb-3">
                  {c.type} campaign · {new Date(c.createdAt).toLocaleDateString()}
                </p>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="text-center"><p className="text-sm font-bold text-foreground">{c.sent.toLocaleString()}</p><p className="text-[9px] text-muted-foreground">Sent</p></div>
                  <div className="text-center"><p className="text-sm font-bold text-foreground">{c.opened.toLocaleString()}</p><p className="text-[9px] text-muted-foreground">Opened</p></div>
                  <div className="text-center"><p className="text-sm font-bold text-foreground">{c.clicked.toLocaleString()}</p><p className="text-[9px] text-muted-foreground">Clicked</p></div>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={c.status}
                    onChange={(e) => void setStatus({ id: c._id, status: e.target.value as Doc<"campaigns">["status"] })}
                    className="flex-1 px-2 py-1.5 rounded-lg border bg-background text-[11px]"
                  >
                    {campaignStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
                  </select>
                  <button
                    onClick={() => { if (window.confirm(`Delete “${c.name}”?`)) void remove({ id: c._id }); }}
                    title="Delete campaign"
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════
 *  EMAIL TEMPLATES
 * ══════════════════════════════════════════════════════════════ */

const categoryColors: Record<string, string> = { Onboarding: "bg-electric/10 text-electric", Sales: "bg-emerald-500/10 text-emerald-500", Scheduling: "bg-amber-500/10 text-amber-500", Client: "bg-violet-500/10 text-violet-500", Billing: "bg-blue-500/10 text-blue-500", Marketing: "bg-rose-500/10 text-rose-500", Security: "bg-red-500/10 text-red-500" };

export function EmailTemplatesPanel() {
  const templates = useQuery(api.adminRbac.listEmailTemplates);
  const create = useMutation(api.adminRbac.createEmailTemplate);
  const remove = useMutation(api.adminRbac.deleteEmailTemplate);

  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("Marketing");
  const [error, setError] = useState<string | null>(null);

  const rows = templates ?? [];

  const submit = async () => {
    if (!name.trim() || !subject.trim()) return;
    try {
      await create({ name: name.trim(), subject: subject.trim(), category: category.trim() || "Marketing" });
      setName("");
      setSubject("");
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create the template.");
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Email Templates</h1>
          <p className="text-muted-foreground text-sm mt-1">{rows.length} templates</p>
        </div>
      </div>

      <div className="p-5 rounded-xl bg-card border border-border mb-6 space-y-3">
        <h3 className="font-semibold text-sm">New template</h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Template name" className="px-3 py-2 rounded-lg border bg-background text-sm" />
          <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject line" className="sm:col-span-2 px-3 py-2 rounded-lg border bg-background text-sm" />
          <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" className="px-3 py-2 rounded-lg border bg-background text-sm" />
        </div>
        <button onClick={() => void submit()} disabled={!name.trim() || !subject.trim()} className="flex items-center gap-2 px-4 py-2 bg-electric text-white rounded-lg text-sm font-medium hover:bg-electric-dark disabled:opacity-50">
          <Plus className="w-4 h-4" /> Create template
        </button>
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>

      {rows.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          No email templates yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {rows.map((t) => (
            <div key={t._id} className="p-5 rounded-xl bg-card border border-border hover:border-border/80 transition-all group">
              <div className="flex items-center justify-between mb-3">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${categoryColors[t.category] || "bg-muted text-muted-foreground"}`}>{t.category}</span>
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-1">{t.name}</h3>
              <p className="text-[10px] text-muted-foreground mb-3 truncate">{t.subject}</p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground">Edited {new Date(t.lastEdited).toLocaleDateString()}</span>
                <button
                  onClick={() => { if (window.confirm(`Delete “${t.name}”?`)) void remove({ id: t._id }); }}
                  title="Delete template"
                  className="p-1 rounded text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════
 *  CTAs MANAGER
 * ══════════════════════════════════════════════════════════════ */

export function CTAsPanel() {
  const ctas = useQuery(api.adminRbac.listCTAs);
  const create = useMutation(api.adminRbac.createCTA);
  const toggle = useMutation(api.adminRbac.toggleCTAVisibility);
  const remove = useMutation(api.adminRbac.deleteCTA);

  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");
  const [style, setStyle] = useState("Primary Blue");
  const [error, setError] = useState<string | null>(null);

  const rows = ctas ?? [];

  const submit = async () => {
    if (!label.trim() || !url.trim()) return;
    try {
      await create({ label: label.trim(), url: url.trim(), style });
      setLabel("");
      setUrl("");
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create the CTA.");
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">CTAs</h1>
          <p className="text-muted-foreground text-sm mt-1">{rows.length} call-to-action buttons</p>
        </div>
      </div>

      <div className="p-5 rounded-xl bg-card border border-border mb-6 space-y-3">
        <h3 className="font-semibold text-sm">New CTA</h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Label" className="px-3 py-2 rounded-lg border bg-background text-sm" />
          <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="/contact" className="px-3 py-2 rounded-lg border bg-background text-sm" />
          <input value={style} onChange={(e) => setStyle(e.target.value)} placeholder="Style" className="px-3 py-2 rounded-lg border bg-background text-sm" />
          <button onClick={() => void submit()} disabled={!label.trim() || !url.trim()} className="flex items-center justify-center gap-2 px-4 py-2 bg-electric text-white rounded-lg text-sm font-medium hover:bg-electric-dark disabled:opacity-50">
            <Plus className="w-4 h-4" /> Add CTA
          </button>
        </div>
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>

      {rows.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          No CTAs yet.
        </div>
      ) : (
        <div className="rounded-xl bg-card border border-border overflow-hidden">
          <div className="divide-y divide-border">
            {rows.map((cta) => (
              <div key={cta._id} className="flex flex-wrap items-center gap-4 px-5 py-3.5 hover:bg-muted/30 transition-colors">
                <button
                  onClick={() => void toggle({ id: cta._id, visible: !cta.visible })}
                  title={cta.visible ? "Hide CTA" : "Show CTA"}
                  className={`p-1 rounded ${cta.visible ? "text-emerald-500" : "text-muted-foreground"}`}
                >
                  {cta.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <div className="flex-1 min-w-32">
                  <p className="text-sm font-medium text-foreground">{cta.label}</p>
                  <p className="text-[10px] text-muted-foreground">{cta.url}</p>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{cta.style}</span>
                <span className="text-xs text-muted-foreground">{cta.clicks} clicks</span>
                <button
                  onClick={() => { if (window.confirm(`Delete the “${cta.label}” CTA?`)) void remove({ id: cta._id }); }}
                  title="Delete CTA"
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

export function RateLimitingPanel() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Rate Limiting</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Limits are enforced before a request reaches the database. This deployment has no
          rate-limit table or configuration mutation, so the editable form that used to sit here was
          removed instead of pretending to save.
        </p>
      </div>
      <div className="rounded-xl bg-card border border-border p-6 max-w-2xl">
        <h2 className="font-semibold text-sm mb-3">Where limits live today</h2>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Convex function limits and scheduler concurrency, configured in the Convex dashboard.</li>
          <li>• Hosting-provider WAF and bot rules in front of the public site.</li>
          <li>• Attempt caps stored on each verification code record.</li>
        </ul>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════
 *  BLOCKED ACTIVITY
 * ══════════════════════════════════════════════════════════════ */

export function BlockedActivityPanel() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Blocked Activity</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Blocked requests are recorded by the edge/hosting layer, not in this application&apos;s
          database, so there is nothing real to list here yet.
        </p>
      </div>
      <div className="rounded-xl bg-card border border-border py-14 text-center">
        <p className="text-sm text-muted-foreground">
          No blocked-request feed is connected to this panel.
        </p>
        <p className="text-xs text-muted-foreground/70 mt-2">
          Review blocked traffic in the hosting provider&apos;s security dashboard.
        </p>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════
 *  AUDIT LOGS
 * ══════════════════════════════════════════════════════════════ */

export function AuditLogsPanel() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Audit Logs</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Who changed what, and when.
        </p>
      </div>
      <div className="rounded-xl bg-card border border-border py-14 text-center">
        <p className="text-sm text-muted-foreground">
          Admin writes are not yet recorded to an audit table, so this panel has no entries to show.
        </p>
        <p className="text-xs text-muted-foreground/70 mt-2">
          Security events that are recorded live under Security Logs.
        </p>
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
        <p className="text-muted-foreground text-sm mt-1">
          The AI provider key, model allow-list and per-user daily limits are configured in the
          deployment (project secrets and the AI route), never in the database.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl">
        <div className="rounded-xl bg-card border border-border p-6">
          <h2 className="font-semibold text-sm mb-4">Provider</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">API key</dt>
              <dd className="text-foreground">set as deployment secret</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Model allow-list</dt>
              <dd className="text-foreground">server-side allow-list</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Daily limit</dt>
              <dd className="text-foreground">per signed-in account</dd>
            </div>
          </dl>
          <p className="text-xs text-muted-foreground mt-4">
            To rotate the key, update the secret in project settings and redeploy. The browser never
            receives it.
          </p>
        </div>
        <div className="rounded-xl bg-card border border-border p-6">
          <h2 className="font-semibold text-sm mb-4">YasBot</h2>
          <p className="text-sm text-muted-foreground">
            The assistant&apos;s name, greeting and system prompt are part of the site build in
            <code className="mx-1 rounded bg-muted px-1.5 py-0.5 text-[11px]">src/components/YasBot.tsx</code>
            so a change is reviewed and versioned like any other content change.
          </p>
        </div>
      </div>
    </motion.div>
  );
}


/* ══════════════════════════════════════════════════════════════
 *  GENERIC PLACEHOLDER for remaining sections
 * ══════════════════════════════════════════════════════════════ */

export function GenericAdminPanel({
  title,
  description,
  reason,
}: {
  title: string;
  description: string;
  reason?: string;
}) {
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
        <h3 className="font-semibold text-foreground mb-2">Not enabled</h3>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          {reason ??
            "This module is not enabled for this deployment. Website content, plans, staff and leads are fully manageable from the other panels in the sidebar."}
        </p>
      </div>
    </motion.div>
  );
}
