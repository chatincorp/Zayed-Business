/**
 * FinancialMarkets — live stock markets page organized by region and country.
 * Shows all global exchanges with real-time data display.
 */

import { useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Globe,
  Search,
  ArrowUpDown,
  BarChart3,
} from "lucide-react";
import {
  stockExchanges,
  regions,
  formatNumber,
  getChangeColor,
  getChangeArrow,
  type StockExchange,
} from "@/data/tabloidData";
import StockTicker from "@/components/tabloid/StockTicker";
import Navigation from "@/components/Navigation";
import ForexTicker from "@/components/tabloid/ForexTicker";
import FloatingWidgets from "@/components/FloatingWidgets";
import { useSEO } from "@/lib/seo";

type SortKey = "country" | "value" | "changePercent";

export default function FinancialMarkets() {
  useSEO({
    title: "Live Global Stock Markets — Real-Time Indices by Region",
    description:
      "Track live stock indices across Africa, Asia, Europe, the Americas and Oceania, including the Nairobi Securities Exchange. Real-time market data from the Zayed Tabloid markets desk.",
    path: "/tabloid/markets",
    keywords: "live stock markets, global indices, Nairobi Securities Exchange, NSE 20, stock market data, Africa markets",
  });

  const [activeRegion, setActiveRegion] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("changePercent");
  const [sortDesc, setSortDesc] = useState(true);
  const [search, setSearch] = useState("");

  const filtered = stockExchanges
    .filter((s) => activeRegion === "all" || s.region.toLowerCase().replace(/\s+/g, "-") === activeRegion)
    .filter(
      (s) =>
        s.country.toLowerCase().includes(search.toLowerCase()) ||
        s.index.toLowerCase().includes(search.toLowerCase()) ||
        s.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const dir = sortDesc ? -1 : 1;
      if (sortKey === "country") return dir * a.country.localeCompare(b.country);
      if (sortKey === "value") return dir * (a.value - b.value);
      return dir * (a.changePercent - b.changePercent);
    });

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDesc(!sortDesc);
    else { setSortKey(key); setSortDesc(true); }
  };

  return (
    <div className="min-h-screen bg-[#060a14]">
      <Navigation />
      <StockTicker />
      <ForexTicker />

      {/* Header */}
      <header className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
                Live Markets
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              Global Stock Exchanges
            </h1>
            <p className="text-white/50 text-lg">
              Real-time market data from exchanges across {regions.length} regions worldwide.
            </p>
          </motion.div>
        </div>
      </header>

      {/* Region Tabs + Search + Sort */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 border-b border-white/5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Region tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 flex-1">
            <Globe className="w-4 h-4 text-white/30 shrink-0" />
            <button
              onClick={() => setActiveRegion("all")}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                activeRegion === "all"
                  ? "bg-emerald-500 text-white"
                  : "bg-white/5 text-white/50 hover:bg-white/10"
              }`}
            >
              All Regions
            </button>
            {regions.map((r) => (
              <button
                key={r.slug}
                onClick={() => setActiveRegion(r.slug)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  activeRegion === r.slug
                    ? "bg-emerald-500 text-white"
                    : "bg-white/5 text-white/50 hover:bg-white/10"
                }`}
              >
                {r.flag} {r.name}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative shrink-0">
            <Search className="w-4 h-4 text-white/30 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search exchanges..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-electric/50 w-56"
            />
          </div>
        </div>
      </div>

      {/* Market Summary Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total Exchanges", value: filtered.length.toString(), icon: BarChart3 },
            {
              label: "Gainers",
              value: filtered.filter((s) => s.change > 0).length.toString(),
              icon: TrendingUp,
              color: "text-emerald-400",
            },
            {
              label: "Decliners",
              value: filtered.filter((s) => s.change < 0).length.toString(),
              icon: TrendingUp,
              color: "text-red-400",
            },
            {
              label: "Avg Change",
              value: (
                filtered.reduce((a, b) => a + b.changePercent, 0) / (filtered.length || 1)
              ).toFixed(2) + "%",
              icon: Globe,
              color: "text-electric",
            },
          ].map((card) => (
            <div key={card.label} className="rounded-lg bg-white/[0.02] border border-white/5 p-4">
              <card.icon className={`w-4 h-4 mb-2 ${card.color || "text-white/30"}`} />
              <p className="text-lg font-bold text-white">{card.value}</p>
              <p className="text-xs text-white/40">{card.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Exchanges Table */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Table header */}
        <div className="grid grid-cols-12 gap-4 px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-white/30 border-b border-white/5">
          <button onClick={() => toggleSort("country")} className="col-span-3 flex items-center gap-1 hover:text-white/50 transition-colors">
            Country / Exchange <ArrowUpDown className="w-3 h-3" />
          </button>
          <div className="col-span-2">Index</div>
          <button onClick={() => toggleSort("value")} className="col-span-2 flex items-center gap-1 hover:text-white/50 transition-colors text-right">
            Value <ArrowUpDown className="w-3 h-3" />
          </button>
          <div className="col-span-2 text-right">Change</div>
          <button onClick={() => toggleSort("changePercent")} className="col-span-2 flex items-center gap-1 justify-end hover:text-white/50 transition-colors">
            % Change <ArrowUpDown className="w-3 h-3" />
          </button>
          <div className="col-span-1 text-right">Region</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-white/5">
          {filtered.map((exchange, i) => (
            <ExchangeRow key={`${exchange.country}-${exchange.index}`} exchange={exchange} index={i} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <BarChart3 className="w-12 h-12 text-white/10 mx-auto mb-4" />
            <p className="text-white/30 text-sm">No exchanges found for this filter.</p>
          </div>
        )}
      </div>

      <FloatingWidgets />
    </div>
  );
}

function ExchangeRow({ exchange, index }: { exchange: StockExchange; index: number }) {
  const regionMeta = regions.find((r) => r.name === exchange.region);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, delay: index * 0.02 }}
      className="grid grid-cols-12 gap-4 px-4 py-3 items-center hover:bg-white/[0.02] transition-colors"
    >
      {/* Country + Exchange */}
      <div className="col-span-3">
        <p className="text-sm font-medium text-white/80">{exchange.country}</p>
        <p className="text-[11px] text-white/30">{exchange.name}</p>
      </div>

      {/* Index */}
      <div className="col-span-2">
        <span className="text-sm text-white/60 font-medium">{exchange.index}</span>
      </div>

      {/* Value */}
      <div className="col-span-2 text-right">
        <span className="text-sm font-semibold text-white/90">
          {formatNumber(exchange.value)}
        </span>
        <span className="text-[10px] text-white/30 ml-1">{exchange.currency}</span>
      </div>

      {/* Change */}
      <div className="col-span-2 text-right">
        <span className={`text-sm ${getChangeColor(exchange.change)}`}>
          {exchange.change > 0 ? "+" : ""}{formatNumber(exchange.change)}
        </span>
      </div>

      {/* % Change */}
      <div className="col-span-2 text-right">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
          exchange.changePercent > 0
            ? "bg-emerald-500/10 text-emerald-400"
            : exchange.changePercent < 0
            ? "bg-red-500/10 text-red-400"
            : "bg-white/5 text-white/40"
        }`}>
          {getChangeArrow(exchange.changePercent)}
          {exchange.changePercent > 0 ? "+" : ""}
          {exchange.changePercent.toFixed(2)}%
        </span>
      </div>

      {/* Region */}
      <div className="col-span-1 text-right">
        <span className="text-xs text-white/30" title={exchange.region}>
          {regionMeta?.flag}
        </span>
      </div>
    </motion.div>
  );
}
