"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";

/* ══════════════════════════════════════════════════════════════
 *  Continuous news ingestion engine for Zayed Tabloid.
 *  1. Fetches RSS/Atom XML from every active newsFeeds row.
 *  2. Dedupes against tabloidNews via by_dedupe index.
 *  3. AI-rewrites headlines + body in human editorial style
 *     (OpenAI when OPENAI_API_KEY is set, deterministic
 *     heuristic rewriting otherwise).
 *  4. Inserts new items into tabloidNews.
 * ══════════════════════════════════════════════════════════════ */

/* ── XML helpers (no RSS parser dependency) ─────────────────── */

function decodeEntities(s: string): string {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;|&#x27;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&amp;/g, "&");
}

function stripTags(s: string): string {
  return decodeEntities(s)
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

interface RawItem {
  title: string;
  link: string;
  description: string;
  pubDate: number;
  image?: string;
}

function absolutizeUrl(u: string, base: string): string {
  try {
    return new URL(u, base).href;
  } catch {
    return u;
  }
}

function isArticleImage(u: string): boolean {
  if (!u) return false;
  // Reject tracking pixels / tiny assets / logos.
  if (/(1x1|pixel|spacer|blank|\.svg)(\?|$)/i.test(u)) return false;
  return /\.(jpe?g|png|webp)(\?|$)/i.test(u) || /\/photo\//.test(u);
}

/**
 * Extract the original article image from a raw RSS/Atom item block.
 * Priority: media:content (widest) → media:thumbnail → enclosure → inline <img>.
 */
function extractImage(block: string, feedUrl: string): string | undefined {
  const candidates: string[] = [];
  let m: RegExpExecArray | null;

  // 1. Media RSS — collect url + width so we can pick the largest.
  const mediaRe = /<media:(?:content|thumbnail)\b[^>]*>/gi;
  while ((m = mediaRe.exec(block)) !== null) {
    const url = m[0].match(/url="([^"]+)"/i)?.[1];
    if (!url || !isArticleImage(url)) continue;
    const w = Number(m[0].match(/width="(\d+)"/i)?.[1] ?? 0);
    candidates.push(`${w}|${url}`);
  }

  // 2. <enclosure url=... type="image/...">
  const encRe = /<enclosure\b[^>]*>/gi;
  while ((m = encRe.exec(block)) !== null) {
    const url = m[0].match(/url="([^"]+)"/i)?.[1];
    const type = m[0].match(/type="([^"]+)"/i)?.[1] ?? "";
    if (url && (type.startsWith("image") || /\.(jpe?g|png|webp)(\?|$)/i.test(url))) {
      candidates.push(`0|${url}`);
    }
  }

  // 3. Inline <img src=...> (Google News, some Atom content blocks).
  const imgRe = /<img\b[^>]*>/gi;
  while ((m = imgRe.exec(block)) !== null) {
    const url =
      m[0].match(/(?:data-)?src="([^"]+)"/i)?.[1] ??
      m[0].match(/srcset="([^"]+?)\s/)?.[1];
    if (url && isArticleImage(url)) candidates.push(`0|${url}`);
  }

  if (candidates.length === 0) return undefined;

  // Widest media:content first; ties resolved by encounter order.
  candidates.sort((a, b) => Number(b.split("|")[0]) - Number(a.split("|")[0]));
  return absolutizeUrl(candidates[0].split("|").slice(1).join("|"), feedUrl);
}

function parseFeed(xml: string, feedUrl: string): RawItem[] {
  const items: RawItem[] = [];
  const blocks =
    xml.match(/<item[\s>][\s\S]*?<\/item>/gi) ??
    xml.match(/<entry[\s>][\s\S]*?<\/entry>/gi) ??
    [];

  for (const block of blocks.slice(0, 15)) {
    const titleMatch = block.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const linkMatch =
      block.match(/<link[^>]*href="([^"]+)"/i) ??
      block.match(/<link[^>]*>([\s\S]*?)<\/link>/i);
    const descMatch = block.match(
      /<(?:description|summary|content:encoded)[^>]*>([\s\S]*?)<\/(?:description|summary|content:encoded)>/i
    );
    const dateMatch = block.match(
      /<(?:pubDate|published|updated|dc:date)[^>]*>([\s\S]*?)<\/(?:pubDate|published|updated|dc:date)>/i
    );

    const title = stripTags(titleMatch?.[1] ?? "");
    if (!title) continue;

    const link = (linkMatch?.[1] ?? "").trim();
    const description = stripTags(descMatch?.[1] ?? "").slice(0, 2000);
    const pubDate = dateMatch?.[1] ? new Date(stripTags(dateMatch[1])).getTime() : Date.now();

    items.push({
      title,
      link,
      description,
      pubDate: Number.isFinite(pubDate) ? pubDate : Date.now(),
      image: extractImage(block, feedUrl),
    });
  }
  return items;
}

/* ── Deterministic hash for dedupe keys ─────────────────────── */

function hashString(input: string): string {
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let i = 0; i < input.length; i++) {
    const ch = input.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36) + (h2 >>> 0).toString(36);
}

/* ── Category inference ─────────────────────────────────────── */

const CATEGORY_RULES: Array<{ category: string; terms: string[] }> = [
  { category: "Security", terms: ["cyber", "security", "hack", "breach", "ransomware", "data protection", "phishing"] },
  { category: "Technology", terms: ["ai ", "artificial intelligence", "tech", "software", "app", "chip", "cloud", "startup", "digital", "saas", "robot"] },
  { category: "Global Finance", terms: ["market", "stock", "fed ", "central bank", "inflation", "interest rate", "investor", "wall street", "nasdaq", "s&p", "treasury"] },
  { category: "Business", terms: ["business", "company", "revenue", "earnings", "ceo", "merger", "acquisition", "ipo", "economy", "trade", "gdp"] },
  { category: "Africa", terms: ["kenya", "nairobi", "africa", "nigeria", "lagos", "johannesburg", "ghana", "rwanda", "tanzania", "uganda", "east africa"] },
];

function inferCategory(title: string, excerpt: string, feedCategory: string): string {
  const text = `${title} ${excerpt}`.toLowerCase();
  for (const rule of CATEGORY_RULES) {
    if (rule.terms.some((t) => text.includes(t))) return rule.category;
  }
  if (feedCategory === "africa") return "Africa";
  if (feedCategory === "tech") return "Technology";
  if (feedCategory === "finance") return "Global Finance";
  return "Business";
}

/* ── Human-style heuristic rewriting ────────────────────────── */

const HOOKS = [
  "Here's what matters:",
  "The short version:",
  "What you need to know:",
  "The bottom line:",
];

function sentenceSplit(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 1);
}

function rewriteTitle(original: string, category: string): string {
  let t = original.trim();
  // Remove noisy source suffixes and site branding.
  t = t.replace(/\s*[-–—|]\s*[^-–—|]{2,40}$/, "").trim() || original.trim();
  t = t.replace(/\b(report|update|breaking|exclusive)\b\s*\d*\s*[-–—:]\s*/i, "");
  if (t.length > 90) {
    const cut = t.slice(0, 90);
    t = cut.slice(0, cut.lastIndexOf(" ")) + "…";
  }
  if (t.length < 28 && category === "Africa") t = `${t}: What It Means for Kenya`;
  return t;
}

function humanizeParagraph(sentence: string): string {
  let s = sentence;
  // Convert passive-leaning openers to active voice.
  s = s.replace(/\b(is|are|was|were)\s+being\s+/gi, "is ");
  s = s.replace(/\bthere (is|are)\b\s+/i, "");
  s = s.replace(/^It (is|was) (important to note|worth noting) that\s+/i, "");
  s = s.replace(/\bin order to\b/gi, "to");
  s = s.replace(/\butili[sz]e\b/gi, "use");
  s = s.replace(/\bcommence\b/gi, "start");
  s = s.replace(/\bsubsequently\b/gi, "then");
  // Emphasize numbers — financial readers scan for figures.
  s = s.replace(/\$([0-9][\d,.]*)(\s?)(billion|trillion|million)\b/gi, (_m, num, _sp, unit) =>
    `$${num}${unit.charAt(0).toLowerCase()}`
  );
  return s.trim();
}

function buildRewrite(
  originalTitle: string,
  excerpt: string,
  category: string
): { title: string; excerpt: string; body: string; aiRewrite: string } {
  const title = rewriteTitle(originalTitle, category);
  const sentences = sentenceSplit(excerpt);

  const lead = sentences[0] ? humanizeParagraph(sentences[0]) : originalTitle;
  const hook = HOOKS[originalTitle.length % HOOKS.length];

  const bodyParagraphs: string[] = [];
  bodyParagraphs.push(lead);

  const middles = sentences.slice(1, 7).map(humanizeParagraph);
  if (middles.length > 0) {
    bodyParagraphs.push(middles.slice(0, Math.ceil(middles.length / 2)).join(" "));
    if (middles.length > 1) {
      bodyParagraphs.push(middles.slice(Math.ceil(middles.length / 2)).join(" "));
    }
  }

  if (bodyParagraphs.length < 3) {
    bodyParagraphs.push(
      `${hook} ${category === "Security" ? "Security teams" : "Market watchers"} will be following how this develops over the coming days, particularly what it means for businesses and investors watching the space.`
    );
  }

  const contextLine =
    category === "Africa"
      ? "For East African businesses, the development underscores how quickly the regional landscape is maturing — and why staying informed is now a competitive advantage."
      : "The takeaway: stay close to the facts, watch the numbers, and treat every development as an input to your next decision.";

  bodyParagraphs.push(contextLine);

  const body = bodyParagraphs.filter((p) => p.length > 0).join("\n\n");
  const excerptOut =
    (sentences[0] ? humanizeParagraph(sentences[0]) : title).slice(0, 180).trim() + "…";
  const aiRewrite = `${bodyParagraphs.slice(0, 2).join(" ")} ${hook} ${contextLine}`;

  return { title, excerpt: excerptOut, body, aiRewrite };
}

/* ── Optional OpenAI-powered rewrite ────────────────────────── */

async function openAiRewrite(
  title: string,
  excerpt: string
): Promise<{ title: string; body: string } | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.7,
        messages: [
          {
            role: "system",
            content:
              "You are the lead editor of a premium business publication. Rewrite the given news in a confident, human, journalistic style. Return strict JSON: {\"title\": string (max 90 chars, no clickbait), \"body\": string (4-6 paragraphs separated by blank lines)}. Never copy source sentences verbatim.",
          },
          {
            role: "user",
            content: `Headline: ${title}\n\nSummary: ${excerpt}`,
          },
        ],
        response_format: { type: "json_object" },
      }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = data.choices?.[0]?.message?.content;
    if (!content) return null;
    const parsed = JSON.parse(content) as { title?: string; body?: string };
    if (!parsed.title || !parsed.body) return null;
    return { title: parsed.title, body: parsed.body };
  } catch {
    return null;
  }
}

/* ── Tags ───────────────────────────────────────────────────── */

function buildTags(title: string, excerpt: string, category: string): string[] {
  const stop = new Set([
    "the", "and", "for", "with", "from", "that", "this", "have", "has",
    "will", "into", "after", "over", "about", "more", "than", "their",
    "said", "says", "new", "amid", "are", "was", "were", "its", "his",
    "her", "not", "but", "all", "can", "how", "why", "what", "who",
  ]);
  const words = `${title} ${excerpt}`
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !stop.has(w));
  const freq = new Map<string, number>();
  for (const w of words) freq.set(w, (freq.get(w) ?? 0) + 1);
  const top = [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([w]) => w.replace(/\b\w/g, (c) => c.toUpperCase()));
  return [...new Set([category, ...top])].slice(0, 5);
}

/* ── The ingest action ──────────────────────────────────────── */

const DEFAULT_FEEDS = [
  { name: "Google News Kenya – Business", url: "https://news.google.com/rss/search?q=Kenya+business&hl=en-KE&gl=KE&ceid=KE:en", category: "africa" },
  { name: "Google News Kenya – Technology", url: "https://news.google.com/rss/search?q=Kenya+technology&hl=en-KE&gl=KE&ceid=KE:en", category: "tech" },
  { name: "CNBC", url: "https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=100003114", category: "finance" },
  { name: "CNN Business", url: "http://rss.cnn.com/rss/money_news_international.rss", category: "global" },
  { name: "BBC Business (fallback)", url: "https://feeds.bbci.co.uk/news/business/rss.xml", category: "global" },
];

export const ingestNews = action({
  args: {
    feedName: v.optional(v.string()),
    maxPerFeed: v.optional(v.number()),
    autoPublish: v.optional(v.boolean()),
    useAI: v.optional(v.boolean()),
  },
  handler: async (ctx, args): Promise<{ feedsProcessed: number; inserted: number }> => {
    const maxPerFeed = Math.min(args.maxPerFeed ?? 8, 15);
    const autoPublish = args.autoPublish ?? true;
    const useAI = args.useAI ?? true;

    // 1. Gather feeds (DB first, defaults as fallback).
    let feeds: Array<{ _id?: string; name: string; url: string; category: string }> =
      await ctx.runQuery(internal.tabloidNews.getActiveFeedsInternal, {});

    let sources: Array<{ name: string; url: string; category: string }>;
    if (feeds.length > 0) {
      sources = feeds.map((f) => ({ name: f.name, url: f.url, category: f.category }));
    } else {
      sources = DEFAULT_FEEDS;
      feeds = [];
    }

    const target = args.feedName
      ? sources.filter((s) => s.name === args.feedName)
      : sources;

    let totalInserted = 0;
    const now = Date.now();

    for (const source of target) {
      const feedRecord = feeds.find((f) => f.name === source.name);
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 12_000);
        const res = await fetch(source.url, {
          signal: controller.signal,
          headers: {
            "User-Agent": "Mozilla/5.0 (compatible; ZayedTabloidBot/1.0; +https://yasirzayed.com)",
            Accept: "application/rss+xml, application/xml, text/xml, */*",
          },
        });
        clearTimeout(timer);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const xml = await res.text();
        const rawItems = parseFeed(xml, source.url).slice(0, maxPerFeed);
        const prepared: Array<Record<string, unknown>> = [];

        for (const item of rawItems) {
          const dedupeKey = hashString(`${item.link || item.title}`.slice(0, 300));
          const category = inferCategory(item.title, item.description, source.category);
          const tags = buildTags(item.title, item.description, category);
          const readTime =
            Math.max(2, Math.min(9, Math.round(item.description.split(/\s+/).length / 60) || 3)) + " min";

          let rewrite = buildRewrite(item.title, item.description || item.title, category);

          if (useAI) {
            const ai = await openAiRewrite(rewrite.title, item.description || item.title);
            if (ai) {
              rewrite = {
                title: ai.title,
                excerpt: (sentenceSplit(ai.body)[0] ?? rewrite.excerpt).slice(0, 180) + "…",
                body: ai.body,
                aiRewrite: ai.body.split("\n\n").slice(0, 2).join(" ").slice(0, 500),
              };
            }
          }

          // SEO metadata — derived from the final title/body after any AI rewrite.
          const seoTitle = `${rewrite.title.slice(0, 60)} | Zayed Tabloid`.slice(0, 100);
          const seoDescription =
            (sentenceSplit(rewrite.body)[0] ?? rewrite.excerpt).replace(/\s+/g, " ").trim().slice(0, 155) ||
            rewrite.excerpt.slice(0, 155);
          const seoKeywords = tags.join(", ");

          prepared.push({
            dedupeKey,
            sourceName: source.name,
            sourceUrl: item.link || source.url,
            originalTitle: item.title,
            originalExcerpt: item.description.slice(0, 400) || undefined,
            title: rewrite.title,
            excerpt: rewrite.excerpt,
            aiRewrite: rewrite.aiRewrite,
            body: rewrite.body,
            image: item.image,
            category,
            tags,
            seoTitle,
            seoDescription,
            seoKeywords,
            readTime,
            author: "Zayed News Desk",
            editor: "News Desk",
            status: autoPublish ? "published" : "rewritten",
            publishedAt: Math.max(item.pubDate, now - 48 * 60 * 60 * 1000),
          });
        }

        const result = await ctx.runMutation(internal.tabloidNews.ingestNewsItemsInternal, {
          feedId: feedRecord?._id as never,
          publish: autoPublish,
          items: prepared as never,
        });
        totalInserted += result.inserted;

        if (feedRecord?._id) {
          await ctx.runMutation(internal.tabloidNews.markFeedFetchedInternal, {
            feedId: feedRecord._id as never,
            itemCount: rawItems.length,
          });
        }
      } catch (err) {
        console.warn(`[tabloidIngest] feed "${source.name}" failed:`, err instanceof Error ? err.message : err);
      }
    }

    return { feedsProcessed: target.length, inserted: totalInserted };
  },
});
