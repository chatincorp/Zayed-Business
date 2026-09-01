/**
 * StockTicker — scrolling stock ticker bar for the tabloid header.
 * Shows top stock indices with live-updating prices and change indicators.
 */

import { stockExchanges, formatNumber, getChangeColor, getChangeArrow } from "@/data/tabloidData";

const topStocks = stockExchanges.slice(0, 12);
const tickerItems = [...topStocks, ...topStocks]; // duplicate for seamless loop

export default function StockTicker() {
  return (
    <div className="bg-[#0a0f1a] border-b border-white/5 overflow-hidden">
      <div className="flex items-center">
        {/* Label */}
        <div className="shrink-0 px-4 py-2 bg-electric/10 border-r border-white/5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-electric">
            Markets
          </span>
        </div>

        {/* Scrolling ticker */}
        <div className="overflow-hidden flex-1">
          <div className="stock-ticker flex items-center gap-6 py-2 px-4 w-max">
            {tickerItems.map((stock, i) => (
              <div
                key={`${stock.index}-${i}`}
                className="flex items-center gap-2 shrink-0 text-xs"
              >
                <span className="font-semibold text-white/80">{stock.index}</span>
                <span className="text-white/60">{formatNumber(stock.value)}</span>
                <span className={`flex items-center gap-0.5 ${getChangeColor(stock.change)}`}>
                  <span className="text-[10px]">{getChangeArrow(stock.change)}</span>
                  <span>{stock.changePercent > 0 ? "+" : ""}{stock.changePercent.toFixed(2)}%</span>
                </span>
                <span className="text-white/20">•</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
