/**
 * TabloidArticlePage — full article at /tabloid/:id.
 * Reads from the live Convex tabloidNews feed with mock fallback,
 * emits NewsArticle JSON-LD via useSEO, shows editorial pipeline
 * and source attribution.
 */

import { useParams, Link } from "react-router";
import { useQuery } from "convex/react";
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
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { mockArticles, newsSources } from "@/data/tabloidData";
import StockTicker from "@/components/tabloid/StockTicker";
import ForexTicker from "@/components/tabloid/ForexTicker";
import FloatingWidgets from "@/components/FloatingWidgets";
import { useSEO, SEO_SITE_URL } from "@/lib/seo";

const categoryImages: Record<string, string> = {
  Africa: "https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=1200&h=500&fit=crop",
  "Global Finance": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=500&fit=crop",
  Technology: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=500&fit=crop",
  Business: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=500&fit=crop",
  Security: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&h=500&fit=crop",
};

/** Normalized article shape for rendering (Convex doc or mock). */
interface ArticleView {
  id: string;
  title: string;
  originalTitle?: string;
  excerpt: string;
  body: string;
  aiRewrite: string;
  category: string;
  author: string;
  editor?: string;
  publisher?: string;
  readTime: string;
  publishedAt: number;
  image?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  tags: string[];
  sourceName: string;
  sourceUrl: string;
  status: string;
}

export default function TabloidArticlePage() {
  const { id } = useParams<{ id: string }>();

  // Live lookup when the id is a Convex id.
  const live = useQuery(
    api.tabloidNews.getNewsItem,
    id && id.length > 20 ? { id: id as Id<"tabloidNews"> } : "skip"
  );

  const mock = mockArticles.find((a) => a.id === id);

  const article: ArticleView | null = live
    ? {
        id: live._id,
        title: live.title,
        originalTitle: live.originalTitle,
        excerpt: live.excerpt,
        body: live.body,
        aiRewrite: live.aiRewrite,
        category: live.category,
        author: live.author,
        editor: live.editor,
        publisher: live.status === "published" ? "Editorial Board" : undefined,
        readTime: live.readTime,
        publishedAt: live.publishedAt,
        image: live.image,
        seoTitle: live.seoTitle,
        seoDescription: live.seoDescription,
        seoKeywords: live.seoKeywords,
        tags: live.tags,
        sourceName: live.sourceName,
        sourceUrl: live.sourceUrl,
        status: live.status,
      }
    : mock
      ? {
          id: mock.id,
          title: mock.title,
          excerpt: mock.excerpt,
          body: mock.body ?? mock.aiRewrite,
          aiRewrite: mock.aiRewrite,
          category: mock.category,
          author: mock.author,
          editor: mock.editor,
          publisher: mock.publisher,
          readTime: mock.readTime,
          publishedAt: new Date(mock.publishedAt).getTime(),
          image: mock.image,
          tags: mock.tags,
          sourceName: newsSources.find((s) => s.id === mock.sourceId)?.name ?? mock.sourceId,
          sourceUrl: mock.sourceUrl,
          status: mock.status,
        }
      : null;

  const related = mock
    ? mockArticles.filter((a) => a.id !== mock.id && a.category === mock.category).slice(0, 2)
    : [];

  /* ── SEO + NewsArticle structured data ── */
  const heroImage =
    article?.image || (article ? categoryImages[article.category] : undefined) || categoryImages.Technology;
  const seoTitle = article?.seoTitle || article?.title || "Article";
  const seoDescription = article?.seoDescription || article?.excerpt || "";
  const seoKeywords = article?.seoKeywords || article?.tags.join(", ") || "";

  useSEO(
    article
      ? {
          title: seoTitle,
          description: seoDescription,
          path: `/tabloid/${article.id}`,
          type: "article",
          image: heroImage,
          publishedTime: new Date(article.publishedAt).toISOString(),
          modifiedTime: new Date().toISOString(),
          author: article.author,
          keywords: seoKeywords,
          jsonLd: {
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            headline: article.title,
            alternativeHeadline: article.originalTitle || article.title,
            description: seoDescription,
            image: [heroImage],
            datePublished: new Date(article.publishedAt).toISOString(),
            dateModified: new Date(article.publishedAt).toISOString(),
            author: { "@type": "Organization", name: article.author },
            publisher: {
              "@type": "Organization",
              name: "Yasir Zayed",
              logo: { "@type": "ImageObject", url: `${SEO_SITE_URL}/logo.svg` },
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `${SEO_SITE_URL}/tabloid/${article.id}`,
            },
            keywords: seoKeywords,
            articleSection: article.category,
            inLanguage: "en",
            isAccessibleForFree: true,
          },
        }
      : {
          title: "Article",
          description: "Read the latest business, technology and markets intelligence on Zayed Tabloid.",
          path: id ? `/tabloid/${id}` : "/tabloid",
          noindex: true,
        }
  );

  if (!article) {
    return (
      <div className="min-h-screen bg-[#060a14]">
        <StockTicker />
        <ForexTicker />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Article Not Found</h1>
          <p className="text-white/50 mb-6">
            This story may still be moving through the editorial pipeline, or the link is no longer valid.
          </p>
          <Link
            to="/tabloid"
            className="inline-flex items-center gap-2 px-6 py-3 bg-electric text-white rounded-lg font-medium hover:bg-electric-dark transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Tabloid
          </Link>
        </div>
        <FloatingWidgets />
      </div>
    );
  }

  const bodyParagraphs = article.body.split("\n\n").filter((p) => p.trim());
  const publishedDate = new Date(article.publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const shareUrl = `${SEO_SITE_URL}/tabloid/${article.id}`;

  return (
    <div className="min-h-screen bg-[#060a14]">
      <StockTicker />
      <ForexTicker />

      {/* Hero */}
      <div className="relative h-[380px] sm:h-[480px] overflow-hidden">
        <img
          src={heroImage}
          alt={article.title}
          className="w-full h-full object-cover"
          loading="eager"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#060a14] via-[#060a14]/60 to-transparent" />

        <div className="absolute top-6 left-6">
          <Link
            to="/tabloid"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-black/40 backdrop-blur-sm text-white/80 text-sm font-medium hover:bg-black/60 hover:text-white transition-all border border-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Tabloid
          </Link>
        </div>

        <div className="absolute top-6 right-6">
          <span className="px-3 py-1.5 rounded-full bg-electric/20 border border-electric/30 text-electric text-xs font-semibold backdrop-blur-sm">
            {article.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 -mt-32 relative z-10">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-[1.12] tracking-tight mb-6">
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
                <p className="text-[10px] text-white/30">Zayed Tabloid · {article.sourceName}</p>
              </div>
            </div>

            <span className="text-white/10">|</span>

            <div className="flex items-center gap-1.5 text-white/40 text-sm">
              <Clock className="w-3.5 h-3.5" />
              {article.readTime} read
            </div>

            <span className="text-white/10">|</span>

            <span className="text-white/40 text-sm">{publishedDate}</span>

            <div className="flex-1" />

            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  navigator.clipboard?.writeText(shareUrl).catch(() => undefined)
                }
                className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                title="Copy link"
              >
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

          {/* Lead */}
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

          {/* Editorial pipeline */}
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

          {/* Source */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5 mb-10">
            <div className="flex items-center gap-3">
              <span className="text-lg">
                {newsSources.find((s) => s.name === article.sourceName)?.icon ?? "📰"}
              </span>
              <div>
                <p className="text-sm font-medium text-white/70">Original Source</p>
                <p className="text-xs text-white/40">{article.sourceName}</p>
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

          {/* Related */}
          {related.length > 0 && (
            <div className="mb-16">
              <h3 className="text-xs font-bold text-white/30 uppercase tracking-wider mb-4">
                More from Zayed Tabloid
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {related.map((rel) => (
                  <Link
                    key={rel.id}
                    to={`/tabloid/${rel.id}`}
                    className="group p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all"
                  >
                    <div className="flex gap-4">
                      <img
                        src={rel.image || categoryImages[rel.category] || categoryImages.Technology}
                        alt={rel.title}
                        className="w-20 h-20 rounded-lg object-cover shrink-0"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white/80 group-hover:text-white line-clamp-2 transition-colors">
                          {rel.title}
                        </p>
                        <p className="text-[10px] text-white/30 mt-1">
                          {rel.readTime} read · {new Date(rel.publishedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </motion.article>
      </main>

      <FloatingWidgets />
    </div>
  );
}
