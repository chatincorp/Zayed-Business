import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router";
import {
  ArrowRight,
  ArrowUpRight,
  ClipboardList,
  ShoppingCart,
  Truck,
  Store,
  Tag,
} from "lucide-react";

const fmcgServices = [
  {
    slug: "fmcg-order-booking",
    title: "Order Booking",
    icon: ClipboardList,
    blurb:
      "Structured call cycles, clean order capture, credit checks and confirmed dispatch.",
  },
  {
    slug: "fmcg-sales",
    title: "Sales",
    icon: ShoppingCart,
    blurb:
      "Route-to-market plans, distributor coverage and outlet-level sales execution.",
  },
  {
    slug: "fmcg-supplier-sourcing",
    title: "Supplier Sourcing",
    icon: Truck,
    blurb:
      "Vetted manufacturers, benchmarked landed cost and dependable lead times.",
  },
  {
    slug: "fmcg-merchandizing",
    title: "Merchandizing",
    icon: Store,
    blurb:
      "Planograms, shelf share and display standards that lift sell-through.",
  },
  {
    slug: "fmcg-product-promotion",
    title: "Product Promotion",
    icon: Tag,
    blurb:
      "Trade offers and consumer activations that move stock and build demand.",
  },
];

const outcomes = [
  "Distributor coverage",
  "Outlet-level execution",
  "Sell-out visibility",
];

export default function FmcgSection() {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section
      id="fmcg"
      aria-labelledby="fmcg-heading"
      className="relative overflow-hidden bg-[#0a0c10] py-20 sm:py-28"
    >
      <div className="absolute inset-0 bg-grid-pattern-dark opacity-40" />
      <div className="pointer-events-none absolute -top-40 right-0 h-[520px] w-[520px] rounded-full bg-amber-400/10 blur-[150px]" />
      <div className="pointer-events-none absolute bottom-0 left-1/4 h-[320px] w-[320px] rounded-full bg-electric/5 blur-[120px]" />

      <div
        ref={ref}
        className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        {/* Header */}
        <div className="mb-12 grid items-end gap-8 lg:grid-cols-[1.15fr,0.85fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-10 bg-gradient-to-r from-amber-300 to-transparent" />
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-300">
                FMCG Services
              </p>
            </div>
            <h2
              id="fmcg-heading"
              className="font-display text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl"
            >
              FMCG, handled{" "}
              <span className="bg-gradient-to-r from-amber-200 via-[#E8C56A] to-amber-500 bg-clip-text text-transparent">
                end to end
              </span>
              .
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/50 sm:text-lg">
              Fast-moving consumer goods move on execution. One accountable team
              covers the whole chain — book the order, source the supply, win the
              shelf and promote the product — from depot to point of purchase.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="rounded-2xl border border-amber-300/15 bg-amber-300/[0.04] p-5"
          >
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-300/80">
              Built for
            </p>
            <ul className="space-y-2">
              {outcomes.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2.5 text-sm text-white/70"
                >
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-300" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-4 border-t border-white/10 pt-3 text-[11px] leading-relaxed text-white/35">
              Nairobi-based · Kenya &amp; East Africa · Distributors, retailers
              and brand owners
            </p>
          </motion.div>
        </div>

        {/* Service cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {fmcgServices.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.45, delay: 0.2 + index * 0.07 }}
              >
                <Link
                  to={`/services/${service.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-amber-300/40 hover:bg-white/[0.05]"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-300/10">
                      <Icon className="h-5 w-5 text-amber-300" />
                    </span>
                    <span className="font-mono text-[10px] text-white/20">
                      0{index + 1}
                    </span>
                  </div>
                  <h3 className="font-display text-base font-bold text-white group-hover:text-amber-200 transition-colors">
                    {service.title}
                  </h3>
                  <p className="mt-2 flex-1 text-[13px] leading-relaxed text-white/40">
                    {service.blurb}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-[11px] font-semibold text-amber-300/80 opacity-0 transition-all group-hover:opacity-100">
                    View service
                    <ArrowUpRight className="h-3 w-3" />
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.55 }}
          className="mt-10 flex flex-col items-start justify-between gap-5 border-t border-white/10 pt-8 sm:flex-row sm:items-center"
        >
          <p className="max-w-xl text-sm text-white/40">
            Selling FMCG in Kenya or expanding across East Africa? Start with a
            free 30-minute route-to-market review.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-300 to-[#E8C56A] px-5 py-2.5 text-sm font-semibold text-[#1a1305] transition-all hover:brightness-105"
            >
              Explore FMCG services
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-5 py-2.5 text-sm font-medium text-white/75 transition-colors hover:border-white/30 hover:text-white"
            >
              Talk to the FMCG desk
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
