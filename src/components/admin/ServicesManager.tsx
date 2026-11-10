/**
 * ServicesManager — Convex-backed service catalogue.
 * Edits here drive the public services page and the homepage service grid.
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import { Plus, Search, Eye, EyeOff, Pencil, Trash2, Save, ExternalLink, RefreshCw } from "lucide-react";

type ServiceDoc = Doc<"services">;

const CATEGORIES = ["business", "sales", "marketing", "promotional", "security", "digital", "ai", "fmcg"];

const inputCls = "w-full px-3 py-2 rounded-lg border bg-background text-sm text-foreground";
const labelCls = "block text-xs font-medium text-muted-foreground mb-1.5";

const slugify = (v: string) => v.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default function ServicesManager() {
  const services = useQuery(api.content.adminContent);
  const seed = useMutation(api.content.seedDefaults);
  const upsert = useMutation(api.content.upsertService);
  const setStatus = useMutation(api.content.setServiceStatus);
  const remove = useMutation(api.content.deleteService);

  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ServiceDoc | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("business");
  const [description, setDescription] = useState("");
  const [ctaUrl, setCtaUrl] = useState("");

  const all = services?.services ?? [];
  const filtered = all
    .filter((s) => catFilter === "All" || s.category === catFilter)
    .filter((s) => s.title.toLowerCase().includes(search.toLowerCase()));

  const reset = () => { setOpen(false); setEditing(null); setTitle(""); setCategory("business"); setDescription(""); setCtaUrl(""); };
  const startEdit = (s: ServiceDoc) => {
    setEditing(s); setOpen(true); setTitle(s.title); setCategory(s.category);
    setDescription(s.shortDescription ?? ""); setCtaUrl(s.ctaUrl ?? "");
  };
  const save = async () => {
    if (!title.trim()) return;
    await upsert({
      id: editing?._id,
      title: title.trim(),
      slug: editing?.slug ?? slugify(title),
      category,
      shortDescription: description.trim() || undefined,
      ctaUrl: ctaUrl.trim() || undefined,
      displayOrder: editing?.displayOrder ?? all.length + 1,
      status: editing?.status ?? "published",
    });
    reset();
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Services</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {all.length} service areas · {all.filter((s) => s.status === "published").length} published on the homepage
          </p>
        </div>
        <button onClick={() => { reset(); setOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-electric text-white rounded-lg text-sm font-medium hover:bg-electric-dark">
          <Plus className="w-4 h-4" /> New Service
        </button>
      </div>

      {open && (
        <div className="p-5 rounded-xl border bg-card mb-6 space-y-4">
          <h3 className="font-semibold text-sm">{editing ? "Edit service" : "New service"}</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className={labelCls}>Title</label>
              <input className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Business Development" />
            </div>
            <div>
              <label className={labelCls}>Category</label>
              <select className={inputCls} value={category} onChange={(e) => setCategory(e.target.value)}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>CTA link</label>
              <input className={inputCls} value={ctaUrl} onChange={(e) => setCtaUrl(e.target.value)} placeholder="/#services" />
            </div>
          </div>
          <div>
            <label className={labelCls}>Short description</label>
            <textarea rows={3} className={inputCls} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="flex gap-2">
            <button onClick={save} className="flex items-center gap-2 px-4 py-2 bg-electric text-white rounded-lg text-sm font-medium hover:bg-electric-dark"><Save className="w-4 h-4" /> Save service</button>
            <button onClick={reset} className="px-4 py-2 border border-border rounded-lg text-sm hover:bg-muted">Cancel</button>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search services…" className="w-full pl-9 pr-3 py-2 rounded-lg border bg-card text-sm" />
        </div>
        <div className="flex flex-wrap gap-2">
          {["All", ...CATEGORIES].map((c) => (
            <button key={c} onClick={() => setCatFilter(c)} className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize ${catFilter === c ? "bg-electric text-white" : "bg-card border border-border text-muted-foreground hover:text-foreground"}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {all.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-10 text-center">
          <p className="text-sm text-muted-foreground mb-4">No services yet.</p>
          <button onClick={() => void seed()} className="flex items-center gap-2 px-4 py-2 bg-electric text-white rounded-lg text-sm mx-auto">
            <RefreshCw className="w-4 h-4" /> Load website defaults
          </button>
        </div>
      ) : (
        <div className="rounded-xl bg-card border border-border overflow-hidden divide-y divide-border">
          {filtered.map((s) => (
            <div key={s._id} className="flex flex-wrap items-center gap-3 px-5 py-4 hover:bg-muted/30">
              <span className="text-xs text-muted-foreground w-5">{s.displayOrder}</span>
              <div className="flex-1 min-w-40">
                <p className="text-sm font-medium text-foreground">{s.title}</p>
                <p className="text-[10px] text-muted-foreground capitalize">{s.category} · {s.shortDescription ?? "No description"}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${s.status === "published" ? "bg-emerald-500/10 text-emerald-500" : "bg-muted text-muted-foreground"}`}>{s.status}</span>
              <button onClick={() => void setStatus({ id: s._id, status: s.status === "published" ? "draft" : "published" })} className={`p-1.5 rounded hover:bg-muted ${s.status === "published" ? "text-emerald-500" : "text-muted-foreground"}`} title={s.status === "published" ? "Unpublish" : "Publish"}>
                {s.status === "published" ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
              {s.ctaUrl && <a href={s.ctaUrl} target="_blank" rel="noreferrer" className="p-1.5 rounded hover:bg-muted text-muted-foreground"><ExternalLink className="w-4 h-4" /></a>}
              <button onClick={() => startEdit(s)} className="p-1.5 rounded hover:bg-muted text-muted-foreground"><Pencil className="w-4 h-4" /></button>
              <button onClick={() => void remove({ id: s._id })} className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
