import { Link } from "react-router";
import { Mail, Phone, ArrowUpRight } from "lucide-react";
import YasirZayedLogo from "./YasirZayedLogo";
import PartnerLogosCarousel from "./PartnerLogosCarousel";

const footerNav = [
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Services", href: "/services" },
      { label: "FMCG Services", href: "/fmcg" },
      { label: "Pricing", href: "/pricing" },
      { label: "How We Work", href: "/#process" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Business Development", href: "/services/strategic-business-planning" },
      { label: "Sales Strategy", href: "/services/sales-strategy-development" },
      { label: "Marketing Strategy", href: "/services/marketing-strategy-planning" },
      { label: "Security Solutions", href: "/services/cctv-surveillance-systems" },
      { label: "AI Integration", href: "/services/ai-system-integration" },
    ],
  },
  {
    title: "FMCG",
    links: [
      { label: "FMCG Services", href: "/fmcg" },
      { label: "Order Booking", href: "/services/fmcg-order-booking" },
      { label: "FMCG Sales", href: "/services/fmcg-sales" },
      { label: "Supplier Sourcing", href: "/services/fmcg-supplier-sourcing" },
      { label: "Merchandizing", href: "/services/fmcg-merchandizing" },
      { label: "Product Promotion", href: "/services/fmcg-product-promotion" },
      { label: "Wholesale Ordering", href: "/wholesale" },
      { label: "Supplier Registration", href: "/supplier/register" },
    ],
  },
  {
    title: "Technology",
    links: [
      { label: "Web Development", href: "/services/custom-corporate-websites" },
      { label: "WordPress Development", href: "/services/custom-wordpress-themes" },
      { label: "AI Chatbots", href: "/services/custom-ai-chatbots" },
      { label: "Workflow Automation", href: "/services/workflow-automation" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Pricing", href: "/pricing" },
      { label: "Case Studies", href: "/#case-studies" },
      { label: "Zayed Tabloid", href: "/tabloid" },
      { label: "Live Markets", href: "/tabloid/markets" },
      { label: "Live Forex", href: "/tabloid/forex" },
      { label: "Partner With Us", href: "/contact" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative bg-navy-dark border-t border-white/5">
      <div className="absolute inset-0 bg-grid-pattern-dark opacity-30" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-14 flex flex-col lg:flex-row gap-10">
          {/* Brand column */}
          <div className="w-full lg:w-64 shrink-0">
            <Link to="/" className="inline-flex flex-col items-start mb-5 group">
              <YasirZayedLogo variant="full" height={120} />
              <span className="mt-3 font-serif text-lg text-[#E8C56A] tracking-[0.3em]">
                YASIR ZAYED
              </span>
            </Link>
            <p className="text-white/40 text-sm leading-relaxed mb-5">
              Building stronger businesses, smarter systems and secure futures. One partnership at a time.
            </p>
            <p className="text-white/30 text-xs leading-relaxed mb-5">
              From FMCG order booking, sales and merchandizing to business strategy, security infrastructure, digital experiences and artificial intelligence — we help organizations build stronger foundations for sustainable growth.
            </p>

            {/* Contact info */}
            <div className="space-y-2">
              <a href="tel:+254114712989" className="flex items-center gap-2 text-white/50 hover:text-electric text-sm transition-colors">
                <Phone className="w-4 h-4" />
                +254 114 712 989
              </a>
              <a href="tel:+254717227012" className="flex items-center gap-2 text-white/50 hover:text-electric text-sm transition-colors">
                <Phone className="w-4 h-4" />
                +254 717 227 012
              </a>
              <a href="mailto:info@yasirzayed.com" className="flex items-center gap-2 text-white/50 hover:text-electric text-sm transition-colors">
                <Mail className="w-4 h-4" />
                info@yasirzayed.com
              </a>
            </div>
          </div>

          {/* Navigation columns — fill remaining space */}
          <div className="flex-1">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
              {footerNav.map((section) => (
                <div key={section.title}>
                  <h4 className="text-white text-xs font-semibold uppercase tracking-widest mb-4">
                    {section.title}
                  </h4>
                  <ul className="space-y-2.5">
                    {section.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          to={link.href}
                          className="text-white/40 hover:text-electric text-sm transition-colors flex items-center gap-1 group"
                        >
                          {link.label}
                          <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Get in Touch CTA — fixed width on right */}
          <div className="w-full lg:w-48 shrink-0">
            <h4 className="text-white text-xs font-semibold uppercase tracking-widest mb-4">
              Get in Touch
            </h4>
            <p className="text-white/40 text-sm leading-relaxed mb-4">
              Ready to grow your business? Let&apos;s start a conversation.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-electric text-white text-sm font-semibold rounded-lg hover:bg-electric-dark transition-all duration-200 shadow-lg shadow-electric/20"
            >
              Contact Us
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Partner/Supplier Logos Carousel — below nav columns, above legal bar */}
        <div className="border-t border-white/5">
          <PartnerLogosCarousel />
        </div>

        {/* Bottom legal bar */}
        <div className="py-5 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs">
            &copy; {new Date().getFullYear()} Yasir Zayed. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="text-white/30 hover:text-white/50 text-xs transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-white/30 hover:text-white/50 text-xs transition-colors">
              Terms &amp; Conditions
            </Link>
            <Link to="/cookies" className="text-white/30 hover:text-white/50 text-xs transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
