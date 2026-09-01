import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Users, Eye, Clock, Globe, BarChart3 } from "lucide-react";

const metrics = [
  { label: "Page Views", value: "24,891", change: "+12.3%", up: true, icon: Eye },
  { label: "Unique Visitors", value: "8,234", change: "+8.7%", up: true, icon: Users },
  { label: "Avg. Session", value: "3m 42s", change: "+15.1%", up: true, icon: Clock },
  { label: "Bounce Rate", value: "34.2%", change: "-2.1%", up: true, icon: TrendingDown },
  { label: "Conversion Rate", value: "2.8%", change: "+0.4%", up: true, icon: TrendingUp },
  { label: "Top Country", value: "Kenya", change: "38%", up: true, icon: Globe },
];

const weeklyData = [
  { day: "Mon", views: 3200, visitors: 1100 },
  { day: "Tue", views: 3800, visitors: 1300 },
  { day: "Wed", views: 4100, visitors: 1500 },
  { day: "Thu", views: 3600, visitors: 1200 },
  { day: "Fri", views: 4500, visitors: 1600 },
  { day: "Sat", views: 2800, visitors: 900 },
  { day: "Sun", views: 2100, visitors: 700 },
];

const topPages = [
  { page: "/", views: 8432, pct: 34 },
  { page: "/services", views: 4123, pct: 17 },
  { page: "/about", views: 3210, pct: 13 },
  { page: "/pricing", views: 2890, pct: 12 },
  { page: "/contact", views: 2345, pct: 9 },
  { page: "/tabloid", views: 1890, pct: 8 },
];

const maxViews = Math.max(...weeklyData.map((d) => d.views));

export default function AnalyticsDashboard() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground text-sm mt-1">Website traffic and engagement metrics (last 30 days)</p>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        {metrics.map((m) => (
          <div key={m.label} className="p-4 rounded-xl bg-card border border-border">
            <m.icon className="w-4 h-4 text-muted-foreground mb-2" />
            <p className="text-xl font-bold text-foreground">{m.value}</p>
            <p className="text-[10px] text-muted-foreground mt-1">{m.label}</p>
            <p className={`text-[10px] font-medium mt-1 ${m.up ? "text-emerald-500" : "text-red-500"}`}>{m.change}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar chart */}
        <div className="rounded-xl bg-card border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground text-sm">Weekly Traffic</h3>
            <BarChart3 className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="flex items-end gap-2 h-40">
            {weeklyData.map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full rounded-t-md bg-electric/20 relative" style={{ height: `${(d.views / maxViews) * 100}%` }}>
                  <div className="absolute bottom-0 w-full rounded-t-md bg-electric/60" style={{ height: `${(d.visitors / d.views) * 100}%` }} />
                </div>
                <span className="text-[10px] text-muted-foreground">{d.day}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-3 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-electric/60" /> Visitors</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-electric/20" /> Total Views</span>
          </div>
        </div>

        {/* Top pages */}
        <div className="rounded-xl bg-card border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground text-sm">Top Pages</h3>
            <Globe className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="space-y-3">
            {topPages.map((p) => (
              <div key={p.page} className="flex items-center gap-3">
                <span className="text-sm text-foreground font-mono flex-1 truncate">{p.page}</span>
                <div className="w-32 h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-electric/60" style={{ width: `${p.pct}%` }} />
                </div>
                <span className="text-xs text-muted-foreground w-16 text-right">{p.views.toLocaleString()}</span>
                <span className="text-[10px] text-muted-foreground w-8 text-right">{p.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
