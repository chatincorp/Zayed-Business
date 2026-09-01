import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Search, Eye, EyeOff, GripVertical, Edit3, Trash2,
  ExternalLink,
} from "lucide-react";

interface Service {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  visible: boolean;
  order: number;
}

const initialServices: Service[] = [
  { id: "1", title: "Strategic Business Planning", slug: "strategic-business-planning", category: "Business Development", description: "Develop growth strategies and market positioning.", visible: true, order: 1 },
  { id: "2", title: "Sales Strategy Development", slug: "sales-strategy-development", category: "Business Development", description: "Build sales pipelines and conversion frameworks.", visible: true, order: 2 },
  { id: "3", title: "Marketing Strategy Planning", slug: "marketing-strategy-planning", category: "Business Development", description: "Digital marketing and lead generation strategies.", visible: true, order: 3 },
  { id: "4", title: "Custom Corporate Websites", slug: "custom-corporate-websites", category: "Technology", description: "Modern responsive websites built for business growth.", visible: true, order: 4 },
  { id: "5", title: "Custom WordPress Themes", slug: "custom-wordpress-themes", category: "Technology", description: "Tailored WordPress solutions beyond generic templates.", visible: true, order: 5 },
  { id: "6", title: "AI System Integration", slug: "ai-system-integration", category: "Technology", description: "Integrate AI into business processes and platforms.", visible: true, order: 6 },
  { id: "7", title: "Custom AI Chatbots", slug: "custom-ai-chatbots", category: "Technology", description: "Intelligent conversational systems for customer engagement.", visible: true, order: 7 },
  { id: "8", title: "Workflow Automation", slug: "workflow-automation", category: "Technology", description: "Streamline repetitive processes with intelligent automation.", visible: true, order: 8 },
  { id: "9", title: "CCTV & Surveillance Systems", slug: "cctv-surveillance-systems", category: "Security", description: "Complete security infrastructure and monitoring.", visible: true, order: 9 },
  { id: "10", title: "Access Control Systems", slug: "access-control-systems", category: "Security", description: "Physical and digital access control solutions.", visible: false, order: 10 },
];

const categories = ["All", "Business Development", "Technology", "Security"];

export default function ServicesManager() {
  const [services, setServices] = useState(initialServices);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [showCreate, setShowCreate] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newCat, setNewCat] = useState("Technology");
  const [newDesc, setNewDesc] = useState("");

  const filtered = services
    .filter((s) => catFilter === "All" || s.category === catFilter)
    .filter((s) => s.title.toLowerCase().includes(search.toLowerCase()));

  const toggleVisible = (id: string) => {
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, visible: !s.visible } : s)));
  };

  const deleteService = (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  const handleCreate = () => {
    if (!newTitle.trim()) return;
    const slug = newTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    setServices((prev) => [
      ...prev,
      { id: Date.now().toString(), title: newTitle, slug, category: newCat, description: newDesc, visible: true, order: prev.length + 1 },
    ]);
    setNewTitle("");
    setNewDesc("");
    setShowCreate(false);
  };

  const handleEdit = (id: string, title: string, desc: string) => {
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, title, description: desc } : s)));
    setEditId(null);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Service Manager</h1>
          <p className="text-muted-foreground text-sm mt-1">{services.length} services · {services.filter((s) => s.visible).length} visible</p>
        </div>
        <button onClick={() => setShowCreate(!showCreate)} className="flex items-center gap-2 px-4 py-2 bg-electric text-white rounded-lg text-sm font-medium hover:bg-electric-dark transition-colors">
          <Plus className="w-4 h-4" /> New Service
        </button>
      </div>

      {/* Create form */}
      <AnimatePresence>
        {showCreate && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mb-6">
            <div className="p-5 rounded-xl bg-card border border-border space-y-4">
              <h3 className="font-semibold text-sm">Create New Service</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input placeholder="Service title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="px-3 py-2 rounded-lg border bg-background text-sm" />
                <select value={newCat} onChange={(e) => setNewCat(e.target.value)} className="px-3 py-2 rounded-lg border bg-background text-sm">
                  {categories.filter((c) => c !== "All").map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <textarea placeholder="Description" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} rows={2} className="w-full px-3 py-2 rounded-lg border bg-background text-sm resize-none" />
              <div className="flex gap-2">
                <button onClick={handleCreate} className="px-4 py-2 bg-electric text-white rounded-lg text-sm font-medium hover:bg-electric-dark">Create</button>
                <button onClick={() => setShowCreate(false)} className="px-4 py-2 border rounded-lg text-sm">Cancel</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search services…" className="w-full pl-9 pr-4 py-2 rounded-lg bg-card border border-border text-sm" />
        </div>
        <div className="flex gap-1.5">
          {categories.map((c) => (
            <button key={c} onClick={() => setCatFilter(c)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${catFilter === c ? "bg-electric text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>{c}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl bg-card border border-border overflow-hidden">
        <div className="grid grid-cols-12 gap-2 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground border-b border-border bg-muted/30">
          <div className="col-span-1" />
          <div className="col-span-4">Service</div>
          <div className="col-span-2">Category</div>
          <div className="col-span-2 text-center">Status</div>
          <div className="col-span-3 text-right">Actions</div>
        </div>
        <div className="divide-y divide-border">
          {filtered.map((service) => (
            <div key={service.id} className="grid grid-cols-12 gap-2 px-4 py-3 items-center hover:bg-muted/30 transition-colors group">
              <div className="col-span-1"><GripVertical className="w-4 h-4 text-muted-foreground/30 group-hover:text-muted-foreground cursor-grab" /></div>
              <div className="col-span-4">
                {editId === service.id ? (
                  <input defaultValue={service.title} onBlur={(e) => handleEdit(service.id, e.target.value, service.description)} className="w-full px-2 py-1 rounded border bg-background text-sm" autoFocus />
                ) : (
                  <>
                    <p className="text-sm font-medium text-foreground">{service.title}</p>
                    <p className="text-[10px] text-muted-foreground">/{service.slug}</p>
                  </>
                )}
              </div>
              <div className="col-span-2"><span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{service.category}</span></div>
              <div className="col-span-2 flex justify-center">
                <button onClick={() => toggleVisible(service.id)} className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${service.visible ? "bg-emerald-500/10 text-emerald-500" : "bg-muted text-muted-foreground"}`}>
                  {service.visible ? <><Eye className="w-3 h-3" /> Visible</> : <><EyeOff className="w-3 h-3" /> Hidden</>}
                </button>
              </div>
              <div className="col-span-3 flex items-center justify-end gap-2">
                <a href={`/services/${service.slug}`} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"><ExternalLink className="w-3.5 h-3.5" /></a>
                <button onClick={() => setEditId(editId === service.id ? null : service.id)} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"><Edit3 className="w-3.5 h-3.5" /></button>
                <button onClick={() => deleteService(service.id)} className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
        {filtered.length === 0 && <div className="py-12 text-center text-muted-foreground text-sm">No services match your filter.</div>}
      </div>
    </motion.div>
  );
}
