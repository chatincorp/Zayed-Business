/**
 * StockTicker — scrolling ticker bar for the tabloid header.
 *
 * Equities, top exchange stocks and commodities, driven by the same cached
 * quote proxy as the market bar. Instruments without an upstream feed keep
 * their reference level and are marked "ref".
 */

import { instrumentBySymbol } from "@/data/marketCatalog";
import { formatNumber, getChangeColor, getChangeArrow } from "@/data/tabloidData";
import { quoteDecimals, useLiveQuotes } from "@/lib/marketLive";

const TICKER_SYMBOLS = [
  "^GSPC",
  "^IXIC",
  "^DJI",
  "^FTSE",
  "^GDAXI",
  "^N225",
  "^HSI",
  "^JN0U.JO",
  "AAPL",
  "MSFT",
  "NVDA",
  "7203.T",
  "0700.HK",
  "GC=F",
  "SI=F",
  "CL=F",
  "BZ=F",
  "HG=F",
];

export default function StockTicker() {
  const { quotes } = useLiveQuotes(TICKER_SYMBOLS);

  const items = TICKER_SYMBOLS.map((symbol) => instrumentBySymbol(symbol)).filter(
    (instrument): instrument is NonNullable<typeof instrument> => Boolean(instrument),
  );
  const tickerItems = [...items, ...items];

  return (
    <div className="bg-[#0a0f1a] border-b border-white/5 overflow-hidden">
      <div className="flex items-center">
        <div className="shrink-0 px-4 py-2 bg-electric/10 border-r border-white/5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-electric">
            Markets
          </span>
        </div>

        <div className="overflow-hidden flex-1">
          <div className="stock-ticker flex items-center gap-6 py-2 px-4 w-max">
            {tickerItems.map((item, i) => {
              const quote = quotes[item.symbol];
              const price = quote?.price ?? item.reference;
              return (
                <div key={`${item.symbol}-${i}`} className="flex items-center gap-2 shrink-0 text-xs">
                  <span className="font-semibold text-white/80">{item.label}</span>
                  <span className="text-white/60">
                    {formatNumber(price, item.decimals ?? quoteDecimals(price))}
                  </span>
                  {quote ? (
                    <span className={`flex items-center gap-0.5 ${getChangeColor(quote.change)}`}>
                      <span className="text-[10px]">{getChangeArrow(quote.change)}</span>
                      <span>
                        {quote.changePercent > 0 ? "+" : ""}
                        {quote.changePercent.toFixed(2)}%
                      </span>
                    </span>
                  ) : (
                    <span className="text-[9px] uppercase tracking-wider text-amber-300/70">ref</span>
                  )}
                  <span className="text-white/20">•</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
