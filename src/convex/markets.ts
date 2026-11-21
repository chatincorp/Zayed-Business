/**
 * markets — live quote proxy with provider fallbacks.
 *
 * The browser cannot call the quote feeds directly (no CORS), so the fetch
 * happens here and results are cached in `marketQuotes`. Rows stay usable for a
 * day if the feed is down; the client falls back to the bundled reference
 * levels in `src/data/marketCatalog.ts`.
 *
 * Providers:
 *   yahoo       — chart API, tried on both hosts (indices, commodities, FX)
 *   nasdaq      — keyless US quote API, used only when Yahoo fails a plain ticker
 *   moex        — Moscow Exchange ISS (official JSON)
 *   tradingview — public scanner API (Lagos NGX ASI, Casablanca MASI)
 *   wazi        — Wazi Markets daily board (Nairobi NASI)
 *   gse         — Ghana Stock Exchange market table (GSE-CI)
 */

import { v } from "convex/values";
import { action, internalMutation, internalQuery } from "./_generated/server";
import { internal } from "./_generated/api";
import { feedRoutes, instrumentBySymbol } from "../data/marketCatalog";

const YAHOO_HOSTS = ["https://query1.finance.yahoo.com", "https://query2.finance.yahoo.com"];
const TRADINGVIEW_SCAN = "https://scanner.tradingview.com/global/scan";
const WAZI = "https://markets.wazi.africa";
const GSE_TABLE = "https://gse.com.gh/wp-admin/admin-ajax.php?action=get_wdtable&table_id=47";
const GSE_PAGE = "https://gse.com.gh/trading-and-data/";
const NASDAQ_QUOTE = "https://api.nasdaq.com/api/quote";
const MOEX_ISS = "https://iss.moex.com/iss";
const USER_AGENT = "Mozilla/5.0 (compatible; YasirZayedDesk/1.0)";
const QUOTE_TTL_MS = 10 * 60 * 1000;
const STALE_TTL_MS = 24 * 60 * 60 * 1000;
const MAX_SYMBOLS = 40;
const FX_TTL_MS = 6 * 60 * 60 * 1000;

/** Full ~160-currency table first, ECB's smaller table as the fallback. */
const FX_ENDPOINTS = [
  { url: "https://open.er-api.com/v6/latest/USD", label: "exchangerate-api.com" },
  { url: "https://api.frankfurter.dev/v1/latest?base=USD", label: "frankfurter (ECB)" },
];

const quoteValidator = v.object({
  symbol: v.string(),
  price: v.number(),
  previousClose: v.number(),
  change: v.number(),
  changePercent: v.number(),
  currency: v.string(),
  exchange: v.string(),
  name: v.optional(v.string()),
  closes: v.array(v.number()),
  marketTime: v.number(),
  fetchedAt: v.number(),
});

type CachedQuote = {
  symbol: string;
  price: number;
  previousClose: number;
  change: number;
  changePercent: number;
  currency: string;
  exchange: string;
  name?: string;
  closes: number[];
  marketTime: number;
  fetchedAt: number;
};

export const readCache = internalQuery({
  args: { symbols: v.array(v.string()) },
  handler: async (ctx, { symbols }) => {
    const rows = await Promise.all(
      symbols.map((symbol) => ctx.db.query("marketQuotes").withIndex("by_symbol", (q) => q.eq("symbol", symbol)).first()),
    );
    return rows.filter((row): row is NonNullable<typeof row> => row !== null);
  },
});

export const writeCache = internalMutation({
  args: { quotes: v.array(quoteValidator) },
  handler: async (ctx, { quotes }) => {
    for (const quote of quotes) {
      const existing = await ctx.db
        .query("marketQuotes")
        .withIndex("by_symbol", (q) => q.eq("symbol", quote.symbol))
        .first();
      if (existing) await ctx.db.patch(existing._id, quote);
      else await ctx.db.insert("marketQuotes", quote);
    }
  },
});

/** One attempt; `null` means this provider had nothing for us (also covers 429s). */
async function getJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": USER_AGENT, Accept: "application/json, text/html;q=0.9,*/*;q=0.8" },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

async function getText(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

async function postJson<T>(
  url: string,
  body: string,
  contentType: string,
  headers: Record<string, string> = {},
): Promise<T | null> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "User-Agent": USER_AGENT, "Content-Type": contentType, ...headers },
      body,
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

function toNumber(value: unknown): number | null {
  if (isFiniteNumber(value)) return value;
  if (typeof value !== "string") return null;
  const parsed = Number(value.replace(/[^0-9.+-]/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

/**
 * Every provider derives `previousClose` from a real session close — never from
 * a range-boundary field — so the change is always a daily move.
 */
function makeQuote(input: {
  symbol: string;
  price: number;
  previousClose: number;
  closes: number[];
  currency?: string;
  exchange?: string;
  name?: string;
  marketTime?: number;
}): CachedQuote {
  const change = input.price - input.previousClose;
  return {
    symbol: input.symbol,
    price: input.price,
    previousClose: input.previousClose,
    change,
    changePercent: input.previousClose ? (change / input.previousClose) * 100 : 0,
    currency: input.currency || "USD",
    exchange: input.exchange || "—",
    name: input.name,
    closes: input.closes.length > 1 ? input.closes.slice(-30) : [input.previousClose, input.price],
    marketTime: input.marketTime ?? Date.now(),
    fetchedAt: Date.now(),
  };
}

interface YahooChartResponse {
  chart?: {
    result?: Array<{
      meta?: {
        currency?: string;
        exchangeName?: string;
        fullExchangeName?: string;
        shortName?: string;
        regularMarketPrice?: number;
        regularMarketTime?: number;
        previousClose?: number;
      };
      indicators?: { quote?: Array<{ close?: Array<number | null> }> };
    }>;
  };
}

async function fetchYahooQuote(symbol: string, upstream: string): Promise<CachedQuote | null> {
  const path = `/v8/finance/chart/${encodeURIComponent(upstream)}?interval=1d&range=1mo`;
  for (const host of YAHOO_HOSTS) {
    const body = await getJson<YahooChartResponse>(`${host}${path}`);
    const result = body?.chart?.result?.[0];
    const meta = result?.meta;
    if (!meta) continue;

    const closes = (result?.indicators?.quote?.[0]?.close ?? []).filter(isFiniteNumber);
    const price = isFiniteNumber(meta.regularMarketPrice) ? meta.regularMarketPrice : closes[closes.length - 1];
    if (!isFiniteNumber(price)) continue;

    // The second-to-last daily close is the previous session. `chartPreviousClose`
    // is the close before the whole 1-month range, so it is never used. A few
    // indices (Santiago, Manila, Buenos Aires) publish only today's bar — without
    // a real prior session there is no honest daily move, so they stay a
    // reference level instead of showing a fabricated 0.00%.
    const previousClose = closes.length > 1 ? closes[closes.length - 2] : meta.previousClose;
    if (!isFiniteNumber(previousClose)) continue;

    return makeQuote({
      symbol,
      price,
      previousClose,
      closes,
      currency: meta.currency,
      exchange: meta.fullExchangeName ?? meta.exchangeName,
      name: meta.shortName,
      marketTime: isFiniteNumber(meta.regularMarketTime) ? meta.regularMarketTime * 1000 : undefined,
    });
  }
  return null;
}

interface NasdaqInfoResponse {
  data?: {
    exchange?: string;
    companyName?: string;
    primaryData?: { lastSalePrice?: string; netChange?: string };
  };
}

/** Keyless US quote fallback for plain tickers (AAPL, MSFT, …). */
async function fetchNasdaqQuote(symbol: string): Promise<CachedQuote | null> {
  if (!/^[A-Z]{1,5}$/.test(symbol)) return null;
  const body = await getJson<NasdaqInfoResponse>(`${NASDAQ_QUOTE}/${symbol}/info?assetclass=stocks`);
  const data = body?.data;
  const price = toNumber(data?.primaryData?.lastSalePrice);
  const netChange = toNumber(data?.primaryData?.netChange);
  if (price === null || netChange === null) return null;

  const instrument = instrumentBySymbol(symbol);
  return makeQuote({
    symbol,
    price,
    previousClose: price - netChange,
    closes: [],
    currency: instrument?.currency,
    exchange: data?.exchange ?? instrument?.exchange,
    name: data?.companyName ?? instrument?.name,
  });
}

interface MoexBoardResponse {
  marketdata?: { data?: number[][] };
}

interface MoexHistoryResponse {
  history?: { data?: Array<Array<number | null>> };
}

/** Moscow Exchange ISS — the official, keyless JSON feed. */
async function fetchMoexQuote(symbol: string, secId: string): Promise<CachedQuote | null> {
  const id = encodeURIComponent(secId);
  const board = await getJson<MoexBoardResponse>(
    `${MOEX_ISS}/engines/stock/markets/index/boards/SNDX/securities/${id}.json?iss.meta=off&iss.only=marketdata&marketdata.columns=LASTVALUE`,
  );
  const price = toNumber(board?.marketdata?.data?.[0]?.[0]);
  if (price === null) return null;

  // The board shows today's level; history supplies the previous session (and a
  // sparkline for the explorer). Without a close there is no honest daily move.
  const from = new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const history = await getJson<MoexHistoryResponse>(
    `${MOEX_ISS}/history/engines/stock/markets/index/securities/${id}.json?iss.meta=off&iss.only=history&history.columns=CLOSE&from=${from}`,
  );
  const closes = (history?.history?.data ?? []).map((row) => toNumber(row?.[0])).filter(isFiniteNumber);

  const instrument = instrumentBySymbol(symbol);
  return makeQuote({
    symbol,
    price,
    previousClose: closes[closes.length - 1] ?? price,
    closes: [...closes, price],
    currency: instrument?.currency,
    exchange: instrument?.exchange,
    name: instrument?.name,
  });
}

interface TradingViewScanResponse {
  data?: Array<{ d?: Array<number | string | null> }>;
}

/** TradingView's public scanner: close, % change, absolute change, name. */
async function fetchTradingViewQuote(symbol: string, ticker: string): Promise<CachedQuote | null> {
  const body = await postJson<TradingViewScanResponse>(
    TRADINGVIEW_SCAN,
    JSON.stringify({
      symbols: { tickers: [ticker], query: { types: [] } },
      columns: ["close", "change", "change_abs", "description"],
    }),
    "application/json",
  );
  const row = body?.data?.[0]?.d;
  const price = toNumber(row?.[0]);
  const changeAbs = toNumber(row?.[2]);
  if (price === null || changeAbs === null) return null;

  const instrument = instrumentBySymbol(symbol);
  return makeQuote({
    symbol,
    price,
    previousClose: price - changeAbs,
    closes: [],
    currency: instrument?.currency,
    exchange: instrument?.exchange,
    name: typeof row?.[3] === "string" ? row[3] : instrument?.name,
  });
}

/** Wazi Markets renders the NSE daily board; the level and move are in the HTML. */
async function fetchWaziQuote(symbol: string, path: string): Promise<CachedQuote | null> {
  const html = await getText(`${WAZI}/indices/${encodeURIComponent(path)}`);
  if (!html) return null;

  const level = html.match(/latest level ([\d,.]+) as of (\d{4}-\d{2}-\d{2})/);
  const price = toNumber(level?.[1]);
  if (price === null) return null;

  // The board prints the move as a percentage only, so the prior close is derived.
  const percent = toNumber(html.match(/text-(?:neg|pos)">[▲▼]\s*([+-]?[\d.]+)%/)?.[1]);
  const previousClose = percent === null ? price : price / (1 + percent / 100);

  const instrument = instrumentBySymbol(symbol);
  return makeQuote({
    symbol,
    price,
    previousClose,
    closes: [],
    currency: instrument?.currency,
    exchange: instrument?.exchange,
    name: instrument?.name,
    marketTime: level?.[2] ? Date.parse(`${level[2]}T00:00:00Z`) : undefined,
  });
}

interface GseTableResponse {
  data?: string[][];
}

/**
 * The GSE site's daily summary table, served by wpDataTables. The table id and
 * its page-load nonce come from the public page, then the newest two rows give
 * the index level and the previous session.
 */
async function fetchGseQuote(symbol: string): Promise<CachedQuote | null> {
  const html = await getText(GSE_PAGE);
  const nonce = html?.match(/wdtNonceFrontendEdit_47"[^>]*value="([a-f0-9]+)"/)?.[1];
  if (!nonce) return null;

  const form = new URLSearchParams({
    draw: "1",
    start: "0",
    length: "2",
    wdtNonce: nonce,
    "order[0][column]": "0",
    "order[0][dir]": "desc",
    "search[value]": "",
  }).toString();
  const body = await postJson<GseTableResponse>(GSE_TABLE, form, "application/x-www-form-urlencoded", {
    Referer: "https://gse.com.gh/",
    "X-Requested-With": "XMLHttpRequest",
  });

  const rows = (body?.data ?? []).filter((row) => toNumber(row?.[4]) !== null);
  if (rows.length === 0) return null;
  const price = toNumber(rows[0][4]) as number;
  const previousClose = toNumber(rows[1]?.[4]) ?? price;
  const [day, month, year] = (rows[0][2] ?? "").split("/");
  const marketTime = year ? Date.parse(`${year}-${month}-${day}T00:00:00Z`) : undefined;

  const instrument = instrumentBySymbol(symbol);
  return makeQuote({
    symbol,
    price,
    previousClose,
    closes: [],
    currency: instrument?.currency,
    exchange: instrument?.exchange,
    name: instrument?.name,
    marketTime: Number.isNaN(marketTime) ? undefined : marketTime,
  });
}

async function fetchQuote(symbol: string): Promise<CachedQuote | null> {
  const route = feedRoutes[symbol];
  if (route) {
    if (route.provider === "moex") return fetchMoexQuote(symbol, route.ref);
    if (route.provider === "tradingview") return fetchTradingViewQuote(symbol, route.ref);
    if (route.provider === "wazi") return fetchWaziQuote(symbol, route.ref);
    return fetchGseQuote(symbol);
  }

  const upstream = instrumentBySymbol(symbol)?.yahoo ?? symbol;
  return (await fetchYahooQuote(symbol, upstream)) ?? fetchNasdaqQuote(upstream);
}

async function fetchInBatches(symbols: string[], batchSize = 6) {
  const out: CachedQuote[] = [];
  for (let i = 0; i < symbols.length; i += batchSize) {
    const results = await Promise.all(symbols.slice(i, i + batchSize).map((symbol) => fetchQuote(symbol)));
    for (const quote of results) if (quote) out.push(quote);
  }
  return out;
}

export const quotes = action({
  args: { symbols: v.array(v.string()) },
  handler: async (ctx, { symbols }) => {
    const wanted = [...new Set(symbols.filter((s) => typeof s === "string" && s.trim().length > 0))].slice(0, MAX_SYMBOLS);
    if (wanted.length === 0) return { quotes: {}, fetchedAt: Date.now() };

    const now = Date.now();
    const cached = (await ctx.runQuery(internal.markets.readCache, { symbols: wanted })) as CachedQuote[];
    const result: Record<string, CachedQuote> = {};
    const toFetch: string[] = [];

    for (const symbol of wanted) {
      const row = cached.find((r) => r.symbol === symbol);
      const age = row ? now - row.fetchedAt : Infinity;
      // Serve a row for up to a day; re-fetch once it is past its quote TTL.
      if (row && age < STALE_TTL_MS) result[symbol] = row;
      if (age >= QUOTE_TTL_MS) toFetch.push(symbol);
    }

    if (toFetch.length > 0) {
      const fetched = await fetchInBatches(toFetch);
      if (fetched.length > 0) {
        await ctx.runMutation(internal.markets.writeCache, { quotes: fetched });
        for (const quote of fetched) result[quote.symbol] = quote;
      }
    }

    return { quotes: result, fetchedAt: now };
  },
});

export const readFxCache = internalQuery({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("marketFx").withIndex("by_base", (q) => q.eq("base", "USD")).first();
  },
});

export const writeFxCache = internalMutation({
  args: {
    rates: v.record(v.string(), v.number()),
    provider: v.string(),
    fetchedAt: v.number(),
  },
  handler: async (ctx, { rates, provider, fetchedAt }) => {
    const existing = await ctx.db.query("marketFx").withIndex("by_base", (q) => q.eq("base", "USD")).first();
    if (existing) await ctx.db.patch(existing._id, { rates, fetchedAt, provider });
    else await ctx.db.insert("marketFx", { base: "USD", rates, fetchedAt, provider });
  },
});

type FxCacheRow = {
  base: string;
  rates: Record<string, number>;
  provider: string;
  fetchedAt: number;
} | null;

type FxResult = {
  base: string;
  rates: Record<string, number>;
  updatedAt: number;
  provider: string;
  stale?: boolean;
};

interface FxResponse {
  provider?: string;
  rates?: Record<string, number>;
}

export const fxRates = action({
  args: {},
  handler: async (ctx): Promise<FxResult> => {
    const existing = (await ctx.runQuery(internal.markets.readFxCache, {})) as FxCacheRow;
    const now = Date.now();
    if (existing && now - existing.fetchedAt < FX_TTL_MS) {
      return { base: existing.base, rates: existing.rates, updatedAt: existing.fetchedAt, provider: existing.provider };
    }

    for (const endpoint of FX_ENDPOINTS) {
      const body = await getJson<FxResponse>(endpoint.url);
      const rates: Record<string, number> = {};
      for (const [code, value] of Object.entries(body?.rates ?? {})) {
        if (code !== "USD" && isFiniteNumber(value)) rates[code] = value;
      }
      if (Object.keys(rates).length === 0) continue;

      const provider = body?.provider ?? endpoint.label;
      await ctx.runMutation(internal.markets.writeFxCache, { rates, provider, fetchedAt: now });
      return { base: "USD", rates, updatedAt: now, provider };
    }

    if (existing) {
      return { base: existing.base, rates: existing.rates, updatedAt: existing.fetchedAt, provider: existing.provider, stale: true };
    }
    throw new Error("No FX provider responded");
  },
});
