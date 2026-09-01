import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Mail, Phone, CheckCircle2, Clock, XCircle, Eye, MessageSquare } from "lucide-react";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  country: string;
  subject: string;
  message: string;
  status: "new" | "contacted" | "qualified" | "converted" | "lost";
  source: string;
  createdAt: string;
}

const mockLeads: Lead[] = [
  { id: "1", name: "James Mwangi", email: "james@techcorp.co.ke", phone: "+254 712 345 678", company: "TechCorp East Africa", country: "Kenya", subject: "AI Chatbot Integration", message: "We need an AI chatbot for our customer service.", status: "new", source: "Contact Form", createdAt: "2026-09-01T10:30:00Z" },
  { id: "2", name: "Sarah Williams", email: "sarah@greenfield.com", phone: "+44 7700 123456", company: "Greenfield Consulting", country: "United Kingdom", subject: "Web Development", message: "Looking for a corporate website redesign.", status: "contacted", source: "Contact Form", createdAt: "2026-08-31T14:20:00Z" },
  { id: "3", name: "Ahmed Hassan", email: "ahmed@albaraka.ae", phone: "+971 50 123 4567", company: "Al Baraka Group", country: "UAE", subject: "Digital Transformation", message: "Need a complete digital transformation roadmap.", status: "qualified", source: "Meeting Request", createdAt: "2026-08-30T09:15:00Z" },
  { id: "4", name: "Priya Patel", email: "priya@innovate.in", phone: "+91 98765 43210", company: "Innovate India", country: "India", subject: "Workflow Automation", message: "We want to automate our HR onboarding process.", status: "new", source: "Contact Form", createdAt: "2026-08-29T16:45:00Z" },
  { id: "5", name: "Carlos Rodriguez", email: "carlos@latamtech.mx", phone: "+52 55 1234 5678", company: "LatAm Tech Solutions", country: "Mexico", subject: "Security Solutions", message: "Need CCTV and access control for new office.", status: "converted", source: "Appointment", createdAt: "2026-08-28T11:00:00Z" },
  { id: "6", name: "Emily Chen", email: "emily@globalfin.sg", phone: "+65 9123 4567", company: "Global Finance SG", country: "Singapore", subject: "AI Integration", message: "Looking to integrate AI into our trading platform.", status: "new", source: "Contact Form", createdAt: "2026-08-27T08:30:00Z" },
];

const statusConfig = {
  new: { color: "bg-blue-500/10 text-blue-500", icon: Clock, label: "New" },
  contacted: { color: "bg-amber-500/10 text-amber-500", icon: MessageSquare, label: "Contacted" },
  qualified: { color: "bg-violet-500/10 text-violet-500", icon: Eye, label: "Qualified" },
  converted: { color: "bg-emerald-500/10 text-emerald-500", icon: CheckCircle2, label: "Converted" },
  lost: { color: "bg-red-500/10 text-red-500", icon: XCircle, label: "Lost" },
};

export default function LeadsTable() {
  const [leads] = useState(mockLeads);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = leads
    .filter((l) => statusFilter === "all" || l.status === statusFilter)
    .filter((l) => l.name.toLowerCase().includes(search.toLowerCase()) || l.email.toLowerCase().includes(search.toLowerCase()) || l.company.toLowerCase().includes(search.toLowerCase()));

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Lead Management</h1>
        <p className="text-muted-foreground text-sm mt-1">{leads.length} total leads · {leads.filter((l) => l.status === "new").length} new</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        {Object.entries(statusConfig).map(([key, cfg]) => (
          <button key={key} onClick={() => setStatusFilter(statusFilter === key ? "all" : key)} className={`p-3 rounded-xl border transition-all text-left ${statusFilter === key ? "border-electric bg-electric/5" : "bg-card border-border hover:border-border/80"}`}>
            <div className="flex items-center gap-2 mb-1"><cfg.icon className="w-3.5 h-3.5" /><span className="text-xs font-medium">{cfg.label}</span></div>
            <p className="text-xl font-bold">{leads.filter((l) => l.status === key).length}</p>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search leads…" className="w-full pl-9 pr-4 py-2 rounded-lg bg-card border border-border text-sm" />
      </div>

      {/* Table */}
      <div className="rounded-xl bg-card border border-border overflow-hidden">
        <div className="grid grid-cols-12 gap-2 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground border-b border-border bg-muted/30">
          <div className="col-span-3">Contact</div>
          <div className="col-span-2">Company</div>
          <div className="col-span-2">Subject</div>
          <div className="col-span-2 text-center">Status</div>
          <div className="col-span-1">Source</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>
        <div className="divide-y divide-border">
          {filtered.map((lead) => {
            const cfg = statusConfig[lead.status];
            const isExpanded = expandedId === lead.id;
            return (
              <div key={lead.id}>
                <div className="grid grid-cols-12 gap-2 px-4 py-3 items-center hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : lead.id)}>
                  <div className="col-span-3">
                    <p className="text-sm font-medium text-foreground">{lead.name}</p>
                    <p className="text-[10px] text-muted-foreground">{lead.email}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-foreground truncate">{lead.company}</p>
                    <p className="text-[10px] text-muted-foreground">{lead.country}</p>
                  </div>
                  <div className="col-span-2"><span className="text-sm text-foreground">{lead.subject}</span></div>
                  <div className="col-span-2 flex justify-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${cfg.color}`}>{cfg.label}</span></div>
                  <div className="col-span-1"><span className="text-[10px] text-muted-foreground">{lead.source}</span></div>
                  <div className="col-span-2 flex justify-end gap-1">
                    <a href={`mailto:${lead.email}`} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"><Mail className="w-3.5 h-3.5" /></a>
                    <a href={`tel:${lead.phone}`} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"><Phone className="w-3.5 h-3.5" /></a>
                  </div>
                </div>
                {isExpanded && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="px-4 pb-4 border-t border-border/50">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-3 text-xs">
                      <div><span className="text-muted-foreground">Phone:</span> <span className="text-foreground">{lead.phone}</span></div>
                      <div><span className="text-muted-foreground">Country:</span> <span className="text-foreground">{lead.country}</span></div>
                      <div><span className="text-muted-foreground">Source:</span> <span className="text-foreground">{lead.source}</span></div>
                      <div><span className="text-muted-foreground">Date:</span> <span className="text-foreground">{new Date(lead.createdAt).toLocaleDateString()}</span></div>
                    </div>
                    <div className="mt-3 p-3 rounded-lg bg-muted/50 text-sm text-foreground">{lead.message}</div>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
        {filtered.length === 0 && <div className="py-12 text-center text-muted-foreground text-sm">No leads match your filter.</div>}
      </div>
    </motion.div>
  );
}
