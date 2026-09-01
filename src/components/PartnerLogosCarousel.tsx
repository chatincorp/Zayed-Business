/**
 * PartnerLogosCarousel — infinite auto-scrolling supplier/partner logo strip.
 * White background cards with inline brand logos, uniform sizing, auto-scroll.
 */

interface Partner {
  name: string;
  svg: React.ReactNode;
}

/* ── Inline SVG brand marks ────────────────────────────────────── */

const dahuaSvg = (
  <svg viewBox="0 0 120 40" className="h-7 w-auto">
    <text x="4" y="28" fontFamily="Arial Black, sans-serif" fontWeight="900" fontSize="22" fill="#e11d2e">
      d
    </text>
    <text x="20" y="28" fontFamily="Arial Black, sans-serif" fontWeight="900" fontSize="22" fill="#1a1a1a">
      ahua
    </text>
    <text x="4" y="38" fontFamily="Arial, sans-serif" fontWeight="400" fontSize="7" fill="#666" letterSpacing="2">
      TECHNOLOGY
    </text>
  </svg>
);

const openaiSvg = (
  <svg viewBox="0 0 40 40" className="h-8 w-8">
    <path
      d="M20 4C13.4 4 8 8.6 8 14.2c0 3.1 1.6 5.8 4 7.5v5.8c0 .8.9 1.3 1.6.9l3.3-2c.7.2 1.4.3 2.1.3 6.6 0 12-4.6 12-10.2S26.6 4 20 4z"
      fill="#10a37f"
    />
  </svg>
);

const claudeSvg = (
  <svg viewBox="0 0 40 40" className="h-8 w-8">
    <circle cx="20" cy="20" r="18" fill="#d4956a" />
    <text x="20" y="25" textAnchor="middle" fontFamily="Georgia, serif" fontWeight="700" fontSize="16" fill="white">
      C
    </text>
  </svg>
);

const awsSvg = (
  <svg viewBox="0 0 80 35" className="h-7 w-auto">
    <text x="0" y="22" fontFamily="Arial, sans-serif" fontWeight="800" fontSize="18" fill="#232f3e">
      amazon
    </text>
    <text x="0" y="33" fontFamily="Arial, sans-serif" fontWeight="400" fontSize="11" fill="#ff9900">
      web services
    </text>
  </svg>
);

const gcpSvg = (
  <svg viewBox="0 0 40 40" className="h-8 w-8">
    <path d="M20 8l8 14H12z" fill="#4285f4" />
    <path d="M12 22l-6 10h12z" fill="#34a853" />
    <path d="M28 22l6 10H22z" fill="#ea4335" />
    <circle cx="20" cy="20" r="4" fill="#fbbc05" />
  </svg>
);

const oracleSvg = (
  <svg viewBox="0 0 100 28" className="h-6 w-auto">
    <text x="0" y="22" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="22" fill="#c74634" letterSpacing="-1">
      ORACLE
    </text>
  </svg>
);

const hpSvg = (
  <svg viewBox="0 0 40 40" className="h-8 w-8">
    <circle cx="20" cy="20" r="18" fill="#0096d6" />
    <text x="20" y="26" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="800" fontSize="16" fill="white">
      hp
    </text>
  </svg>
);

const ciscoSvg = (
  <svg viewBox="0 0 80 30" className="h-7 w-auto">
    <text x="0" y="22" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="20" fill="#049fd9" letterSpacing="1">
      Cisco
    </text>
  </svg>
);

const dellSvg = (
  <svg viewBox="0 0 40 40" className="h-8 w-8">
    <circle cx="20" cy="20" r="18" fill="none" stroke="#007db8" strokeWidth="2.5" />
    <text x="20" y="25" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="13" fill="#007db8">
      DELL
    </text>
  </svg>
);

const namecheapSvg = (
  <svg viewBox="0 0 110 35" className="h-7 w-auto">
    <path d="M8 10l12 15" stroke="#f15a24" strokeWidth="4" strokeLinecap="round" fill="none" />
    <path d="M20 25l12-15" stroke="#f15a24" strokeWidth="4" strokeLinecap="round" fill="none" />
    <text x="36" y="26" fontFamily="Arial, sans-serif" fontWeight="600" fontSize="17" fill="#666">
      namecheap
    </text>
  </svg>
);

const wordpressSvg = (
  <svg viewBox="0 0 40 40" className="h-8 w-8">
    <circle cx="20" cy="20" r="18" fill="#21759b" />
    <text x="20" y="27" textAnchor="middle" fontFamily="Georgia, serif" fontWeight="700" fontSize="22" fill="white">
      W
    </text>
  </svg>
);

const shopifySvg = (
  <svg viewBox="0 0 40 44" className="h-8 w-auto">
    <path d="M30 8c-1-4-4-6-8-6s-9 3-12 7c-1 1-2 3-2 5 0 4 3 6 3 6s-2 1-2 4c0 3 3 5 7 6h1c1 0 2 0 2-1 1 0 3-1 4-3 1-1 2-3 2-5 0-2-1-3-2-4 2-1 3-3 3-5 0-1 0-2-1-3z"
      fill="#96bf48"
    />
    <path d="M22 12v8" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M18 16h8" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

const ecwidSvg = (
  <svg viewBox="0 0 40 40" className="h-8 w-8">
    <circle cx="20" cy="20" r="18" fill="#48b87e" />
    <text x="20" y="26" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="800" fontSize="14" fill="white">
      e
    </text>
  </svg>
);

const ecitizenSvg = (
  <svg viewBox="0 0 40 40" className="h-8 w-8">
    <rect x="2" y="2" width="36" height="36" rx="6" fill="#1a5276" />
    <text x="20" y="26" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="10" fill="white">
      eCit
    </text>
  </svg>
);

const microsoftSvg = (
  <svg viewBox="0 0 40 40" className="h-8 w-8">
    <rect x="2" y="2" width="16" height="16" fill="#f25022" />
    <rect x="22" y="2" width="16" height="16" fill="#7fba00" />
    <rect x="2" y="22" width="16" height="16" fill="#00a4ef" />
    <rect x="22" y="22" width="16" height="16" fill="#ffb900" />
  </svg>
);

const appleSvg = (
  <svg viewBox="0 0 40 44" className="h-8 w-auto">
    <path
      d="M30 36c-2 2-4 3-6 3-2 0-3-1-5-1s-3 1-5 1c-2 0-4-1-6-3-4-4-7-10-3-16 2-3 5-5 8-5 2 0 4 1 5 1s3-1 5-1c3 0 6 2 8 5-6 4-5 12 1 14l-1 0zM24 4c1-2 2-4 2-6 0 0-2 0-4 2-1 1-2 3-2 5 0 0 0 0 0 0 2 0 3-1 4-1z"
      fill="#a2aaad"
    />
  </svg>
);

const samsungSvg = (
  <svg viewBox="0 0 100 30" className="h-6 w-auto">
    <rect x="0" y="0" width="100" height="30" rx="4" fill="#1428a0" />
    <text x="50" y="21" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="14" fill="white" letterSpacing="2">
      SAMSUNG
    </text>
  </svg>
);

const huaweiSvg = (
  <svg viewBox="0 0 40 40" className="h-8 w-8">
    <circle cx="20" cy="20" r="18" fill="#cf0a2c" />
    <text x="20" y="25" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="800" fontSize="12" fill="white">
      Hw
    </text>
  </svg>
);

const cloudflareSvg = (
  <svg viewBox="0 0 40 40" className="h-8 w-8">
    <circle cx="20" cy="20" r="18" fill="#f38020" />
    <text x="20" y="25" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="800" fontSize="16" fill="white">
      Cf
    </text>
  </svg>
);

const vercelSvg = (
  <svg viewBox="0 0 40 36" className="h-7 w-auto">
    <path d="M20 2L38 34H2z" fill="#000000" />
  </svg>
);

const partners: Partner[] = [
  { name: "Dahua", svg: dahuaSvg },
  { name: "OpenAI", svg: openaiSvg },
  { name: "Claude", svg: claudeSvg },
  { name: "Amazon AWS", svg: awsSvg },
  { name: "Google Cloud", svg: gcpSvg },
  { name: "Oracle", svg: oracleSvg },
  { name: "HP", svg: hpSvg },
  { name: "Cisco", svg: ciscoSvg },
  { name: "Dell", svg: dellSvg },
  { name: "Namecheap", svg: namecheapSvg },
  { name: "WordPress", svg: wordpressSvg },
  { name: "Shopify", svg: shopifySvg },
  { name: "Ecwid", svg: ecwidSvg },
  { name: "eCitizen", svg: ecitizenSvg },
  { name: "Microsoft", svg: microsoftSvg },
  { name: "Apple", svg: appleSvg },
  { name: "Samsung", svg: samsungSvg },
  { name: "Huawei", svg: huaweiSvg },
  { name: "Cloudflare", svg: cloudflareSvg },
  { name: "Vercel", svg: vercelSvg },
];

const loopPartners = [...partners, ...partners];

export default function PartnerLogosCarousel() {
  return (
    <section className="py-8">
      <p className="text-center text-[11px] font-medium uppercase tracking-[0.3em] text-white/30 mb-6 select-none">
        Technology &amp; Supplier Partners
      </p>

      {/* Edge fade */}
      <div
        className="overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0%, black 4%, black 96%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 4%, black 96%, transparent 100%)",
        }}
      >
        {/* Scrolling track */}
        <div className="partner-track flex gap-4 w-max">
          {loopPartners.map((partner, i) => (
            <div
              key={`${partner.name}-${i}`}
              className="partner-card flex items-center justify-center shrink-0 rounded-xl border border-gray-200 transition-all duration-300 hover:shadow-md hover:border-gray-300 hover:scale-[1.03]"
              style={{
                background: "#ffffff",
                minWidth: 140,
                height: 64,
                padding: "0 20px",
              }}
              title={partner.name}
            >
              {partner.svg}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
