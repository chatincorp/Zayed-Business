import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Users, Eye, Clock, Globe, BarChart3, FileText } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function AnalyticsDashboard() {
  const leadCounts = useQuery(api.leads.counts);
  const formSubmissions = useQuery(api.adminRbac.listFormSubmissions);

  const leads = leadCounts ?? { total: 0, byStatus: {}, byType: {}, byService: {} };
  const byStatus = leads.byStatus ?? {};
  const byType = leads.byType ?? {};
  const formRows = (formSubmissions ?? []) as { status: string }[];

  const inboxes =
    typeof formRows === "number" ? formRows : formRows.filter((r) => r.status === "new").length;

  const metrics = [
    { label: "Total Leads", value: String(leads.total), change: "live", up: true, icon: Users },
    {
      label: "New",
      value: String(byStatus.new ?? 0),
      change: "vs others",
      up: byStatus.new && byStatus.new > 0,
      icon: TrendingUp,
    },
    {
      label: "Converted",
      value: String(((byStatus.won ?? 0) + (byStatus.closed ?? 0))),
      change: "won/closed",
      up: !!byStatus.won,
      icon: TrendingUp,
    },
  ];

  const topInbound = Object.entries(byType ?? {})
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, 6)
    .map(([k, v]) => ({ type: k, count: v as number }));

  const maxInbound =
    topInbound.length > 0
      ? Math.max(...topInbound.map((i) => i.count))
      : 1;
  const max = maxInbound || 1;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Website leads, inboxes, and source mix — backed by Convex in real time
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        {metrics.map((m) => (
          <div key={m.label} className="p-4 rounded-xl bg-card border border-border">
            <m.icon className="w-4 h-4 text-muted-foreground mb-2" />
            <p className="text-xl font-bold text-foreground">{m.value}</p>
            <p className="text-[10px] text-muted-foreground mt-1">{m.label}</p>
            <p className="text-[10px] font-medium mt-1 text-emerald-500">{m.change}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inbound channel bar chart */}
        <div className="rounded-xl bg-card border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground text-sm">Leads by source channel</h3>
            <BarChart3 className="w-4 h-4 text-muted-foreground" />
          </div>
          {topInbound.length === 0 ? (
            <p className="text-sm text-muted-foreground">No leads yet.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {topInbound.map((i) => (
                <div key={i.type} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-24 shrink-0 truncate">{i.type}</span>
                  <div className="flex-1 h-5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-electric/60"
                      style={{ width: `${(i.count / max) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-foreground w-12 text-right">{i.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Contact form inbox */}
        <div className="rounded-xl bg-card border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground text-sm">Contact form inbox</h3>
            <FileText className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            {([
              { label: "New / unreplied", key: "new" },
              { label: "Replied", key: "replied" },
              { label: "Other", key: "other" },
            ] as const).map(({ label, key }) =>
              key === "new" ? (
                <div key={key} className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="text-foreground font-medium">
                    {formRows.filter((r) => r.status === "new").length}
                  </span>
                </div>
              ) : key === "replied" ? (
                <div key={key} className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="text-foreground font-medium">
                    {formRows.filter(
                      (r) =>
                        r.status === "replied" || r.status === "answered" || r.status === "pending",
                    ).length}
                  </span>
                </div>
              ) : (
                <div key={key} className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="text-foreground font-medium">
                    {formRows.filter((r) => r.status && r.status !== "new").length}
                  </span>
                </div>
              ),
            )}
            <div className="flex items-center justify-between text-xs pt-2 border-t border-border">
              <span className="text-muted-foreground">Total submissions</span>
              <span className="text-foreground font-medium">{formRows.length}</span>
            </div>
          </div>
        </div>
      </div>

      {topInbound.length === 0 && formRows.length === 0 && (
        <p className="text-xs text-muted-foreground mt-6">Live data will appear as enquiries arrive.</p>
      )}
    </motion.div>
  );
}
