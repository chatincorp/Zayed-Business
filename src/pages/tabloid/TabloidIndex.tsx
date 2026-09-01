/**
 * TabloidIndex — Zayed Tabloid landing page.
 * News feed with source links, AI rewrite, editorial workflow,
 * plus stock and forex tickers.
 */

import { useState } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import {
  Newspaper,
  TrendingUp,
  DollarSign,
  ExternalLink,
  Clock,
  Tag,
  Filter,
  ArrowRight,
  Bot,
  CheckCircle2,
  PenTool,
  Eye,
  Globe,
} from "lucide-react";
import {
  newsSources,
  mockArticles,
  getStatusColor,
  getStatusLabel,
  type TabloidArticle,
} from "@/data/tabloidData";
import StockTicker from "@/components/tabloid/StockTicker";
import ForexTicker from "@/components/tabloid/ForexTicker";
import FloatingWidgets from "@/components/FloatingWidgets";

const categories = ["All", "Africa", "Global Finance", "Technology", "Business", "Security"];

export default function TabloidIndex() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [expandedArticle, setExpandedArticle] = useState<string | null>(null);

  const filteredArticles =
    activeCategory === "All"
      ? mockArticles
      : mockArticles.filter((a) => a.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#060a14]">
      {/* ── Ticker Bars ── */}
      <StockTicker />
      <ForexTicker />

      {/* ── Header ── */}
      <header className="relative border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-electric/5 via-transparent to-emerald-500/5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-electric/10 border border-electric/20 flex items-center justify-center">
                <Newspaper className="w-5 h-5 text-electric" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-widest text-electric">
                Zayed Tabloid
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              Business, Technology &amp; Global Markets
            </h1>
            <p className="text-white/50 text-lg max-w-2xl">
              AI-curated news from the world&apos;s leading sources, rewritten in human style.
              Live markets, forex rates, and editorial intelligence — all in one place.
            </p>

            {/* Quick links */}
            <div className="flex flex-wrap gap-3 mt-6">
              <Link
                to="/tabloid/markets"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium hover:bg-emerald-500/20 transition-colors"
              >
                <TrendingUp className="w-4 h-4" />
                Live Markets
              </Link>
              <Link
                to="/tabloid/forex"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium hover:bg-blue-500/20 transition-colors"
              >
                <DollarSign className="w-4 h-4" />
                Live Forex
              </Link>
              <Link
                to="/tabloid/editorial"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium hover:bg-purple-500/20 transition-colors"
              >
                <PenTool className="w-4 h-4" />
                Editorial Dashboard
              </Link>
            </div>
          </motion.div>
        </div>
      </header>

      {/* ── Source News Links ── */}
      <section className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-4">
            Source News Feeds
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {newsSources.map((source) => (
              <a
                key={source.id}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all"
              >
                <span className="text-lg">{source.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white/70 group-hover:text-white transition-colors truncate">
                    {source.name}
                  </p>
                  <p className="text-[10px] text-white/30 uppercase">{source.category}</p>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-white/20 group-hover:text-electric shrink-0 transition-colors" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Category Filter ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <Filter className="w-4 h-4 text-white/30 shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? "bg-electric text-white shadow-lg shadow-electric/20"
                  : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/70"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Articles Grid ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid gap-4">
          {filteredArticles.map((article, i) => (
            <ArticleCard
              key={article.id}
              article={article}
              index={i}
              isExpanded={expandedArticle === article.id}
              onToggle={() =>
                setExpandedArticle(expandedArticle === article.id ? null : article.id)
              }
            />
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-20">
            <Newspaper className="w-12 h-12 text-white/10 mx-auto mb-4" />
            <p className="text-white/30 text-sm">No articles in this category yet.</p>
          </div>
        )}
      </main>

      <FloatingWidgets />
    </div>
  );
}

/* ── Article Card Component ─────────────────────────────────── */

function ArticleCard({
  article,
  index,
  isExpanded,
  onToggle,
}: {
  article: TabloidArticle;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const source = newsSources.find((s) => s.id === article.sourceId);

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="rounded-xl bg-white/[0.02] border border-white/5 overflow-hidden hover:border-white/10 transition-all"
    >
      {/* Top bar — source + status */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/5">
        <div className="flex items-center gap-3">
          <span className="text-sm">{source?.icon}</span>
          <span className="text-xs text-white/40">{source?.name}</span>
          <span className="text-white/10">•</span>
          <span className="text-xs text-white/30">{article.category}</span>
        </div>
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusColor(article.status)}`}>
          {getStatusLabel(article.status)}
        </span>
      </div>

      {/* Content */}
      <div className="px-5 py-4">
        <h3 className="text-lg font-semibold text-white mb-2 leading-snug">{article.title}</h3>
        <p className="text-sm text-white/40 mb-3">{article.excerpt}</p>

        {/* Meta */}
        <div className="flex items-center gap-4 text-xs text-white/30">
          <span className="flex items-center gap-1">
            <Bot className="w-3 h-3" />
            {article.author}
          </span>
          {article.editor && (
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {article.editor}
            </span>
          )}
          {article.publisher && (
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              {article.publisher}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {article.readTime}
          </span>
        </div>
      </div>

      {/* Tags + expand */}
      <div className="px-5 py-3 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5 text-white/30 text-[10px]"
            >
              <Tag className="w-2.5 h-2.5" />
              {tag}
            </span>
          ))}
        </div>
        <button
          onClick={onToggle}
          className="text-xs text-electric hover:text-electric/80 transition-colors flex items-center gap-1"
        >
          {isExpanded ? "Collapse" : "Read AI Rewrite"}
          <ArrowRight className={`w-3 h-3 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
        </button>
      </div>

      {/* Expanded AI Rewrite */}
      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="px-5 py-4 border-t border-white/5 bg-electric/[0.02]"
        >
          <div className="flex items-center gap-2 mb-3">
            <Bot className="w-4 h-4 text-electric" />
            <span className="text-xs font-semibold text-electric uppercase tracking-wider">
              AI Rewrite — Human Style
            </span>
          </div>
          <p className="text-sm text-white/60 leading-relaxed">{article.aiRewrite}</p>
          <div className="mt-4 flex items-center gap-3">
            <a
              href={article.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-white/50 text-xs hover:bg-white/10 hover:text-white/70 transition-all"
            >
              <Globe className="w-3 h-3" />
              View Original Source
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </motion.div>
      )}
    </motion.article>
  );
}
