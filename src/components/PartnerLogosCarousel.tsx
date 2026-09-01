/**
 * PartnerLogosCarousel — infinite auto-scrolling supplier/partner logo strip.
 * Uses actual PNG/SVG logo files from /public/logos/ for authentic brand marks.
 * Falls back to inline SVG for brands where image download failed.
 */

interface Partner {
  name: string;
  /** Path to logo file in /public/logos/ or inline SVG data URI */
  logo: string;
  /** Brand accent color for fallback text */
  color: string;
}

const svg = (content: string) =>
  `data:image/svg+xml,${encodeURIComponent(content)}`;

const partners: Partner[] = [
  { name: "Dahua", logo: "/logos/dahua.png", color: "#e11d2e" },
  { name: "OpenAI", logo: "/logos/openai.png", color: "#10a37f" },
  { name: "Claude", logo: "/logos/claude.png", color: "#d4956a" },
  {
    name: "Amazon AWS",
    logo: svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 50"><rect width="140" height="50" fill="white" rx="4"/><text x="12" y="24" font-family="Arial,sans-serif" font-weight="800" font-size="16" fill="#232f3e">amazon</text><text x="12" y="40" font-family="Arial,sans-serif" font-weight="700" font-size="13" fill="#ff9900">aws</text><path d="M100 34c6 2 14 1 20-2" stroke="#ff9900" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M116 31l4-2-1 5" fill="#ff9900"/></svg>`),
    color: "#ff9900",
  },
  {
    name: "Google Cloud",
    logo: svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 50"><rect width="140" height="50" fill="white" rx="4"/><path d="M70 10l20 34H50z" fill="#4285f4"/><path d="M50 44l-14 16h28z" fill="#34a853"/><path d="M90 44l14 16H76z" fill="#ea4335"/><circle cx="70" cy="38" r="8" fill="#fbbc05"/><circle cx="70" cy="38" r="4" fill="white"/></svg>`),
    color: "#4285f4",
  },
  { name: "Oracle", logo: "/logos/oracle.png", color: "#c74634" },
  { name: "HP", logo: "/logos/hp.svg", color: "#0096d6" },
  { name: "Cisco", logo: "/logos/cisco.svg", color: "#049fd9" },
  { name: "Dell", logo: "/logos/dell.svg", color: "#007db8" },
  { name: "Namecheap", logo: "/logos/namecheap.png", color: "#f15a24" },
  { name: "WordPress", logo: "/logos/wordpress.png", color: "#21759b" },
  {
    name: "Shopify",
    logo: svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 50"><rect width="140" height="50" fill="white" rx="4"/><path d="M108 12c-1-4-4-6-8-6s-8 3-10 6c-2 2-3 4-3 6 0 4 3 5 3 5s-2 1-2 4c0 3 4 5 8 6h1c1 0 2 0 2-1 1 0 3-1 4-3 1-2 2-3 2-5 0-2-1-3-2-4 2-1 3-3 3-5 0-1 0-2-1-2z" fill="#96bf48"/><path d="M98 16v6" stroke="white" stroke-width="2" stroke-linecap="round"/><path d="M95 19h6" stroke="white" stroke-width="2" stroke-linecap="round"/><text x="18" y="30" font-family="Arial,sans-serif" font-weight="700" font-size="14" fill="#5e8e3e">shopify</text></svg>`),
    color: "#96bf48",
  },
  { name: "Ecwid", logo: "/logos/ecwid.png", color: "#48b87e" },
  { name: "Microsoft", logo: "/logos/microsoft.png", color: "#00a4ef" },
  { name: "Apple", logo: "/logos/apple.png", color: "#a2aaad" },
  { name: "Samsung", logo: "/logos/samsung.png", color: "#1428a0" },
  { name: "Huawei", logo: "/logos/huawei.png", color: "#cf0a2c" },
  { name: "Cloudflare", logo: "/logos/cloudflare.png", color: "#f38020" },
  { name: "Vercel", logo: "/logos/vercel.png", color: "#000000" },
];

const loopPartners = [...partners, ...partners];

export default function PartnerLogosCarousel() {
  return (
    <section className="py-6">
      <p className="text-center text-[10px] font-semibold uppercase tracking-[0.3em] text-white/30 mb-4 select-none">
        Technology &amp; Supplier Partners
      </p>

      {/* Edge fade mask */}
      <div
        className="overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0%, black 4%, black 96%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 4%, black 96%, transparent 100%)",
        }}
      >
        {/* Auto-scrolling track */}
        <div className="partner-track flex gap-3 w-max">
          {loopPartners.map((partner, i) => (
            <div
              key={`${partner.name}-${i}`}
              className="flex items-center justify-center shrink-0 rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer group"
              style={{
                background: "#ffffff",
                border: "1px solid #e5e7eb",
                width: 140,
                height: 56,
                padding: "8px 12px",
              }}
              title={partner.name}
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="max-h-10 max-w-[120px] w-auto h-auto object-contain group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
                onError={(e) => {
                  // Fallback to brand-colored text if image fails
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const parent = target.parentElement;
                  if (parent && !parent.querySelector(".fallback-text")) {
                    const span = document.createElement("span");
                    span.className =
                      "fallback-text text-[11px] font-bold tracking-wide";
                    span.style.color = partner.color;
                    span.textContent = partner.name;
                    parent.appendChild(span);
                  }
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
