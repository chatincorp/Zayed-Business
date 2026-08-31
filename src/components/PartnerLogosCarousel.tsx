/**
 * PartnerLogosCarousel — infinite auto-scrolling supplier/partner logo strip.
 *
 * Uses a CSS keyframes animation defined in index.css (.partner-track).
 * Each partner renders as a branded card with coloured accent.
 * Pass `logo` URLs for image-based logos; they auto-size to fit.
 * Duplicate the list once for a seamless loop.
 */

interface Partner {
  name: string;
  logo?: string;
  color: string;
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

const loopPartners = [...partners, ...partners];

function LogoCard({ partner }: { partner: Partner }) {
  if (partner.logo) {
    return (
      <div
        className="flex items-center justify-center shrink-0 rounded-lg px-5 py-3"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          minWidth: 120,
          height: 56,
        }}
      >
        <img
          src={partner.logo}
          alt={partner.name}
          className="max-h-9 max-w-[100px] w-auto h-auto object-contain"
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div
      className="flex items-center justify-center shrink-0 rounded-lg px-5 py-3 gap-2 transition-all duration-300 hover:scale-105"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        minWidth: 120,
        height: 56,
      }}
    >
      {/* Coloured dot accent */}
      <span
        className="w-2 h-2 rounded-full shrink-0"
        style={{ background: partner.color }}
      />
      <span
        className="text-[13px] font-semibold tracking-wide whitespace-nowrap"
        style={{ color: partner.color, opacity: 0.85 }}
      >
        {partner.name}
      </span>
    </div>
  );
}

export default function PartnerLogosCarousel() {
  return (
    <section className="py-10 border-t border-white/5">
      <p className="text-center text-[11px] font-medium uppercase tracking-[0.3em] text-white/30 mb-8 select-none">
        Technology &amp; Supplier Partners
      </p>

      {/* Edge fade mask */}
      <div
        className="overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
        }}
      >
        {/* Scrolling track */}
        <div className="partner-track flex gap-5 w-max">
          {loopPartners.map((partner, i) => (
            <LogoCard key={`${partner.name}-${i}`} partner={partner} />
          ))}
        </div>
      </div>
    </section>
  );
}
