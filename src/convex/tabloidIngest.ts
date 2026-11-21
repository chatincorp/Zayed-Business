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

/** Trim text to a maximum length without cutting a word in half. */
function clampAtWord(s: string, max: number): string {
  const text = s.replace(/\s+/g, " ").trim();
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  const base = lastSpace > max * 0.5 ? cut.slice(0, lastSpace) : cut;
  return base.replace(/[\s,;:.\-–—]+$/, "");
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

const IMAGE_HOST_RE =
  /(googleusercontent|bbci|cloudfront|akamaized|cdn|img\.|images?\.|static\.|media\.|wp\.com|unsplash|reuters|bloomberg|cnn|forbes|nyt|wsj|ft\.com)/i;

/**
 * Is this URL an article photograph we can trust to render?
 *
 * Publishers serve images from extension-less CDN paths as often as from
 * .jpg URLs, so an extension check alone silently discarded most source
 * photography. Accept known image hosts and image-shaped paths, and reject
 * the things that are never article art.
 */
function isArticleImage(u: string): boolean {
  if (!u) return false;
  if (!/^https?:\/\//i.test(u)) return false;
  if (/(1x1|pixel|spacer|blank|sprite|logo|favicon|\.svg)(\?|$)/i.test(u)) return false;
  if (/\.(jpe?g|png|webp|avif)(\?|$)/i.test(u)) return true;
  if (/\/(photo|image|images|media|thumb|thumbnail|resize|crop|picture)s?\//i.test(u)) return true;
  return IMAGE_HOST_RE.test(u);
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

function hash01(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

/** Magnetic headline styles — deterministic per story, never clickbait. */
function rewriteTitle(original: string, category: string): string {
  let t = original.trim();
  // Remove noisy source suffixes and site branding.
  t = t.replace(/\s*[-–—|]\s*[^-–—|]{2,40}$/, "").trim() || original.trim();
  t = t.replace(/\b(report|update|breaking|exclusive)\b\s*\d*\s*[-–—:]\s*/i, "");

  const seed = hash01(original);
  const styles: Array<(s: string) => string> = [
    (s) => s,
    (s) => (s.endsWith("?") ? s : `${s}: What Changed and Why It Matters`),
    (s) => (s.endsWith("?") ? s : `${s} — The Full Story`),
    (s) => (s.endsWith("?") ? s : `${s}, Explained`),
  ];
  let out = pick(styles, seed)(t);

  if (out.length > 92) {
    const cut = out.slice(0, 92);
    out = cut.slice(0, cut.lastIndexOf(" ")) + "…";
  }
  if (out.length < 28 && category === "Africa") out = `${out}: What It Means for Kenya`;
  return out;
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

function keyFacts(excerpt: string): string[] {
  const facts: string[] = [];
  // Sentences containing figures, dates, or named-entity verbs make solid pull-facts.
  for (const s of sentenceSplit(excerpt)) {
    if (
      (/\d/.test(s) || /\b(said|announced|reported|confirmed|launched|signed|plan(ned)?|expect(s|ed)?)\b/i.test(s)) &&
      s.length > 40 &&
      s.length < 220
    ) {
      facts.push(s.trim());
    }
    if (facts.length >= 4) break;
  }
  return facts;
}

function buildSection(segments: string[], heading: string): string {
  if (segments.length === 0) return "";
  return `## ${heading}\n\n${segments.join(" ")}`;
}

/**
 * Longform editorial rewrite: turns a thin RSS glimpse into a full
 * 700+ word article with magnetic headline, hook lede, key-facts box,
 * themed analysis sections, pull-quote, outlook and evergreen closer.
 */
function buildRewrite(
  originalTitle: string,
  excerpt: string,
  category: string
): { title: string; excerpt: string; body: string; aiRewrite: string } {
  const title = rewriteTitle(originalTitle, category);
  const seed = hash01(originalTitle);
  const sentences = sentenceSplit(excerpt);
  const humanized = sentences.map(humanizeParagraph);

  const hook = pick(HOOKS, seed);
  const hookMap: Record<string, string> = {
    Security: "cybersecurity teams, regulators and every board with data on the line",
    Technology: "founders, engineers and the investors funding the next wave",
    "Global Finance": "traders, treasurers and anyone with exposure to the moving parts",
    Business: "executives, operators and the markets pricing it all in",
    Africa: "East African businesses, policymakers and regional investors",
  };
  const audience = hookMap[category] ?? "executives, operators and the markets pricing it all in";

  /* ── Lede ── */
  const leadFacts = humanized[0] ?? originalTitle;
  const contextFact = humanized[1] ?? "";
  const lede = [
    leadFacts,
    contextFact,
    `${hook} ${audience} are watching this one closely — and for good reason.`,
  ]
    .filter(Boolean)
    .join(" ");

  /* ── Key facts box ── */
  const facts = keyFacts(excerpt);
  const factsBlock =
    facts.length > 0
      ? `> **The essentials:**\n>\n${facts.map((f) => `> - ${f}`).join("\n")}`
      : "";

  /* ── Body sections ── */
  const middle = humanized.slice(facts.length > 0 ? 1 : 1, 9);
  const half = Math.ceil(middle.length / 2);

  const sectionHeadings: Record<string, string[]> = {
    Security: ["What Happened", "How the Attack Unfolded", "Who Is Exposed", "What Defenders Should Do Now"],
    Technology: ["What Was Announced", "Why It Matters", "The Competitive Picture", "What Comes Next"],
    "Global Finance": ["The Numbers", "What Drove the Move", "Market Reaction", "The Road Ahead"],
    Business: ["The Deal, Explained", "The Strategic Logic", "Winners and Losers", "What to Watch"],
    Africa: ["The Story So Far", "Why It Matters for the Region", "The Business Angle", "The Road Ahead"],
  };
  const headings = sectionHeadings[category] ?? sectionHeadings.Business;

  const sections: string[] = [];
  if (middle.length > 0) sections.push(buildSection(middle.slice(0, half), headings[0]));
  if (middle.length > half) sections.push(buildSection(middle.slice(half), headings[1]));

  /* ── Analysis (voice of the desk) ── */
  const analysisTemplates = [
    `Zoom out, and the pattern is hard to miss. ${category === "Africa" ? "Across East Africa" : category === "Security" ? "Across the security landscape" : "Across the industry"}, momentum has been building for months — capital, talent and attention all tilting the same direction. This development doesn't arrive in a vacuum; it lands on an already-tilted board.`,
    `For businesses, the practical question is not whether this matters but how fast it changes decisions. Budgets, procurement timelines and risk registers all move slower than headlines — which is precisely why the teams that act early tend to capture the upside while late movers pay catch-up premiums.`,
    `There is also a second-order story here. Every shift of this scale reshuffles adjacent markets: suppliers gain or lose leverage, rivals recalibrate pricing, and regulators start asking questions that outlast the news cycle itself.`,
  ];
  sections.push(buildSection(analysisTemplates, headings[2]));

  /* ── Pull-quote ── */
  const quoteCandidates = humanized.filter((s) => s.length > 60 && s.length < 180);
  const pullQuote =
    quoteCandidates.length > 0
      ? `> "${quoteCandidates[seed % quoteCandidates.length]}"\n>\n> — Zayed Tabloid analysis`
      : `> "${title.replace(/ — .*$/, "")}"\n>\n> — Zayed Tabloid analysis`;

  /* ── Outlook ── */
  const outlookTemplates = [
    `The next few sessions and statements will tell the real story. Watch for follow-through: official confirmations, counter-moves from competitors, and whether the initial numbers hold up under scrutiny. ${category === "Global Finance" ? "Positioning data and central-bank commentary will be the tells." : category === "Security" ? "Patch cadence and disclosure timelines will be the tells." : "Official filings and partnership announcements will be the tells."}`, 
    `For ${audience}, the disciplined move is to separate signal from spectacle: track what is verifiable, discount what is breathless, and let the verification catch up before committing capital or reputation.`,
  ];
  sections.push(buildSection(outlookTemplates, headings[3]));

  /* ── Evergreen closer ── */
  const closer =
    category === "Africa"
      ? `The bigger picture for Kenya and East Africa: the region's business landscape is maturing faster than most forecasts assumed, and stories like this are reminders that global capital, technology and regulation now move through Nairobi as quickly as they move through London or Singapore. Zayed Tabloid will keep tracking this story as it develops.`
      : `Zayed Tabloid will continue to follow this story as it develops — with the numbers, the context and the analysis that decision-makers actually need.`;

  const bodyParts = [lede, factsBlock, ...sections, pullQuote, closer].filter((p) => p.length > 0);
  const body = bodyParts.join("\n\n");

  const excerptOut =
    (humanized[0] ? humanized[0].slice(0, 180).trim() : title) + "…";
  const aiRewrite = bodyParts.slice(0, 2).join(" ").slice(0, 500);

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
              "You are the lead editor of Zayed Tabloid, a premium business publication with a tabloid's appetite and a broadsheet's standards. Write a FULL-LENGTH news article from the given material — not a summary. Voice: confident, human, punchy. Open with a hook lede that lands in one sentence, use concrete numbers and named players, and write section headings that say something rather than label something. Headline rules: catchy and specific, in the register of a good magazine cover — never clickbait, never a question, no 'you won't believe'. Return strict JSON: {\"title\": string (max 90 chars, catchy but honest), \"body\": string (700-1100 words, 7-9 paragraphs separated by blank lines; optional section headings as '## Heading' on their own line; one blockquote line starting with '>' is welcome)}. Never copy source sentences verbatim; add context, implications and analysis while staying faithful to the facts.",
          },
          {
            role: "user",
            content: `Headline: ${title}\n\nSummary: ${excerpt}\n\nWrite the complete article now.`,
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

          let rewrite = buildRewrite(item.title, item.description || item.title, category);

          if (useAI) {
            const ai = await openAiRewrite(rewrite.title, item.description || item.title);
            if (ai) {
              rewrite = {
                title: ai.title,
                excerpt: clampAtWord(sentenceSplit(ai.body)[0] ?? rewrite.excerpt, 180) + "…",
                body: ai.body,
                aiRewrite: ai.body.split("\n\n").slice(0, 2).join(" ").slice(0, 500),
              };
            }
          }

          // Read time from the FINAL body (~220 wpm), clamped to a believable range.
          const words = rewrite.body.split(/\s+/).length;
          const readTime = `${Math.max(3, Math.min(12, Math.round(words / 220) || 3))} min`;

          // SEO metadata — derived from the final title/body after any AI rewrite.
          const seoTitle = clampAtWord(rewrite.title, 65);
          const seoDescription =
            clampAtWord(sentenceSplit(rewrite.body)[0] ?? rewrite.excerpt, 155) ||
            clampAtWord(rewrite.excerpt, 155);
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
