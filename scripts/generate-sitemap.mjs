/**
 * Regenerates public/sitemap.xml from the static route list plus the local-SEO
 * matrix.
 *
 * The matrix is read as JSON (src/data/localSeoData.json) rather than importing
 * the TypeScript source, so this runs on any Node version — no type stripping
 * required. Run directly with `npm run sitemap`; it also runs as part of
 * `npm run build`.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const matrix = JSON.parse(
  readFileSync(resolve(root, "src/data/localSeoData.json"), "utf8"),
);
const LOCAL_SERVICES = matrix.services;
const LOCAL_PLACES = matrix.places;

/**
 * Canonical origin for every URL. Override with SITE_ORIGIN at build time so the
 * sitemap matches whichever host actually serves the site (custom domain on
 * Cloudflare, or a workers.dev / preview host before DNS is attached).
 */
const ORIGIN = (process.env.SITE_ORIGIN || "https://yasirzayed.com").replace(/\/+$/, "");
const TODAY = new Date().toISOString().slice(0, 10);

/** [path, changefreq, priority] */
const STATIC_ROUTES = [
  ["/", "daily", "1.0"],
  ["/services", "weekly", "0.9"],
  ["/about", "monthly", "0.8"],
  ["/contact", "monthly", "0.8"],
  ["/pricing", "monthly", "0.8"],
  ["/best", "weekly", "0.9"],
  ["/fmcg", "weekly", "0.9"],
  ["/fmcg/account", "weekly", "0.7"],
  ["/wholesale", "daily", "0.9"],
  ["/tabloid", "hourly", "0.9"],
  ["/tabloid/markets", "hourly", "0.8"],
  ["/tabloid/forex", "hourly", "0.8"],
  ["/markets", "hourly", "0.8"],
  ["/tabloid/editorial", "daily", "0.6"],
  ["/privacy", "yearly", "0.3"],
  ["/terms", "yearly", "0.3"],
  ["/cookies", "yearly", "0.3"],
];

const SERVICE_ROUTES = [
  "strategic-business-planning",
  "market-research-analysis",
  "business-model-optimization",
  "sales-strategy-development",
  "sales-process-optimization",
  "marketing-strategy-planning",
  "digital-marketing-strategy",
  "brand-development-positioning",
  "promotional-campaign-development",
  "event-marketing-management",
  "product-launch-support",
  "fmcg-order-booking",
  "fmcg-sales",
  "fmcg-supplier-sourcing",
  "fmcg-merchandizing",
  "fmcg-product-promotion",
  "cctv-surveillance-systems",
  "intrusion-alarm-systems",
  "access-control-systems",
  "ai-system-integration",
  "custom-ai-chatbots",
  "workflow-automation",
  "custom-corporate-websites",
  "custom-wordpress-themes",
  "wordpress-woocommerce",
  "web-applications",
  "ecommerce-platforms",
  "crm-implementation",
  "marketplace-listings",
  "account-social-media-management",
  "content-generation",
  "ad-generation",
];

/** Mirrors isIndexablePair() in src/data/localSeo.ts. */
const isIndexablePair = (service, place) => service.places.includes(place.slug);

const urlEntry = (loc, changefreq, priority) =>
  `  <url><loc>${ORIGIN}${loc}</loc><lastmod>${TODAY}</lastmod><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`;

const pairs = LOCAL_SERVICES.flatMap((service) =>
  LOCAL_PLACES.filter((place) => isIndexablePair(service, place)).map((place) => ({
    service,
    place,
  })),
);

const body = [
  ...STATIC_ROUTES.map(([loc, freq, priority]) => urlEntry(loc, freq, priority)),
  "",
  "  <!-- Service detail pages -->",
  ...SERVICE_ROUTES.map((slug) => urlEntry(`/services/${slug}`, "monthly", "0.8")),
  "",
  "  <!-- Best <service> in <place> landing pages -->",
  ...pairs.map(({ service, place }) =>
    urlEntry(`/best/${service.slug}/${place.slug}`, "monthly", "0.7"),
  ),
].join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${body}
</urlset>
`;

// Keep robots.txt advertising the same origin as the sitemap it points at.
const robotsPath = resolve(root, "public/robots.txt");
writeFileSync(
  robotsPath,
  readFileSync(robotsPath, "utf8")
    .replace(/^# Canonical host:.*$/m, `# Canonical host: ${ORIGIN} (no www)`)
    .replace(/^Sitemap:.*$/m, `Sitemap: ${ORIGIN}/sitemap.xml`),
);

writeFileSync(resolve(root, "public/sitemap.xml"), xml);
const total = STATIC_ROUTES.length + SERVICE_ROUTES.length + pairs.length;
console.log(
  `sitemap.xml written with ${total} URLs (${pairs.length} of ${LOCAL_SERVICES.length * LOCAL_PLACES.length} local pages indexable)`,
);
