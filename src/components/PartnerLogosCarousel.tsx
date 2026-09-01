/**
 * PartnerLogosCarousel — infinite auto-scrolling supplier/partner logo strip.
 * White background cards with exact brand logos, uniform sizing, auto-scroll.
 * Uses Clearbit Logo API for high-quality brand logos on white cards.
 */

interface Partner {
  name: string;
  /** URL to the brand logo image */
  logo: string;
}

const partners: Partner[] = [
  { name: "Dahua", logo: "https://logo.clearbit.com/dahuatech.com" },
  { name: "OpenAI", logo: "https://logo.clearbit.com/openai.com" },
  { name: "Claude", logo: "https://logo.clearbit.com/anthropic.com" },
  { name: "Amazon AWS", logo: "https://logo.clearbit.com/aws.amazon.com" },
  { name: "Google Cloud", logo: "https://logo.clearbit.com/cloud.google.com" },
  { name: "Oracle", logo: "https://logo.clearbit.com/oracle.com" },
  { name: "HP", logo: "https://logo.clearbit.com/hp.com" },
  { name: "Cisco", logo: "https://logo.clearbit.com/cisco.com" },
  { name: "Dell", logo: "https://logo.clearbit.com/dell.com" },
  { name: "Namecheap", logo: "https://logo.clearbit.com/namecheap.com" },
  { name: "WordPress", logo: "https://logo.clearbit.com/wordpress.org" },
  { name: "Shopify", logo: "https://logo.clearbit.com/shopify.com" },
  { name: "Ecwid", logo: "https://logo.clearbit.com/ecwid.com" },
  { name: "eCitizen", logo: "https://logo.clearbit.com/ecitizen.go.ke" },
  { name: "Microsoft", logo: "https://logo.clearbit.com/microsoft.com" },
  { name: "Apple", logo: "https://logo.clearbit.com/apple.com" },
  { name: "Samsung", logo: "https://logo.clearbit.com/samsung.com" },
  { name: "Huawei", logo: "https://logo.clearbit.com/huawei.com" },
  { name: "Cloudflare", logo: "https://logo.clearbit.com/cloudflare.com" },
  { name: "Vercel", logo: "https://logo.clearbit.com/vercel.com" },
];

/** Duplicate the list for seamless infinite scroll */
const loopPartners = [...partners, ...partners];

export default function PartnerLogosCarousel() {
  return (
    <section className="py-6">
      <p className="text-center text-[10px] font-semibold uppercase tracking-[0.3em] text-white/25 mb-5 select-none">
        Technology &amp; Supplier Partners
      </p>

      {/* Edge fade mask */}
      <div
        className="overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)",
        }}
      >
        {/* Auto-scrolling track */}
        <div className="partner-track flex gap-3 w-max">
          {loopPartners.map((partner, i) => (
            <div
              key={`${partner.name}-${i}`}
              className="flex items-center justify-center shrink-0 rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-[1.04] cursor-pointer"
              style={{
                background: "#ffffff",
                border: "1px solid #e5e7eb",
                width: 130,
                height: 52,
                padding: "0 14px",
              }}
              title={partner.name}
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="max-h-8 max-w-[100px] w-auto h-auto object-contain"
                loading="lazy"
                onError={(e) => {
                  /* Fallback: show brand name text if logo fails */
                  const target = e.currentTarget as HTMLImageElement;
                  target.style.display = "none";
                  const parent = target.parentElement;
                  if (parent && !parent.querySelector(".fallback-text")) {
                    const span = document.createElement("span");
                    span.className = "fallback-text text-xs font-semibold text-gray-700 whitespace-nowrap";
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
