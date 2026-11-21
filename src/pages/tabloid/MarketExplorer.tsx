/**
 * MarketExplorer — dropdown-driven view of every instrument in the catalog.
 *
 * Pick an asset class, then narrow by region, country and instrument. Quotes
 * come from the cached Convex proxy; markets without an upstream feed show
 * their reference level with a clear "reference" badge. The forex tab also
 * exposes the daily USD matrix so every country that publishes a currency is
 * covered, not just the quoted pairs.
 */

import { useMemo, useState } from "react";
import { Link } from "react-router";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { Globe2, LineChart as LineChartIcon, ArrowUpDown } from "lucide-react";
import Navigation from "@/components/Navigation";
import FloatingWidgets from "@/components/FloatingWidgets";
import StockTicker from "@/components/tabloid/StockTicker";
import ForexTicker from "@/components/tabloid/ForexTicker";
import { useSEO } from "@/lib/seo";
import {
  assetClassLabels,
  flagFor,
  marketInstruments,
  marketRegions,
  nationCurrencies,
  type AssetClass,
} from "@/data/marketCatalog";
import { formatNumber, getChangeArrow, getChangeColor } from "@/data/tabloidData";
import { quoteDecimals, useFxRates, useLiveQuotes } from "@/lib/marketLive";

const ASSET_CLASSES: AssetClass[] = ["index", "stock", "commodity", "forex"];
const MAX_SYMBOLS = 25;

function Select({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1 text-[10px] uppercase tracking-wider text-white/40">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full min-w-[160px] rounded-lg border border-white/10 bg-[#0b1220] px-3 py-2 text-sm text-white/85 focus:border-emerald-500/60 focus:outline-none"
      >
        {children}
      </select>
    </label>
  );
}

export default function MarketExplorer() {
  useSEO({
    title: "Markets Explorer — Indices, Stocks, Commodities & Forex by Country",
    description:
      "Browse live market levels by asset class, region, country and instrument — global indices, exchange stocks, commodities and worldwide forex rates.",
    path: "/markets",
  });

  const [assetClass, setAssetClass] = useState<AssetClass>("index");
  const [region, setRegion] = useState("all");
  const [country, setCountry] = useState("all");
  const [symbol, setSymbol] = useState("");
  const [matrix, setMatrix] = useState(false);

  const byClass = useMemo(
    () => marketInstruments.filter((instrument) => instrument.assetClass === assetClass),
    [assetClass],
  );

  const regionsForClass = useMemo(
    () => marketRegions.filter((r) => byClass.some((instrument) => instrument.region === r)),
    [byClass],
  );

  const countriesForClass = useMemo(() => {
    const list = byClass
      .filter((instrument) => region === "all" || instrument.region === region)
      .map((instrument) => ({ country: instrument.country, countryCode: instrument.countryCode }));
    return [...new Map(list.map((item) => [item.country, item])).values()].sort((a, b) =>
      a.country.localeCompare(b.country),
    );
  }, [byClass, region]);

  const scoped = useMemo(
    () =>
      byClass.filter(
        (instrument) =>
          (region === "all" || instrument.region === region) &&
          (country === "all" || instrument.country === country),
      ),
    [byClass, region, country],
  );

  // Derive the active symbol rather than syncing state: changing the filters
  // narrows `scoped`, and a selection that no longer exists falls back to the
  // first instrument in the new scope.
  const activeSymbol = scoped.some((instrument) => instrument.symbol === symbol)
    ? symbol
    : scoped[0]?.symbol ?? "";

  const symbols = useMemo(() => scoped.slice(0, MAX_SYMBOLS).map((i) => i.symbol), [scoped]);
  const { quotes, updatedAt, failed } = useLiveQuotes(symbols);
  const { data: fx } = useFxRates();

  const selected = scoped.find((instrument) => instrument.symbol === activeSymbol) ?? scoped[0];
  const selectedQuote = selected ? quotes[selected.symbol] : undefined;
  const selectedPrice = selectedQuote?.price ?? selected?.reference ?? 0;

  const nationRows = useMemo(() => {
    if (!fx) return [];
    return nationCurrencies
      .map((entry) => {
        const rate = fx.rates[entry.code];
        return rate ? { ...entry, rate } : null;
      })
      .filter((row): row is { code: string; country: string; countryCode: string; rate: number } => row !== null)
      .sort((a, b) => a.country.localeCompare(b.country));
  }, [fx]);

  return (
    <div className="min-h-screen bg-[#060a14]">
      <Navigation />
      <StockTicker />
      <ForexTicker />

      <header className="border-b border-white/5">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10">
              <LineChartIcon className="h-5 w-5 text-emerald-400" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
              Markets Explorer
            </span>
          </div>
          <h1 className="mb-2 text-3xl font-bold text-white sm:text-4xl">
            Every market, one selection away
          </h1>
          <p className="text-lg text-white/50">
            Indices, stocks, commodities and currencies across {marketRegions.length} regions.
            {updatedAt ? ` Quotes refreshed ${new Date(updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}.` : ""}
            {failed ? " Upstream feed unreachable — showing reference levels." : ""}
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-4">
          <Select label="Asset class" value={assetClass} onChange={(value) => { setAssetClass(value as AssetClass); setRegion("all"); setCountry("all"); }}>
            {ASSET_CLASSES.map((value) => (
              <option key={value} value={value}>{assetClassLabels[value]}</option>
            ))}
          </Select>

          <Select label="Region" value={region} onChange={(value) => { setRegion(value); setCountry("all"); }}>
            <option value="all">All regions</option>
            {regionsForClass.map((value) => (
              <option key={value} value={value}>{value}</option>
            ))}
          </Select>

          <Select label="Country" value={country} onChange={setCountry}>
            <option value="all">All countries</option>
            {countriesForClass.map((item) => (
              <option key={item.country} value={item.country}>
                {flagFor(item.countryCode)} {item.country}
              </option>
            ))}
          </Select>

          <Select label="Instrument" value={activeSymbol} onChange={setSymbol}>
            {scoped.map((instrument) => (
              <option key={instrument.symbol} value={instrument.symbol}>
                {instrument.label} — {instrument.name}
              </option>
            ))}
          </Select>

          {assetClass === "forex" && (
            <button
              type="button"
              onClick={() => setMatrix((value) => !value)}
              className={`ml-auto rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${
                matrix
                  ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-300"
                  : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10"
              }`}
            >
              {matrix ? "Hide all-country matrix" : "All countries (USD matrix)"}
            </button>
          )}
        </div>

        {selected && (
          <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_1fr]">
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-2xl font-bold text-white">{selected.label}</p>
                  <p className="mt-1 text-xs text-white/40">
                    {flagFor(selected.countryCode)} {selected.name} · {selected.exchange} · {selected.currency}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                    selectedQuote
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-amber-400/10 text-amber-300"
                  }`}
                >
                  {selectedQuote ? "Live" : "Reference"}
                </span>
              </div>

              <div className="mt-4 flex items-end gap-4">
                <p className="text-4xl font-bold tabular-nums text-white">
                  {formatNumber(selectedPrice, selected.decimals ?? quoteDecimals(selectedPrice))}
                </p>
                <p className={`flex items-center gap-1 pb-1 text-sm tabular-nums ${getChangeColor(selectedQuote?.change ?? 0)}`}>
                  {getChangeArrow(selectedQuote?.change ?? 0)}
                  {formatNumber(selectedQuote?.change ?? 0, selected.decimals ?? quoteDecimals(selectedPrice))}
                  <span className="text-white/40">
                    ({selectedQuote ? `${selectedQuote.changePercent > 0 ? "+" : ""}${selectedQuote.changePercent.toFixed(2)}%` : "—"})
                  </span>
                </p>
              </div>

              <div className="mt-4 h-40">
                {selectedQuote && selectedQuote.closes.length > 2 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={selectedQuote.closes.map((close, index) => ({ index, close }))}>
                      <defs>
                        <linearGradient id="explorer-fill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
                          <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area type="monotone" dataKey="close" stroke="#10b981" strokeWidth={2} fill="url(#explorer-fill)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-white/10 text-xs text-white/30">
                    No intraday series for this market — reference level shown.
                  </div>
                )}
              </div>
              <p className="mt-2 text-[10px] text-white/25">
                {selectedQuote
                  ? `Last market tick ${new Date(selectedQuote.marketTime).toLocaleString()}`
                  : "This exchange does not publish a machine-readable feed; the level above is a reference quote."}
              </p>
            </div>

            <div className="overflow-hidden rounded-xl border border-white/5 bg-white/[0.02]">
              <div className="grid grid-cols-12 gap-2 border-b border-white/5 px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-white/30">
                <span className="col-span-5">Instrument</span>
                <span className="col-span-3 text-right">Level</span>
                <span className="col-span-2 text-right">Change</span>
                <span className="col-span-2 text-right">Source</span>
              </div>
              <div className="max-h-[340px] divide-y divide-white/5 overflow-y-auto">
                {scoped.slice(0, MAX_SYMBOLS).map((instrument) => {
                  const quote = quotes[instrument.symbol];
                  const price = quote?.price ?? instrument.reference;
                  return (
                    <button
                      key={instrument.symbol}
                      type="button"
                      onClick={() => setSymbol(instrument.symbol)}
                      className={`grid w-full grid-cols-12 gap-2 px-4 py-2 text-left transition-colors hover:bg-white/[0.04] ${
                        instrument.symbol === selected.symbol ? "bg-white/[0.05]" : ""
                      }`}
                    >
                      <span className="col-span-5">
                        <span className="block text-xs font-medium text-white/80">{instrument.label}</span>
                        <span className="block text-[10px] text-white/30">{instrument.country}</span>
                      </span>
                      <span className="col-span-3 text-right text-xs tabular-nums text-white/70">
                        {formatNumber(price, instrument.decimals ?? quoteDecimals(price))}
                      </span>
                      <span className={`col-span-2 text-right text-xs tabular-nums ${getChangeColor(quote?.change ?? 0)}`}>
                        {quote ? `${quote.changePercent > 0 ? "+" : ""}${quote.changePercent.toFixed(2)}%` : "—"}
                      </span>
                      <span className="col-span-2 text-right text-[10px] uppercase tracking-wider text-white/30">
                        {quote ? "live" : "ref"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {scoped.length > MAX_SYMBOLS && (
          <p className="mt-2 text-[10px] text-white/30">
            Showing the first {MAX_SYMBOLS} of {scoped.length} instruments in this selection; narrow by country to see the rest.
          </p>
        )}

        {assetClass === "forex" && matrix && (
          <div className="mt-8 overflow-hidden rounded-xl border border-white/5 bg-white/[0.02]">
            <div className="flex items-center gap-2 border-b border-white/5 px-4 py-3">
              <Globe2 className="h-4 w-4 text-emerald-400" />
              <p className="text-sm font-semibold text-white/80">All countries — USD reference matrix</p>
              <span className="ml-auto text-[10px] uppercase tracking-wider text-white/30">
                {fx ? `${nationRows.length} currencies` : "loading"}
              </span>
            </div>
            <div className="grid max-h-[420px] grid-cols-1 divide-y divide-white/5 overflow-y-auto sm:grid-cols-2 sm:divide-y-0">
              {nationRows.map((row) => (
                <div key={row.code} className="flex items-center gap-3 px-4 py-2">
                  <span className="text-sm">{flagFor(row.countryCode)}</span>
                  <span className="flex-1 text-xs text-white/70">{row.country}</span>
                  <span className="text-[10px] uppercase tracking-wider text-white/30">{row.code}</span>
                  <span className="w-24 text-right text-xs tabular-nums text-white/80">
                    {formatNumber(row.rate, row.rate < 1 ? 6 : 2)}
                  </span>
                </div>
              ))}
              {nationRows.length === 0 && (
                <p className="px-4 py-6 text-xs text-white/30">Rate feed unavailable — quoted pairs above still update.</p>
              )}
            </div>
            <p className="border-t border-white/5 px-4 py-2 text-[10px] text-white/25">
              Daily reference rates (1 USD = shown units), provider {fx?.provider ?? "—"}. Not for settlement.
            </p>
          </div>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-3 text-xs">
          <Link to="/tabloid/markets" className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300">
            Global exchanges table <ArrowUpDown className="h-3 w-3" />
          </Link>
          <Link to="/tabloid/forex" className="text-white/40 hover:text-white/70">
            Forex desk
          </Link>
        </div>
      </div>

      <FloatingWidgets />
    </div>
  );
}
