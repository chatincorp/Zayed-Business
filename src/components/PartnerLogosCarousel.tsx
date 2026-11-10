/**
 * PartnerLogosCarousel — infinite auto-scrolling supplier/partner logo strip.
 * Uses official, brand-colored vector marks (simple-icons + Wikimedia) from
 * /public/logos/ for realistic, crisp logos on any background.
 */

interface Partner {
  name: string;
  /** Path to brand SVG in /public/logos/ */
  logo: string;
  /** Brand accent color (used for fallback text) */
  color: string;
}

import { useSitePartners } from "@/lib/siteContent";

const staticPartners: Partner[] = [
  { name: "Dahua", logo: "/logos/dahua.svg", color: "#e11d2e" },
  { name: "OpenAI", logo: "/logos/openai.svg", color: "#412991" },
  { name: "Anthropic (Claude)", logo: "/logos/anthropic.svg", color: "#191919" },
  { name: "Amazon AWS", logo: "/logos/amazonaws.svg", color: "#232f3e" },
  { name: "Google Cloud", logo: "/logos/googlecloud.svg", color: "#4285f4" },
  { name: "Oracle", logo: "/logos/oracle.svg", color: "#c74634" },
  { name: "HP", logo: "/logos/hp.svg", color: "#0096d6" },
  { name: "Cisco", logo: "/logos/cisco.svg", color: "#1ba0d7" },
  { name: "Dell", logo: "/logos/dell.svg", color: "#007db8" },
  { name: "Namecheap", logo: "/logos/namecheap.svg", color: "#de3723" },
  { name: "WordPress", logo: "/logos/wordpress.svg", color: "#21759b" },
  { name: "Shopify", logo: "/logos/shopify.svg", color: "#7ab55c" },
  { name: "Microsoft", logo: "/logos/microsoft.svg", color: "#00a4ef" },
  { name: "Apple", logo: "/logos/apple.svg", color: "#111111" },
  { name: "Samsung", logo: "/logos/samsung.svg", color: "#1428a0" },
  { name: "Huawei", logo: "/logos/huawei.svg", color: "#ff0000" },
  { name: "Cloudflare", logo: "/logos/cloudflare.svg", color: "#f38020" },
  { name: "Vercel", logo: "/logos/vercel.svg", color: "#000000" },
];

export default function PartnerLogosCarousel() {
  // Active partners from the admin panel, keeping the bundled brand colors.
  const dbPartners = useSitePartners();
  const livePartners = (dbPartners ?? [])
    .filter((p) => Boolean(p.logo))
    .map((p) => ({
      name: p.name,
      logo: p.logo as string,
      color: staticPartners.find((s) => s.name === p.name)?.color ?? "#111111",
    }));
  const partners = livePartners.length > 0 ? livePartners : staticPartners;
  const loopPartners = [...partners, ...partners];

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
                padding: "10px 14px",
              }}
              title={partner.name}
            >
              <img
                src={partner.logo}
                alt={`${partner.name} logo`}
                className="max-h-9 max-w-[112px] w-auto h-auto object-contain group-hover:scale-105 transition-transform duration-300"
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
