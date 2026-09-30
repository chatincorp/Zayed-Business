/**
 * LiveForex — live forex rates page organized by region.
 * Shows all currency pairs with rates, changes, and 24h ranges.
 */

import { useState } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  Globe,
  Search,
  ArrowUpDown,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from "lucide-react";
import {
  forexPairs,
  regions,
  formatNumber,
  getChangeColor,
  type ForexPair,
} from "@/data/tabloidData";
import StockTicker from "@/components/tabloid/StockTicker";
import ForexTicker from "@/components/tabloid/ForexTicker";
import FloatingWidgets from "@/components/FloatingWidgets";
import { useSEO } from "@/lib/seo";

type SortKey = "pair" | "rate" | "changePercent";

export default function LiveForex() {
  useSEO({
    title: "Live Forex Rates — Global & East African Currency Pairs",
    description:
      "Live foreign exchange rates for major pairs and East African currencies — USD/KES, KES/UGX, KES/TZS, KES/RWF and more. Real-time forex intelligence from the Zayed Tabloid desk.",
    path: "/tabloid/forex",
    keywords: "live forex rates, USD to KES, KES cross rates, East Africa forex, currency exchange, USD/NGN, USD/TZS",
  });

  const [activeRegion, setActiveRegion] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("changePercent");
  const [sortDesc, setSortDesc] = useState(true);
  const [search, setSearch] = useState("");

  const filtered = forexPairs
    .filter((f) => activeRegion === "all" || f.region.toLowerCase() === activeRegion)
    .filter(
      (f) =>
        f.pair.toLowerCase().includes(search.toLowerCase()) ||
        f.baseCurrency.toLowerCase().includes(search.toLowerCase()) ||
        f.quoteCurrency.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const dir = sortDesc ? -1 : 1;
      if (sortKey === "pair") return dir * a.pair.localeCompare(b.pair);
      if (sortKey === "rate") return dir * (a.rate - b.rate);
      return dir * (a.changePercent - b.changePercent);
    });

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDesc(!sortDesc);
    else { setSortKey(key); setSortDesc(true); }
  };

  // Group by region for card view
  const _grouped = filtered.reduce(
    (acc, pair) => {
      if (!acc[pair.region]) acc[pair.region] = [];
      acc[pair.region].push(pair);
      return acc;
    },
    {} as Record<string, ForexPair[]>
  );

  return (
    <div className="min-h-screen bg-[#060a14]">
      <StockTicker />
      <ForexTicker />

      {/* Header */}
      <header className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-widest text-blue-400">
                Live Forex
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              Foreign Exchange Rates
            </h1>
            <p className="text-white/50 text-lg">
              Real-time forex rates for major, minor, and regional currency pairs across {regions.length} regions.
            </p>
          </motion.div>
        </div>
      </header>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 border-b border-white/5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 flex-1">
            <Globe className="w-4 h-4 text-white/30 shrink-0" />
            <button
              onClick={() => setActiveRegion("all")}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                activeRegion === "all"
                  ? "bg-blue-500 text-white"
                  : "bg-white/5 text-white/50 hover:bg-white/10"
              }`}
            >
              All Regions
            </button>
            {[...new Set(forexPairs.map((f) => f.region))].map((region) => (
              <button
                key={region}
                onClick={() => setActiveRegion(region.toLowerCase())}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  activeRegion === region.toLowerCase()
                    ? "bg-blue-500 text-white"
                    : "bg-white/5 text-white/50 hover:bg-white/10"
                }`}
              >
                {region}
              </button>
            ))}
          </div>

          <div className="relative shrink-0">
            <Search className="w-4 h-4 text-white/30 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search pairs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500/50 w-48"
            />
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total Pairs", value: filtered.length.toString(), icon: Activity },
            {
              label: "Gainers",
              value: filtered.filter((f) => f.change > 0).length.toString(),
              icon: ArrowUpRight,
              color: "text-emerald-400",
            },
            {
              label: "Decliners",
              value: filtered.filter((f) => f.change < 0).length.toString(),
              icon: ArrowDownRight,
              color: "text-red-400",
            },
            {
              label: "Unchanged",
              value: filtered.filter((f) => f.change === 0).length.toString(),
              icon: Minus,
              color: "text-white/50",
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

      {/* Table */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Header */}
        <div className="grid grid-cols-12 gap-4 px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-white/30 border-b border-white/5">
          <button onClick={() => toggleSort("pair")} className="col-span-3 flex items-center gap-1 hover:text-white/50 transition-colors">
            Currency Pair <ArrowUpDown className="w-3 h-3" />
          </button>
          <button onClick={() => toggleSort("rate")} className="col-span-2 flex items-center gap-1 hover:text-white/50 transition-colors">
            Rate <ArrowUpDown className="w-3 h-3" />
          </button>
          <div className="col-span-2 text-right">Change</div>
          <button onClick={() => toggleSort("changePercent")} className="col-span-2 flex items-center gap-1 justify-end hover:text-white/50 transition-colors">
            % Change <ArrowUpDown className="w-3 h-3" />
          </button>
          <div className="col-span-1 text-center">24h High</div>
          <div className="col-span-1 text-center">24h Low</div>
          <div className="col-span-1 text-right">Region</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-white/5">
          {filtered.map((pair, i) => (
            <ForexRow key={`${pair.pair}`} pair={pair} index={i} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <DollarSign className="w-12 h-12 text-white/10 mx-auto mb-4" />
            <p className="text-white/30 text-sm">No forex pairs found.</p>
          </div>
        )}
      </div>

      {/* Region cards — card view below table */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-4">
          By Region
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(_grouped).map(([region, pairs]) => {
            const meta = regions.find((r) => r.name.toLowerCase() === region.toLowerCase());
            return (
              <div key={region} className="rounded-xl bg-white/[0.02] border border-white/5 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">{meta?.flag}</span>
                  <h3 className="text-sm font-semibold text-white/80">{region}</h3>
                  <span className="text-[10px] text-white/30 ml-auto">{pairs.length} pairs</span>
                </div>
                <div className="space-y-2">
                  {pairs.map((pair) => (
                    <div key={pair.pair} className="flex items-center justify-between text-xs">
                      <span className="text-white/60 font-medium">{pair.pair}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-white/80">{formatNumber(pair.rate, pair.rate > 100 ? 2 : 4)}</span>
                        <span className={`w-16 text-right ${getChangeColor(pair.change)}`}>
                          {pair.changePercent > 0 ? "+" : ""}{pair.changePercent.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <FloatingWidgets />
    </div>
  );
}

function ForexRow({ pair, index }: { pair: ForexPair; index: number }) {
  const dec = pair.rate > 100 ? 2 : 4;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, delay: index * 0.02 }}
      className="grid grid-cols-12 gap-4 px-4 py-3 items-center hover:bg-white/[0.02] transition-colors"
    >
      {/* Pair */}
      <div className="col-span-3">
        <p className="text-sm font-semibold text-white/80">{pair.pair}</p>
        <p className="text-[10px] text-white/30">{pair.baseCurrency} → {pair.quoteCurrency}</p>
      </div>

      {/* Rate */}
      <div className="col-span-2">
        <span className="text-sm font-bold text-white/90">{formatNumber(pair.rate, dec)}</span>
      </div>

      {/* Change */}
      <div className="col-span-2 text-right">
        <span className={`text-sm ${getChangeColor(pair.change)}`}>
          {pair.change > 0 ? "+" : ""}{formatNumber(pair.change, dec)}
        </span>
      </div>

      {/* % Change */}
      <div className="col-span-2 text-right">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
          pair.changePercent > 0
            ? "bg-emerald-500/10 text-emerald-400"
            : pair.changePercent < 0
            ? "bg-red-500/10 text-red-400"
            : "bg-white/5 text-white/40"
        }`}>
          {pair.changePercent > 0 ? "▲" : pair.changePercent < 0 ? "▼" : "—"}
          {pair.changePercent > 0 ? "+" : ""}{pair.changePercent.toFixed(2)}%
        </span>
      </div>

      {/* 24h High */}
      <div className="col-span-1 text-center">
        <span className="text-xs text-emerald-400/60">{formatNumber(pair.high24h, dec)}</span>
      </div>

      {/* 24h Low */}
      <div className="col-span-1 text-center">
        <span className="text-xs text-red-400/60">{formatNumber(pair.low24h, dec)}</span>
      </div>

      {/* Region */}
      <div className="col-span-1 text-right">
        <span className="text-[10px] text-white/30 px-2 py-0.5 rounded-full bg-white/5">
          {pair.region}
        </span>
      </div>
    </motion.div>
  );
}
