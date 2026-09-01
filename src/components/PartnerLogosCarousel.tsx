/**
 * PartnerLogosCarousel — infinite auto-scrolling supplier/partner logo strip.
 * Uses inline SVG data URIs for exact brand logos on white background cards.
 * No external files needed — logos load instantly.
 */

interface Partner {
  name: string;
  /** Inline SVG data URI */
  logo: string;
}

const svg = (content: string) =>
  `data:image/svg+xml,${encodeURIComponent(content)}`;

const partners: Partner[] = [
  {
    name: "Dahua",
    logo: svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 40"><rect width="140" height="40" fill="white"/><text x="12" y="26" font-family="Arial Black,Arial,sans-serif" font-weight="900" font-size="20" fill="#e11d2e">d</text><text x="28" y="26" font-family="Arial Black,Arial,sans-serif" font-weight="900" font-size="20" fill="#1a1a1a">ahua</text><text x="12" y="37" font-family="Arial,sans-serif" font-weight="400" font-size="7" fill="#888" letter-spacing="2">TECHNOLOGY</text></svg>`),
  },
  {
    name: "OpenAI",
    logo: svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" fill="white"/><path d="M20 6C14.5 6 10 9.8 10 14.5c0 2.6 1.3 4.8 3.3 6.2v4.8c0 .7.8 1.1 1.3.7l2.7-1.7c.6.1 1.2.2 1.7.2 5.5 0 10-3.8 10-8.5S25.5 6 20 6z" fill="#10a37f"/></svg>`),
  },
  {
    name: "Claude",
    logo: svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 50"><rect width="60" height="50" fill="white"/><g transform="translate(30,16)"><line x1="0" y1="-10" x2="0" y2="10" stroke="#d4956a" stroke-width="2.5" stroke-linecap="round"/><line x1="-8.66" y1="-5" x2="8.66" y2="5" stroke="#d4956a" stroke-width="2.5" stroke-linecap="round"/><line x1="-8.66" y1="5" x2="8.66" y2="-5" stroke="#d4956a" stroke-width="2.5" stroke-linecap="round"/><line x1="-5" y1="-8.66" x2="5" y2="8.66" stroke="#d4956a" stroke-width="2.5" stroke-linecap="round"/><line x1="-5" y1="8.66" x2="5" y2="-8.66" stroke="#d4956a" stroke-width="2.5" stroke-linecap="round"/><line x1="-10" y1="0" x2="10" y2="0" stroke="#d4956a" stroke-width="2.5" stroke-linecap="round"/></g><text x="30" y="44" text-anchor="middle" font-family="Georgia,serif" font-size="12" font-weight="700" fill="#1a1a1a">Claude</text></svg>`),
  },
  {
    name: "Amazon AWS",
    logo: svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 40"><rect width="120" height="40" fill="white"/><text x="6" y="20" font-family="Arial,sans-serif" font-weight="800" font-size="14" fill="#232f3e">amazon</text><text x="6" y="34" font-family="Arial,sans-serif" font-weight="700" font-size="11" fill="#ff9900">aws</text><path d="M80 28c8 2 16 1 22-3" stroke="#ff9900" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M98 25l4-3-1 5" fill="#ff9900"/></svg>`),
  },
  {
    name: "Google Cloud",
    logo: svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 40"><rect width="44" height="40" fill="white"/><path d="M22 8l10 17H12z" fill="#4285f4"/><path d="M12 25l-7 11h14z" fill="#34a853"/><path d="M32 25l7 11H25z" fill="#ea4335"/><circle cx="22" cy="22" r="4.5" fill="#fbbc05"/><circle cx="22" cy="22" r="2" fill="white"/></svg>`),
  },
  {
    name: "Oracle",
    logo: svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 32"><rect width="120" height="32" fill="white"/><text x="4" y="24" font-family="Arial,sans-serif" font-weight="800" font-size="22" fill="#c74634" letter-spacing="-0.5">ORACLE</text></svg>`),
  },
  {
    name: "HP",
    logo: svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" fill="white"/><circle cx="20" cy="20" r="16" fill="#0096d6"/><text x="20" y="26" text-anchor="middle" font-family="Arial,sans-serif" font-weight="800" font-size="15" fill="white">hp</text></svg>`),
  },
  {
    name: "Cisco",
    logo: svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 36"><rect width="100" height="36" fill="white"/><g transform="translate(10,4)"><rect x="0" y="18" width="3" height="10" rx="1.5" fill="#049fd9"/><rect x="5" y="12" width="3" height="16" rx="1.5" fill="#049fd9"/><rect x="10" y="6" width="3" height="22" rx="1.5" fill="#049fd9"/><rect x="15" y="14" width="3" height="14" rx="1.5" fill="#049fd9"/><rect x="20" y="4" width="3" height="24" rx="1.5" fill="#049fd9"/><rect x="25" y="10" width="3" height="18" rx="1.5" fill="#049fd9"/><rect x="30" y="2" width="3" height="26" rx="1.5" fill="#049fd9"/><rect x="35" y="8" width="3" height="20" rx="1.5" fill="#049fd9"/></g><text x="52" y="25" font-family="Arial,sans-serif" font-weight="700" font-size="18" fill="#049fd9" letter-spacing="0.5">cisco</text></svg>`),
  },
  {
    name: "Dell",
    logo: svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" fill="white"/><circle cx="20" cy="20" r="16" fill="none" stroke="#007db8" stroke-width="2.2"/><text x="20" y="25" text-anchor="middle" font-family="Arial,sans-serif" font-weight="700" font-size="13" fill="#007db8">DELL</text></svg>`),
  },
  {
    name: "Namecheap",
    logo: svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130 36"><rect width="130" height="36" fill="white"/><path d="M10 8l10 12" stroke="#f15a24" stroke-width="3.5" stroke-linecap="round" fill="none"/><path d="M20 20l10-12" stroke="#f15a24" stroke-width="3.5" stroke-linecap="round" fill="none"/><text x="36" y="24" font-family="Arial,sans-serif" font-weight="600" font-size="15" fill="#555">namecheap</text></svg>`),
  },
  {
    name: "WordPress",
    logo: svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" fill="white"/><circle cx="20" cy="20" r="17" fill="#21759b"/><text x="20" y="27" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="22" fill="white">W</text></svg>`),
  },
  {
    name: "Shopify",
    logo: svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 48"><rect width="44" height="48" fill="white"/><path d="M34 10c-1-4-4-6-8-6s-9 3-12 7c-1 1-2 3-2 5 0 4 3 6 3 6s-2 1-2 4c0 3 3 5 7 6h1c1 0 2 0 2-1 1 0 3-1 4-3 1-1 2-3 2-5 0-2-1-3-2-4 2-1 3-3 3-5 0-1 0-2-1-3z" fill="#96bf48"/><path d="M26 14v8" stroke="white" stroke-width="2.5" stroke-linecap="round"/><path d="M22 18h8" stroke="white" stroke-width="2.5" stroke-linecap="round"/></svg>`),
  },
  {
    name: "Ecwid",
    logo: svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" fill="white"/><circle cx="20" cy="20" r="16" fill="#48b87e"/><text x="20" y="26" text-anchor="middle" font-family="Arial,sans-serif" font-weight="800" font-size="16" fill="white">e</text></svg>`),
  },
  {
    name: "eCitizen",
    logo: svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44"><rect width="44" height="44" rx="4" fill="white"/><rect x="4" y="4" width="36" height="36" rx="4" fill="#1a5276"/><text x="22" y="20" text-anchor="middle" font-family="Arial,sans-serif" font-weight="800" font-size="9" fill="#e74c3c">REPUBLIC</text><text x="22" y="28" text-anchor="middle" font-family="Arial,sans-serif" font-weight="800" font-size="9" fill="#2ecc71">OF KENYA</text><text x="22" y="36" text-anchor="middle" font-family="Arial,sans-serif" font-weight="400" font-size="5" fill="white">HARAMBEE</text></svg>`),
  },
  {
    name: "Microsoft",
    logo: svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" fill="white"/><rect x="4" y="4" width="14" height="14" fill="#f25022"/><rect x="22" y="4" width="14" height="14" fill="#7fba00"/><rect x="4" y="22" width="14" height="14" fill="#00a4ef"/><rect x="22" y="22" width="14" height="14" fill="#ffb900"/></svg>`),
  },
  {
    name: "Apple",
    logo: svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 48"><rect width="40" height="48" fill="white"/><path d="M32 38c-2 2-4 3-6 3-2 0-3-1-5-1s-3 1-5 1c-2 0-4-1-6-3-4-4-7-10-3-16 2-3 5-5 8-5 2 0 4 1 5 1s3-1 5-1c3 0 6 2 8 5-6 4-5 12 1 14l-1 0zM26 4c1-2 2-4 2-6 0 0-2 0-4 2-1 1-2 3-2 5 0 0 0 0 0 0 2 0 3-1 4-1z" fill="#a2aaad"/></svg>`),
  },
  {
    name: "Samsung",
    logo: svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 110 32"><rect width="110" height="32" rx="4" fill="#1428a0"/><text x="55" y="22" text-anchor="middle" font-family="Arial,sans-serif" font-weight="700" font-size="13" fill="white" letter-spacing="3">SAMSUNG</text></svg>`),
  },
  {
    name: "Huawei",
    logo: svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" fill="white"/><circle cx="20" cy="20" r="16" fill="#cf0a2c"/><text x="20" y="25" text-anchor="middle" font-family="Arial,sans-serif" font-weight="800" font-size="11" fill="white">HW</text></svg>`),
  },
  {
    name: "Cloudflare",
    logo: svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" fill="white"/><circle cx="20" cy="20" r="16" fill="#f38020"/><text x="20" y="25" text-anchor="middle" font-family="Arial,sans-serif" font-weight="800" font-size="14" fill="white">CF</text></svg>`),
  },
  {
    name: "Vercel",
    logo: svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 36"><rect width="40" height="36" fill="white"/><path d="M20 2L38 34H2z" fill="#000000"/></svg>`),
  },
];

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
                padding: "0 10px",
              }}
              title={partner.name}
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="max-h-9 max-w-[110px] w-auto h-auto object-contain"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
