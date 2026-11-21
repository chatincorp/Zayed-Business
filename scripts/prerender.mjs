/**
 * Prerenders the local-SEO pages after `vite build`.
 *
 * The site is a client-rendered SPA, so a crawler that does not run JavaScript
 * sees only the homepage shell. For each indexable /best/<service>/<place> page
 * this writes dist/best/<service>/<place>/index.html containing that page's
 * real title, meta description, canonical, Open Graph tags, JSON-LD and body
 * copy. React replaces the static block on hydration, so the rendered app is
 * unchanged for visitors.
 *
 * Runs as part of `npm run build`; safe to re-run.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(root, "dist");
const templatePath = resolve(dist, "index.html");

if (!existsSync(templatePath)) {
  console.error("prerender: dist/index.html not found — run vite build first.");
  process.exit(1);
}

const template = readFileSync(templatePath, "utf8");
const matrix = JSON.parse(
  readFileSync(resolve(root, "src/data/localSeoData.json"), "utf8"),
);
const ORIGIN = "https://yasirzayed.com";

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const escapeJson = (value) => JSON.stringify(value).replace(/</g, "\\u003c");

/** Replace the content of an existing meta/link tag, or append it. */
function setTag(html, pattern, replacement, fallbackHead) {
  if (pattern.test(html)) return html.replace(pattern, replacement);
  return html.replace("</head>", `${fallbackHead}\n</head>`);
}

const isIndexablePair = (service, place) => service.places.includes(place.slug);
const localAngle = (service, place) => matrix.localAngles?.[`${service.slug}/${place.slug}`];

const deliveryNote = (place) => {
  switch (place.kind) {
    case "city":
      return `Work in ${place.name} runs from a local base: site visits or outlet rides inside the city, a named contact on WhatsApp and phone, and reporting issued at the end of each week rather than the end of the quarter.`;
    case "town":
      return `${place.name} engagements are planned around travel: we batch site visits, agree the visit calendar up front and keep day-to-day coordination on calls and shared documents so travel time never becomes your delay.`;
    case "county":
      return `County-wide work in ${place.name} is delivered in waves, with a coverage map agreed before the first visit so no ward is assumed covered when it is not.`;
    case "country":
      return `National programmes across ${place.name} use one process, one reporting pack and one accountable lead, with regional coordinators handling day-to-day execution on the ground.`;
    case "region":
      return `Regional work across ${place.name} is scoped country by country: local requirements, local pricing and local logistics are confirmed before a single regional commitment is made.`;
    case "continent":
      return `Multi-country work across ${place.name} starts with a short feasibility pass — regulation, logistics, payment norms and local partners — before we commit to a delivery plan.`;
    default:
      return "We confirm scope, sites, timelines and reporting lines in writing before work starts.";
  }
};

const sentence = (text) => text.charAt(0).toUpperCase() + text.slice(1);

function buildFaq(service, place) {
  return [
    {
      q: `How much does ${service.name} cost ${place.phrase}?`,
      a: `Pricing for ${service.name} ${place.phrase} is ${service.pricing}. After a discovery call we quote against your actual scope, sites and volumes, so there are no surprise line items.`,
    },
    {
      q: `Do you deliver ${service.name} ${place.phrase}?`,
      a: `Yes. Yasir Zayed delivers ${service.name} ${place.phrase}, covering ${place.areas.join(", ")}. ${place.context}`,
    },
    {
      q: `How do we start ${service.name} ${place.phrase}?`,
      a: "Open an account or book a consultation through the contact page. We confirm scope, timeline and pricing in writing before work starts, usually within two working days.",
    },
  ];
}

function buildJsonLd(service, place, path) {
  const areaType =
    place.kind === "country" ? "Country" : place.kind === "city" || place.kind === "town" ? "City" : "Place";
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: `${service.name} ${place.phrase}`,
        serviceType: service.name,
        description: `${service.summary}. ${service.detail}`,
        url: `${ORIGIN}${path}`,
        provider: {
          "@type": "Organization",
          "@id": `${ORIGIN}/#organization`,
          name: "Yasir Zayed",
          url: `${ORIGIN}/`,
          telephone: "+254-114-712-989",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Nairobi",
            addressRegion: "Nairobi County",
            addressCountry: "KE",
          },
        },
        areaServed: { "@type": areaType, name: place.name },
        offers: {
          "@type": "Offer",
          priceCurrency: "USD",
          description: `Pricing: ${service.pricing}`,
          availability: "https://schema.org/InStock",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: buildFaq(service, place).map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${ORIGIN}/` },
          { "@type": "ListItem", position: 2, name: "Best by location", item: `${ORIGIN}/best` },
          { "@type": "ListItem", position: 3, name: `${service.name} ${place.phrase}`, item: `${ORIGIN}${path}` },
        ],
      },
    ],
  };
}

function buildStaticBody(service, place, path) {
  const faq = buildFaq(service, place);
  const otherPlaces = matrix.places.filter((item) => item.slug !== place.slug).slice(0, 5);
  const otherServices = matrix.services.filter((item) => item.slug !== service.slug).slice(0, 6);

  return `
      <nav aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/best">Best by location</a> / ${escapeHtml(place.name)}</nav>
      <h1>Best ${escapeHtml(service.name)} ${escapeHtml(place.phrase)}</h1>
      <p>${escapeHtml(sentence(service.summary))} — delivered ${escapeHtml(place.phrase)} by a team that works to one process, one reporting standard and one point of accountability.</p>
      <p><a href="/contact">Book a consultation</a> · <a href="/services/${escapeHtml(service.slug)}">Full service details</a></p>

      <h2>${escapeHtml(service.name)} for businesses ${escapeHtml(place.phrase)}</h2>
      <p>${escapeHtml(place.context)}</p>
      <p>${escapeHtml(service.detail)}</p>
      <p>Engagements ${escapeHtml(place.phrase)} are priced ${escapeHtml(service.pricing)}. We confirm scope, timeline and price in writing before work starts.</p>

      ${localAngle(service, place) ? `<p><strong>The local picture.</strong> ${escapeHtml(localAngle(service, place))}</p>` : ""}
      <h2>How we work ${escapeHtml(place.phrase)}</h2>
      <p>${escapeHtml(deliveryNote(place))}</p>
      <p>Every engagement starts with an assessment of what exists today — sites, outlets, systems and current spend — so the plan is built on your actual operation rather than a template.</p>

      <h2>Why ${escapeHtml(place.name)} clients choose Yasir Zayed</h2>
      <ul>${service.proofPoints.map((point) => `<li>${escapeHtml(point)}</li>`).join("")}</ul>

      <h2>What the engagement includes</h2>
      <ul>${service.outcomes.map((outcome) => `<li>${escapeHtml(outcome)}</li>`).join("")}</ul>

      <h2>Areas covered ${escapeHtml(place.phrase)}</h2>
      <p>${escapeHtml(place.areas.join(", "))}</p>

      <h2>${escapeHtml(service.name)} ${escapeHtml(place.phrase)} — common questions</h2>
      ${faq
        .map(
          (item) =>
            `<h3>${escapeHtml(item.q)}</h3><p>${escapeHtml(item.a)}</p>`,
        )
        .join("\n      ")}

      <h2>${escapeHtml(service.name)} in other locations</h2>
      <ul>${otherPlaces
        .map(
          (other) =>
            `<li><a href="/best/${escapeHtml(service.slug)}/${escapeHtml(other.slug)}">${escapeHtml(service.name)} in ${escapeHtml(other.name)}</a></li>`,
        )
        .join("")}</ul>
      <h2>Other services in ${escapeHtml(place.name)}</h2>
      <ul>${otherServices
        .map(
          (other) =>
            `<li><a href="/best/${escapeHtml(other.slug)}/${escapeHtml(place.slug)}">${escapeHtml(other.name)} in ${escapeHtml(place.name)}</a></li>`,
        )
        .join("")}</ul>
      <p><a href="/best">All services by location</a></p>
      <p data-prerendered="${escapeHtml(path)}"></p>`;
}

function renderPage({ title, description, path, jsonLd, body }) {
  const url = `${ORIGIN}${path}`;
  const fullTitle = title.includes("Yasir Zayed") ? title : `${title} | Yasir Zayed`;
  let html = template;

  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(fullTitle)}</title>`);
  html = setTag(
    html,
    /<meta name="description" content="[^"]*"\s*\/?>/,
    `<meta name="description" content="${escapeHtml(description)}" />`,
    `<meta name="description" content="${escapeHtml(description)}" />`,
  );
  html = setTag(
    html,
    /<link rel="canonical" href="[^"]*"\s*\/?>/,
    `<link rel="canonical" href="${url}" />`,
    `<link rel="canonical" href="${url}" />`,
  );
  html = setTag(
    html,
    /<link rel="alternate" hreflang="en" href="[^"]*"\s*\/?>/,
    `<link rel="alternate" hreflang="en" href="${url}" />`,
    `<link rel="alternate" hreflang="en" href="${url}" />`,
  );
  html = setTag(
    html,
    /<link rel="alternate" hreflang="x-default" href="[^"]*"\s*\/?>/,
    `<link rel="alternate" hreflang="x-default" href="${url}" />`,
    `<link rel="alternate" hreflang="x-default" href="${url}" />`,
  );

  for (const [attr, key, value] of [
    ["property", "og:title", fullTitle],
    ["property", "og:description", description],
    ["property", "og:url", url],
    ["name", "twitter:title", fullTitle],
    ["name", "twitter:description", description],
  ]) {
    html = setTag(
      html,
      new RegExp(`<meta ${attr}="${key}" content="[^"]*"\\s*\\/?>`),
      `<meta ${attr}="${key}" content="${escapeHtml(value)}" />`,
      `<meta ${attr}="${key}" content="${escapeHtml(value)}" />`,
    );
  }

  if (jsonLd) {
    html = html.replace(
      "</head>",
      `  <script type="application/ld+json">${escapeJson(jsonLd)}</script>\n</head>`,
    );
  }

  html = html.replace(
    '<div id="root"></div>',
    `<div id="root">${body}
    </div>`,
  );

  const file = resolve(dist, `${path.replace(/^\//, "")}/index.html`);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
  return file;
}

let written = 0;

for (const service of matrix.services) {
  for (const place of matrix.places) {
    if (!isIndexablePair(service, place)) continue;
    const path = `/best/${service.slug}/${place.slug}`;
    const pricing = sentence(service.pricing);
    renderPage({
      title: `Best ${service.name} in ${place.name} (2026)`,
      description: `${service.name} ${place.phrase} from Yasir Zayed: ${service.summary}. ${pricing}.`,
      path,
      jsonLd: buildJsonLd(service, place, path),
      body: buildStaticBody(service, place, path),
    });
    written += 1;
  }
}

// /best hub
const hubSections = matrix.places
  .map((place) => {
    const links = matrix.services
      .filter((service) => isIndexablePair(service, place))
      .map(
        (service) =>
          `<li><a href="/best/${escapeHtml(service.slug)}/${escapeHtml(place.slug)}">${escapeHtml(service.name)} in ${escapeHtml(place.name)}</a></li>`,
      )
      .join("");
    return `<h2>Services in ${escapeHtml(place.name)}</h2><p>${escapeHtml(place.kind)}</p><p>${escapeHtml(place.context)}</p><ul>${links}</ul>`;
  })
  .join("\n      ");

renderPage({
  title: "Best Business, FMCG, Security & Technology Services by Location",
  description:
    "Find the best FMCG, business development, security, AI, web and marketing services by city, town, country, region and continent — Nairobi, Mombasa, Kisumu, Nakuru, Eldoret, Kenya, East Africa, Africa and worldwide.",
  path: "/best",
  jsonLd: {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Services by location",
    url: `${ORIGIN}/best`,
  },
  body: `<h1>Best services by location</h1><p>${matrix.services.length} services × ${matrix.places.length} locations — city, town, county, country, region and continent.</p>${hubSections}`,
});
written += 1;

console.log(`prerender: wrote ${written} static pages into dist/`);
