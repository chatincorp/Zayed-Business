/**
 * ForexTicker — scrolling forex rates bar below the stock ticker.
 *
 * Majors plus African and Asian crosses, driven by the cached quote proxy.
 */

import { instrumentsByClass } from "@/data/marketCatalog";
import { formatNumber, getChangeColor, getChangeArrow } from "@/data/tabloidData";
import { quoteDecimals, useLiveQuotes } from "@/lib/marketLive";

const pairs = instrumentsByClass("forex");
const symbols = pairs.map((pair) => pair.symbol);

export default function ForexTicker() {
  const { quotes } = useLiveQuotes(symbols);
  const tickerItems = [...pairs, ...pairs];

  return (
    <div className="bg-[#060a14] border-b border-white/5 overflow-hidden">
      <div className="flex items-center">
        <div className="shrink-0 px-4 py-1.5 bg-emerald-500/10 border-r border-white/5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
            Forex
          </span>
        </div>

        <div className="overflow-hidden flex-1">
          <div className="forex-ticker flex items-center gap-5 py-1.5 px-4 w-max">
            {tickerItems.map((pair, i) => {
              const quote = quotes[pair.symbol];
              const rate = quote?.price ?? pair.reference;
              return (
                <div key={`${pair.symbol}-${i}`} className="flex items-center gap-2 shrink-0 text-xs">
                  <span className="font-semibold text-white/70">{pair.label}</span>
                  <span className="text-white/50">
                    {formatNumber(rate, pair.decimals ?? quoteDecimals(rate))}
                  </span>
                  {quote ? (
                    <span className={`flex items-center gap-0.5 text-[10px] ${getChangeColor(quote.change)}`}>
                      <span>{getChangeArrow(quote.change)}</span>
                      <span>
                        {quote.changePercent > 0 ? "+" : ""}
                        {quote.changePercent.toFixed(2)}%
                      </span>
                    </span>
                  ) : (
                    <span className="text-[9px] uppercase tracking-wider text-amber-300/70">ref</span>
                  )}
                  <span className="text-white/15">•</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
