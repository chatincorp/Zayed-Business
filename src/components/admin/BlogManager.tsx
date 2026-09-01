import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, FileText, Clock, CheckCircle2, Edit3, Trash2 } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  status: "draft" | "scheduled" | "published";
  category: string;
  author: string;
  date: string;
  views: number;
}

const mockPosts: BlogPost[] = [
  { id: "1", title: "How AI is Transforming Business in Africa", status: "published", category: "Technology", author: "Zayed AI", date: "2026-08-28", views: 1234 },
  { id: "2", title: "5 Signs Your Business Needs Digital Transformation", status: "published", category: "Business", author: "Content Desk", date: "2026-08-25", views: 892 },
  { id: "3", title: "The Future of Cybersecurity in East Africa", status: "draft", category: "Security", author: "Zayed AI", date: "2026-08-30", views: 0 },
  { id: "4", title: "Why Custom WordPress Beats Templates", status: "scheduled", category: "Technology", author: "Tech Desk", date: "2026-09-05", views: 0 },
  { id: "5", title: "Building an AI Chatbot: A Practical Guide", status: "draft", category: "AI", author: "Zayed AI", date: "2026-08-31", views: 0 },
];

const statusIcons = { draft: Clock, scheduled: FileText, published: CheckCircle2 };
const statusColors = { draft: "bg-muted text-muted-foreground", scheduled: "bg-amber-500/10 text-amber-500", published: "bg-emerald-500/10 text-emerald-500" };

export default function BlogManager() {
  const [posts] = useState(mockPosts);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filtered = posts
    .filter((p) => filter === "all" || p.status === filter)
    .filter((p) => p.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Blog / Insights</h1>
          <p className="text-muted-foreground text-sm mt-1">{posts.length} articles</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-electric text-white rounded-lg text-sm font-medium hover:bg-electric-dark transition-colors">
          <Plus className="w-4 h-4" /> New Article
        </button>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search articles..." className="w-full pl-9 pr-4 py-2 rounded-lg bg-card border border-border text-sm" />
        </div>
        <div className="flex gap-1.5">
          {["all", "draft", "scheduled", "published"].map((s) => (
            <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all ${filter === s ? "bg-electric text-white" : "bg-muted text-muted-foreground"}`}>{s}</button>
          ))}
        </div>
      </div>

      <div className="rounded-xl bg-card border border-border overflow-hidden">
        <div className="grid grid-cols-12 gap-2 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground border-b border-border bg-muted/30">
          <div className="col-span-5">Title</div>
          <div className="col-span-2">Category</div>
          <div className="col-span-1 text-center">Status</div>
          <div className="col-span-1 text-center">Views</div>
          <div className="col-span-1">Date</div>
          <div className="col-span-1">Author</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>
        <div className="divide-y divide-border">
          {filtered.map((post) => {
            const Icon = statusIcons[post.status];
            return (
              <div key={post.id} className="grid grid-cols-12 gap-2 px-4 py-3 items-center hover:bg-muted/30 transition-colors">
                <div className="col-span-5"><p className="text-sm font-medium text-foreground truncate">{post.title}</p></div>
                <div className="col-span-2"><span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{post.category}</span></div>
                <div className="col-span-1 flex justify-center"><span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${statusColors[post.status]}`}><Icon className="w-3 h-3" />{post.status}</span></div>
                <div className="col-span-1 text-center"><span className="text-sm text-foreground">{post.views.toLocaleString()}</span></div>
                <div className="col-span-1"><span className="text-[10px] text-muted-foreground">{post.date}</span></div>
                <div className="col-span-1"><span className="text-[10px] text-muted-foreground">{post.author}</span></div>
                <div className="col-span-1 flex justify-end gap-1">
                  <button className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"><Edit3 className="w-3.5 h-3.5" /></button>
                  <button className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
