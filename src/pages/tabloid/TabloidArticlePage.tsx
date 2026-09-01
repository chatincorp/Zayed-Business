/**
 * TabloidArticlePage — full readable article page at /tabloid/:id
 * Shows hero image, title, metadata, full body, AI rewrite, tags, and source.
 */

import { useParams, Link } from "react-router";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  Tag,
  Bot,
  ExternalLink,
  Globe,
  Eye,
  CheckCircle2,
  Share2,
  Bookmark,
} from "lucide-react";
import { mockArticles, newsSources } from "@/data/tabloidData";
import StockTicker from "@/components/tabloid/StockTicker";
import ForexTicker from "@/components/tabloid/ForexTicker";
import FloatingWidgets from "@/components/FloatingWidgets";

// Fallback images by category
const categoryImages: Record<string, string> = {
  Africa: "https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=1200&h=500&fit=crop",
  "Global Finance": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=500&fit=crop",
  Technology: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=500&fit=crop",
  Business: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=500&fit=crop",
  Security: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&h=500&fit=crop",
};

export default function TabloidArticlePage() {
  const { id } = useParams<{ id: string }>();
  const article = mockArticles.find((a) => a.id === id);

  if (!article) {
    return (
      <div className="min-h-screen bg-[#060a14]">
        <StockTicker />
        <ForexTicker />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Article Not Found</h1>
          <p className="text-white/50 mb-6">The article you are looking for does not exist or has been removed.</p>
          <Link to="/tabloid" className="inline-flex items-center gap-2 px-6 py-3 bg-electric text-white rounded-lg font-medium hover:bg-electric-dark transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Tabloid
          </Link>
        </div>
        <FloatingWidgets />
      </div>
    );
  }

  const source = newsSources.find((s) => s.id === article.sourceId);
  const heroImage = article.image || categoryImages[article.category] || categoryImages.Technology;

  // Split body into paragraphs — fall back to aiRewrite if no body
  const bodyText = article.body || article.aiRewrite;
  const bodyParagraphs = bodyText.split("\n\n").filter((p) => p.trim());

  return (
    <div className="min-h-screen bg-[#060a14]">
      <StockTicker />
      <ForexTicker />

      {/* Hero image */}
      <div className="relative h-[400px] sm:h-[500px] overflow-hidden">
        <img
          src={heroImage}
          alt={article.title}
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#060a14] via-[#060a14]/60 to-transparent" />

        {/* Back button */}
        <div className="absolute top-6 left-6">
          <Link
            to="/tabloid"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-black/40 backdrop-blur-sm text-white/80 text-sm font-medium hover:bg-black/60 hover:text-white transition-all border border-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Tabloid
          </Link>
        </div>

        {/* Category badge */}
        <div className="absolute top-6 right-6">
          <span className="px-3 py-1.5 rounded-full bg-electric/20 border border-electric/30 text-electric text-xs font-semibold backdrop-blur-sm">
            {article.category}
          </span>
        </div>
      </div>

      {/* Article content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 -mt-32 relative z-10">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
            {article.title}
          </h1>

          {/* Meta bar */}
          <div className="flex flex-wrap items-center gap-4 mb-8 pb-6 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-electric/20 flex items-center justify-center">
                <Bot className="w-4 h-4 text-electric" />
              </div>
              <div>
                <p className="text-sm font-medium text-white/80">{article.author}</p>
                <p className="text-[10px] text-white/30">AI Content Engine</p>
              </div>
            </div>

            <span className="text-white/10">|</span>

            <div className="flex items-center gap-1.5 text-white/40 text-sm">
              <Clock className="w-3.5 h-3.5" />
              {article.readTime} read
            </div>

            <span className="text-white/10">|</span>

            <span className="text-white/40 text-sm">
              {new Date(article.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>

            <div className="flex-1" />

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-colors" title="Share">
                <Share2 className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-colors" title="Bookmark">
                <Bookmark className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/5 text-white/40 text-xs border border-white/5"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>

          {/* Excerpt / Lead */}
          <p className="text-xl text-white/70 leading-relaxed mb-8 font-medium border-l-4 border-electric pl-6">
            {article.excerpt}
          </p>

          {/* Body */}
          <div className="prose-article mb-12">
            {bodyParagraphs.map((paragraph, i) => (
              <p key={i} className="text-base text-white/60 leading-relaxed mb-5">
                {paragraph}
              </p>
            ))}
          </div>

          {/* AI Rewrite Section */}
          <div className="rounded-xl bg-electric/[0.03] border border-electric/10 p-6 mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Bot className="w-5 h-5 text-electric" />
              <h3 className="text-sm font-bold text-electric uppercase tracking-wider">
                AI Rewrite — Human Style
              </h3>
            </div>
            <p className="text-sm text-white/60 leading-relaxed italic">
              {article.aiRewrite}
            </p>
          </div>

          {/* Editorial info */}
          <div className="rounded-xl bg-white/[0.02] border border-white/5 p-6 mb-10">
            <h3 className="text-xs font-bold text-white/30 uppercase tracking-wider mb-4">
              Editorial Pipeline
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-electric/10 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-electric" />
                </div>
                <div>
                  <p className="text-xs text-white/40">Content Creator</p>
                  <p className="text-sm font-medium text-white/70">{article.author}</p>
                </div>
              </div>
              {article.editor && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center">
                    <Eye className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-xs text-white/40">Editor</p>
                    <p className="text-sm font-medium text-white/70">{article.editor}</p>
                  </div>
                </div>
              )}
              {article.publisher && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs text-white/40">Publisher</p>
                    <p className="text-sm font-medium text-white/70">{article.publisher}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Source link */}
          {source && (
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5 mb-10">
              <div className="flex items-center gap-3">
                <span className="text-lg">{source.icon}</span>
                <div>
                  <p className="text-sm font-medium text-white/70">Source</p>
                  <p className="text-xs text-white/40">{source.name}</p>
                </div>
              </div>
              <a
                href={article.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/5 text-white/50 text-xs font-medium hover:bg-white/10 hover:text-white/70 transition-all"
              >
                <Globe className="w-3.5 h-3.5" />
                View Original
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}

          {/* Related articles */}
          <div className="mb-16">
            <h3 className="text-xs font-bold text-white/30 uppercase tracking-wider mb-4">
              More from Zayed Tabloid
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {mockArticles
                .filter((a) => a.id !== article.id && a.category === article.category)
                .slice(0, 2)
                .map((related) => (
                  <Link
                    key={related.id}
                    to={`/tabloid/${related.id}`}
                    className="group p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all"
                  >
                    <div className="flex gap-4">
                      <img
                        src={related.image || categoryImages[related.category]}
                        alt={related.title}
                        className="w-20 h-20 rounded-lg object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white/80 group-hover:text-white line-clamp-2 transition-colors">
                          {related.title}
                        </p>
                        <p className="text-[10px] text-white/30 mt-1">
                          {related.readTime} read · {new Date(related.publishedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </motion.article>
      </main>

      <FloatingWidgets />
    </div>
  );
}
