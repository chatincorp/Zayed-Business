import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Globe, Layout, ShoppingCart, ArrowRight, ExternalLink, Monitor, Smartphone, Tablet } from "lucide-react";

const demos = [
  {
    id: "corporate",
    label: "Corporate Website",
    icon: Globe,
    description: "A premium responsive corporate site with navigation, hero, services, team, testimonials and contact.",
    url: "#",
    colors: { primary: "#0a1628", accent: "#0ea5e9", bg: "#f8fafc" },
  },
  {
    id: "webapp",
    label: "Web Application",
    icon: Layout,
    description: "A full-featured dashboard web app with sidebar, data tables, charts and real-time notifications.",
    url: "#",
    colors: { primary: "#1e293b", accent: "#8b5cf6", bg: "#f1f5f9" },
  },
  {
    id: "ecommerce",
    label: "E-Commerce Store",
    icon: ShoppingCart,
    description: "A responsive online store with product grid, cart, checkout and order tracking.",
    url: "#",
    colors: { primary: "#0f172a", accent: "#10b981", bg: "#fafafa" },
  },
];

function CorporateDemo() {
  return (
    <div className="w-full h-full bg-[#f8fafc] text-[#0a1628] overflow-hidden text-[8px] sm:text-[10px]">
      {/* Nav */}
      <div className="flex items-center justify-between px-3 py-2 bg-white border-b border-gray-100">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-[#0ea5e9] flex items-center justify-center">
            <span className="text-white text-[6px] font-bold">YZ</span>
          </div>
          <span className="font-bold text-[7px]">YASIR ZAYED</span>
        </div>
        <div className="flex gap-2 text-gray-400 text-[7px]">
          <span>Home</span>
          <span>Services</span>
          <span>About</span>
          <span>Contact</span>
        </div>
      </div>
      {/* Hero */}
      <div className="relative px-4 py-6 sm:py-8 bg-gradient-to-br from-[#0a1628] to-[#111d32]">
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full" style={{
            backgroundImage: "linear-gradient(rgba(14,165,233,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(14,165,233,0.3) 1px, transparent 1px)",
            backgroundSize: "20px 20px"
          }} />
        </div>
        <div className="relative">
          <div className="text-[#0ea5e9] text-[6px] font-bold uppercase tracking-widest mb-1">Business Development</div>
          <div className="text-white text-[11px] sm:text-sm font-bold mb-1.5 leading-tight">Building Stronger Businesses</div>
          <div className="text-white/40 text-[7px] mb-3 max-w-[60%]">Strategic consulting for growth</div>
          <div className="flex gap-1.5">
            <div className="px-2.5 py-1 bg-[#0ea5e9] text-white rounded text-[7px] font-semibold">Get Started</div>
            <div className="px-2.5 py-1 border border-white/20 text-white/60 rounded text-[7px]">Learn More</div>
          </div>
        </div>
      </div>
      {/* Services grid */}
      <div className="p-3">
        <div className="text-[7px] font-bold text-center mb-2 uppercase tracking-wider text-gray-400">Our Services</div>
        <div className="grid grid-cols-3 gap-1.5">
          {["Business Dev", "Sales", "Marketing", "Security", "Web Dev", "AI"].map((s) => (
            <div key={s} className="p-2 bg-white rounded border border-gray-100 text-center">
              <div className="w-4 h-4 rounded bg-[#0ea5e9]/10 mx-auto mb-1" />
              <div className="text-[6px] font-semibold">{s}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Footer */}
      <div className="px-3 py-2 bg-[#0a1628] text-white/30 text-[6px] flex justify-between">
        <span>© 2026 Yasir Zayed</span>
        <span>Kenya · UK</span>
      </div>
    </div>
  );
}

function WebAppDemo() {
  return (
    <div className="w-full h-full bg-[#f1f5f9] text-[#1e293b] overflow-hidden flex text-[8px] sm:text-[10px]">
      {/* Sidebar */}
      <div className="w-[22%] bg-[#0f172a] text-white/50 p-2 flex flex-col gap-1.5">
        <div className="text-white/90 font-bold text-[7px] mb-2 px-1">YZ Dashboard</div>
        {["Overview", "Leads", "Services", "Revenue", "Team", "Settings"].map((item, i) => (
          <div
            key={item}
            className={`px-2 py-1 rounded text-[7px] ${
              i === 0 ? "bg-[#8b5cf6]/20 text-[#8b5cf6]" : ""
            }`}
          >
            {item}
          </div>
        ))}
      </div>
      {/* Main */}
      <div className="flex-1 p-2 flex flex-col gap-2">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="text-[8px] font-bold">Dashboard Overview</div>
          <div className="flex gap-1">
            <div className="w-5 h-5 rounded-full bg-[#8b5cf6]/20 flex items-center justify-center text-[6px] text-[#8b5cf6] font-bold">A</div>
          </div>
        </div>
        {/* KPIs */}
        <div className="grid grid-cols-4 gap-1.5">
          {[
            { label: "Leads", value: "247", change: "+12%" },
            { label: "Revenue", value: "$48K", change: "+8%" },
            { label: "Conversion", value: "34%", change: "+5%" },
            { label: "Active", value: "89", change: "+3%" },
          ].map((kpi) => (
            <div key={kpi.label} className="p-2 bg-white rounded border border-gray-100">
              <div className="text-[6px] text-gray-400">{kpi.label}</div>
              <div className="text-[10px] font-bold">{kpi.value}</div>
              <div className="text-[6px] text-emerald-500">{kpi.change}</div>
            </div>
          ))}
        </div>
        {/* Chart area */}
        <div className="flex-1 bg-white rounded border border-gray-100 p-2">
          <div className="text-[7px] font-semibold mb-2">Revenue Trend</div>
          <div className="flex items-end gap-1 h-[60%]">
            {[40, 55, 45, 70, 65, 80, 75, 90, 85, 95, 88, 100].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                <motion.div
                  className="w-full rounded-t"
                  style={{ backgroundColor: i === 11 ? "#8b5cf6" : "#e2e8f0" }}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-1 text-[5px] text-gray-300">
            <span>Jan</span><span>Jun</span><span>Dec</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function EcommerceDemo() {
  return (
    <div className="w-full h-full bg-[#fafafa] text-[#0f172a] overflow-hidden text-[8px] sm:text-[10px]">
      {/* Nav */}
      <div className="flex items-center justify-between px-3 py-2 bg-white border-b border-gray-100">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-[#10b981] flex items-center justify-center">
            <span className="text-white text-[6px] font-bold">YZ</span>
          </div>
          <span className="font-bold text-[7px]">YZ STORE</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-2 py-0.5 bg-gray-100 rounded text-[6px] text-gray-400">Search...</div>
          <div className="relative">
            <ShoppingCart className="w-3.5 h-3.5 text-gray-400" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#10b981] text-white text-[5px] flex items-center justify-center">3</div>
          </div>
        </div>
      </div>
      {/* Categories */}
      <div className="flex gap-1.5 px-3 py-1.5 bg-white border-b border-gray-50">
        {["All", "Electronics", "Fashion", "Home", "Sports"].map((cat, i) => (
          <div key={cat} className={`px-2 py-0.5 rounded text-[6px] font-medium ${
            i === 0 ? "bg-[#10b981] text-white" : "text-gray-400"
          }`}>
            {cat}
          </div>
        ))}
      </div>
      {/* Products */}
      <div className="p-3 grid grid-cols-3 gap-2">
        {[
          { name: "Wireless Headphones", price: "$89", img: "#10b981" },
          { name: "Smart Watch Pro", price: "$249", img: "#0ea5e9" },
          { name: "Premium Backpack", price: "$65", img: "#f59e0b" },
          { name: "USB-C Hub", price: "$45", img: "#8b5cf6" },
          { name: "Desk Organizer", price: "$32", img: "#ec4899" },
          { name: "LED Desk Lamp", price: "$58", img: "#06b6d4" },
        ].map((product) => (
          <div key={product.name} className="bg-white rounded border border-gray-100 p-1.5">
            <div className="w-full h-8 rounded mb-1.5" style={{ backgroundColor: `${product.img}15` }}>
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-5 h-5 rounded" style={{ backgroundColor: `${product.img}30` }} />
              </div>
            </div>
            <div className="text-[6px] font-semibold leading-tight">{product.name}</div>
            <div className="flex items-center justify-between mt-1">
              <div className="text-[7px] font-bold text-[#10b981]">{product.price}</div>
              <div className="text-[5px] bg-[#10b981] text-white px-1.5 py-0.5 rounded">Add</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const demoComponents: Record<string, React.FC> = {
  corporate: CorporateDemo,
  webapp: WebAppDemo,
  ecommerce: EcommerceDemo,
};

const viewModes = [
  { id: "desktop", label: "Desktop", icon: Monitor, width: "100%" },
  { id: "tablet", label: "Tablet", icon: Tablet, width: "75%" },
  { id: "mobile", label: "Mobile", icon: Smartphone, width: "40%" },
];

export default function LiveDemoPreviews() {
  const [ref, inView] = useInView({ threshold: 0.15, triggerOnce: true });
  const [activeDemo, setActiveDemo] = useState("corporate");
  const [viewMode, setViewMode] = useState("desktop");

  const DemoComponent = demoComponents[activeDemo];
  const currentView = viewModes.find((v) => v.id === viewMode)!;

  return (
    <section className="relative py-24 sm:py-32 bg-background overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" ref={ref}>
        {/* Header */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-electric text-xs font-semibold uppercase tracking-[0.25em] mb-4 block"
          >
            Live Demo Previews
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight mb-4"
          >
            See What We Build
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            Interactive previews of the types of digital experiences we create — corporate sites, web applications and e-commerce platforms.
          </motion.p>
        </div>

        {/* Demo type tabs + view mode */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap items-center justify-between gap-4 mb-8"
        >
          <div className="flex gap-2">
            {demos.map((demo) => {
              const Icon = demo.icon;
              return (
                <button
                  key={demo.id}
                  onClick={() => setActiveDemo(demo.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    activeDemo === demo.id
                      ? "bg-navy text-white shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted border border-border"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{demo.label}</span>
                </button>
              );
            })}
          </div>
          <div className="flex gap-1 p-1 bg-muted rounded-lg">
            {viewModes.map((mode) => {
              const Icon = mode.icon;
              return (
                <button
                  key={mode.id}
                  onClick={() => setViewMode(mode.id)}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === mode.id
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  title={mode.label}
                >
                  <Icon className="w-4 h-4" />
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Browser frame */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mx-auto transition-all duration-500"
          style={{ maxWidth: currentView.width }}
        >
          <div className="rounded-2xl bg-card border border-border shadow-2xl shadow-black/10 overflow-hidden">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-border">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                <div className="w-3 h-3 rounded-full bg-green-400/80" />
              </div>
              <div className="flex-1 flex items-center justify-center">
                <div className="px-4 py-1 rounded-lg bg-background text-muted-foreground text-xs border border-border max-w-md w-full text-center">
                  yasirzayed.com
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
            </div>

            {/* Demo content */}
            <div className="aspect-[16/10] sm:aspect-[16/9]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeDemo}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full"
                >
                  <DemoComponent />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center mt-8"
        >
          <p className="text-muted-foreground text-sm max-w-lg mx-auto">
            {demos.find((d) => d.id === activeDemo)?.description}
          </p>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-8"
        >
          <a
            href="/contact"
            className="group inline-flex items-center gap-2 px-8 py-4 bg-electric text-white font-semibold text-sm rounded-xl hover:bg-electric-dark transition-all shadow-xl shadow-electric/20"
          >
            Build Something Like This
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
