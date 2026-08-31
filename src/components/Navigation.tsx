import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", href: "/#hero" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
];



export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 50);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Close mobile menu on route change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileOpen(false);
  }, [location]);

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
                <Link
                  key={link.label}
                  to={link.href}
                  className={cn(
                    "flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors duration-200 rounded-md",
                    scrolled
                      ? "text-white/80 hover:text-white hover:bg-white/5"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* CTA + Mobile Toggle */}
            <div className="flex items-center gap-3">
              <Link
                to="/auth"
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors rounded-lg"
              >
                Sign In
              </Link>
              <Link
                to="/contact"
                className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 bg-electric text-white text-sm font-semibold rounded-lg hover:bg-electric-dark transition-all duration-200 shadow-lg shadow-electric/20 hover:shadow-electric/40"
              >
                Get Started
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
                    <Link
                      key={link.label}
                      to={link.href}
                      className="block px-4 py-3 text-sm font-medium text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-white/10 space-y-3">
                  <Link
                    to="/auth"
                    className="flex items-center justify-center gap-2 w-full px-5 py-3 border border-white/20 text-white/80 text-sm font-medium rounded-lg hover:bg-white/5 transition-all"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/contact"
                    className="flex items-center justify-center gap-2 w-full px-5 py-3 bg-electric text-white text-sm font-semibold rounded-lg hover:bg-electric-dark transition-all duration-200"
                  >
                    Get Started
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
