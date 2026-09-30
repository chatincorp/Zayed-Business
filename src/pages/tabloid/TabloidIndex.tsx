/**
 * TabloidIndex — Zayed Tabloid. Bloomberg/Forbes-style dense news front page.
 * Live Convex feed (auto-refreshing) with mock fallback, lead story,
 * category rails, live tickers, and 1-second clock.
 */

import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router";
import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import {
  Newspaper,
  TrendingUp,
  DollarSign,
  Clock,
  PenTool,
  Radio,
  RefreshCw,
  Zap,
} from "lucide-react";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import { mockArticles, type TabloidArticle } from "@/data/tabloidData";
import StockTicker from "@/components/tabloid/StockTicker";
import ForexTicker from "@/components/tabloid/ForexTicker";
import FloatingWidgets from "@/components/FloatingWidgets";
import NewsEngineBoot from "@/components/tabloid/NewsEngineBoot";
import Navigation from "@/components/Navigation";
import { useSEO } from "@/lib/seo";

type NewsDoc = Doc<"tabloidNews">;

/** Unified shape so Convex docs and mock articles render identically. */
interface FeedItem {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  author: string;
  readTime: string;
  publishedAt: number;
  image?: string;
  tags: string[];
  sourceName: string;
  isLive: boolean;
}

function fromDoc(d: NewsDoc): FeedItem {
  return {
    id: d._id,
    title: d.title,
    category: d.category,
    excerpt: d.excerpt,
    author: d.author,
    readTime: d.readTime,
    publishedAt: d.publishedAt,
    image: d.image,
    tags: d.tags,
    sourceName: d.sourceName,
    isLive: true,
  };
}

function fromMock(a: TabloidArticle): FeedItem {
  return {
    id: a.id,
    title: a.title,
    category: a.category,
    excerpt: a.excerpt,
    author: a.author,
    readTime: a.readTime,
    publishedAt: new Date(a.publishedAt).getTime(),
    image: a.image,
    tags: a.tags,
    sourceName: a.sourceId,
    isLive: false,
  };
}

const CATEGORIES = ["All", "Africa", "Global Finance", "Technology", "Business", "Security"];

function timeAgo(ts: number): string {
  const s = Math.max(1, Math.floor((Date.now() - ts) / 1000));
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

/** 1-second clock for the live status bar. */
function LiveClock() {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    let raf = 0;
    raf = requestAnimationFrame(() => setNow(Date.now()));
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(id);
    };
  }, []);
  return (
    <span className="font-mono text-[11px] tabular-nums text-emerald-400">
      {now === null ? "--:--:--" : new Date(now).toLocaleTimeString("en-GB")}
    </span>
  );
}

/** Relative time chip that re-renders every second. */
function AgoChip({ ts }: { ts: number }) {
  const [, tick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => tick((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, []);
  return <span className="whitespace-nowrap">{timeAgo(ts)}</span>;
}

const categoryImages: Record<string, string> = {
  Africa: "https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=800&h=450&fit=crop",
  "Global Finance": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=450&fit=crop",
  Technology: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=450&fit=crop",
  Business: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=450&fit=crop",
  Security: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=450&fit=crop",
};

function imgFor(item: FeedItem): string {
  return item.image || categoryImages[item.category] || categoryImages.Technology;
}

export default function TabloidIndex() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [refreshedAt, setRefreshedAt] = useState<number | null>(null);

  // Live subscription — Convex pushes updates the moment new items publish.
  const liveNews = useQuery(api.tabloidNews.listPublishedNews, { limit: 48 });
  const stats = useQuery(api.tabloidNews.getNewsStats, {});

  useSEO({
    title: "Zayed Tabloid — Business, Technology & Global Markets News",
    description:
      "Business, technology, security and markets news from the world's leading sources — curated and published by the Zayed Tabloid news desk. Live stocks, forex and East African market intelligence.",
    path: "/tabloid",
    keywords:
      "Kenya business news, global markets, technology news, AI news, live forex, stock markets, East Africa business, Zayed Tabloid",
  });

  const items: FeedItem[] = useMemo(() => {
    const live = (liveNews ?? []).map(fromDoc);
    if (live.length > 0) return live;
    return mockArticles.filter((a) => a.status === "published").map(fromMock);
  }, [liveNews]);

  const filtered =
    activeCategory === "All"
      ? items
      : items.filter((i) => i.category === activeCategory);

  const lead = filtered[0];
  const secondary = filtered.slice(1, 3);
  const rail = filtered.slice(3, 11);
  const ticker = filtered.slice(11, 19);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setRefreshedAt(Date.now()));
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleManualRefresh = () => setRefreshedAt(Date.now());

  return (
    <div className="min-h-screen bg-[#060a14]">
      <Navigation />
      <StockTicker />
      <ForexTicker />

      {/* ── Masthead ── */}
      <header className="relative border-b border-white/10 bg-[#060a14]">
        <div className="absolute inset-0 bg-gradient-to-r from-electric/[0.06] via-transparent to-emerald-500/[0.04]" />
        <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg bg-electric/10 border border-electric/25 flex items-center justify-center">
                <Newspaper className="w-4 h-4 text-electric" />
              </div>
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-electric">
                Zayed Tabloid
              </span>
              <span className="h-px flex-1 bg-gradient-to-r from-electric/30 to-transparent" />
            </div>

            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-none">
                  Business. Technology. <span className="text-electric">Markets.</span>
                </h1>
                <p className="text-white/45 text-sm mt-2 max-w-2xl">
                  Continuously fetched from leading global sources and curated by the
                  Zayed Tabloid news desk — with live stocks, forex and market intelligence.
                </p>
              </div>

              {/* Live status */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-400">LIVE</span>
                  <LiveClock />
                </div>
                <button
                  onClick={handleManualRefresh}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60 text-[11px] hover:bg-white/10 hover:text-white transition-colors"
                  title="Feed refreshes automatically — Convex real-time"
                >
                  <RefreshCw className="w-3 h-3" />
                  Auto
                </button>
              </div>
            </div>

            {/* Quick links + stats */}
            <div className="flex flex-wrap items-center gap-2 mt-5">
              <Link
                to="/tabloid/markets"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/20 transition-colors"
              >
                <TrendingUp className="w-3.5 h-3.5" /> Markets
              </Link>
              <Link
                to="/tabloid/forex"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold hover:bg-blue-500/20 transition-colors"
              >
                <DollarSign className="w-3.5 h-3.5" /> Forex
              </Link>
              <Link
                to="/tabloid/editorial"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold hover:bg-purple-500/20 transition-colors"
              >
                <PenTool className="w-3.5 h-3.5" /> Editorial
              </Link>
              <span className="ml-auto flex items-center gap-1.5 text-[11px] text-white/30">
                <Radio className="w-3 h-3 text-electric/60" />
                {stats
                  ? `${stats.published} published · ${stats.inPipeline} in pipeline · ${stats.last24h} ingested today`
                  : "Loading feed stats…"}
              </span>
            </div>
          </motion.div>
        </div>
      </header>

      {/* ── Category filter bar ── */}
      <nav className="sticky top-0 z-30 bg-[#060a14]/95 backdrop-blur border-b border-white/10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 overflow-x-auto py-2.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? "bg-electric text-white shadow-lg shadow-electric/25"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                }`}
              >
                {cat}
              </button>
            ))}
            <span className="ml-auto hidden sm:flex items-center gap-1.5 text-[10px] text-white/25 pl-4">
              <Zap className="w-3 h-3" />
              {refreshedAt === null ? "Live" : `Updated ${new Date(refreshedAt).toLocaleTimeString("en-GB")}`}
            </span>
          </div>
        </div>
      </nav>

      {/* ── Main content ── */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {!lead ? (
          <div className="py-24 text-center">
            <Newspaper className="w-12 h-12 text-white/10 mx-auto mb-4" />
            <p className="text-white/30 text-sm">No stories in this section yet — the feed is fetching.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Lead story */}
            <div className="lg:col-span-8">
              <LeadStory item={lead} />

              {/* Secondary stories */}
              {secondary.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-6">
                  {secondary.map((item, i) => (
                    <StandardCard key={item.id} item={item} index={i} />
                  ))}
                </div>
              )}

              {/* Horizontal ticker rail */}
              {ticker.length >= 3 && (
                <div className="mt-8 border-t border-b border-white/10 py-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">
                      More Headlines
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                    {ticker.map((item) => (
                      <Link
                        key={item.id}
                        to={`/tabloid/${item.id}`}
                        className="group flex items-baseline gap-3 py-1 border-b border-white/5 hover:border-white/15 transition-colors"
                      >
                        <span className="text-[10px] font-bold text-electric/70 uppercase shrink-0 w-16 truncate">
                          {item.category}
                        </span>
                        <span className="text-sm text-white/75 group-hover:text-white leading-snug">
                          {item.title}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right sidebar rail */}
            <aside className="lg:col-span-4 space-y-6">
              {rail.length > 0 && (
                <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
                  <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-electric animate-pulse" />
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/60">
                      Latest Intelligence
                    </h3>
                  </div>
                  <div className="divide-y divide-white/5">
                    {rail.map((item) => (
                      <Link
                        key={item.id}
                        to={`/tabloid/${item.id}`}
                        className="group flex gap-3 px-4 py-3 hover:bg-white/[0.03] transition-colors"
                      >
                        <img
                          src={imgFor(item)}
                          alt=""
                          className="w-16 h-16 rounded-lg object-cover shrink-0"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold text-electric/80 uppercase tracking-wider mb-0.5">
                            {item.category}
                          </p>
                          <p className="text-[13px] font-medium text-white/80 leading-snug line-clamp-2 group-hover:text-white">
                            {item.title}
                          </p>
                          <p className="text-[10px] text-white/30 mt-1">
                            <AgoChip ts={item.publishedAt} /> · {item.readTime}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Markets snapshot */}
              <div className="rounded-xl border border-emerald-500/15 bg-emerald-500/[0.03] p-4">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-400">
                    Markets Live
                  </h3>
                </div>
                <p className="text-xs text-white/40 leading-relaxed mb-4">
                  Real-time stock indices and forex rates across Africa, Asia, Europe and the
                  Americas — including KES cross rates.
                </p>
                <div className="flex gap-2">
                  <Link
                    to="/tabloid/markets"
                    className="flex-1 text-center px-3 py-2 rounded-lg bg-emerald-500/15 text-emerald-300 text-xs font-semibold hover:bg-emerald-500/25 transition-colors"
                  >
                    View Markets
                  </Link>
                  <Link
                    to="/tabloid/forex"
                    className="flex-1 text-center px-3 py-2 rounded-lg bg-white/5 text-white/60 text-xs font-semibold hover:bg-white/10 transition-colors"
                  >
                    Forex Desk
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        )}
      </main>

      <FloatingWidgets />
      <NewsEngineBoot />
    </div>
  );
}

/* ── Lead story (large hero) ────────────────────────────────── */

function LeadStory({ item }: { item: FeedItem }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Link to={`/tabloid/${item.id}`} className="group block relative rounded-2xl overflow-hidden">
        <div className="relative h-[380px] sm:h-[460px]">
          <img
            src={imgFor(item)}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#060a14] via-[#060a14]/55 to-transparent" />

          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-electric text-white text-[10px] font-bold uppercase tracking-wider">
              Top Story
            </span>
            <span className="px-2.5 py-1 rounded-md bg-black/50 backdrop-blur text-white/80 text-[10px] font-semibold uppercase tracking-wider border border-white/10">
              {item.category}
            </span>
            {item.isLive && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-500/20 backdrop-blur border border-emerald-400/30 text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live
              </span>
            )}
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
            <h2 className="text-2xl sm:text-4xl font-black text-white leading-[1.1] tracking-tight group-hover:text-electric transition-colors max-w-3xl">
              {item.title}
            </h2>
            <p className="hidden sm:block text-white/55 text-sm leading-relaxed mt-3 max-w-2xl line-clamp-2">
              {item.excerpt}
            </p>
            <div className="flex items-center gap-3 mt-4 text-[11px] text-white/40">
              <span className="flex items-center gap-1.5">
                {item.author}
                <span className="text-white/20">·</span>
                <span className="text-white/40">{item.sourceName}</span>
              </span>
              <span>·</span>
              <span><AgoChip ts={item.publishedAt} /></span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {item.readTime}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

/* ── Standard grid card ─────────────────────────────────────── */

function StandardCard({ item, index }: { item: FeedItem; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group rounded-xl bg-white/[0.02] border border-white/5 overflow-hidden hover:border-white/15 hover:bg-white/[0.04] transition-all"
    >
      <Link to={`/tabloid/${item.id}`} className="block relative h-44 overflow-hidden">
        <img
          src={imgFor(item)}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
        <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-electric/85 text-white text-[10px] font-bold uppercase tracking-wider">
          {item.category}
        </span>
      </Link>
      <div className="p-4">
        <Link to={`/tabloid/${item.id}`}>
          <h3 className="text-base font-bold text-white leading-snug group-hover:text-electric transition-colors line-clamp-2">
            {item.title}
          </h3>
        </Link>
        <p className="text-[13px] text-white/40 mt-2 line-clamp-2">{item.excerpt}</p>
        <div className="flex items-center gap-2 mt-3 text-[11px] text-white/30">
          <span className="flex items-center gap-1">
            {item.author}
            <span className="text-white/20">·</span>
            <span className="text-white/40">{item.sourceName}</span>
          </span>
          <span>·</span>
          <span><AgoChip ts={item.publishedAt} /></span>
          <span>·</span>
          <span>{item.readTime}</span>
        </div>
      </div>
    </motion.article>
  );
}
