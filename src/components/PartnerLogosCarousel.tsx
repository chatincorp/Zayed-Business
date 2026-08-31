/**
 * PartnerLogosCarousel — infinite auto-scrolling supplier/partner logo strip.
 *
 * Each partner is rendered in a fixed-size card with the brand name styled
 * to suggest the partner's visual identity.  Cards auto-resize their
 * content (text or images) to fit uniformly.
 *
 * Duplicate the list once for a seamless CSS-marquee loop.
 */

interface Partner {
  name: string;
  /** Optional image URL — when provided, an <img> replaces the text badge. */
  logo?: string;
  /** Override the accent colour shown behind the text fallback. */
  color?: string;
}

const partners: Partner[] = [
  { name: "Dahua", color: "#e11d2e" },
  { name: "OpenAI", color: "#10a37f" },
  { name: "Claude", color: "#d4956a" },
  { name: "Amazon AWS", color: "#ff9900" },
  { name: "Google Cloud", color: "#4285f4" },
  { name: "Oracle", color: "#c74634" },
  { name: "HP", color: "#0096d6" },
  { name: "Cisco", color: "#049fd9" },
  { name: "Dell", color: "#007db8" },
  { name: "Namecheap", color: "#d53e3e" },
  { name: "WordPress", color: "#21759b" },
  { name: "Shopify", color: "#96bf48" },
  { name: "Ecwid", color: "#48b87e" },
  { name: "eCitizen", color: "#1a5276" },
  { name: "Microsoft", color: "#00a4ef" },
  { name: "Apple", color: "#a2aaad" },
  { name: "Samsung", color: "#1428a0" },
  { name: "Huawei", color: "#cf0a2c" },
  { name: "Cloudflare", color: "#f38020" },
  { name: "Vercel", color: "#ffffff" },
];

/* Double the list for a seamless loop */
const loopPartners = [...partners, ...partners];

function LogoCard({ partner }: { partner: Partner }) {
  if (partner.logo) {
    return (
      <div className="flex items-center justify-center h-12 w-auto px-2">
        <img
          src={partner.logo}
          alt={partner.name}
          className="max-h-10 max-w-[100px] w-auto h-auto object-contain opacity-50 hover:opacity-90 transition-opacity duration-300"
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div
      className="flex items-center justify-center h-12 px-4 min-w-[110px] rounded-md border border-white/5 hover:border-white/10 transition-all duration-300 group"
      style={{ backgroundColor: `${partner.color}10` }}
    >
      <span
        className="text-xs font-semibold tracking-wider uppercase whitespace-nowrap opacity-40 group-hover:opacity-80 transition-opacity duration-300 select-none"
        style={{ color: partner.color }}
      >
        {partner.name}
      </span>
    </div>
  );
}

export default function PartnerLogosCarousel() {
  return (
    <div className="py-10 border-t border-white/5">
      {/* Section label */}
      <p className="text-center text-[10px] uppercase tracking-[0.25em] text-white/25 mb-6 select-none">
        Technology &amp; Supplier Partners
      </p>

      {/* Marquee wrapper */}
      <div
        className="relative overflow-hidden group"
        style={{ maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)" }}
      >
        {/* Scrolling track — pure CSS infinite marquee */}
        <div className="flex gap-6 w-max animate-[partnerScroll_60s_linear_infinite] group-hover:[animation-play-state:paused]">
          {loopPartners.map((partner, i) => (
            <div key={`${partner.name}-${i}`} className="flex-shrink-0">
              <LogoCard partner={partner} />
            </div>
          ))}
        </div>
      </div>

      {/* CSS animation via inline style tag */}
      <style>{`
        @keyframes partnerScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
