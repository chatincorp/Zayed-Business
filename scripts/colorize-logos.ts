// One-off asset script: injects official brand hex colors into downloaded
// simple-icons SVGs so the partner carousel shows realistic brand-colored marks.
// Run: bun scripts/colorize-logos.ts
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const dir = "public/logos";
const dataUrl = "https://cdn.jsdelivr.net/npm/simple-icons@latest/_data/simple-icons.json";

interface BrandEntry { title: string; hex: string; }

const res = await fetch(dataUrl);
if (!res.ok) {
  console.error("Failed to fetch brand data:", res.status);
  process.exit(1);
}
const brands = (await res.json()) as BrandEntry[];

// Map: file name in public/logos → brand title in simple-icons data.
const fileToBrand: Record<string, string> = {
  "openai.svg": "OpenAI",
  "amazonaws.svg": "Amazon Web Services",
  "googlecloud.svg": "Google Cloud",
  "oracle.svg": "Oracle",
  "hp.svg": "HP",
  "cisco.svg": "Cisco",
  "dell.svg": "Dell",
  "namecheap.svg": "Namecheap",
  "wordpress.svg": "WordPress",
  "shopify.svg": "Shopify",
  "microsoft.svg": "Microsoft",
  "apple.svg": "Apple",
  "samsung.svg": "Samsung",
  "huawei.svg": "Huawei",
  "cloudflare.svg": "Cloudflare",
  "vercel.svg": "Vercel",
  "anthropic.svg": "Anthropic",
  // Wikimedia-sourced files are pre-colored:
  "dahua.svg": "",
};

let updated = 0;
let skipped = 0;

for (const [file, brandTitle] of Object.entries(fileToBrand)) {
  const path = `${dir}/${file}`;
  if (!brandTitle || !existsSync(path)) { skipped++; continue; }

  const brand = brands.find(
    (b) => b.title.toLowerCase() === brandTitle.toLowerCase()
  );
  if (!brand) {
    console.warn(`No brand data for ${brandTitle} (${file})`);
    skipped++;
    continue;
  }

  let svg = readFileSync(path, "utf8");
  if (svg.includes('fill="#')) { skipped++; continue; } // already colored
  svg = svg.replace(/<svg /, `<svg fill="#${brand.hex}" `);
  writeFileSync(path, svg);
  updated++;
  console.log(`${file} → #${brand.hex}`);
}

console.log(`Done. updated=${updated} skipped=${skipped}`);
