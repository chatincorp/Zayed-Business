/**
 * ForexTicker — scrolling forex rates bar below the stock ticker.
 * Shows major and regional forex pairs with live rates.
 */

import { forexPairs, formatNumber, getChangeColor, getChangeArrow } from "@/data/tabloidData";

const topForex = forexPairs.slice(0, 15);
const tickerItems = [...topForex, ...topForex]; // duplicate for seamless loop

export default function ForexTicker() {
  return (
    <div className="bg-[#060a14] border-b border-white/5 overflow-hidden">
      <div className="flex items-center">
        {/* Label */}
        <div className="shrink-0 px-4 py-1.5 bg-emerald-500/10 border-r border-white/5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
            Forex
          </span>
        </div>

        {/* Scrolling ticker */}
        <div className="overflow-hidden flex-1">
          <div className="forex-ticker flex items-center gap-5 py-1.5 px-4 w-max">
            {tickerItems.map((pair, i) => (
              <div
                key={`${pair.pair}-${i}`}
                className="flex items-center gap-2 shrink-0 text-xs"
              >
                <span className="font-semibold text-white/70">{pair.pair}</span>
                <span className="text-white/50">{formatNumber(pair.rate, pair.rate > 100 ? 2 : 4)}</span>
                <span className={`flex items-center gap-0.5 text-[10px] ${getChangeColor(pair.change)}`}>
                  <span>{getChangeArrow(pair.change)}</span>
                  <span>{pair.changePercent > 0 ? "+" : ""}{pair.changePercent.toFixed(2)}%</span>
                </span>
                <span className="text-white/15">•</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
