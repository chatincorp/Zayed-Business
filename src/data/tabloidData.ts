/* ──────────────────────────────────────────────────────────────
 *  Zayed Tabloid — financial data types, mock data, news sources
 * ────────────────────────────────────────────────────────────── */

/* ── News Sources ───────────────────────────────────────────── */

export interface NewsSource {
  id: string;
  name: string;
  url: string;
  category: "global" | "africa" | "asia" | "tech" | "finance" | "entrepreneur";
  icon: string;
}

export const newsSources: NewsSource[] = [
  { id: "gn-ke-business", name: "Google News Kenya – Business", url: "https://news.google.com/topics/CAAqKggKIiRDQkFTRlFvSUwyMHZNRGx6TVdZU0JXVnVMVWRDR2dKTFJTZ0FQAQ?hl=en-KE&gl=KE&ceid=KE%3Aen", category: "africa", icon: "🌍" },
  { id: "gn-ke-tech", name: "Google News Kenya – Technology", url: "https://news.google.com/topics/CAAqKggKIiRDQkFTRlFvSUwyMHZNRGRqTVhZU0JXVnVMVWRDR2dKTFJTZ0FQAQ?hl=en-KE&gl=KE&ceid=KE%3Aen", category: "tech", icon: "💻" },
  { id: "cgtn-business", name: "CGTN Business", url: "https://www.cgtn.com/business", category: "global", icon: "🌐" },
  { id: "cgtn-scitech", name: "CGTN Sci-Tech", url: "https://www.cgtn.com/sci-tech", category: "tech", icon: "🔬" },
  { id: "bloomberg", name: "Bloomberg", url: "https://www.bloomberg.com/", category: "finance", icon: "📊" },
  { id: "forbes", name: "Forbes", url: "https://www.forbes.com/", category: "finance", icon: "💼" },
  { id: "entrepreneur", name: "Entrepreneur", url: "https://www.entrepreneur.com/", category: "entrepreneur", icon: "🚀" },
  { id: "business-insider", name: "Business Insider", url: "https://www.businessinsider.com", category: "finance", icon: "📈" },
  { id: "business-times", name: "Business Times SG", url: "https://www.businesstimes.com.sg/", category: "asia", icon: "🏢" },
  { id: "cnn-business", name: "CNN Business", url: "https://edition.cnn.com/business", category: "global", icon: "🔴" },
  { id: "cnbc", name: "CNBC", url: "https://www.cnbc.com", category: "finance", icon: "💰" },
  { id: "fortune", name: "Fortune", url: "https://fortune.com/", category: "finance", icon: "🎯" },
  { id: "wsj", name: "Wall Street Journal", url: "https://www.wsj.com/", category: "finance", icon: "📰" },
];

/* ── Tabloid Articles ───────────────────────────────────────── */

export type ArticleStatus = "draft" | "pending_review" | "approved" | "published" | "rejected";

export interface TabloidArticle {
  id: string;
  title: string;
  originalTitle: string;
  sourceId: string;
  sourceUrl: string;
  category: string;
  excerpt: string;
  aiRewrite: string;
  body?: string;
  author: string;
  editor?: string;
  publisher?: string;
  status: ArticleStatus;
  publishedAt: string;
  readTime: string;
  image?: string;
  tags: string[];
}

export const mockArticles: TabloidArticle[] = [
  {
    id: "art-001",
    title: "Kenya's Digital Economy Surges as Tech Startups Attract Record Investment in 2026",
    originalTitle: "Kenya tech startups raise record funding",
    sourceId: "gn-ke-business",
    sourceUrl: "https://news.google.com/topics/CAAqKggKIiRDQkFTRlFvSUwyMHZNRGx6TVdZU0JXVnVMVWRDR2dKTFJTZ0FQAQ?hl=en-KE&gl=KE&ceid=KE%3Aen",
    category: "Africa",
    excerpt: "Kenyan technology companies have attracted unprecedented levels of venture capital.",
    aiRewrite: "Kenya's tech scene is having a moment. In the first half of 2026, startups based in Nairobi and Mombasa pulled in more venture capital than the previous two years combined. The wave is being driven by fintech platforms serving unbanked populations, AI-driven agritech solving real problems for smallholder farmers, and SaaS tools built specifically for African enterprises. Investors are no longer treating East Africa as an emerging bet — they're treating it as a core portfolio allocation.",
    body: "Kenya's technology ecosystem has reached a tipping point. In the first half of 2026, startups based in Nairobi and Mombasa attracted more venture capital than the previous two years combined, cementing the country's position as East Africa's undisputed tech capital.\n\nThe numbers tell a compelling story. According to data from Africa: The Big Deal, Kenyan startups raised over $800 million in the first six months of 2026, a 180% increase from the same period in 2025. Fintech companies led the charge, accounting for nearly 40% of total funding, followed by agritech at 25% and SaaS platforms at 15%.\n\nBut the real story isn't just about the money. It's about the maturation of the ecosystem. Companies that were raising seed rounds two years ago are now closing Series A and B rounds. The quality of startups has improved dramatically, with more founders building solutions specifically for African markets rather than copying Western templates.\n\nM-pesa's continued dominance in mobile payments has created a fertile ground for fintech innovation. Companies like Tala, Branch, and new entrants are building credit scoring, lending, and insurance products that reach millions of previously unbanked Kenyans.\n\nIn agritech, startups are using AI and satellite imagery to help smallholder farmers optimize yields, access markets, and secure financing. The impact is measurable — participating farmers have seen yield improvements of 20-35%.\n\nThe SaaS wave is perhaps the most exciting development. African-built enterprise software is finally finding its stride, with companies building CRM, HR, and accounting tools tailored to the realities of African businesses.\n\nInvestors are taking notice. Major funds including TLcom, Novastar Ventures, and Norrsken22 have all increased their allocation to Kenyan startups. International players like Sequoia and a16z have opened Nairobi offices.\n\nThe challenge now is sustaining this momentum. Infrastructure gaps, regulatory complexity, and talent competition remain real obstacles. But for the first time, the narrative has shifted from potential to proven execution.",
    image: "https://images.unsplash.com/photo-1611348586804-61bf6c080437?w=800&h=400&fit=crop",
    author: "Zayed News Desk",
    editor: "Content Desk",
    publisher: "Editorial Board",
    status: "published",
    publishedAt: "2026-09-01T08:30:00Z",
    readTime: "4 min",
    tags: ["Kenya", "Startups", "Venture Capital", "Fintech"],
  },
  {
    id: "art-002",
    title: "Global Markets Rally as Central Banks Signal Rate Stability Through Q4",
    originalTitle: "Markets climb on central bank signals",
    sourceId: "bloomberg",
    sourceUrl: "https://www.bloomberg.com/",
    category: "Global Finance",
    excerpt: "Major stock indices posted strong gains after central bank commentary suggested policy stability.",
    aiRewrite: "Wall Street, London, and Asian markets all closed higher on Tuesday after a string of central bank officials indicated they see no urgency to change interest rate policy before year-end. The message was clear: the tightening cycle is over, and growth — not inflation — is now the focus. For investors, it's the green light many had been waiting for. Tech and growth stocks led the charge, with the S&P 500 hitting its highest level since March.",
    author: "Zayed News Desk",
    editor: "Finance Desk",
    status: "published",
    publishedAt: "2026-09-01T07:15:00Z",
    readTime: "5 min",
    tags: ["Markets", "Interest Rates", "Central Banks", "Investing"],
  },
  {
    id: "art-003",
    title: "AI-Powered Customer Service Is Reshaping How African Businesses Scale",
    originalTitle: "AI chatbots transforming African customer service",
    sourceId: "cgtn-scitech",
    sourceUrl: "https://www.cgtn.com/sci-tech",
    category: "Technology",
    excerpt: "Companies across the continent are deploying intelligent automation to handle customer interactions.",
    aiRewrite: "There's a quiet revolution happening in how African businesses talk to their customers. From Lagos to Nairobi, companies are deploying AI-powered chatbots and virtual assistants that don't just answer FAQs — they handle complex queries, process orders, and even upsell products. The shift isn't about replacing humans. It's about giving small teams the firepower to serve thousands of customers simultaneously, around the clock, in multiple languages.",
    author: "Zayed News Desk",
    editor: "Tech Desk",
    status: "published",
    publishedAt: "2026-09-01T06:00:00Z",
    readTime: "6 min",
    tags: ["AI", "Customer Service", "Africa", "Automation"],
  },
  {
    id: "art-004",
    title: "Remote Work Is No Longer a Perk — It's Infrastructure",
    originalTitle: "Remote work becomes standard for global companies",
    sourceId: "forbes",
    sourceUrl: "https://www.forbes.com/",
    category: "Business",
    excerpt: "Companies that once resisted remote work are now investing in digital collaboration tools.",
    aiRewrite: "The debate is over. Remote work isn't a pandemic leftover — it's a permanent feature of the global economy. Companies that once insisted on five days in the office are now building entire workflows around distributed teams. The latest data shows that organizations offering flexible work arrangements are attracting 40% more qualified applicants and retaining employees at nearly twice the rate of office-only competitors.",
    author: "Zayed News Desk",
    status: "pending_review",
    publishedAt: "2026-09-01T05:45:00Z",
    readTime: "3 min",
    tags: ["Remote Work", "Future of Work", "Talent", "Digital Tools"],
  },
  {
    id: "art-005",
    title: "Cybersecurity Spending in Africa Expected to Double by 2028",
    originalTitle: "Africa cybersecurity market set to grow rapidly",
    sourceId: "business-insider",
    sourceUrl: "https://www.businessinsider.com",
    category: "Security",
    excerpt: "As digital transformation accelerates across the continent, so does the need for robust security infrastructure.",
    aiRewrite: "Africa's digital transformation is moving fast — and so are the threats that come with it. A new industry report projects that cybersecurity spending across the continent will double within two years, driven by rising ransomware attacks, stricter data protection regulations, and the sheer volume of businesses moving online. The message from CISOs is straightforward: you can't build a digital economy on a foundation of digital vulnerability.",
    author: "Zayed News Desk",
    editor: "Security Desk",
    status: "approved",
    publishedAt: "2026-09-01T04:30:00Z",
    readTime: "5 min",
    tags: ["Cybersecurity", "Africa", "Digital Transformation", "Data Protection"],
  },
  {
    id: "art-006",
    title: "Nairobi's Real Estate Boom Tied to Tech Sector Growth",
    originalTitle: "Nairobi real estate prices surge with tech growth",
    sourceId: "gn-ke-business",
    sourceUrl: "https://news.google.com/topics/CAAqKggKIiRDQkFTRlFvSUwyMHZNRGx6TVdZU0JXVnVMVWRDR2dKTFJTZ0FQAQ?hl=en-KE&gl=KE&ceid=KE%3Aen",
    category: "Africa",
    excerpt: "Commercial and residential property values in Nairobi's tech corridors have risen sharply.",
    aiRewrite: "Nairobi's Westlands, Kilimani, and Upper Hill neighborhoods are in the middle of a property gold rush — and tech companies are the driving force. As global firms set up African headquarters and local startups scale their teams, demand for modern office space and quality housing has pushed property values up 35% in key corridors. Real estate analysts say this isn't a bubble. It's the physical manifestation of Kenya's rise as a continental tech hub.",
    author: "Zayed News Desk",
    status: "draft",
    publishedAt: "2026-09-01T03:00:00Z",
    readTime: "4 min",
    tags: ["Nairobi", "Real Estate", "Tech Hub", "Kenya"],
  },
];

/* ── Stock Exchanges by Region ──────────────────────────────── */

export interface StockExchange {
  name: string;
  country: string;
  countryCode: string;
  index: string;
  value: number;
  change: number;
  changePercent: number;
  currency: string;
  region: string;
  lastUpdated: string;
}

export const stockExchanges: StockExchange[] = [
  // North America
  { name: "New York Stock Exchange", country: "United States", countryCode: "US", index: "S&P 500", value: 5842.31, change: 28.47, changePercent: 0.49, currency: "USD", region: "North America", lastUpdated: "2026-09-01T14:30:00Z" },
  { name: "NASDAQ", country: "United States", countryCode: "US", index: "NASDAQ Composite", value: 19234.56, change: 156.78, changePercent: 0.82, currency: "USD", region: "North America", lastUpdated: "2026-09-01T14:30:00Z" },
  { name: "Toronto Stock Exchange", country: "Canada", countryCode: "CA", index: "TSX", value: 22845.90, change: -45.23, changePercent: -0.20, currency: "CAD", region: "North America", lastUpdated: "2026-09-01T14:00:00Z" },
  { name: "Bolsa Mexicana", country: "Mexico", countryCode: "MX", index: "IPC", value: 56789.12, change: 234.56, changePercent: 0.41, currency: "MXN", region: "North America", lastUpdated: "2026-09-01T13:00:00Z" },

  // Central America
  { name: "Bolsa Nacional de Valores", country: "Costa Rica", countryCode: "CR", index: "BNAVC", value: 1245.67, change: 3.21, changePercent: 0.26, currency: "CRC", region: "Central America", lastUpdated: "2026-09-01T12:00:00Z" },
  { name: "Bolsa de Valores", country: "Panama", countryCode: "PA", index: "BVP", value: 456.78, change: -1.23, changePercent: -0.27, currency: "PAB", region: "Central America", lastUpdated: "2026-09-01T12:00:00Z" },
  { name: "Bolsa de Valores", country: "Guatemala", countryCode: "GT", index: "BVG", value: 1890.34, change: 12.45, changePercent: 0.66, currency: "GTQ", region: "Central America", lastUpdated: "2026-09-01T11:00:00Z" },

  // South America
  { name: "B3", country: "Brazil", countryCode: "BR", index: "Bovespa", value: 134567.89, change: 892.34, changePercent: 0.67, currency: "BRL", region: "South America", lastUpdated: "2026-09-01T14:00:00Z" },
  { name: "Bolsa de Comercio", country: "Argentina", countryCode: "AR", index: "MERVAL", value: 2456789.12, change: -23456.78, changePercent: -0.95, currency: "ARS", region: "South America", lastUpdated: "2026-09-01T13:00:00Z" },
  { name: "Bolsa de Santiago", country: "Chile", countryCode: "CL", index: "IPSA", value: 6789.45, change: 34.56, changePercent: 0.51, currency: "CLP", region: "South America", lastUpdated: "2026-09-01T13:00:00Z" },
  { name: "BVL", country: "Peru", countryCode: "PE", index: "S&P/BVL", value: 23456.78, change: 123.45, changePercent: 0.53, currency: "PEN", region: "South America", lastUpdated: "2026-09-01T12:00:00Z" },
  { name: "BVC", country: "Colombia", countryCode: "CO", index: "COLCAP", value: 1345.67, change: -8.90, changePercent: -0.66, currency: "COP", region: "South America", lastUpdated: "2026-09-01T12:00:00Z" },

  // Europe
  { name: "London Stock Exchange", country: "United Kingdom", countryCode: "GB", index: "FTSE 100", value: 8456.78, change: 45.23, changePercent: 0.54, currency: "GBP", region: "Europe", lastUpdated: "2026-09-01T14:30:00Z" },
  { name: "Euronext", country: "France", countryCode: "FR", index: "CAC 40", value: 7890.12, change: -23.45, changePercent: -0.30, currency: "EUR", region: "Europe", lastUpdated: "2026-09-01T14:30:00Z" },
  { name: "Deutsche Börse", country: "Germany", countryCode: "DE", index: "DAX", value: 19234.56, change: 167.89, changePercent: 0.88, currency: "EUR", region: "Europe", lastUpdated: "2026-09-01T14:30:00Z" },
  { name: "Borsa Italiana", country: "Italy", countryCode: "IT", index: "FTSE MIB", value: 34567.89, change: 234.56, changePercent: 0.68, currency: "EUR", region: "Europe", lastUpdated: "2026-09-01T14:00:00Z" },
  { name: "SIX Swiss Exchange", country: "Switzerland", countryCode: "CH", index: "SMI", value: 12345.67, change: 56.78, changePercent: 0.46, currency: "CHF", region: "Europe", lastUpdated: "2026-09-01T14:30:00Z" },
  { name: "Moscow Exchange", country: "Russia", countryCode: "RU", index: "MOEX", value: 3456.78, change: -12.34, changePercent: -0.36, currency: "RUB", region: "Europe", lastUpdated: "2026-09-01T11:00:00Z" },

  // Africa
  { name: "Nairobi Securities Exchange", country: "Kenya", countryCode: "KE", index: "NSE 20", value: 2345.67, change: 12.34, changePercent: 0.53, currency: "KES", region: "Africa", lastUpdated: "2026-09-01T14:00:00Z" },
  { name: "Johannesburg Stock Exchange", country: "South Africa", countryCode: "ZA", index: "JSE Top 40", value: 78901.23, change: 456.78, changePercent: 0.58, currency: "ZAR", region: "Africa", lastUpdated: "2026-09-01T14:30:00Z" },
  { name: "Nigerian Stock Exchange", country: "Nigeria", countryCode: "NG", index: "NGX ASI", value: 98765.43, change: -234.56, changePercent: -0.24, currency: "NGN", region: "Africa", lastUpdated: "2026-09-01T13:00:00Z" },
  { name: "Egyptian Exchange", country: "Egypt", countryCode: "EG", index: "EGX 30", value: 34567.89, change: 123.45, changePercent: 0.36, currency: "EGP", region: "Africa", lastUpdated: "2026-09-01T12:00:00Z" },
  { name: "Casablanca Stock Exchange", country: "Morocco", countryCode: "MA", index: "MASI", value: 14567.89, change: 67.89, changePercent: 0.47, currency: "MAD", region: "Africa", lastUpdated: "2026-09-01T13:00:00Z" },
  { name: "Ghana Stock Exchange", country: "Ghana", countryCode: "GH", index: "GSE CI", value: 4567.89, change: 23.45, changePercent: 0.52, currency: "GHS", region: "Africa", lastUpdated: "2026-09-01T13:00:00Z" },

  // Asia
  { name: "Tokyo Stock Exchange", country: "Japan", countryCode: "JP", index: "Nikkei 225", value: 42345.67, change: 345.67, changePercent: 0.82, currency: "JPY", region: "Asia", lastUpdated: "2026-09-01T08:00:00Z" },
  { name: "Shanghai Stock Exchange", country: "China", countryCode: "CN", index: "SSE Composite", value: 3456.78, change: 23.45, changePercent: 0.68, currency: "CNY", region: "Asia", lastUpdated: "2026-09-01T08:00:00Z" },
  { name: "Hong Kong Stock Exchange", country: "Hong Kong", countryCode: "HK", index: "Hang Seng", value: 21345.67, change: -123.45, changePercent: -0.58, currency: "HKD", region: "Asia", lastUpdated: "2026-09-01T08:00:00Z" },
  { name: "Bombay Stock Exchange", country: "India", countryCode: "IN", index: "SENSEX", value: 78901.23, change: 567.89, changePercent: 0.72, currency: "INR", region: "Asia", lastUpdated: "2026-09-01T08:30:00Z" },
  { name: "Singapore Exchange", country: "Singapore", countryCode: "SG", index: "STI", value: 3456.78, change: 12.34, changePercent: 0.36, currency: "SGD", region: "Asia", lastUpdated: "2026-09-01T08:00:00Z" },
  { name: "Korea Exchange", country: "South Korea", countryCode: "KR", index: "KOSPI", value: 2789.45, change: 34.56, changePercent: 1.25, currency: "KRW", region: "Asia", lastUpdated: "2026-09-01T08:00:00Z" },
  { name: "Bursa Malaysia", country: "Malaysia", countryCode: "MY", index: "KLCI", value: 1567.89, change: -8.90, changePercent: -0.57, currency: "MYR", region: "Asia", lastUpdated: "2026-09-01T08:00:00Z" },
  { name: "Thailand Stock Exchange", country: "Thailand", countryCode: "TH", index: "SET", value: 1345.67, change: 6.78, changePercent: 0.51, currency: "THB", region: "Asia", lastUpdated: "2026-09-01T08:00:00Z" },
  { name: "Indonesia Stock Exchange", country: "Indonesia", countryCode: "ID", index: "IHSG", value: 7890.12, change: 45.67, changePercent: 0.58, currency: "IDR", region: "Asia", lastUpdated: "2026-09-01T08:00:00Z" },

  // Oceania
  { name: "Australian Securities Exchange", country: "Australia", countryCode: "AU", index: "S&P/ASX 200", value: 8234.56, change: 67.89, changePercent: 0.83, currency: "AUD", region: "Oceania", lastUpdated: "2026-09-01T06:00:00Z" },
  { name: "New Zealand Exchange", country: "New Zealand", countryCode: "NZ", index: "NZX 50", value: 12345.67, change: -34.56, changePercent: -0.28, currency: "NZD", region: "Oceania", lastUpdated: "2026-09-01T05:00:00Z" },
];

/* ── Forex Pairs ────────────────────────────────────────────── */

export interface ForexPair {
  pair: string;
  baseCurrency: string;
  quoteCurrency: string;
  rate: number;
  change: number;
  changePercent: number;
  high24h: number;
  low24h: number;
  region: string;
  lastUpdated: string;
}

export const forexPairs: ForexPair[] = [
  // Major Pairs
  { pair: "EUR/USD", baseCurrency: "EUR", quoteCurrency: "USD", rate: 1.0892, change: 0.0023, changePercent: 0.21, high24h: 1.0912, low24h: 1.0856, region: "Global", lastUpdated: "2026-09-01T14:30:00Z" },
  { pair: "GBP/USD", baseCurrency: "GBP", quoteCurrency: "USD", rate: 1.2734, change: 0.0045, changePercent: 0.35, high24h: 1.2756, low24h: 1.2698, region: "Global", lastUpdated: "2026-09-01T14:30:00Z" },
  { pair: "USD/JPY", baseCurrency: "USD", quoteCurrency: "JPY", rate: 149.23, change: -0.45, changePercent: -0.30, high24h: 149.78, low24h: 148.67, region: "Global", lastUpdated: "2026-09-01T14:30:00Z" },
  { pair: "USD/CHF", baseCurrency: "USD", quoteCurrency: "CHF", rate: 0.8834, change: -0.0012, changePercent: -0.14, high24h: 0.8856, low24h: 0.8812, region: "Global", lastUpdated: "2026-09-01T14:30:00Z" },
  { pair: "AUD/USD", baseCurrency: "AUD", quoteCurrency: "USD", rate: 0.6534, change: 0.0018, changePercent: 0.28, high24h: 0.6556, low24h: 0.6512, region: "Global", lastUpdated: "2026-09-01T14:30:00Z" },
  { pair: "USD/CAD", baseCurrency: "USD", quoteCurrency: "CAD", rate: 1.3567, change: -0.0023, changePercent: -0.17, high24h: 1.3589, low24h: 1.3545, region: "Global", lastUpdated: "2026-09-01T14:30:00Z" },
  { pair: "NZD/USD", baseCurrency: "NZD", quoteCurrency: "USD", rate: 0.5987, change: 0.0012, changePercent: 0.20, high24h: 0.6001, low24h: 0.5967, region: "Global", lastUpdated: "2026-09-01T14:30:00Z" },

  // Africa
  { pair: "USD/KES", baseCurrency: "USD", quoteCurrency: "KES", rate: 153.45, change: 0.23, changePercent: 0.15, high24h: 153.89, low24h: 153.12, region: "Africa", lastUpdated: "2026-09-01T14:00:00Z" },
  { pair: "EUR/KES", baseCurrency: "EUR", quoteCurrency: "KES", rate: 167.12, change: 0.34, changePercent: 0.20, high24h: 167.56, low24h: 166.78, region: "Africa", lastUpdated: "2026-09-01T14:00:00Z" },
  { pair: "GBP/KES", baseCurrency: "GBP", quoteCurrency: "KES", rate: 195.34, change: 0.56, changePercent: 0.29, high24h: 195.78, low24h: 194.89, region: "Africa", lastUpdated: "2026-09-01T14:00:00Z" },
  { pair: "USD/NGN", baseCurrency: "USD", quoteCurrency: "NGN", rate: 1545.67, change: 3.45, changePercent: 0.22, high24h: 1549.12, low24h: 1542.34, region: "Africa", lastUpdated: "2026-09-01T13:00:00Z" },
  { pair: "USD/ZAR", baseCurrency: "USD", quoteCurrency: "ZAR", rate: 18.23, change: -0.12, changePercent: -0.65, high24h: 18.34, low24h: 18.12, region: "Africa", lastUpdated: "2026-09-01T14:00:00Z" },
  { pair: "USD/EGP", baseCurrency: "USD", quoteCurrency: "EGP", rate: 49.56, change: 0.12, changePercent: 0.24, high24h: 49.78, low24h: 49.34, region: "Africa", lastUpdated: "2026-09-01T13:00:00Z" },
  { pair: "USD/GHS", baseCurrency: "USD", quoteCurrency: "GHS", rate: 14.89, change: 0.05, changePercent: 0.34, high24h: 14.95, low24h: 14.82, region: "Africa", lastUpdated: "2026-09-01T13:00:00Z" },
  { pair: "USD/TZS", baseCurrency: "USD", quoteCurrency: "TZS", rate: 2512.34, change: 4.56, changePercent: 0.18, high24h: 2516.78, low24h: 2508.12, region: "Africa", lastUpdated: "2026-09-01T14:00:00Z" },
  { pair: "USD/UGX", baseCurrency: "USD", quoteCurrency: "UGX", rate: 3789.12, change: 5.67, changePercent: 0.15, high24h: 3794.56, low24h: 3784.23, region: "Africa", lastUpdated: "2026-09-01T14:00:00Z" },
  { pair: "USD/RWF", baseCurrency: "USD", quoteCurrency: "RWF", rate: 1345.67, change: 2.34, changePercent: 0.17, high24h: 1348.90, low24h: 1343.23, region: "Africa", lastUpdated: "2026-09-01T14:00:00Z" },
  { pair: "USD/ETB", baseCurrency: "USD", quoteCurrency: "ETB", rate: 128.45, change: 1.23, changePercent: 0.96, high24h: 129.12, low24h: 127.89, region: "Africa", lastUpdated: "2026-09-01T14:00:00Z" },
  { pair: "USD/CDF", baseCurrency: "USD", quoteCurrency: "CDF", rate: 2845.67, change: 8.90, changePercent: 0.31, high24h: 2854.56, low24h: 2840.12, region: "Africa", lastUpdated: "2026-09-01T14:00:00Z" },
  { pair: "USD/XOF", baseCurrency: "USD", quoteCurrency: "XOF", rate: 623.45, change: 1.23, changePercent: 0.20, high24h: 624.78, low24h: 622.34, region: "Africa", lastUpdated: "2026-09-01T14:00:00Z" },
  { pair: "USD/MGA", baseCurrency: "USD", quoteCurrency: "MGA", rate: 4678.90, change: 12.34, changePercent: 0.26, high24h: 4691.23, low24h: 4672.34, region: "Africa", lastUpdated: "2026-09-01T14:00:00Z" },
  { pair: "USD/MZN", baseCurrency: "USD", quoteCurrency: "MZN", rate: 63.45, change: 0.23, changePercent: 0.36, high24h: 63.78, low24h: 63.12, region: "Africa", lastUpdated: "2026-09-01T14:00:00Z" },

  // East Africa (KES-based cross rates)
  { pair: "KES/UGX", baseCurrency: "KES", quoteCurrency: "UGX", rate: 24.71, change: 0.05, changePercent: 0.20, high24h: 24.78, low24h: 24.65, region: "East Africa", lastUpdated: "2026-09-01T14:00:00Z" },
  { pair: "KES/TZS", baseCurrency: "KES", quoteCurrency: "TZS", rate: 16.38, change: 0.02, changePercent: 0.12, high24h: 16.42, low24h: 16.35, region: "East Africa", lastUpdated: "2026-09-01T14:00:00Z" },
  { pair: "KES/RWF", baseCurrency: "KES", quoteCurrency: "RWF", rate: 8.77, change: 0.01, changePercent: 0.11, high24h: 8.79, low24h: 8.75, region: "East Africa", lastUpdated: "2026-09-01T14:00:00Z" },
  { pair: "KES/ETB", baseCurrency: "KES", quoteCurrency: "ETB", rate: 0.837, change: 0.006, changePercent: 0.72, high24h: 0.842, low24h: 0.833, region: "East Africa", lastUpdated: "2026-09-01T14:00:00Z" },
  { pair: "KES/USD", baseCurrency: "KES", quoteCurrency: "USD", rate: 0.00652, change: -0.00001, changePercent: -0.15, high24h: 0.00653, low24h: 0.00650, region: "East Africa", lastUpdated: "2026-09-01T14:00:00Z" },
  { pair: "KES/GBP", baseCurrency: "KES", quoteCurrency: "GBP", rate: 0.00512, change: -0.00002, changePercent: -0.39, high24h: 0.00515, low24h: 0.00510, region: "East Africa", lastUpdated: "2026-09-01T14:00:00Z" },
  { pair: "KES/EUR", baseCurrency: "KES", quoteCurrency: "EUR", rate: 0.00599, change: 0.00001, changePercent: 0.17, high24h: 0.00601, low24h: 0.00597, region: "East Africa", lastUpdated: "2026-09-01T14:00:00Z" },

  // West Africa (NGN-based)
  { pair: "NGN/GHS", baseCurrency: "NGN", quoteCurrency: "GHS", rate: 0.00963, change: -0.00005, changePercent: -0.52, high24h: 0.00969, low24h: 0.00958, region: "West Africa", lastUpdated: "2026-09-01T14:00:00Z" },
  { pair: "NGN/XOF", baseCurrency: "NGN", quoteCurrency: "XOF", rate: 0.403, change: 0.002, changePercent: 0.50, high24h: 0.405, low24h: 0.401, region: "West Africa", lastUpdated: "2026-09-01T14:00:00Z" },
  { pair: "XOF/EUR", baseCurrency: "XOF", quoteCurrency: "EUR", rate: 0.00152, change: 0.00001, changePercent: 0.66, high24h: 0.00153, low24h: 0.00151, region: "West Africa", lastUpdated: "2026-09-01T14:00:00Z" },

  // Southern Africa
  { pair: "ZAR/MZN", baseCurrency: "ZAR", quoteCurrency: "MZN", rate: 3.48, change: 0.02, changePercent: 0.58, high24h: 3.50, low24h: 3.46, region: "Southern Africa", lastUpdated: "2026-09-01T14:00:00Z" },
  { pair: "ZAR/BWP", baseCurrency: "ZAR", quoteCurrency: "BWP", rate: 0.96, change: 0.001, changePercent: 0.10, high24h: 0.962, low24h: 0.958, region: "Southern Africa", lastUpdated: "2026-09-01T14:00:00Z" },
  { pair: "ZAR/SZL", baseCurrency: "ZAR", quoteCurrency: "SZL", rate: 1.00, change: 0.001, changePercent: 0.10, high24h: 1.002, low24h: 0.998, region: "Southern Africa", lastUpdated: "2026-09-01T14:00:00Z" },
  { pair: "ZAR/LSL", baseCurrency: "ZAR", quoteCurrency: "LSL", rate: 1.00, change: 0.001, changePercent: 0.10, high24h: 1.002, low24h: 0.998, region: "Southern Africa", lastUpdated: "2026-09-01T14:00:00Z" },
  { pair: "ZAR/NAD", baseCurrency: "ZAR", quoteCurrency: "NAD", rate: 1.00, change: 0.001, changePercent: 0.10, high24h: 1.002, low24h: 0.998, region: "Southern Africa", lastUpdated: "2026-09-01T14:00:00Z" },
  { pair: "ZAR/MWK", baseCurrency: "ZAR", quoteCurrency: "MWK", rate: 118.45, change: 0.89, changePercent: 0.76, high24h: 119.12, low24h: 117.89, region: "Southern Africa", lastUpdated: "2026-09-01T14:00:00Z" },

  // North Africa
  { pair: "EGP/MAD", baseCurrency: "EGP", quoteCurrency: "MAD", rate: 0.207, change: 0.001, changePercent: 0.49, high24h: 0.208, low24h: 0.206, region: "North Africa", lastUpdated: "2026-09-01T14:00:00Z" },
  { pair: "MAD/EUR", baseCurrency: "MAD", quoteCurrency: "EUR", rate: 0.093, change: -0.001, changePercent: -1.06, high24h: 0.094, low24h: 0.092, region: "North Africa", lastUpdated: "2026-09-01T14:00:00Z" },
  { pair: "TND/EUR", baseCurrency: "TND", quoteCurrency: "EUR", rate: 0.297, change: 0.001, changePercent: 0.34, high24h: 0.298, low24h: 0.296, region: "North Africa", lastUpdated: "2026-09-01T14:00:00Z" },
  { pair: "DZD/EUR", baseCurrency: "DZD", quoteCurrency: "EUR", rate: 0.00689, change: 0.00002, changePercent: 0.29, high24h: 0.00691, low24h: 0.00687, region: "North Africa", lastUpdated: "2026-09-01T14:00:00Z" },
  { pair: "LYD/EUR", baseCurrency: "LYD", quoteCurrency: "EUR", rate: 0.189, change: -0.001, changePercent: -0.53, high24h: 0.190, low24h: 0.188, region: "North Africa", lastUpdated: "2026-09-01T14:00:00Z" },

  // Southeast Asia
  { pair: "USD/VND", baseCurrency: "USD", quoteCurrency: "VND", rate: 25456.78, change: 23.45, changePercent: 0.09, high24h: 25480.23, low24h: 25434.56, region: "Southeast Asia", lastUpdated: "2026-09-01T08:00:00Z" },
  { pair: "USD/IDR", baseCurrency: "USD", quoteCurrency: "IDR", rate: 15678.90, change: 23.45, changePercent: 0.15, high24h: 15701.23, low24h: 15656.78, region: "Southeast Asia", lastUpdated: "2026-09-01T08:00:00Z" },
  { pair: "SGD/MYR", baseCurrency: "SGD", quoteCurrency: "MYR", rate: 3.396, change: 0.008, changePercent: 0.24, high24h: 3.402, low24h: 3.390, region: "Southeast Asia", lastUpdated: "2026-09-01T08:00:00Z" },
  { pair: "SGD/THB", baseCurrency: "SGD", quoteCurrency: "THB", rate: 25.69, change: 0.12, changePercent: 0.47, high24h: 25.74, low24h: 25.63, region: "Southeast Asia", lastUpdated: "2026-09-01T08:00:00Z" },
  { pair: "SGD/PHP", baseCurrency: "SGD", quoteCurrency: "PHP", rate: 42.21, change: 0.15, changePercent: 0.36, high24h: 42.28, low24h: 42.14, region: "Southeast Asia", lastUpdated: "2026-09-01T08:00:00Z" },
  { pair: "SGD/IDR", baseCurrency: "SGD", quoteCurrency: "IDR", rate: 11654.78, change: 34.56, changePercent: 0.30, high24h: 11689.34, low24h: 11623.45, region: "Southeast Asia", lastUpdated: "2026-09-01T08:00:00Z" },

  // Europe
  { pair: "EUR/GBP", baseCurrency: "EUR", quoteCurrency: "GBP", rate: 0.8554, change: -0.0012, changePercent: -0.14, high24h: 0.8567, low24h: 0.8542, region: "Europe", lastUpdated: "2026-09-01T14:30:00Z" },
  { pair: "EUR/CHF", baseCurrency: "EUR", quoteCurrency: "CHF", rate: 0.9618, change: 0.0015, changePercent: 0.16, high24h: 0.9634, low24h: 0.9598, region: "Europe", lastUpdated: "2026-09-01T14:30:00Z" },
  { pair: "EUR/RUB", baseCurrency: "EUR", quoteCurrency: "RUB", rate: 98.45, change: -0.34, changePercent: -0.34, high24h: 98.89, low24h: 98.12, region: "Europe", lastUpdated: "2026-09-01T11:00:00Z" },

  // Asia
  { pair: "USD/CNY", baseCurrency: "USD", quoteCurrency: "CNY", rate: 7.1234, change: -0.0045, changePercent: -0.06, high24h: 7.1278, low24h: 7.1198, region: "Asia", lastUpdated: "2026-09-01T08:00:00Z" },
  { pair: "USD/HKD", baseCurrency: "USD", quoteCurrency: "HKD", rate: 7.8123, change: 0.0001, changePercent: 0.00, high24h: 7.8125, low24h: 7.8121, region: "Asia", lastUpdated: "2026-09-01T08:00:00Z" },
  { pair: "USD/INR", baseCurrency: "USD", quoteCurrency: "INR", rate: 83.45, change: 0.12, changePercent: 0.14, high24h: 83.56, low24h: 83.34, region: "Asia", lastUpdated: "2026-09-01T08:30:00Z" },
  { pair: "USD/SGD", baseCurrency: "USD", quoteCurrency: "SGD", rate: 1.3456, change: -0.0023, changePercent: -0.17, high24h: 1.3478, low24h: 1.3434, region: "Asia", lastUpdated: "2026-09-01T08:00:00Z" },
  { pair: "USD/KRW", baseCurrency: "USD", quoteCurrency: "KRW", rate: 1345.67, change: -8.90, changePercent: -0.66, high24h: 1354.56, low24h: 1342.34, region: "Asia", lastUpdated: "2026-09-01T08:00:00Z" },
  { pair: "USD/MYR", baseCurrency: "USD", quoteCurrency: "MYR", rate: 4.5678, change: 0.0123, changePercent: 0.27, high24h: 4.5789, low24h: 4.5567, region: "Asia", lastUpdated: "2026-09-01T08:00:00Z" },
  { pair: "USD/THB", baseCurrency: "USD", quoteCurrency: "THB", rate: 34.5678, change: 0.1234, changePercent: 0.36, high24h: 34.6789, low24h: 34.4567, region: "Asia", lastUpdated: "2026-09-01T08:00:00Z" },
  { pair: "USD/PHP", baseCurrency: "USD", quoteCurrency: "PHP", rate: 56.78, change: 0.23, changePercent: 0.41, high24h: 56.89, low24h: 56.56, region: "Asia", lastUpdated: "2026-09-01T08:00:00Z" },

  // Americas
  { pair: "USD/MXN", baseCurrency: "USD", quoteCurrency: "MXN", rate: 19.8765, change: -0.1234, changePercent: -0.62, high24h: 19.9876, low24h: 19.7654, region: "Americas", lastUpdated: "2026-09-01T13:00:00Z" },
  { pair: "USD/BRL", baseCurrency: "USD", quoteCurrency: "BRL", rate: 4.8912, change: 0.0234, changePercent: 0.48, high24h: 4.9123, low24h: 4.8678, region: "Americas", lastUpdated: "2026-09-01T14:00:00Z" },
  { pair: "USD/ARS", baseCurrency: "USD", quoteCurrency: "ARS", rate: 1234.56, change: 12.34, changePercent: 1.01, high24h: 1245.67, low24h: 1223.45, region: "Americas", lastUpdated: "2026-09-01T13:00:00Z" },
  { pair: "USD/CLP", baseCurrency: "USD", quoteCurrency: "CLP", rate: 923.45, change: -3.45, changePercent: -0.37, high24h: 926.78, low24h: 920.12, region: "Americas", lastUpdated: "2026-09-01T13:00:00Z" },
  { pair: "USD/COP", baseCurrency: "USD", quoteCurrency: "COP", rate: 4234.56, change: 12.34, changePercent: 0.29, high24h: 4245.67, low24h: 4223.45, region: "Americas", lastUpdated: "2026-09-01T13:00:00Z" },

  // Oceania
  { pair: "AUD/NZD", baseCurrency: "AUD", quoteCurrency: "NZD", rate: 1.0912, change: 0.0045, changePercent: 0.41, high24h: 1.0934, low24h: 1.0878, region: "Oceania", lastUpdated: "2026-09-01T06:00:00Z" },
  { pair: "AUD/JPY", baseCurrency: "AUD", quoteCurrency: "JPY", rate: 97.45, change: 0.67, changePercent: 0.69, high24h: 97.89, low24h: 96.78, region: "Oceania", lastUpdated: "2026-09-01T06:00:00Z" },
];

/* ── Region Metadata ────────────────────────────────────────── */

export interface RegionMeta {
  name: string;
  slug: string;
  flag: string;
  color: string;
}

export const regions: RegionMeta[] = [
  { name: "Global", slug: "global", flag: "🌐", color: "#3b82f6" },
  { name: "North America", slug: "north-america", flag: "🇺🇸", color: "#10b981" },
  { name: "Central America", slug: "central-america", flag: "🌎", color: "#f59e0b" },
  { name: "South America", slug: "south-america", flag: "🇧🇷", color: "#8b5cf6" },
  { name: "Europe", slug: "europe", flag: "🇪🇺", color: "#06b6d4" },
  { name: "Africa", slug: "africa", flag: "🌍", color: "#ef4444" },
  { name: "East Africa", slug: "east-africa", flag: "🇰🇪", color: "#f43f5e" },
  { name: "West Africa", slug: "west-africa", flag: "🇳🇬", color: "#f97316" },
  { name: "Southern Africa", slug: "southern-africa", flag: "🇿🇦", color: "#a855f7" },
  { name: "North Africa", slug: "north-africa", flag: "🇪🇬", color: "#14b8a6" },
  { name: "Southeast Asia", slug: "southeast-asia", flag: "🇸🇬", color: "#ec4899" },
  { name: "Asia", slug: "asia", flag: "🌏", color: "#ec4899" },
  { name: "Americas", slug: "americas", flag: "🌎", color: "#14b8a6" },
  { name: "Oceania", slug: "oceania", flag: "🇦🇺", color: "#f97316" },
];

/* ── Editorial Roles ────────────────────────────────────────── */

export interface EditorialTeamMember {
  name: string;
  role: "content_creator" | "editor" | "publisher";
  avatar: string;
  department: string;
}

export const editorialTeam: EditorialTeamMember[] = [
  { name: "News Desk", role: "content_creator", avatar: "📝", department: "Editorial" },
  { name: "News Desk", role: "editor", avatar: "📰", department: "News & Features" },
  { name: "Finance Desk", role: "editor", avatar: "📊", department: "Markets & Finance" },
  { name: "Tech Desk", role: "editor", avatar: "💻", department: "Technology" },
  { name: "Security Desk", role: "editor", avatar: "🔒", department: "Security & Compliance" },
  { name: "Editorial Board", role: "publisher", avatar: "🏛️", department: "Executive" },
];

/* ── Helper Functions ───────────────────────────────────────── */

export function formatNumber(n: number, decimals = 2): string {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function getChangeColor(change: number): string {
  if (change > 0) return "text-emerald-400";
  if (change < 0) return "text-red-400";
  return "text-white/50";
}

export function getChangeArrow(change: number): string {
  if (change > 0) return "▲";
  if (change < 0) return "▼";
  return "—";
}

export function getStatusColor(status: ArticleStatus): string {
  switch (status) {
    case "draft": return "bg-zinc-500/20 text-zinc-400 border-zinc-500/30";
    case "pending_review": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
    case "approved": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    case "published": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    case "rejected": return "bg-red-500/20 text-red-400 border-red-500/30";
  }
}

export function getStatusLabel(status: ArticleStatus): string {
  switch (status) {
    case "draft": return "Draft";
    case "pending_review": return "Pending Review";
    case "approved": return "Approved";
    case "published": return "Published";
    case "rejected": return "Rejected";
  }
}
