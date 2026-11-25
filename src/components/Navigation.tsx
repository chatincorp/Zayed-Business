import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useLocation } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSiteNav } from "@/lib/siteContent";
import YasirZayedLogo from "./YasirZayedLogo";

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  // Menu items come from the admin Navigation panel; bundled defaults are
  // used until a Convex deployment is attached.
  const navLinks = useSiteNav();

  const handleScroll = useCallback(() => {
    const y = window.scrollY;
    setScrolled(y > 50);
    // The header hugs the bottom edge of the announcement bar while the bar is
    // still on screen, then pins to the top once the bar scrolls away.
    document.documentElement.style.setProperty("--yz-scroll-y", `${y}px`);
  }, []);

  useEffect(() => {
    const frame = requestAnimationFrame(handleScroll);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  // Close mobile menu on route change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileOpen(false);
  }, [location]);

  // Mobile drawer: Escape to close + focus trap inside the panel.
  useEffect(() => {
    if (!mobileOpen) return;
    const focusFirst = () => {
      const panel = panelRef.current;
      const first = panel?.querySelector<HTMLElement>(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      first?.focus();
    };
    const t = window.setTimeout(focusFirst, 50);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setMobileOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;
      const focusables = Array.from(
        panel.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (focusables.length === 0) return;
      const firstEl = focusables[0];
      const lastEl = focusables[focusables.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        }
      } else if (document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    };
    // Stop the page behind the drawer from scrolling while it is open.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          top: "max(0px, calc(var(--yz-banner-height, 0px) - var(--yz-scroll-y, 0px)))",
        }}
        className={cn(
          "fixed left-0 right-0 z-50 transition-[background-color,border-color,box-shadow] duration-500",
          scrolled
            ? "bg-navy/95 backdrop-blur-xl shadow-lg shadow-black/10 border-b border-white/5"
            : "bg-transparent"
        )}
      >
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-18 items-center justify-between">
            {/* Logo — gold brand emblem + name lockup */}
            <Link to="/" className="flex items-center gap-3 group">
              <YasirZayedLogo
                variant="icon"
                height={42}
                className="shrink-0 drop-shadow-[0_0_10px_rgba(232,197,106,0.3)] transition-transform duration-300 group-hover:scale-105"
              />
              <div className="flex flex-col">
                <span className="text-white font-bold text-sm tracking-[0.08em] leading-none">
                  YASIR ZAYED
                </span>
                <span className="text-[9px] text-white/50 tracking-[0.18em] uppercase leading-none mt-1">
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
                aria-expanded={mobileOpen}
                aria-controls="mobile-main-menu"
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
          /* Above the cookie notice (z-[90]): the notice is pinned to the
             bottom of the viewport and would otherwise cover the drawer's
             Sign In / Get Started buttons on phones. */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] lg:hidden"
          >
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              ref={panelRef}
              id="mobile-main-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Main menu"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-[300px] max-h-[100dvh] bg-navy-dark/98 backdrop-blur-xl border-l border-white/10 overflow-y-auto overscroll-contain"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <YasirZayedLogo variant="icon" height={36} />
                  <button
                    onClick={() => setMobileOpen(false)}
                    aria-label="Close menu"
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
