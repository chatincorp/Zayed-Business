import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Globe,
  Layout,
  ShoppingCart,
  ArrowRight,
  ExternalLink,
  Monitor,
  Smartphone,
  Tablet,
  Play,
  Eye,
} from "lucide-react";

const demos = [
  {
    id: "corporate",
    label: "Corporate Website",
    icon: Globe,
    description:
      "A premium, high-conversion corporate site with parallax hero, animated stats, auto-scrolling capabilities, insights section and leadership profiles.",
    url: "/demo/corporate",
    theme: {
      primary: "#0a0f1e",
      accent: "#60a5fa",
      bg: "#f8fafc",
      gradient: "from-[#0a0f1e] to-[#1e3a5f]",
      buttonBg: "#60a5fa",
    },
  },
  {
    id: "webapp",
    label: "Web Application",
    icon: Layout,
    description:
      "A full-featured booking platform with search interface, destination scrollers, hotel listings with ratings and a management dashboard with live charts.",
    url: "/demo/webapp",
    theme: {
      primary: "#003580",
      accent: "#0071c2",
      bg: "#f5f5f5",
      gradient: "from-[#003580] to-[#005fa3]",
      buttonBg: "#0071c2",
    },
  },
  {
    id: "ecommerce",
    label: "E-Commerce Store",
    icon: ShoppingCart,
    description:
      "A responsive online store with hero banners, category navigation, product cards with ratings, animated cart sidebar and Amazon-style checkout flow.",
    url: "/demo/ecommerce",
    theme: {
      primary: "#131921",
      accent: "#ff9900",
      bg: "#e3e6e6",
      gradient: "from-[#131921] to-[#232f3e]",
      buttonBg: "#ff9900",
    },
  },
];

/* ── Animated Miniature Previews ─────────────────────────────────── */

function CorporatePreview({ isActive }: { isActive: boolean }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive || !scrollRef.current) return;
    const el = scrollRef.current;
    let pos = 0;
    let raf: number;
    const tick = () => {
      pos += 0.4;
      if (pos >= el.scrollHeight - el.clientHeight) pos = 0;
      el.scrollTop = pos;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isActive]);

  return (
    <div ref={scrollRef} className="w-full h-full overflow-hidden bg-[#f8fafc] text-[#0a0f1e]">
      {/* Sticky nav */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-3 py-2 bg-[#0a0f1e]/95 backdrop-blur border-b border-white/5">
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 rounded bg-[#60a5fa] flex items-center justify-center">
            <span className="text-white text-[5px] font-bold">YZ</span>
          </div>
          <span className="text-white font-bold text-[6px] tracking-wider">YASIR ZAYED</span>
        </div>
        <div className="flex gap-2 text-white/40 text-[5px]">
          {["Solutions", "Insights", "About", "Contact"].map((l) => (
            <span key={l}>{l}</span>
          ))}
        </div>
      </div>

      {/* Hero */}
      <div className="relative px-4 py-8 bg-gradient-to-br from-[#0a0f1e] to-[#1e3a5f]">
        <div className="absolute inset-0 opacity-5">
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                "linear-gradient(rgba(96,165,250,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(96,165,250,0.4) 1px, transparent 1px)",
              backgroundSize: "16px 16px",
            }}
          />
        </div>
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={isActive ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-[#60a5fa] text-[5px] font-bold uppercase tracking-[0.2em] mb-1.5"
          >
            Capital Advisory
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isActive ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-white text-[10px] sm:text-xs font-bold mb-1 leading-tight"
          >
            Building a More
            <br />
            <span className="text-[#60a5fa]">Sustainable</span> Financial Future
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={isActive ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-white/30 text-[5px] mb-3 max-w-[65%] leading-relaxed"
          >
            Technology-driven financial solutions and strategic advisory
          </motion.div>
          <div className="flex gap-1.5">
            <div className="px-3 py-1 bg-[#60a5fa] text-[#0a0f1e] rounded text-[6px] font-bold">
              Our Capabilities
            </div>
            <div className="px-3 py-1 border border-white/20 text-white/50 rounded text-[6px]">
              View Insights
            </div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="px-4 py-3 bg-[#0a0f1e] flex justify-between">
        {[
          { v: "$10T+", l: "AUM" },
          { v: "70+", l: "Countries" },
          { v: "1988", l: "Founded" },
          { v: "190K+", l: "Employees" },
        ].map((s, i) => (
          <motion.div
            key={s.l}
            initial={{ opacity: 0, y: 5 }}
            animate={isActive ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.4 + i * 0.08 }}
            className="text-center"
          >
            <div className="text-[8px] font-bold text-white">{s.v}</div>
            <div className="text-[4px] text-white/30 uppercase tracking-wider">{s.l}</div>
          </motion.div>
        ))}
      </div>

      {/* Capabilities scroll */}
      <div className="px-4 py-3 bg-[#f8fafc]">
        <div className="text-[5px] font-bold uppercase tracking-wider text-gray-400 mb-2">
          Our Capabilities
        </div>
        <div className="flex gap-2 overflow-hidden">
          {["Investment Management", "Risk Analytics", "Global Markets", "FinTech"].map(
            (cap, i) => (
              <motion.div
                key={cap}
                initial={{ opacity: 0, x: 10 }}
                animate={isActive ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
                className="flex-shrink-0 w-24 p-2 bg-white rounded-lg border border-gray-100 shadow-sm"
              >
                <div className="w-4 h-4 rounded bg-[#60a5fa]/10 mb-1.5" />
                <div className="text-[5px] font-bold text-[#0a0f1e]">{cap}</div>
              </motion.div>
            )
          )}
        </div>
      </div>

      {/* Insights */}
      <div className="px-4 py-3 bg-white">
        <div className="text-[5px] font-bold uppercase tracking-wider text-gray-400 mb-2">
          Latest Insights
        </div>
        {[
          "Navigating the New Rate Environment",
          "Global Outlook: Resilience Amid Uncertainty",
          "Private Markets in Modern Portfolios",
        ].map((title, i) => (
          <div
            key={i}
            className="py-2 border-b border-gray-50 last:border-0 flex items-start gap-2"
          >
            <div className="w-1 h-1 rounded-full bg-[#60a5fa] mt-1.5 flex-shrink-0" />
            <div className="text-[5px] font-semibold text-[#0a0f1e] leading-tight">{title}</div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 bg-[#0a0f1e] flex justify-between">
        <span className="text-white/20 text-[4px]">© 2026 Yasir Zayed</span>
        <span className="text-white/20 text-[4px]">Kenya · UK</span>
      </div>
    </div>
  );
}

function WebappPreview({ isActive }: { isActive: boolean }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive || !scrollRef.current) return;
    const el = scrollRef.current;
    let pos = 0;
    let raf: number;
    const tick = () => {
      pos += 0.35;
      if (pos >= el.scrollHeight - el.clientHeight) pos = 0;
      el.scrollTop = pos;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isActive]);

  return (
    <div
      ref={scrollRef}
      className="w-full h-full overflow-hidden bg-[#003580]"
      style={{ color: "white" }}
    >
      {/* Search bar */}
      <div className="px-3 py-2 bg-[#003580]">
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-white text-[10px] font-bold mb-1"
        >
          Find your next stay
        </motion.div>
        <div className="bg-white rounded-lg p-1.5 flex gap-1.5">
          <div className="flex-1 bg-gray-50 rounded px-2 py-1 text-[6px] text-gray-400">
            Nairobi, Kenya
          </div>
          <div className="bg-gray-50 rounded px-2 py-1 text-[6px] text-gray-500">Sep 1-7</div>
          <div className="bg-[#0071c2] rounded px-3 py-1 text-white text-[6px] font-bold">Search</div>
        </div>
      </div>

      {/* Trending destinations */}
      <div className="px-3 py-2 bg-white">
        <div className="text-[6px] font-bold text-gray-900 mb-2">Trending destinations</div>
        <div className="flex gap-2 overflow-hidden">
          {[
            { name: "Nairobi", color: "#007185" },
            { name: "Mombasa", color: "#00a698" },
            { name: "London", color: "#8b5cf6" },
            { name: "Dubai", color: "#f59e0b" },
          ].map((dest, i) => (
            <motion.div
              key={dest.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isActive ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
              className="flex-shrink-0 w-20"
            >
              <div
                className="h-12 rounded-lg mb-1"
                style={{ backgroundColor: `${dest.color}20` }}
              >
                <div
                  className="w-full h-full rounded-lg flex items-center justify-center text-[6px] font-bold"
                  style={{ color: dest.color }}
                >
                  {dest.name}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Hotel listings */}
      <div className="px-3 py-2 bg-[#f5f5f5]">
        <div className="text-[6px] font-bold text-gray-900 mb-2">
          2,847 properties found
        </div>
        {[
          { name: "Serena Hotel", rating: 9.2, price: 185, badge: "Superb" },
          { name: "Hemingways", rating: 9.5, price: 245, badge: "Exceptional" },
          { name: "Radisson Blu", rating: 8.8, price: 142, badge: "Excellent" },
          { name: "Sarova Panafric", rating: 8.4, price: 98, badge: "Very Good" },
        ].map((hotel, i) => (
          <motion.div
            key={hotel.name}
            initial={{ opacity: 0, x: 10 }}
            animate={isActive ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
            className="flex gap-2 p-2 bg-white rounded-lg border border-gray-100 mb-1.5"
          >
            <div className="w-12 h-12 rounded-lg bg-gray-100 flex-shrink-0" />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-0.5">
                <div className="text-[6px] font-bold text-gray-900">{hotel.name}</div>
                <div className="bg-[#003580] text-white text-[5px] font-bold px-1.5 py-0.5 rounded">
                  {hotel.rating}
                </div>
              </div>
              <div className="flex gap-0.5 mb-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <div key={s} className="w-1.5 h-1.5 rounded-sm bg-[#febb02]" />
                ))}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[5px] text-[#003580] font-semibold">{hotel.badge}</span>
                <span className="text-[7px] font-bold text-gray-900">${hotel.price}/night</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-3 py-2 bg-[#232f3e]">
        <div className="text-white/30 text-[4px] text-center">© 2026 YZ Booking Platform Demo</div>
      </div>
    </div>
  );
}

function EcommercePreview({ isActive }: { isActive: boolean }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive || !scrollRef.current) return;
    const el = scrollRef.current;
    let pos = 0;
    let raf: number;
    const tick = () => {
      pos += 0.3;
      if (pos >= el.scrollHeight - el.clientHeight) pos = 0;
      el.scrollTop = pos;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isActive]);

  return (
    <div ref={scrollRef} className="w-full h-full overflow-hidden bg-[#e3e6e6]">
      {/* Amazon-style nav */}
      <div className="sticky top-0 z-10 bg-[#131921] px-3 py-1.5 flex items-center gap-2">
        <div className="text-white font-bold text-[7px]">
          yasirzayed<span className="text-[#ff9900]">.store</span>
        </div>
        <div className="flex-1 bg-white rounded h-4 flex items-center px-2">
          <span className="text-[5px] text-gray-400">Search yasirzayed.store</span>
        </div>
        <div className="text-white text-[6px] relative">
          🛒
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#ff9900] text-[#131921] rounded-full text-[4px] flex items-center justify-center font-bold">
            3
          </span>
        </div>
      </div>

      {/* Sub nav */}
      <div className="bg-[#232f3e] px-3 py-1 flex gap-3 text-white text-[5px]">
        {["All", "Today's Deals", "Prime", "Electronics", "Fashion"].map((l) => (
          <span key={l} className="whitespace-nowrap">{l}</span>
        ))}
      </div>

      {/* Hero banner */}
      <div className="px-3 py-4 bg-gradient-to-r from-[#1a2332] to-[#0d1b2a]">
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={isActive ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <div className="text-[#00a8e1] text-[8px] font-bold mb-1">Upgrade Your Workspace</div>
          <div className="text-white/50 text-[5px] mb-2">Save up to 40% on premium office gear</div>
          <div className="bg-[#00a8e1] text-[#131921] text-[5px] font-bold px-3 py-1 rounded-full inline-block">
            Shop Now
          </div>
        </motion.div>
      </div>

      {/* Categories */}
      <div className="px-3 py-2 bg-white flex gap-3 overflow-hidden">
        {["Electronics", "Computers", "Gaming", "Audio", "Home"].map((cat, i) => (
          <motion.div
            key={cat}
            initial={{ opacity: 0, y: 5 }}
            animate={isActive ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.3, delay: 0.2 + i * 0.05 }}
            className="flex-shrink-0 text-center"
          >
            <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center mb-0.5">
              <span className="text-[5px]">📱</span>
            </div>
            <div className="text-[4px] text-gray-600 font-medium">{cat}</div>
          </motion.div>
        ))}
      </div>

      {/* Products grid */}
      <div className="px-3 py-2 bg-white mt-1">
        <div className="text-[7px] font-bold text-gray-900 mb-2">Today&apos;s Deals</div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { name: "Wireless Headphones", price: "$298", rating: 4.7, reviews: "12.8K", badge: "Best Seller" },
            { name: "Smart Watch Ultra", price: "$749", rating: 4.8, reviews: "8.4K", badge: "#1 Best" },
            { name: "Cabin Luggage", price: "$189", rating: 4.5, reviews: "3.2K", badge: "" },
            { name: "Desk Lamp LED", price: "$109", rating: 4.6, reviews: "5.7K", badge: "Deal" },
            { name: "Mirrorless Camera", price: "$2,399", rating: 4.9, reviews: "2.2K", badge: "Choice" },
            { name: "Kindle E-Reader", price: "$190", rating: 4.7, reviews: "18.9K", badge: "Best Seller" },
          ].map((product, i) => (
            <motion.div
              key={product.name}
              initial={{ opacity: 0, y: 10 }}
              animate={isActive ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.06 }}
              className="bg-white rounded border border-gray-100 p-1.5 hover:shadow-md transition-shadow"
            >
              <div className="w-full h-10 bg-gray-50 rounded mb-1 flex items-center justify-center">
                <span className="text-[8px]">📦</span>
              </div>
              {product.badge && (
                <div className="bg-[#cc0c39] text-white text-[3px] font-bold px-1 py-0.5 rounded mb-0.5 inline-block">
                  {product.badge}
                </div>
              )}
              <div className="text-[4px] font-medium text-gray-800 line-clamp-2 mb-0.5 leading-tight">
                {product.name}
              </div>
              <div className="flex items-center gap-0.5 mb-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <div
                    key={s}
                    className={`w-1 h-1 rounded-sm ${
                      s <= Math.floor(product.rating)
                        ? "bg-[#de7921]"
                        : "bg-gray-200"
                    }`}
                  />
                ))}
                <span className="text-[3px] text-[#007185]">{product.reviews}</span>
              </div>
              <div className="text-[7px] font-bold text-gray-900">{product.price}</div>
              <div className="bg-[#ffd814] text-center text-[4px] font-bold text-[#0f1111] py-0.5 rounded-full mt-1">
                Add to Cart
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-3 py-2 bg-[#232f3e] mt-1">
        <div className="text-center">
          <div className="bg-[#37475a] text-white text-[4px] px-4 py-1 rounded inline-block mb-1">
            Back to top
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main Component ─────────────────────────────────────────────── */

const previewComponents: Record<string, React.FC<{ isActive: boolean }>> = {
  corporate: CorporatePreview,
  webapp: WebappPreview,
  ecommerce: EcommercePreview,
};

export default function LiveDemoPreviews() {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [activeDemo, setActiveDemo] = useState("corporate");
  const [viewMode, setViewMode] = useState<"desktop" | "tablet" | "mobile">(
    "desktop"
  );


  const current = demos.find((d) => d.id === activeDemo)!;
  const PreviewComp = previewComponents[activeDemo];

  const widths = { desktop: "100%", tablet: "70%", mobile: "38%" };

  return (
    <section className="relative py-24 sm:py-32 bg-background overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" ref={ref}>
        {/* Header */}
        <div className="text-center mb-14">
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
            Live, animated previews of the digital experiences we create. Click
            to explore full working demos.
          </motion.p>
        </div>

        {/* Demo tabs + view modes */}
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
                  onMouseEnter={() => {}}
                  onMouseLeave={() => {}}
                  aria-label={demo.label}
                  aria-pressed={activeDemo === demo.id}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    activeDemo === demo.id
                      ? "bg-navy text-white shadow-lg shadow-navy/20"
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
            {[
              { id: "desktop" as const, icon: Monitor, label: "Desktop" },
              { id: "tablet" as const, icon: Tablet, label: "Tablet" },
              { id: "mobile" as const, icon: Smartphone, label: "Mobile" },
            ].map((mode) => {
              const Icon = mode.icon;
              return (
                <button
                  key={mode.id}
                  onClick={() => setViewMode(mode.id)}
                  aria-label={mode.label}
                  aria-pressed={viewMode === mode.id}
                  title={mode.label}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === mode.id
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Browser frame with preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mx-auto transition-all duration-500"
          style={{ maxWidth: widths[viewMode] }}
        >
          <div className="rounded-2xl bg-card border border-border shadow-2xl shadow-black/10 overflow-hidden group">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-border">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                <div className="w-3 h-3 rounded-full bg-green-400/80" />
              </div>
              <div className="flex-1 flex items-center justify-center">
                <div
                  className="px-4 py-1 rounded-lg bg-background text-muted-foreground text-xs border border-border max-w-md w-full text-center flex items-center justify-center gap-2 cursor-pointer hover:border-electric/50 transition-colors"
                  onClick={() => window.open(current.url, "_blank")}
                >
                  <Globe className="w-3 h-3" />
                  yasirzayed.com{current.url}
                </div>
              </div>
              <button
                type="button"
                aria-label="Open demo in new tab"
                onClick={() => window.open(current.url, "_blank")}
                className="p-1 rounded text-muted-foreground hover:text-electric transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Scrollable preview */}
            <div className="aspect-[16/10] sm:aspect-[16/9] relative overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeDemo}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full"
                >
                  <PreviewComp isActive={true} />
                </motion.div>
              </AnimatePresence>

              {/* Click to explore overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-8 pointer-events-none">
                <a
                  href={current.url}
                  className="pointer-events-auto flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-full text-sm font-bold shadow-2xl hover:scale-105 transition-transform"
                >
                  <Play className="w-4 h-4" />
                  Explore Full Demo
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Description + CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center mt-8 space-y-4"
        >
          <p className="text-muted-foreground text-sm max-w-lg mx-auto">
            {current.description}
          </p>

          <div className="flex items-center justify-center gap-4">
            <a
              href={current.url}
              className="group inline-flex items-center gap-2 px-8 py-4 bg-electric text-white font-semibold text-sm rounded-xl hover:bg-electric-dark transition-all shadow-xl shadow-electric/20"
            >
              <Eye className="w-4 h-4" />
              Open Full Demo
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-4 border border-border text-foreground font-semibold text-sm rounded-xl hover:bg-muted transition-all"
            >
              Build Something Like This
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
