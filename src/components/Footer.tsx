import { Link } from "react-router";
import { Mail, Phone, ArrowUpRight } from "lucide-react";

const footerNav = {
  Company: [
    { label: "About Us", href: "/#hero" },
    { label: "Services", href: "/services" },
    { label: "Pricing", href: "/pricing" },
    { label: "How We Work", href: "/#process" },
    { label: "Contact", href: "/contact" },
  ],
  Services: [
    { label: "Business Development", href: "/services/strategic-business-planning" },
    { label: "Sales Strategy", href: "/services/sales-strategy-development" },
    { label: "Marketing Strategy", href: "/services/marketing-strategy-planning" },
    { label: "Security Solutions", href: "/services/cctv-surveillance-systems" },
    { label: "AI Integration", href: "/services/ai-system-integration" },
  ],
  Technology: [
    { label: "Web Development", href: "/services/custom-corporate-websites" },
    { label: "WordPress Development", href: "/services/custom-wordpress-themes" },
    { label: "AI Chatbots", href: "/services/custom-ai-chatbots" },
    { label: "Workflow Automation", href: "/services/workflow-automation" },
  ],
  Resources: [
    { label: "Pricing", href: "/pricing" },
    { label: "Case Studies", href: "/#case-studies" },
    { label: "Zayed Tabloid", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Partner With Us", href: "/contact" },
  ],
};

export default function Footer() {
  return (
    <footer className="relative bg-navy-dark border-t border-white/5">
      <div className="absolute inset-0 bg-grid-pattern-dark opacity-30" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main footer */}
        <div className="py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Link to="/" className="inline-flex items-center gap-3 mb-5 group">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-electric to-electric-dark flex items-center justify-center">
                <span className="text-white font-bold text-sm">YZ</span>
              </div>
              <div>
                <span className="text-white font-bold text-base tracking-tight block leading-none">
                  YASIR ZAYED
                </span>
                <span className="text-[10px] text-metallic/60 tracking-[0.12em] uppercase leading-none mt-0.5 block">
                  Business • Security • Technology
                </span>
              </div>
            </Link>
            <p className="text-white/40 text-sm leading-relaxed mb-6 max-w-sm">
              Building stronger businesses, smarter systems and secure futures. One partnership at a time.
            </p>
            <p className="text-white/30 text-xs leading-relaxed max-w-sm mb-6">
              From business strategy and sales growth to security infrastructure, digital experiences and artificial intelligence — we help organizations build stronger foundations for sustainable growth.
            </p>

            {/* Contact */}
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

          {/* Navigation columns */}
          {Object.entries(footerNav).map(([title, links]) => (
            <div key={title} className="lg:col-span-2">
              <h4 className="text-white text-xs font-semibold uppercase tracking-widest mb-4">
                {title}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
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

          {/* Contact CTA column */}
          <div className="lg:col-span-2">
            <h4 className="text-white text-xs font-semibold uppercase tracking-widest mb-4">
              Get in Touch
            </h4>
            <p className="text-white/40 text-sm leading-relaxed mb-4">
              Ready to grow your business? Let's start a conversation.
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

        {/* Bottom bar */}
        <div className="py-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs">
            © {new Date().getFullYear()} Yasir Zayed. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-white/30 hover:text-white/50 text-xs transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-white/30 hover:text-white/50 text-xs transition-colors">
              Terms & Conditions
            </a>
            <a href="#" className="text-white/30 hover:text-white/50 text-xs transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
