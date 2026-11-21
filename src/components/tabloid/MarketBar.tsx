/**
 * MarketBar — the tabloid's market strip.
 *
 * Sits directly below the navigation, flows slowly, and gives each market its
 * own labelled lane: global equities, African markets, commodities and the
 * forex desk. Quotes come from the cached Convex proxy; anything the upstream
 * feed does not publish for a given exchange falls back to the bundled
 * reference level and is labelled as such instead of looking live.
 */

import { TrendingUp, Globe2, DollarSign, Gem } from "lucide-react";
import { formatNumber, getChangeColor, getChangeArrow } from "@/data/tabloidData";
import {
  instrumentBySymbol,
  marketBarSymbols,
  type MarketInstrument,
} from "@/data/marketCatalog";
import { quoteDecimals, useLiveQuotes } from "@/lib/marketLive";

const laneSymbols = [
  ...marketBarSymbols.globalIndices,
  ...marketBarSymbols.africanIndices,
  ...marketBarSymbols.commodities,
  ...marketBarSymbols.forex,
];

function Quote({
  instrument,
  price,
  change,
  changePercent,
  live,
}: {
  instrument: MarketInstrument;
  price: number;
  change: number;
  changePercent: number;
  live: boolean;
}) {
  const decimals = instrument.decimals ?? quoteDecimals(price);
  return (
    <span className="flex items-center gap-2 shrink-0 text-xs">
      <span className="font-semibold text-white/75" title={instrument.name}>
        {instrument.label}
      </span>
      <span className="text-white/55 tabular-nums">{formatNumber(price, decimals)}</span>
      <span className={`flex items-center gap-0.5 tabular-nums ${getChangeColor(change)}`}>
        <span className="text-[10px]">{getChangeArrow(change)}</span>
        <span>
          {changePercent > 0 ? "+" : ""}
          {changePercent.toFixed(2)}%
        </span>
      </span>
      {!live && <span className="text-[9px] uppercase tracking-wider text-amber-300/70">ref</span>}
      <span className="text-white/15">·</span>
    </span>
  );
}

function Lane({
  icon,
  heading,
  caption,
  tone,
  duration,
  children,
}: {
  icon: React.ReactNode;
  heading: string;
  caption: string;
  tone: string;
  duration: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-stretch border-b border-white/5 last:border-b-0">
      <div className={`shrink-0 w-[104px] sm:w-[172px] px-3 sm:px-4 py-1.5 border-r border-white/5 ${tone}`}>
        <div className="flex items-center gap-1.5">
          {icon}
          <span className="text-[10px] font-bold uppercase tracking-[0.18em] leading-none">
            {heading}
          </span>
        </div>
        <p className="hidden sm:block text-[9px] text-white/30 mt-1 leading-tight">{caption}</p>
      </div>
      <div className="overflow-hidden flex-1">
        <div
          className="market-track flex items-center gap-5 py-2 px-4 w-max"
          style={{ animationDuration: duration }}
        >
          {children}
          {children}
        </div>
      </div>
    </div>
  );
}

export default function MarketBar() {
  const { quotes, updatedAt, live } = useLiveQuotes(laneSymbols);

  const render = (symbols: readonly string[]) =>
    symbols.map((symbol) => {
      const instrument = instrumentBySymbol(symbol);
      if (!instrument) return null;
      const quote = quotes[symbol];
      const price = quote?.price ?? instrument.reference;
      return (
        <Quote
          key={symbol}
          instrument={instrument}
          price={price}
          change={quote?.change ?? 0}
          changePercent={quote?.changePercent ?? 0}
          live={Boolean(quote)}
        />
      );
    });

  return (
    <section aria-label="Live market bar" className="bg-[#080d18] border-b border-white/10">
      <div className="flex items-center justify-between gap-3 border-b border-white/5 px-3 sm:px-4 py-1 text-[9px] uppercase tracking-[0.2em]">
        <span className="text-white/30">
          {live && Object.keys(quotes).length > 0 ? "Live quotes" : "Reference levels"}
        </span>
        <span className="text-white/25">
          {updatedAt ? `Updated ${new Date(updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : "Awaiting first tick"}
        </span>
      </div>

      <Lane
        heading="Global Equities"
        caption="Americas, Europe, Asia-Pacific"
        tone="bg-electric/10 text-electric"
        duration="150s"
        icon={<TrendingUp className="w-3 h-3" />}
      >
        {render(marketBarSymbols.globalIndices)}
      </Lane>

      <Lane
        heading="African Markets"
        caption="JSE, EGX, NSE, NGX and peers"
        tone="bg-amber-400/10 text-amber-300"
        duration="110s"
        icon={<Globe2 className="w-3 h-3" />}
      >
        {render(marketBarSymbols.africanIndices)}
      </Lane>

      <Lane
        heading="Commodities"
        caption="Metals, energy and softs"
        tone="bg-sky-500/10 text-sky-300"
        duration="130s"
        icon={<Gem className="w-3 h-3" />}
      >
        {render(marketBarSymbols.commodities)}
      </Lane>

      <Lane
        heading="Forex Desk"
        caption="Majors and frontier crosses"
        tone="bg-emerald-500/10 text-emerald-400"
        duration="190s"
        icon={<DollarSign className="w-3 h-3" />}
      >
        {render(marketBarSymbols.forex)}
      </Lane>
    </section>
  );
}
