/**
 * marketLive — client access to the cached Convex quote proxy.
 *
 * Uses ConvexHttpClient instead of the React provider so the market bar keeps
 * working on any page (and in the static bundle) without extra wiring. When the
 * backend is not configured — or the feed is unreachable — callers fall back to
 * the reference levels bundled in `src/data/marketCatalog.ts`.
 */

import { useEffect, useRef, useState } from "react";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { CONVEX_URL, isBackendConfigured } from "@/lib/backend";

const client = isBackendConfigured ? new ConvexHttpClient(CONVEX_URL) : null;
const REFRESH_MS = 5 * 60 * 1000;

export interface LiveQuote {
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
}

export interface FxRates {
  base: string;
  rates: Record<string, number>;
  updatedAt: number;
  provider: string;
  stale?: boolean;
}

export function useLiveQuotes(symbols: string[]) {
  const key = symbols.join(",");
  const [quotes, setQuotes] = useState<Record<string, LiveQuote>>({});
  const [updatedAt, setUpdatedAt] = useState<number | null>(null);
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    if (!client) return () => { mounted.current = false; };

    const wanted = key.split(",").filter(Boolean);
    if (wanted.length === 0) return () => { mounted.current = false; };

    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const res = (await client.action(api.markets.quotes, { symbols: wanted })) as {
          quotes: Record<string, LiveQuote>;
          fetchedAt: number;
        };
        if (cancelled) return;
        setQuotes((prev) => ({ ...prev, ...res.quotes }));
        setUpdatedAt(res.fetchedAt);
        setFailed(false);
      } catch {
        if (!cancelled) setFailed(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();
    const timer = window.setInterval(load, REFRESH_MS);
    return () => {
      cancelled = true;
      mounted.current = false;
      window.clearInterval(timer);
    };
  }, [key]);

  return { quotes, updatedAt, loading, failed, live: Boolean(client) };
}

export function useFxRates() {
  const [data, setData] = useState<FxRates | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!client) return;
    let cancelled = false;
    const load = async () => {
      try {
        const res = (await client.action(api.markets.fxRates, {})) as FxRates;
        if (!cancelled) {
          setData(res);
          setFailed(false);
        }
      } catch {
        if (!cancelled) setFailed(true);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { data, failed, live: Boolean(client) };
}

/** Decimals that keep a quote readable: 4 for FX and pennies, 2 otherwise. */
export function quoteDecimals(price: number): number {
  if (price >= 1000) return 2;
  if (price >= 100) return 2;
  if (price >= 1) return 2;
  if (price >= 0.1) return 4;
  return 5;
}
