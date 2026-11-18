/**
 * LatestIntelligence — homepage news strip wired to the live
 * Zayed Tabloid feed (Convex real-time), with animated stat
 * counters and a CTA into the full tabloid experience.
 */

import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { useQuery } from "convex/react";
import { motion, useInView } from "framer-motion";
import { Newspaper, ArrowRight, Radio, TrendingUp, Shield, Cpu } from "lucide-react";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import { mockArticles } from "@/data/tabloidData";
import { isBackendConfigured } from "@/lib/backend";

type NewsDoc = Doc<"tabloidNews">;

type NewsStats = { published: number; inPipeline: number; last24h: number };

interface StripItem {
  id: string;
  title: string;
  category: string;
  publishedAt: number;
  readTime: string;
}

const categoryIcons: Record<string, typeof TrendingUp> = {
  "Global Finance": TrendingUp,
  Technology: Cpu,
  Security: Shield,
  Business: Newspaper,
  Africa: Radio,
};

/* ── Animated counter ───────────────────────────────────────── */

function Counter({
  target,
  suffix = "",
  duration = 1400,
}: {
  target: number;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {value.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ── Section ────────────────────────────────────────────────── */

export default function LatestIntelligence() {
  if (!isBackendConfigured) {
    return <LatestIntelligenceView liveNews={undefined} stats={undefined} />;
  }
  return <LiveLatestIntelligence />;
}

function LiveLatestIntelligence() {
  const liveNews = useQuery(api.tabloidNews.listPublishedNews, { limit: 5 });
  const stats = useQuery(api.tabloidNews.getNewsStats, {});
  return <LatestIntelligenceView liveNews={liveNews} stats={stats} />;
}

function LatestIntelligenceView({
  liveNews,
  stats,
}: {
  liveNews: NewsDoc[] | null | undefined;
  stats: NewsStats | null | undefined;
}) {
  const items: StripItem[] =
    liveNews && liveNews.length > 0
      ? liveNews.map((d) => ({
          id: d._id,
          title: d.title,
          category: d.category,
          publishedAt: d.publishedAt,
          readTime: d.readTime,
        }))
      : mockArticles
          .filter((a) => a.status === "published")
          .slice(0, 5)
          .map((a) => ({
            id: a.id,
            title: a.title,
            category: a.category,
            publishedAt: new Date(a.publishedAt).getTime(),
            readTime: a.readTime,
          }));

  return (
    <section className="relative py-20 border-y border-white/5 bg-[#060a14] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-electric/[0.04] via-transparent to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-400">
                Live Feed
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Latest <span className="text-electric">Intelligence</span>
            </h2>
            <p className="text-white/45 text-sm mt-2 max-w-xl">
              Business, technology and market signals — continuously gathered from leading global
              sources by the Zayed Tabloid news desk.
            </p>
          </div>

          <Link
            to="/tabloid"
            className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-electric/10 border border-electric/25 text-electric text-sm font-semibold hover:bg-electric hover:text-white transition-all"
          >
            Open Zayed Tabloid
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Headlines list */}
          <div className="lg:col-span-7 rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
            <div className="px-5 py-3.5 border-b border-white/10 flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/50">
                Top Stories
              </span>
              <span className="text-[10px] text-white/25">
                {isBackendConfigured ? "Auto-refreshing · Convex real-time" : "Curated · Zayed News Desk"}
              </span>
            </div>
            <div className="divide-y divide-white/5">
              {items.map((item, i) => {
                const Icon = categoryIcons[item.category] ?? Newspaper;
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: i * 0.06 }}
                  >
                    <Link
                      to={`/tabloid/${item.id}`}
                      className="group flex items-center gap-4 px-5 py-4 hover:bg-white/[0.03] transition-colors"
                    >
                      <span className="text-xl font-black text-white/10 w-8 shrink-0 tabular-nums">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-bold text-electric/80 uppercase tracking-wider mb-0.5 flex items-center gap-1.5">
                          <Icon className="w-3 h-3" />
                          {item.category}
                        </p>
                        <p className="text-sm font-medium text-white/80 leading-snug group-hover:text-white line-clamp-1 transition-colors">
                          {item.title}
                        </p>
                      </div>
                      <div className="text-right shrink-0 hidden sm:block">
                        <p className="text-[10px] text-white/30">{item.readTime} read</p>
                        <p className="text-[10px] text-emerald-400/60">
                          {new Date(item.publishedAt).toLocaleTimeString("en-GB", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-electric group-hover:translate-x-0.5 transition-all shrink-0" />
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Stats + CTA panel */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Articles Published", target: stats?.published ?? 6, icon: Newspaper },
                { label: "In Pipeline", target: stats?.inPipeline ?? 3, icon: Radio },
                { label: "Ingested Today", target: stats?.last24h ?? 12, icon: TrendingUp },
              ].map(({ label, target, icon: Icon }) => (
                <div
                  key={label}
                  className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-center"
                >
                  <Icon className="w-4 h-4 text-electric mx-auto mb-2" />
                  <p className="text-2xl font-black text-white">
                    <Counter target={target} />
                  </p>
                  <p className="text-[10px] text-white/35 mt-1 leading-tight">{label}</p>
                </div>
              ))}
            </div>

            <div className="flex-1 rounded-2xl border border-electric/15 bg-gradient-to-br from-electric/[0.08] to-transparent p-6 flex flex-col justify-center">
              <h3 className="text-lg font-bold text-white mb-2">
                Your competitors read the news. We read everything.
              </h3>
              <p className="text-sm text-white/45 leading-relaxed mb-5">
                The Zayed Tabloid engine monitors leading business, technology and security
                sources around the clock — then delivers the signal, not the noise.
              </p>
              <div className="flex flex-wrap gap-2">
                <Link
                  to="/tabloid/markets"
                  className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/70 text-xs font-semibold hover:bg-white/10 hover:text-white transition-colors"
                >
                  Live Markets
                </Link>
                <Link
                  to="/tabloid/forex"
                  className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/70 text-xs font-semibold hover:bg-white/10 hover:text-white transition-colors"
                >
                  Forex Desk
                </Link>
                <Link
                  to="/tabloid/editorial"
                  className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/70 text-xs font-semibold hover:bg-white/10 hover:text-white transition-colors"
                >
                  Editorial Pipeline
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
