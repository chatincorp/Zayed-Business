/**
 * EditorialDashboard — content creation, editor review, and publisher approval workflow.
 * AI-generated content goes through a 3-stage editorial pipeline.
 */

import { useState } from "react";
import { motion } from "framer-motion";
import {
  PenTool,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  Bot,
  Send,
  FileText,
  Filter,
  Search,
  RefreshCw,
  ArrowRight,
} from "lucide-react";
import {
  mockArticles,
  editorialTeam,
  newsSources,
  getStatusColor,
  getStatusLabel,
  type TabloidArticle,
  type ArticleStatus,
} from "@/data/tabloidData";
import StockTicker from "@/components/tabloid/StockTicker";
import ForexTicker from "@/components/tabloid/ForexTicker";
import FloatingWidgets from "@/components/FloatingWidgets";
import { useSEO } from "@/lib/seo";

const statusFilters: ArticleStatus[] = ["draft", "pending_review", "approved", "published", "rejected"];

const statusIcons: Record<ArticleStatus, typeof PenTool> = {
  draft: PenTool,
  pending_review: Clock,
  approved: CheckCircle2,
  published: Send,
  rejected: XCircle,
};

export default function EditorialDashboard() {
  useSEO({
    title: "Editorial Pipeline — AI Content Workflow",
    description:
      "How the Zayed Tabloid editorial engine works: AI content creation, human editor review, and publisher approval before every story goes live.",
    path: "/tabloid/editorial",
    noindex: true,
  });

  const [statusFilter, setStatusFilter] = useState<ArticleStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [selectedArticle, setSelectedArticle] = useState<TabloidArticle | null>(null);

  const filtered = mockArticles
    .filter((a) => statusFilter === "all" || a.status === statusFilter)
    .filter(
      (a) =>
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        a.category.toLowerCase().includes(search.toLowerCase()) ||
        a.author.toLowerCase().includes(search.toLowerCase())
    );

  // Stats
  const stats = {
    total: mockArticles.length,
    drafts: mockArticles.filter((a) => a.status === "draft").length,
    pending: mockArticles.filter((a) => a.status === "pending_review").length,
    approved: mockArticles.filter((a) => a.status === "approved").length,
    published: mockArticles.filter((a) => a.status === "published").length,
    rejected: mockArticles.filter((a) => a.status === "rejected").length,
  };

  return (
    <div className="min-h-screen bg-[#060a14]">
      <StockTicker />
      <ForexTicker />

      {/* Header */}
      <header className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                <PenTool className="w-5 h-5 text-purple-400" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-widest text-purple-400">
                Editorial Dashboard
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              Content Pipeline
            </h1>
            <p className="text-white/50 text-lg">
              AI-generated articles flow through Creator → Editor → Publisher review.
            </p>
          </motion.div>
        </div>
      </header>

      {/* Pipeline Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: "Total", value: stats.total, icon: FileText, color: "text-white/50" },
            { label: "Drafts", value: stats.drafts, icon: PenTool, color: "text-zinc-400" },
            { label: "Pending Review", value: stats.pending, icon: Clock, color: "text-amber-400" },
            { label: "Approved", value: stats.approved, icon: CheckCircle2, color: "text-blue-400" },
            { label: "Published", value: stats.published, icon: Send, color: "text-emerald-400" },
            { label: "Rejected", value: stats.rejected, icon: XCircle, color: "text-red-400" },
          ].map((s) => (
            <div key={s.label} className="rounded-lg bg-white/[0.02] border border-white/5 p-4">
              <s.icon className={`w-4 h-4 mb-2 ${s.color}`} />
              <p className="text-xl font-bold text-white">{s.value}</p>
              <p className="text-[10px] text-white/40 uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pipeline Flow */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <div className="flex items-center justify-center gap-2 py-4 overflow-x-auto">
          {[
            { label: "AI Creates", icon: Bot, color: "electric" },
            { label: "Editor Reviews", icon: Eye, color: "amber-400" },
            { label: "Publisher Approves", icon: CheckCircle2, color: "emerald-400" },
          ].map((step, i) => (
            <div key={step.label} className="flex items-center gap-2">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.03] border border-white/5`}>
                <step.icon className={`w-4 h-4 text-${step.color}`} />
                <span className="text-xs font-medium text-white/60 whitespace-nowrap">{step.label}</span>
              </div>
              {i < 2 && <ArrowRight className="w-4 h-4 text-white/20 shrink-0" />}
            </div>
          ))}
        </div>
      </div>

      {/* Editorial Team */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-3">
          Editorial Team
        </h2>
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {editorialTeam.map((member) => (
            <div
              key={member.name}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.02] border border-white/5 shrink-0"
            >
              <span className="text-lg">{member.avatar}</span>
              <div>
                <p className="text-xs font-medium text-white/70">{member.name}</p>
                <p className="text-[10px] text-white/30 capitalize">
                  {member.role.replace("_", " ")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters + Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 border-t border-b border-white/5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 flex-1">
            <Filter className="w-4 h-4 text-white/30 shrink-0" />
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                statusFilter === "all"
                  ? "bg-purple-500 text-white"
                  : "bg-white/5 text-white/50 hover:bg-white/10"
              }`}
            >
              All ({stats.total})
            </button>
            {statusFilters.map((status) => {
              const Icon = statusIcons[status];
              const count = mockArticles.filter((a) => a.status === status).length;
              return (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                    statusFilter === status
                      ? "bg-purple-500 text-white"
                      : "bg-white/5 text-white/50 hover:bg-white/10"
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  {getStatusLabel(status)} ({count})
                </button>
              );
            })}
          </div>

          <div className="relative shrink-0">
            <Search className="w-4 h-4 text-white/30 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500/50 w-56"
            />
          </div>
        </div>
      </div>

      {/* Articles List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="divide-y divide-white/5">
          {filtered.map((article, i) => (
            <EditorialArticleRow
              key={article.id}
              article={article}
              index={i}
              isSelected={selectedArticle?.id === article.id}
              onSelect={() =>
                setSelectedArticle(selectedArticle?.id === article.id ? null : article)
              }
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <FileText className="w-12 h-12 text-white/10 mx-auto mb-4" />
            <p className="text-white/30 text-sm">No articles match this filter.</p>
          </div>
        )}

        {/* Expanded detail panel */}
        {selectedArticle && (
          <ArticleDetailPanel article={selectedArticle} />
        )}
      </div>

      <FloatingWidgets />
    </div>
  );
}

function EditorialArticleRow({
  article,
  index,
  isSelected,
  onSelect,
}: {
  article: TabloidArticle;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const source = newsSources.find((s) => s.id === article.sourceId);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
      onClick={onSelect}
      className={`px-4 py-4 cursor-pointer hover:bg-white/[0.02] transition-colors ${
        isSelected ? "bg-white/[0.03]" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusColor(article.status)}`}>
              {getStatusLabel(article.status)}
            </span>
            <span className="text-[10px] text-white/30">{article.category}</span>
            <span className="text-[10px] text-white/20">•</span>
            <span className="text-[10px] text-white/20">{source?.icon} {source?.name}</span>
          </div>
          <h3 className="text-sm font-semibold text-white/80 mb-1 leading-snug">{article.title}</h3>
          <p className="text-xs text-white/40 line-clamp-1">{article.excerpt}</p>
        </div>

        <div className="flex items-center gap-3 shrink-0 text-xs text-white/30">
          {/* Author pipeline */}
          <div className="flex items-center gap-1.5">
            <span title="Content Creator" className="flex items-center gap-1">
              <Bot className="w-3 h-3 text-electric" />
              <span className="hidden sm:inline">{article.author}</span>
            </span>
            {article.editor && (
              <>
                <ArrowRight className="w-3 h-3 text-white/15" />
                <span title="Editor" className="flex items-center gap-1">
                  <Eye className="w-3 h-3 text-amber-400" />
                  <span className="hidden sm:inline">{article.editor}</span>
                </span>
              </>
            )}
            {article.publisher && (
              <>
                <ArrowRight className="w-3 h-3 text-white/15" />
                <span title="Publisher" className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span className="hidden sm:inline">{article.publisher}</span>
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ArticleDetailPanel({ article }: { article: TabloidArticle }) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="mt-4 rounded-xl bg-white/[0.02] border border-white/5 overflow-hidden"
    >
      {/* Tabs for Original, AI Rewrite, Actions */}
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(article.status)}`}>
            {getStatusLabel(article.status)}
          </span>
          <h2 className="text-lg font-bold text-white">{article.title}</h2>
        </div>

        {/* Two-column: Original vs AI Rewrite */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <div className="rounded-lg bg-white/[0.02] border border-white/5 p-4">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4 text-white/30" />
              <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">
                Original Source
              </span>
            </div>
            <p className="text-xs text-white/30 italic mb-2">
              &ldquo;{article.excerpt}&rdquo;
            </p>
            <p className="text-[10px] text-white/20">
              Source: {newsSources.find((s) => s.id === article.sourceId)?.name}
            </p>
          </div>

          <div className="rounded-lg bg-electric/[0.03] border border-electric/10 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Bot className="w-4 h-4 text-electric" />
              <span className="text-xs font-semibold text-electric uppercase tracking-wider">
                AI Rewrite — Human Style
              </span>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">{article.aiRewrite}</p>
          </div>
        </div>

        {/* Tags */}
        <div className="flex items-center gap-2 flex-wrap mb-6">
          {article.tags.map((tag) => (
            <span key={tag} className="px-2 py-0.5 rounded-full bg-white/5 text-white/30 text-[10px]">
              {tag}
            </span>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium hover:bg-emerald-500/20 transition-colors">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Approve & Publish
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium hover:bg-amber-500/20 transition-colors">
            <RefreshCw className="w-3.5 h-3.5" />
            Request Revision
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium hover:bg-red-500/20 transition-colors">
            <XCircle className="w-3.5 h-3.5" />
            Reject
          </button>
        </div>
      </div>
    </motion.div>
  );
}
