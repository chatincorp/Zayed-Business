/**
 * ContentPanels — Convex-backed admin panels for the website content store.
 * Every edit here is persisted to Convex and immediately reflected on the
 * public site (navigation, services, pricing plans, partners, pages...).
 */

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import { GATED_ROUTES, SECTION_FLAG_LABELS } from "@/lib/siteContent";
import {
  Plus, Pencil, Trash2, Eye, EyeOff, FileText, Navigation as NavIcon,
  Layers, HelpCircle, MessageSquare, Handshake, ToggleLeft,
  ToggleRight, CheckCircle2, Save, RefreshCw,
} from "lucide-react";

/* ── Shared shell ─────────────────────────────────────────────── */

function Shell({
  title, subtitle, action, children,
}: {
  title: string;
  subtitle: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          <p className="text-muted-foreground text-sm mt-1">{subtitle}</p>
        </div>
        {action}
      </div>
      {children}
    </motion.div>
  );
}

const inputCls = "w-full px-3 py-2 rounded-lg border bg-background text-sm text-foreground";
const labelCls = "block text-xs font-medium text-muted-foreground mb-1.5";
const primaryBtn = "flex items-center gap-2 px-4 py-2 bg-electric text-white rounded-lg text-sm font-medium hover:bg-electric-dark transition-colors";
const ghostBtn = "px-4 py-2 border border-border rounded-lg text-sm text-foreground hover:bg-muted transition-colors";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      {children}
    </div>
  );
}

function EmptyState({ label, onSeed }: { label: string; onSeed: () => void }) {
  return (
    <div className="rounded-xl border border-dashed border-border p-10 text-center">
      <p className="text-sm text-muted-foreground mb-4">No {label} yet.</p>
      <button onClick={onSeed} className={primaryBtn + " mx-auto"}>
        <RefreshCw className="w-4 h-4" /> Load website defaults
      </button>
    </div>
  );
}

function StatusPill({ active, labels = ["Active", "Hidden"] }: { active: boolean; labels?: [string, string] | string[] }) {
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full ${active ? "bg-emerald-500/10 text-emerald-500" : "bg-muted text-muted-foreground"}`}>
      {active ? labels[0] : labels[1]}
    </span>
  );
}

const slugify = (v: string) => v.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/* ── Pages ────────────────────────────────────────────────────── */

type PageRow = Doc<"pages">;

export function PagesPanel() {
  const content = useQuery(api.content.adminContent);
  const seed = useMutation(api.content.seedDefaults);
  const upsert = useMutation(api.content.upsertPage);
  const remove = useMutation(api.content.deletePage);

  const [editing, setEditing] = useState<PageRow | null>(null);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [status, setStatus] = useState<"draft" | "published" | "scheduled" | "archived">("published");

  const reset = () => { setEditing(null); setOpen(false); setTitle(""); setSlug(""); setStatus("published"); };
  const startEdit = (p: PageRow) => {
    setEditing(p); setOpen(true); setTitle(p.title); setSlug(p.slug); setStatus(p.status);
  };
  const save = async () => {
    if (!title.trim()) return;
    await upsert({ id: editing?._id, title: title.trim(), slug: slug.trim() || `/${slugify(title)}`, status });
    reset();
  };

  const pages = content?.pages ?? [];
  return (
    <Shell
      title="Pages"
      subtitle={`${pages.length} pages · ${pages.filter((p) => p.status === "published").length} published · publishing controls whether that route is live`}
      action={
        <button onClick={() => { reset(); setOpen(true); }} className={primaryBtn}>
          <Plus className="w-4 h-4" /> New Page
        </button>
      }
    >
      {open && (
        <div className="p-5 rounded-xl border bg-card mb-6 space-y-4">
          <h3 className="font-semibold text-sm">{editing ? "Edit page" : "New page"}</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Title"><input className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="About Us" /></Field>
            <Field label="Slug"><input className={inputCls} value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="/about" /></Field>
            <Field label="Status">
              <select className={inputCls} value={status} onChange={(e) => setStatus(e.target.value as typeof status)}>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="scheduled">Scheduled</option>
                <option value="archived">Archived</option>
              </select>
            </Field>
          </div>
          <div className="flex gap-2">
            <button onClick={save} className={primaryBtn}><Save className="w-4 h-4" /> Save page</button>
            <button onClick={reset} className={ghostBtn}>Cancel</button>
          </div>
        </div>
      )}

      {pages.length === 0 ? (
        <EmptyState label="pages" onSeed={() => void seed()} />
      ) : (
        <div className="rounded-xl bg-card border border-border overflow-hidden divide-y divide-border">
          {pages.map((page) => (
            <div key={page._id} className="flex flex-wrap items-center gap-3 px-5 py-4 hover:bg-muted/30">
              <FileText className="w-5 h-5 text-muted-foreground shrink-0" />
              <div className="flex-1 min-w-32">
                <p className="text-sm font-medium text-foreground">{page.title}</p>
                <p className="text-[10px] text-muted-foreground">{page.slug}</p>
              </div>
              {!(GATED_ROUTES as readonly string[]).includes(page.slug) && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground" title="No public route uses this slug, so its status has no effect">
                  no route
                </span>
              )}
              <StatusPill active={page.status === "published"} labels={[page.status, page.status]} />
              <span className="text-xs text-muted-foreground hidden sm:block">
                {new Date(page.updatedAt).toLocaleDateString()}
              </span>
              <button onClick={() => startEdit(page)} className="p-1.5 rounded hover:bg-muted text-muted-foreground"><Pencil className="w-4 h-4" /></button>
              <button onClick={() => void remove({ id: page._id })} className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      )}
    </Shell>
  );
}

/* ── Navigation ───────────────────────────────────────────────── */

type NavRow = Doc<"navigation">;

export function NavigationPanel() {
  const content = useQuery(api.content.adminContent);
  const seed = useMutation(api.content.seedDefaults);
  const upsert = useMutation(api.content.upsertNavItem);
  const remove = useMutation(api.content.deleteNavItem);

  const [editing, setEditing] = useState<NavRow | null>(null);
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState("");
  const [href, setHref] = useState("");

  const reset = () => { setEditing(null); setOpen(false); setLabel(""); setHref(""); };
  const startEdit = (n: NavRow) => { setEditing(n); setOpen(true); setLabel(n.label); setHref(n.href); };

  const save = async () => {
    if (!label.trim() || !href.trim()) return;
    const items = (content?.nav ?? []).filter((n) => n.menu === "header");
    await upsert({
      id: editing?._id,
      label: label.trim(),
      href: href.trim(),
      order: editing?.order ?? items.length + 1,
      visible: editing?.visible ?? true,
      menu: "header",
    });
    reset();
  };

  const items = (content?.nav ?? []).filter((n) => n.menu === "header");
  return (
    <Shell
      title="Navigation"
      subtitle="Header menu items. Changes appear across the site immediately."
      action={<button onClick={() => { reset(); setOpen(true); }} className={primaryBtn}><Plus className="w-4 h-4" /> Add Item</button>}
    >
      {open && (
        <div className="p-5 rounded-xl border bg-card mb-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Label"><input className={inputCls} value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Pricing" /></Field>
            <Field label="Link"><input className={inputCls} value={href} onChange={(e) => setHref(e.target.value)} placeholder="/pricing" /></Field>
          </div>
          <div className="flex gap-2">
            <button onClick={save} className={primaryBtn}><Save className="w-4 h-4" /> Save item</button>
            <button onClick={reset} className={ghostBtn}>Cancel</button>
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <EmptyState label="navigation items" onSeed={() => void seed()} />
      ) : (
        <div className="rounded-xl bg-card border border-border overflow-hidden divide-y divide-border">
          {items.map((item) => (
            <div key={item._id} className="flex flex-wrap items-center gap-3 px-5 py-4 hover:bg-muted/30">
              <span className="text-xs text-muted-foreground w-6">#{item.order}</span>
              <NavIcon className="w-5 h-5 text-muted-foreground" />
              <div className="flex-1 min-w-28">
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                <p className="text-[10px] text-muted-foreground">{item.href}</p>
              </div>
              <button
                onClick={() => void upsert({ id: item._id, label: item.label, href: item.href, order: item.order, visible: !item.visible, menu: item.menu })}
                className={`p-1.5 rounded hover:bg-muted ${item.visible ? "text-emerald-500" : "text-muted-foreground"}`}
                title={item.visible ? "Hide from site" : "Show on site"}
              >
                {item.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
              <button onClick={() => startEdit(item)} className="p-1.5 rounded hover:bg-muted text-muted-foreground"><Pencil className="w-4 h-4" /></button>
              <button onClick={() => void remove({ id: item._id })} className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      )}
    </Shell>
  );
}

/* ── Landing pages ────────────────────────────────────────────── */

type LandingRow = Doc<"landingPages">;

export function LandingPagesPanel() {
  const content = useQuery(api.content.adminContent);
  const seed = useMutation(api.content.seedDefaults);
  const upsert = useMutation(api.content.upsertLandingPage);
  const remove = useMutation(api.content.deleteLandingPage);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<LandingRow | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [target, setTarget] = useState("");
  const [status, setStatus] = useState<"draft" | "published" | "scheduled">("published");

  const reset = () => { setOpen(false); setEditing(null); setTitle(""); setSlug(""); setTarget(""); setStatus("published"); };
  const startEdit = (lp: LandingRow) => {
    setEditing(lp); setOpen(true); setTitle(lp.title); setSlug(lp.slug); setTarget(lp.targetService ?? ""); setStatus(lp.status);
  };
  const save = async () => {
    if (!title.trim()) return;
    await upsert({
      id: editing?._id,
      title: title.trim(),
      slug: slug.trim() || `/${slugify(title)}`,
      targetService: target.trim() || undefined,
      status,
      conversionRate: editing?.conversionRate,
    });
    reset();
  };

  const pages = content?.landingPages ?? [];
  return (
    <Shell
      title="Landing Pages"
      subtitle={`${pages.length} landing pages · ${pages.filter((p) => p.status === "published").length} published`}
      action={<button onClick={() => { reset(); setOpen(true); }} className={primaryBtn}><Plus className="w-4 h-4" /> New Landing Page</button>}
    >
      {open && (
        <div className="p-5 rounded-xl border bg-card mb-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-4">
            <Field label="Title"><input className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} /></Field>
            <Field label="Slug"><input className={inputCls} value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="/ai" /></Field>
            <Field label="Target service"><input className={inputCls} value={target} onChange={(e) => setTarget(e.target.value)} placeholder="AI & Automation" /></Field>
            <Field label="Status">
              <select className={inputCls} value={status} onChange={(e) => setStatus(e.target.value as typeof status)}>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </Field>
          </div>
          <div className="flex gap-2">
            <button onClick={save} className={primaryBtn}><Save className="w-4 h-4" /> Save</button>
            <button onClick={reset} className={ghostBtn}>Cancel</button>
          </div>
        </div>
      )}

      {pages.length === 0 ? (
        <EmptyState label="landing pages" onSeed={() => void seed()} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {pages.map((lp) => (
            <div key={lp._id} className="rounded-xl bg-card border border-border p-5">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-sm font-semibold text-foreground">{lp.title}</h3>
                <StatusPill active={lp.status === "published"} labels={["live", lp.status]} />
              </div>
              <p className="text-[10px] text-muted-foreground mb-3">{lp.slug}</p>
              <p className="text-xs text-muted-foreground mb-4">{lp.targetService ?? "General"}</p>
              <div className="flex gap-2">
                <button onClick={() => startEdit(lp)} className="flex-1 px-2 py-1.5 rounded text-xs border border-border hover:bg-muted">Edit</button>
                <button onClick={() => void remove({ id: lp._id })} className="px-2 py-1.5 rounded text-xs text-muted-foreground hover:text-destructive hover:bg-muted"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Shell>
  );
}

/* ── Plans (checkout) ─────────────────────────────────────────── */

type PlanRow = Doc<"plans">;

export function PlansPanel() {
  const content = useQuery(api.content.adminContent);
  const seed = useMutation(api.content.seedDefaults);
  const upsert = useMutation(api.content.upsertPlan);
  const remove = useMutation(api.content.deletePlan);
  const setActive = useMutation(api.content.setPlanActive);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<PlanRow | null>(null);
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [price, setPrice] = useState("");
  const [custom, setCustom] = useState(false);
  const [period, setPeriod] = useState("month");
  const [features, setFeatures] = useState("");
  const [popular, setPopular] = useState(false);

  const reset = () => {
    setOpen(false); setEditing(null); setName(""); setTagline(""); setPrice("");
    setCustom(false); setPeriod("month"); setFeatures(""); setPopular(false);
  };
  const startEdit = (p: PlanRow) => {
    setEditing(p); setOpen(true); setName(p.name); setTagline(p.tagline ?? "");
    setPrice(p.priceUsd != null ? String(p.priceUsd) : "");
    setCustom(p.priceUsd == null); setPeriod(p.period); setFeatures(p.features.join("\n")); setPopular(Boolean(p.popular));
  };
  const save = async () => {
    if (!name.trim()) return;
    const plans = content?.plans ?? [];
    await upsert({
      id: editing?._id,
      name: name.trim(),
      tagline: tagline.trim() || undefined,
      priceUsd: custom ? undefined : Number(price) || 0,
      priceLabel: custom ? "Custom" : undefined,
      period: custom ? "" : period,
      features: features.split("\n").map((f) => f.trim()).filter(Boolean),
      active: editing?.active ?? true,
      popular,
      taxNote: "Prices are not inclusive of Tax",
      order: editing?.order ?? plans.length + 1,
    });
    reset();
  };

  const plans = content?.plans ?? [];
  return (
    <Shell
      title="Checkout & Subscription Plans"
      subtitle="Plans shown on /pricing and used at /checkout. Prices are never inclusive of tax."
      action={<button onClick={() => { reset(); setOpen(true); }} className={primaryBtn}><Plus className="w-4 h-4" /> Add Plan</button>}
    >
      {open && (
        <div className="p-5 rounded-xl border bg-card mb-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="Plan name"><input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="Premium" /></Field>
            <Field label="Tagline"><input className={inputCls} value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="For growing teams" /></Field>
            <Field label="Price (USD)">
              <input className={inputCls} value={price} onChange={(e) => setPrice(e.target.value)} disabled={custom} placeholder="499" inputMode="numeric" />
            </Field>
            <Field label="Billing period">
              <select className={inputCls} value={period} onChange={(e) => setPeriod(e.target.value)} disabled={custom}>
                <option value="month">per month</option>
                <option value="year">per year</option>
              </select>
            </Field>
          </div>
          <Field label="Features (one per line)">
            <textarea rows={5} className={inputCls} value={features} onChange={(e) => setFeatures(e.target.value)} />
          </Field>
          <div className="flex flex-wrap gap-4 text-sm">
            <label className="flex items-center gap-2"><input type="checkbox" checked={custom} onChange={(e) => setCustom(e.target.checked)} /> Custom pricing</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={popular} onChange={(e) => setPopular(e.target.checked)} /> Mark as popular</label>
          </div>
          <div className="flex gap-2">
            <button onClick={save} className={primaryBtn}><Save className="w-4 h-4" /> Save plan</button>
            <button onClick={reset} className={ghostBtn}>Cancel</button>
          </div>
        </div>
      )}

      {plans.length === 0 ? (
        <EmptyState label="plans" onSeed={() => void seed()} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div key={plan._id} className="rounded-xl bg-card border border-border p-6 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
                <button onClick={() => void setActive({ id: plan._id, active: !plan.active })} title="Toggle plan visibility">
                  {plan.active ? <ToggleRight className="w-6 h-6 text-emerald-500" /> : <ToggleLeft className="w-6 h-6 text-muted-foreground" />}
                </button>
              </div>
              {plan.tagline && <p className="text-xs text-muted-foreground mb-3">{plan.tagline}</p>}
              <div className="mb-4">
                <span className="text-3xl font-bold text-foreground">
                  {plan.priceUsd != null ? `$${plan.priceUsd.toLocaleString()}` : plan.priceLabel ?? "Custom"}
                </span>
                {plan.period && <span className="text-muted-foreground">/{plan.period}</span>}
              </div>
              <div className="space-y-2 mb-4 flex-1">
                {plan.features.map((f, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-foreground">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
              <div className="p-3 rounded-lg bg-muted/50 mb-4">
                <p className="text-xs text-muted-foreground">{plan.taxNote}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => startEdit(plan)} className="flex-1 px-3 py-2 rounded-lg border border-border text-sm hover:bg-muted">Edit</button>
                <button onClick={() => void remove({ id: plan._id })} className="px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-destructive">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 p-4 rounded-xl bg-muted/50">
        <p className="text-muted-foreground text-xs leading-relaxed">
          Note: All prices displayed on the checkout page are exclusive of tax. Applicable taxes are calculated during checkout based on the customer&apos;s location.
        </p>
      </div>
    </Shell>
  );
}

/* ── FAQs ─────────────────────────────────────────────────────── */

type FaqRow = Doc<"faqs">;

export function FaqsPanel() {
  const content = useQuery(api.content.adminContent);
  const seed = useMutation(api.content.seedDefaults);
  const upsert = useMutation(api.content.upsertFaq);
  const toggle = useMutation(api.content.toggleFaq);
  const remove = useMutation(api.content.deleteFaq);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<FaqRow | null>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [category, setCategory] = useState("General");

  const reset = () => { setOpen(false); setEditing(null); setQuestion(""); setAnswer(""); setCategory("General"); };
  const startEdit = (f: FaqRow) => { setEditing(f); setOpen(true); setQuestion(f.question); setAnswer(f.answer); setCategory(f.category); };
  const save = async () => {
    if (!question.trim() || !answer.trim()) return;
    const faqs = content?.faqs ?? [];
    await upsert({
      id: editing?._id,
      question: question.trim(),
      answer: answer.trim(),
      category: category.trim() || "General",
      visible: editing?.visible ?? true,
      order: editing?.order ?? faqs.length + 1,
    });
    reset();
  };

  const faqs = content?.faqs ?? [];
  return (
    <Shell
      title="FAQ"
      subtitle={`${faqs.length} questions · ${faqs.filter((f) => f.visible).length} visible on the site`}
      action={<button onClick={() => { reset(); setOpen(true); }} className={primaryBtn}><Plus className="w-4 h-4" /> New Question</button>}
    >
      {open && (
        <div className="p-5 rounded-xl border bg-card mb-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Question"><input className={inputCls} value={question} onChange={(e) => setQuestion(e.target.value)} /></Field>
            <Field label="Category"><input className={inputCls} value={category} onChange={(e) => setCategory(e.target.value)} /></Field>
          </div>
          <Field label="Answer"><textarea rows={3} className={inputCls} value={answer} onChange={(e) => setAnswer(e.target.value)} /></Field>
          <div className="flex gap-2">
            <button onClick={save} className={primaryBtn}><Save className="w-4 h-4" /> Save</button>
            <button onClick={reset} className={ghostBtn}>Cancel</button>
          </div>
        </div>
      )}

      {faqs.length === 0 ? (
        <EmptyState label="FAQs" onSeed={() => void seed()} />
      ) : (
        <div className="rounded-xl bg-card border border-border overflow-hidden divide-y divide-border">
          {faqs.map((f) => (
            <div key={f._id} className="px-5 py-4 hover:bg-muted/30">
              <div className="flex items-start gap-3">
                <HelpCircle className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{f.question}</p>
                  <p className="text-xs text-muted-foreground mt-1">{f.answer}</p>
                  <p className="text-[10px] text-muted-foreground mt-1.5">{f.category}</p>
                </div>
                <button onClick={() => void toggle({ id: f._id, visible: !f.visible })} className={`p-1.5 rounded hover:bg-muted ${f.visible ? "text-emerald-500" : "text-muted-foreground"}`}>
                  {f.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button onClick={() => startEdit(f)} className="p-1.5 rounded hover:bg-muted text-muted-foreground"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => void remove({ id: f._id })} className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Shell>
  );
}

/* ── Testimonials ─────────────────────────────────────────────── */

type TestimonialRow = Doc<"testimonials">;export function TestimonialsPanel() {
  const content = useQuery(api.content.adminContent);
  const seed = useMutation(api.content.seedDefaults);
  const upsert = useMutation(api.content.upsertTestimonial);
  const setStatus = useMutation(api.content.setTestimonialStatus);
  const remove = useMutation(api.content.deleteTestimonial);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<TestimonialRow | null>(null);
  const [quote, setQuote] = useState("");
  const [clientName, setClientName] = useState("");
  const [position, setPosition] = useState("");

  const reset = () => { setOpen(false); setEditing(null); setQuote(""); setClientName(""); setPosition(""); };
  const startEdit = (t: TestimonialRow) => { setEditing(t); setOpen(true); setQuote(t.quote); setClientName(t.clientName); setPosition(t.position ?? ""); };
  const save = async () => {
    if (!quote.trim() || !clientName.trim()) return;
    const items = content?.testimonials ?? [];
    await upsert({
      id: editing?._id,
      quote: quote.trim(),
      clientName: clientName.trim(),
      position: position.trim() || undefined,
      status: editing?.status ?? "published",
      displayOrder: editing?.displayOrder ?? items.length + 1,
    });
    reset();
  };

  const items = content?.testimonials ?? [];
  return (
    <Shell
      title="Testimonials"
      subtitle={`${items.length} testimonials · ${items.filter((t) => t.status === "published").length} published`}
      action={<button onClick={() => { reset(); setOpen(true); }} className={primaryBtn}><Plus className="w-4 h-4" /> New Testimonial</button>}
    >
      {open && (
        <div className="p-5 rounded-xl border bg-card mb-6 space-y-4">
          <Field label="Quote"><textarea rows={3} className={inputCls} value={quote} onChange={(e) => setQuote(e.target.value)} /></Field>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Client name"><input className={inputCls} value={clientName} onChange={(e) => setClientName(e.target.value)} /></Field>
            <Field label="Position"><input className={inputCls} value={position} onChange={(e) => setPosition(e.target.value)} /></Field>
          </div>
          <div className="flex gap-2">
            <button onClick={save} className={primaryBtn}><Save className="w-4 h-4" /> Save</button>
            <button onClick={reset} className={ghostBtn}>Cancel</button>
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <EmptyState label="testimonials" onSeed={() => void seed()} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {items.map((t) => (
            <div key={t._id} className="rounded-xl bg-card border border-border p-5">
              <MessageSquare className="w-5 h-5 text-electric mb-3" />
              <p className="text-sm text-foreground italic mb-4">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-foreground">{t.clientName}</p>
                  <p className="text-xs text-muted-foreground">{t.position}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => void setStatus({ id: t._id, status: t.status === "published" ? "draft" : "published" })} className={`p-1.5 rounded hover:bg-muted ${t.status === "published" ? "text-emerald-500" : "text-muted-foreground"}`}>
                    {t.status === "published" ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button onClick={() => startEdit(t)} className="p-1.5 rounded hover:bg-muted text-muted-foreground"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => void remove({ id: t._id })} className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Shell>
  );
}

/* ── Partners ─────────────────────────────────────────────────── */

type PartnerRow = Doc<"partners">;

export function PartnersPanel() {
  const content = useQuery(api.content.adminContent);
  const seed = useMutation(api.content.seedDefaults);
  const upsert = useMutation(api.content.upsertPartner);
  const setStatus = useMutation(api.content.setPartnerStatus);
  const remove = useMutation(api.content.deletePartner);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<PartnerRow | null>(null);
  const [name, setName] = useState("");
  const [logo, setLogo] = useState("");
  const [industry, setIndustry] = useState("");
  const [website, setWebsite] = useState("");

  const reset = () => { setOpen(false); setEditing(null); setName(""); setLogo(""); setIndustry(""); setWebsite(""); };
  const startEdit = (p: PartnerRow) => { setEditing(p); setOpen(true); setName(p.name); setLogo(p.logo ?? ""); setIndustry(p.industry ?? ""); setWebsite(p.website ?? ""); };
  const save = async () => {
    if (!name.trim()) return;
    const items = content?.partners ?? [];
    await upsert({
      id: editing?._id,
      name: name.trim(),
      logo: logo.trim() || undefined,
      industry: industry.trim() || undefined,
      website: website.trim() || undefined,
      relationshipType: editing?.relationshipType ?? "technology_partner",
      displayOrder: editing?.displayOrder ?? items.length + 1,
      status: editing?.status ?? "active",
    });
    reset();
  };

  const items = content?.partners ?? [];
  return (
    <Shell
      title="Partners"
      subtitle={`${items.length} partners · ${items.filter((p) => p.status === "active").length} shown in the website logo strip`}
      action={<button onClick={() => { reset(); setOpen(true); }} className={primaryBtn}><Plus className="w-4 h-4" /> New Partner</button>}
    >
      {open && (
        <div className="p-5 rounded-xl border bg-card mb-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-4">
            <Field label="Name"><input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} /></Field>
            <Field label="Logo path"><input className={inputCls} value={logo} onChange={(e) => setLogo(e.target.value)} placeholder="/logos/brand.svg" /></Field>
            <Field label="Industry"><input className={inputCls} value={industry} onChange={(e) => setIndustry(e.target.value)} /></Field>
            <Field label="Website"><input className={inputCls} value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://" /></Field>
          </div>
          <div className="flex gap-2">
            <button onClick={save} className={primaryBtn}><Save className="w-4 h-4" /> Save</button>
            <button onClick={reset} className={ghostBtn}>Cancel</button>
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <EmptyState label="partners" onSeed={() => void seed()} />
      ) : (
        <div className="rounded-xl bg-card border border-border overflow-hidden divide-y divide-border">
          {items.map((p) => (
            <div key={p._id} className="flex flex-wrap items-center gap-3 px-5 py-3.5 hover:bg-muted/30">
              <Handshake className="w-4 h-4 text-muted-foreground" />
              <div className="flex-1 min-w-32">
                <p className="text-sm font-medium text-foreground">{p.name}</p>
                <p className="text-[10px] text-muted-foreground">{p.logo ?? "no logo"}</p>
              </div>
              <StatusPill active={p.status === "active"} labels={["active", "hidden"]} />
              <button onClick={() => void setStatus({ id: p._id, status: p.status === "active" ? "archived" : "active" })} className={`p-1.5 rounded hover:bg-muted ${p.status === "active" ? "text-emerald-500" : "text-muted-foreground"}`}>
                {p.status === "active" ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
              <button onClick={() => startEdit(p)} className="p-1.5 rounded hover:bg-muted text-muted-foreground"><Pencil className="w-4 h-4" /></button>
              <button onClick={() => void remove({ id: p._id })} className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      )}
    </Shell>
  );
}

/* ── Contact form inbox ──────────────────────────────────────── */

export function FormsPanel() {
  const submissions = useQuery(api.adminRbac.listFormSubmissions);
  const setStatus = useMutation(api.adminRbac.updateSubmissionStatus);
  const removeSubmission = useMutation(api.adminRbac.deleteSubmission);
  const unread = (submissions ?? []).filter((s) => s.status === "unread").length;

  return (
    <Shell
      title="Contact Forms"
      subtitle={`${submissions?.length ?? 0} submissions · ${unread} unread`}
    >
      {(submissions?.length ?? 0) === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-10 text-center">
          <p className="text-sm text-muted-foreground">No contact form submissions yet.</p>
          <p className="text-xs text-muted-foreground/70 mt-1">Messages sent from the website contact page will appear here.</p>
        </div>
      ) : (
        <div className="rounded-xl bg-card border border-border overflow-hidden divide-y divide-border">
          {[...(submissions ?? [])].sort((a, b) => b.createdAt - a.createdAt).map((s) => (
            <div key={s._id} className="px-5 py-4 hover:bg-muted/30">
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <p className="text-sm font-medium text-foreground">{s.name}</p>
                <span className="text-xs text-muted-foreground">{s.email}</span>
                {s.phone && <span className="text-xs text-muted-foreground">· {s.phone}</span>}
                {s.company && <span className="text-xs text-muted-foreground">· {s.company}</span>}
                <span className="ml-auto">
                  <StatusPill
                    active={s.status !== "unread"}
                    labels={[s.status, "unread"]}
                  />
                </span>
              </div>
              <p className="text-xs font-medium text-foreground/80 mb-1">{s.subject}</p>
              <p className="text-xs text-muted-foreground">{s.message}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <a href={`mailto:${s.email}`} className="px-3 py-1.5 rounded-lg text-xs border border-border hover:bg-muted">Reply by email</a>
                <button onClick={() => void setStatus({ id: s._id, status: "replied" })} className="px-3 py-1.5 rounded-lg text-xs border border-border hover:bg-muted">Mark replied</button>
                <button onClick={() => void setStatus({ id: s._id, status: "escalated" })} className="px-3 py-1.5 rounded-lg text-xs border border-border hover:bg-muted">Escalate</button>
                <span className="text-[10px] text-muted-foreground ml-auto">{new Date(s.createdAt).toLocaleString()}</span>
                <button onClick={() => { if (window.confirm("Delete this submission?")) void removeSubmission({ id: s._id }); }} className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Shell>
  );
}

/* ── Category-filtered service views (Security / Technology / AI) ── */

export function CategoryServicesPanel({
  category,
  title,
  subtitle,
}: {
  category: string;
  title: string;
  subtitle: string;
}) {
  const content = useQuery(api.content.adminContent);
  const setStatus = useMutation(api.content.setServiceStatus);
  const items = (content?.services ?? []).filter((s) => s.category === category);

  return (
    <Shell title={title} subtitle={subtitle}>
      <div className="mb-4 p-3 rounded-lg bg-muted/50 text-xs text-muted-foreground">
        Published services in this category appear on the website. Create or edit entries in Website → Services.
      </div>
      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          No services in this category yet.
        </div>
      ) : (
        <div className="rounded-xl bg-card border border-border overflow-hidden divide-y divide-border">
          {items.map((s) => (
            <div key={s._id} className="flex flex-wrap items-center gap-3 px-5 py-4 hover:bg-muted/30">
              <div className="flex-1 min-w-40">
                <p className="text-sm font-medium text-foreground">{s.title}</p>
                <p className="text-[10px] text-muted-foreground">{s.shortDescription ?? "No description"}</p>
              </div>
              <StatusPill active={s.status === "published"} labels={["live", "draft"]} />
              <button
                onClick={() => void setStatus({ id: s._id, status: s.status === "published" ? "draft" : "published" })}
                className={`p-1.5 rounded hover:bg-muted ${s.status === "published" ? "text-emerald-500" : "text-muted-foreground"}`}
                title={s.status === "published" ? "Unpublish" : "Publish"}
              >
                {s.status === "published" ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>
          ))}
        </div>
      )}
    </Shell>
  );
}

/* ── Site sections ("Coming Soon" control) ────────────────────── */

export function SiteSectionsPanel() {
  const content = useQuery(api.content.adminContent);
  const seed = useMutation(api.content.seedDefaults);
  const setFlag = useMutation(api.content.setSectionFlag);
  const flags = content?.flags ?? {};

  useEffect(() => {
    if (content && (content.pages?.length ?? 0) === 0) void seed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content === undefined]);

  return (
    <Shell
      title="Site Sections"
      subtitle="Publish or pause public sections. Paused sections show a branded “Coming Soon” page instead of the live content."
      action={
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Layers className="w-4 h-4" /> {SECTION_FLAG_LABELS.filter((s) => flags[s.key]).length}/{SECTION_FLAG_LABELS.length} live
        </div>
      }
    >
      {(content?.pages?.length ?? 0) === 0 ? (
        <EmptyState label="website content" onSeed={() => void seed()} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {SECTION_FLAG_LABELS.map((section) => {
            const enabled = Boolean(flags[section.key]);
            return (
              <div key={section.key} className="rounded-xl bg-card border border-border p-5">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="text-sm font-semibold text-foreground">{section.label}</h3>
                  <button
                    onClick={() => void setFlag({ key: section.key, enabled: !enabled })}
                    title={enabled ? "Pause section" : "Publish section"}
                  >
                    {enabled
                      ? <ToggleRight className="w-7 h-7 text-emerald-500" />
                      : <ToggleLeft className="w-7 h-7 text-muted-foreground" />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">{section.description}</p>
                <p className={`text-[11px] mt-3 font-medium ${enabled ? "text-emerald-500" : "text-amber-500"}`}>
                  {enabled ? "Live on the website" : "Showing Coming Soon"}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </Shell>
  );
}

