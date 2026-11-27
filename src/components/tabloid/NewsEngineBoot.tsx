/**
 * NewsEngineBoot — invisible engine that keeps Zayed Tabloid fed.
 *
 * Mounted once on the Landing and Tabloid pages:
 *  1. Seeds the newsFeeds table with curated RSS endpoints (idempotent).
 *  2. Triggers the ingest action — fetch → dedupe → AI-style rewrite → publish.
 *  3. Re-triggers every 90 seconds so the tabloid continuously refreshes.
 *
 * A module-level guard ensures only one engine runs even when mounted twice.
 */

import { useEffect, useRef } from "react";
import { useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";

const INGEST_INTERVAL_MS = 90_000;

/** Curated, bot-friendly RSS endpoints mapped to the tabloid's source brands. */
const RSS_FEEDS: Array<{ name: string; url: string; pageUrl: string; category: string }> = [
  {
    name: "Google News Kenya – Business",
    url: "https://news.google.com/rss/search?q=Kenya+business&hl=en-KE&gl=KE&ceid=KE:en",
    pageUrl: "https://news.google.com/search?q=Kenya%20business",
    category: "africa",
  },
  {
    name: "Google News Kenya – Technology",
    url: "https://news.google.com/rss/search?q=Kenya+technology&hl=en-KE&gl=KE&ceid=KE:en",
    pageUrl: "https://news.google.com/search?q=Kenya%20technology",
    category: "tech",
  },
  {
    name: "BBC Africa",
    url: "https://feeds.bbci.co.uk/news/world/africa/rss.xml",
    pageUrl: "https://www.bbc.com/news/world/africa",
    category: "africa",
  },
  {
    name: "BBC Business",
    url: "https://feeds.bbci.co.uk/news/business/rss.xml",
    pageUrl: "https://www.bbc.com/news/business",
    category: "global",
  },
  {
    name: "CNBC",
    url: "https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=100003114",
    pageUrl: "https://www.cnbc.com",
    category: "finance",
  },
  {
    name: "TechCrunch",
    url: "https://techcrunch.com/feed/",
    pageUrl: "https://techcrunch.com",
    category: "tech",
  },
  {
    name: "Yahoo Finance",
    url: "https://finance.yahoo.com/news/rssindex",
    pageUrl: "https://finance.yahoo.com",
    category: "finance",
  },
];

let engineStarted = false;

export default function NewsEngineBoot() {
  const seedFeeds = useMutation(api.tabloidNews.seedFeeds);
  const ingestNews = useAction(api.tabloidIngest.ingestNews);
  const mountedRef = useRef(false);

  useEffect(() => {
    if (mountedRef.current || engineStarted) return;
    mountedRef.current = true;
    engineStarted = true;

    let cancelled = false;
    let timer: number | undefined;

    const run = async () => {
      // 1. Seed feeds (idempotent — skips existing names).
      try {
        await seedFeeds({ feeds: RSS_FEEDS });
      } catch {
        /* already seeded or transient error — safe to continue */
      }

      // 2. Fetch → rewrite → publish.
      try {
        await ingestNews({ autoPublish: true });
      } catch {
        /* network/feed errors tolerated; next tick retries */
      }

      // 3. Schedule the next continuous fetch.
      if (!cancelled) {
        timer = window.setTimeout(run, INGEST_INTERVAL_MS);
      }
    };

    void run();

    return () => {
      cancelled = true;
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, [seedFeeds, ingestNews]);

  return null;
}
