import { useState } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FloatingWidgets from "@/components/FloatingWidgets";
import PaystackCheckout from "@/components/PaystackCheckout";
import { useSEO } from "@/lib/seo";
import { useSitePlans } from "@/lib/siteContent";
import { usdToKes, formatUsd, formatKes } from "@/lib/currency";
import { Check, ArrowRight, Zap, Crown, Shield } from "lucide-react";

const PLAN_ICONS = [Zap, Crown, Shield];

export default function Checkout() {
  useSEO({
    title: "Checkout — Yasir Zayed",
    description:
      "Complete your Yasir Zayed subscription securely. Plans are billed in KES and all prices are exclusive of tax.",
    path: "/checkout",
  });

  const plans = useSitePlans();
  const [annual, setAnnual] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = plans.find((p) => (p._id ?? p.name) === selectedId) ?? plans[0];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-10">
            <p className="text-electric text-xs font-semibold uppercase tracking-[0.25em] mb-3">Checkout</p>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
              Complete your subscription
            </h1>
            <p className="mt-3 text-muted-foreground">
              Choose a plan and pay securely. All prices are not inclusive of Tax.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-10">
            <div className="inline-flex p-1 rounded-xl bg-muted border border-border">
              <button
                onClick={() => setAnnual(false)}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${!annual ? "bg-electric text-white" : "text-muted-foreground hover:text-foreground"}`}
              >
                Monthly
              </button>
              <button
                onClick={() => setAnnual(true)}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${annual ? "bg-electric text-white" : "text-muted-foreground hover:text-foreground"}`}
              >
                Annual <span className="ml-1 text-[10px] text-emerald-500 font-bold">Save 20%</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
            {plans.map((plan, i) => {
              const Icon = PLAN_ICONS[i % PLAN_ICONS.length];
              const key = plan._id ?? plan.name;
              const active = key === (selected?._id ?? selected?.name);
              const usd = plan.priceUsd != null ? (annual ? plan.priceUsd * 0.8 : plan.priceUsd) : null;

              return (
                <motion.button
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  onClick={() => setSelectedId(key)}
                  className={`text-left rounded-2xl p-6 border transition-all ${
                    active
                      ? "bg-card border-electric ring-1 ring-electric/20 shadow-lg shadow-electric/5"
                      : "bg-card border-border hover:border-border/80"
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-electric/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-electric" />
                    </div>
                    {plan.popular && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-electric/10 text-electric font-bold uppercase tracking-wider">
                        Popular
                      </span>
                    )}
                  </div>
                  <h3 className="font-display text-lg font-bold text-foreground">{plan.name}</h3>
                  {plan.tagline && <p className="text-xs text-muted-foreground mt-1 mb-3">{plan.tagline}</p>}
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-3xl font-bold text-foreground">
                      {usd == null ? plan.priceLabel ?? "Custom" : formatUsd(usd)}
                    </span>
                    {usd != null && plan.period && (
                      <span className="text-muted-foreground text-sm">/{plan.period}</span>
                    )}
                  </div>
                  {usd != null && (
                    <p className="text-xs text-muted-foreground mb-4">{formatKes(usdToKes(usd))} equivalent</p>
                  )}
                  <ul className="space-y-2">
                    {plan.features.slice(0, 4).map((f) => (
                      <li key={f} className="flex items-start gap-2 text-xs text-foreground/80">
                        <Check className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                </motion.button>
              );
            })}
          </div>

          {selected && (
            <div className="rounded-2xl bg-card border border-border p-6 sm:p-8">
              <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
                <div>
                  <h2 className="font-display text-xl font-bold text-foreground">
                    {selected.name} plan
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selected.priceUsd == null
                      ? "Custom pricing — talk to our team to activate this plan."
                      : `${formatUsd(annual ? selected.priceUsd * 0.8 : selected.priceUsd)} ${annual ? "billed annually" : "per month"}`}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground max-w-xs text-right">
                  {selected.taxNote}
                </p>
              </div>

              {selected.priceUsd == null ? (
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-electric text-white text-sm font-semibold rounded-lg hover:bg-electric-dark transition-colors"
                >
                  Contact sales <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <PaystackCheckout
                  planName={`${selected.name} Plan`}
                  amount={Math.round(usdToKes(annual ? selected.priceUsd * 12 * 0.8 : selected.priceUsd))}
                  description={`${selected.name} plan — ${annual ? "Annual" : "Monthly"} billing (tax exclusive)`}
                  variant="primary"
                />
              )}
            </div>
          )}

          <p className="mt-6 text-center text-xs text-muted-foreground">
            All prices are not inclusive of Tax. Applicable taxes are calculated at checkout based on your location.
          </p>
        </div>
      </main>

      <Footer />
      <FloatingWidgets />
    </div>
  );
}
