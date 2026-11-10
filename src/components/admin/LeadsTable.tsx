import { useState } from "react";
import { motion } from "framer-motion";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Search, Mail, Phone, CheckCircle2, Clock, MessageSquare, ChevronDown } from "lucide-react";

const STATUS_CONFIG: Record<string, { color: string; label: string }> = {
  new: { color: "bg-blue-500/10 text-blue-500", label: "New" },
  verified: { color: "bg-sky-500/10 text-sky-500", label: "Verified" },
  contacted: { color: "bg-amber-500/10 text-amber-500", label: "Contacted" },
  qualified: { color: "bg-violet-500/10 text-violet-500", label: "Qualified" },
  proposal_sent: { color: "bg-indigo-500/10 text-indigo-500", label: "Proposal" },
  negotiation: { color: "bg-orange-500/10 text-orange-500", label: "Negotiation" },
  won: { color: "bg-emerald-500/10 text-emerald-500", label: "Won" },
  lost: { color: "bg-red-500/10 text-red-500", label: "Lost" },
  closed: { color: "bg-muted text-muted-foreground", label: "Closed" },
};

const STATUS_ORDER = Object.keys(STATUS_CONFIG);

export default function LeadsTable() {
  const leads = useQuery(api.leads.list, { limit: 200 });
  const updateStatus = useMutation(api.leads.updateStatus);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const all = leads ?? [];
  const filtered = all
    .filter((l) => statusFilter === "all" || l.status === statusFilter)
    .filter((l) => {
      const q = search.toLowerCase();
      return (
        l.name.toLowerCase().includes(q) ||
        l.personalEmail.toLowerCase().includes(q) ||
        (l.company ?? "").toLowerCase().includes(q)
      );
    });

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Lead Management</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {all.length} total leads · {all.filter((l) => l.status === "new").length} new · live from the website
        </p>
      </div>

      {/* Status filter cards */}
      <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2 mb-6">
        {STATUS_ORDER.map((key) => {
          const cfg = STATUS_CONFIG[key];
          const count = all.filter((l) => l.status === key).length;
          return (
            <button
              key={key}
              onClick={() => setStatusFilter(statusFilter === key ? "all" : key)}
              className={`p-2.5 rounded-xl border transition-all text-left ${
                statusFilter === key ? "border-electric bg-electric/5" : "bg-card border-border hover:border-border/80"
              }`}
            >
              <p className="text-[10px] font-medium text-muted-foreground truncate">{cfg.label}</p>
              <p className="text-lg font-bold text-foreground">{count}</p>
            </button>
          );
        })}
      </div>

      <div className="relative max-w-sm mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, email or company…"
          className="w-full pl-9 pr-4 py-2 rounded-lg bg-card border border-border text-sm"
        />
      </div>

      {all.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-10 text-center">
          <p className="text-sm text-muted-foreground">No leads yet.</p>
          <p className="text-xs text-muted-foreground/70 mt-1">
            Enquiries from the website forms appear here as soon as they are submitted.
          </p>
        </div>
      ) : (
        <div className="rounded-xl bg-card border border-border overflow-hidden">
          <div className="hidden md:grid grid-cols-12 gap-2 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground border-b border-border bg-muted/30">
            <div className="col-span-3">Contact</div>
            <div className="col-span-2">Company</div>
            <div className="col-span-2">Type</div>
            <div className="col-span-2 text-center">Status</div>
            <div className="col-span-1">Date</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>
          <div className="divide-y divide-border">
            {filtered.map((lead) => {
              const cfg = STATUS_CONFIG[lead.status] ?? STATUS_CONFIG.new;
              const isExpanded = expandedId === lead._id;
              return (
                <div key={lead._id}>
                  <div
                    className="grid grid-cols-1 md:grid-cols-12 gap-2 px-4 py-3 md:items-center hover:bg-muted/30 transition-colors cursor-pointer"
                    onClick={() => setExpandedId(isExpanded ? null : lead._id)}
                  >
                    <div className="md:col-span-3">
                      <p className="text-sm font-medium text-foreground">{lead.name}</p>
                      <p className="text-[10px] text-muted-foreground">{lead.personalEmail}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-foreground truncate">{lead.company ?? "—"}</p>
                      <p className="text-[10px] text-muted-foreground">{lead.countryCode ?? ""}</p>
                    </div>
                    <div className="md:col-span-2">
                      <span className="text-xs text-foreground capitalize">{lead.leadType}</span>
                      {lead.service && <p className="text-[10px] text-muted-foreground truncate">{lead.service}</p>}
                    </div>
                    <div className="md:col-span-2 flex md:justify-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${cfg.color}`}>{cfg.label}</span>
                    </div>
                    <div className="md:col-span-1">
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(lead.submittedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="md:col-span-2 flex md:justify-end items-center gap-1">
                      <a
                        href={`mailto:${lead.personalEmail}`}
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        title="Email lead"
                      >
                        <Mail className="w-3.5 h-3.5" />
                      </a>
                      {lead.phone && (
                        <a
                          href={`tel:${lead.phone}`}
                          onClick={(e) => e.stopPropagation()}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                          title="Call lead"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <ChevronDown
                        className={`w-4 h-4 text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`}
                      />
                    </div>
                  </div>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="px-4 pb-4 border-t border-border/50 bg-muted/10"
                    >
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-3 text-xs">
                        <div>
                          <span className="text-muted-foreground">Phone:</span>{" "}
                          <span className="text-foreground">{lead.phone ?? "—"}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Business email:</span>{" "}
                          <span className="text-foreground">{lead.businessEmail ?? "—"}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Source:</span>{" "}
                          <span className="text-foreground">{lead.sourcePage ?? lead.utmSource ?? "Website"}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Received:</span>{" "}
                          <span className="text-foreground">{new Date(lead.submittedAt).toLocaleString()}</span>
                        </div>
                      </div>
                      {lead.message && (
                        <div className="mt-3 p-3 rounded-lg bg-card border border-border text-sm text-foreground">
                          {lead.message}
                        </div>
                      )}
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <label className="text-xs text-muted-foreground">Update status</label>
                        <select
                          value={lead.status}
                          onChange={(e) => void updateStatus({ id: lead._id, status: e.target.value })}
                          className="px-2 py-1.5 rounded-lg bg-card border border-border text-xs text-foreground"
                        >
                          {STATUS_ORDER.map((s) => (
                            <option key={s} value={s}>
                              {STATUS_CONFIG[s].label}
                            </option>
                          ))}
                        </select>
                        {lead.notes && lead.notes.length > 0 && (
                          <span className="text-[10px] text-muted-foreground ml-auto">
                            {lead.notes.length} note{lead.notes.length === 1 ? "" : "s"}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-muted-foreground text-sm">
              {all.length === 0 ? "No leads yet." : "No leads match your filter."}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
