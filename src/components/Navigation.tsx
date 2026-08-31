import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", href: "/#hero" },
  {
    label: "Services",
    href: "/#services",
    children: [
      { label: "Business Development", href: "/#services" },
      { label: "Sales Services", href: "/#sales" },
      { label: "Marketing Services", href: "/#marketing" },
      { label: "Promotional Services", href: "/#promotional" },
      { label: "Security Solutions", href: "/#security" },
      { label: "Web Development", href: "/#technology" },
      { label: "AI & Automation", href: "/#ai" },
    ],
  },
  { label: "Security", href: "/#security" },
  { label: "Technology", href: "/#technology" },
  { label: "AI Solutions", href: "/#ai" },
  { label: "Process", href: "/#process" },
  { label: "Contact", href: "/contact" },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 50);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const scrollToSection = (href: string) => {
    if (href.startsWith("/#")) {
      const id = href.slice(2);
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled
            ? "bg-navy/95 backdrop-blur-xl shadow-lg shadow-black/10 border-b border-white/5"
            : "bg-transparent"
        )}
      >
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-18 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-electric to-electric-dark flex items-center justify-center">
                  <span className="text-white font-bold text-sm tracking-tight">YZ</span>
                </div>
                <div className="absolute inset-0 rounded-lg bg-electric/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="flex flex-col">
                <span className="text-white font-bold text-base tracking-tight leading-none">
                  YASIR ZAYED
                </span>
                <span className="text-[10px] text-metallic/70 tracking-[0.15em] uppercase leading-none mt-0.5">
                  Business • Security • Technology
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => link.children && setActiveDropdown(link.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  {link.href.startsWith("/#") ? (
                    <button
                      onClick={() => scrollToSection(link.href)}
                      className={cn(
                        "flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors duration-200 rounded-md",
                        scrolled
                          ? "text-white/80 hover:text-white hover:bg-white/5"
                          : "text-white/80 hover:text-white hover:bg-white/10"
                      )}
                    >
                      {link.label}
                      {link.children && <ChevronDown className="w-3.5 h-3.5 opacity-50" />}
                    </button>
                  ) : (
                    <Link
                      to={link.href}
                      className={cn(
                        "flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors duration-200 rounded-md",
                        scrolled
                          ? "text-white/80 hover:text-white hover:bg-white/5"
                          : "text-white/80 hover:text-white hover:bg-white/10"
                      )}
                    >
                      {link.label}
                      {link.children && <ChevronDown className="w-3.5 h-3.5 opacity-50" />}
                    </Link>
                  )}

                  {/* Dropdown */}
                  <AnimatePresence>
                    {link.children && activeDropdown === link.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-1 w-64 py-2 bg-navy-light/95 backdrop-blur-xl rounded-xl border border-white/10 shadow-2xl shadow-black/30"
                      >
                        {link.children.map((child) => (
                          <button
                            key={child.label}
                            onClick={() => scrollToSection(child.href)}
                            className="block w-full text-left px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                          >
                            {child.label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* CTA + Mobile Toggle */}
            <div className="flex items-center gap-3">
              <Link
                to="/contact"
                className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 bg-electric text-white text-sm font-semibold rounded-lg hover:bg-electric-dark transition-all duration-200 shadow-lg shadow-electric/20 hover:shadow-electric/40"
              >
                Book a Consultation
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-[300px] bg-navy-dark/98 backdrop-blur-xl border-l border-white/10 overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <span className="text-white font-bold text-sm tracking-tight">YASIR ZAYED</span>
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-1">
                  {navLinks.map((link) => (
                    <div key={link.label}>
                      {link.href.startsWith("/#") ? (
                        <button
                          onClick={() => {
                            scrollToSection(link.href);
                            setMobileOpen(false);
                          }}
                          className="block w-full text-left px-4 py-3 text-sm font-medium text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                        >
                          {link.label}
                        </button>
                      ) : (
                        <Link
                          to={link.href}
                          className="block px-4 py-3 text-sm font-medium text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                        >
                          {link.label}
                        </Link>
                      )}
                      {link.children && (
                        <div className="ml-4 mt-1 space-y-0.5">
                          {link.children.map((child) => (
                            <button
                              key={child.label}
                              onClick={() => {
                                scrollToSection(child.href);
                                setMobileOpen(false);
                              }}
                              className="block w-full text-left px-4 py-2 text-xs text-white/50 hover:text-white/80 hover:bg-white/5 rounded-lg transition-colors"
                            >
                              {child.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-white/10">
                  <Link
                    to="/contact"
                    className="flex items-center justify-center gap-2 w-full px-5 py-3 bg-electric text-white text-sm font-semibold rounded-lg hover:bg-electric-dark transition-all duration-200"
                  >
                    Book a Consultation
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
