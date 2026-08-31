import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Check, ArrowRight, Zap, Shield, Crown } from "lucide-react";

const plans = [
  {
    id: "starter",
    name: "Starter",
    tagline: "For businesses taking the first step",
    price: 499,
    period: "month",
    icon: Zap,
    accent: "electric",
    popular: false,
    description: "Perfect for small businesses and startups that need professional guidance to get moving.",
    features: [
      "Monthly strategy consultation (2 sessions)",
      "Email and chat support",
      "Basic market research",
      "Business health assessment",
      "Access to knowledge base",
      "Monthly performance report",
    ],
    cta: "Start with Starter",
  },
  {
    id: "growth",
    name: "Growth",
    tagline: "For ambitious businesses ready to scale",
    price: 1499,
    period: "month",
    icon: Crown,
    accent: "electric",
    popular: true,
    description: "The right mix of hands-on consulting, technology and execution support for growing companies.",
    features: [
      "Everything in Starter, plus:",
      "Weekly strategy sessions",
      "Dedicated account manager",
      "Sales and marketing strategy",
      "CRM setup and optimization",
      "AI workflow recommendations",
      "Security assessment",
      "Priority email and phone support",
      "Quarterly business review",
    ],
    cta: "Start Growing",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tagline: "For organizations that demand the best",
    price: null,
    priceLabel: "Custom",
    period: "",
    icon: Shield,
    accent: "violet-400",
    popular: false,
    description: "Fully tailored consulting, technology and security solutions with senior-level partnership.",
    features: [
      "Everything in Growth, plus:",
      "Senior strategist as your point of contact",
      "Unlimited consulting hours",
      "Full technology implementation",
      "Custom AI development",
      "Enterprise security infrastructure",
      "Dedicated project team",
      "SLA guarantees",
      "Board-level advisory",
      "24/7 premium support",
    ],
    cta: "Contact Us",
  },
];

const addOns = [
  {
    name: "Security Assessment",
    price: "$750",
    description: "Comprehensive on-site security audit with a detailed report and recommendations.",
  },
  {
    name: "AI Chatbot Deployment",
    price: "$2,500",
    description: "Custom-trained chatbot built for your business, installed on your website or messaging platform.",
  },
  {
    name: "Additional Consultation Hours",
    price: "$200/hr",
    description: "Book extra consulting hours beyond your plan allocation whenever you need them.",
  },
  {
    name: "Custom Landing Page",
    price: "$1,500",
    description: "Professionally designed and developed landing page optimized for your campaign.",
  },
];

export default function Pricing() {
  const [annual, setAnnual] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero */}
      <section className="relative pt-32 pb-16 sm:pt-36 sm:pb-20 bg-navy-dark overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern-dark" />
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-electric/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-electric text-xs font-semibold uppercase tracking-[0.25em] mb-4"
          >
            Pricing
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-6"
          >
            Invest in What Matters
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto mb-10"
          >
            Transparent pricing for businesses that value clarity. No hidden fees, no surprises — just a plan that fits your goals.
          </motion.p>

          {/* Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="inline-flex p-1 rounded-xl bg-white/5 border border-white/10"
          >
            <button
              onClick={() => setAnnual(false)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                !annual ? "bg-electric text-white" : "text-white/50 hover:text-white/80"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                annual ? "bg-electric text-white" : "text-white/50 hover:text-white/80"
              }`}
            >
              Annual
              <span className="ml-1.5 text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full font-bold">
                Save 20%
              </span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* Plans */}
      <section className="py-16 sm:py-24 -mt-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {plans.map((plan, i) => {
              const Icon = plan.icon;
              const displayPrice = plan.price === null
                ? "Custom"
                : annual
                ? `$${Math.round(plan.price * 0.8).toLocaleString()}`
                : `$${plan.price.toLocaleString()}`;

              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                  className={`relative rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 ${
                    plan.popular
                      ? "bg-card border-2 border-electric shadow-xl shadow-electric/10 ring-1 ring-electric/10"
                      : "bg-card border border-border hover:border-border hover:shadow-lg"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <span className="px-4 py-1 bg-electric text-white text-xs font-bold rounded-full uppercase tracking-wider">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="mb-6">
                    <div className={`w-11 h-11 rounded-xl ${
                      plan.popular ? "bg-electric/10" : "bg-muted"
                    } flex items-center justify-center mb-4`}>
                      <Icon className={`w-5 h-5 ${plan.popular ? "text-electric" : "text-muted-foreground"}`} />
                    </div>
                    <h3 className="font-display text-xl font-bold text-foreground">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{plan.tagline}</p>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-foreground">{displayPrice}</span>
                      {plan.period && (
                        <span className="text-muted-foreground text-sm">/{plan.period}</span>
                      )}
                    </div>
                    {annual && plan.price && (
                      <p className="text-xs text-emerald-600 font-medium mt-1">
                        Billed ${Math.round(plan.price * 0.8 * 12).toLocaleString()}/year
                      </p>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                    {plan.description}
                  </p>

                  <Link
                    to={plan.id === "enterprise" ? "/contact" : "/contact"}
                    className={`block w-full text-center py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                      plan.popular
                        ? "bg-electric text-white hover:bg-electric-dark shadow-lg shadow-electric/20"
                        : "bg-foreground text-primary-foreground hover:opacity-90"
                    }`}
                  >
                    {plan.cta}
                  </Link>

                  <ul className="mt-8 space-y-3">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-3">
                        <Check className={`w-4 h-4 mt-0.5 shrink-0 ${
                          plan.popular ? "text-electric" : "text-emerald-500"
                        }`} />
                        <span className="text-sm text-foreground/80">{f}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Add-ons */}
      <section className="py-16 sm:py-24 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-3xl sm:text-4xl font-bold text-foreground"
            >
              Add-On Services
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-3 text-muted-foreground text-lg max-w-xl mx-auto"
            >
              Enhance any plan with specialized services whenever you need them.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {addOns.map((addon, i) => (
              <motion.div
                key={addon.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="p-6 rounded-2xl bg-card border border-border/60 hover:border-border hover:shadow-md transition-all duration-300"
              >
                <p className="text-2xl font-bold text-foreground mb-1">{addon.price}</p>
                <h3 className="font-semibold text-foreground text-sm mb-2">{addon.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{addon.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold text-foreground text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "Can I switch plans at any time?",
                a: "Absolutely. You can upgrade, downgrade or cancel your plan at any time. Changes take effect at the start of your next billing cycle.",
              },
              {
                q: "Is there a free trial?",
                a: "We offer a free initial consultation for all new clients so you can experience our approach before committing to a plan.",
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit cards, bank transfers and mobile payments. Enterprise clients can arrange custom invoicing.",
              },
              {
                q: "Do you offer refunds?",
                a: "If you're not satisfied within the first 14 days, we'll issue a full refund — no questions asked.",
              },
              {
                q: "Can I add team members to my account?",
                a: "Yes. Growth and Enterprise plans support multiple team members. Contact us for team pricing.",
              },
            ].map((faq) => (
              <div key={faq.q} className="p-5 rounded-xl bg-muted/50 border border-border/50">
                <h3 className="font-semibold text-foreground text-sm mb-2">{faq.q}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 bg-navy-dark">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to choose your plan?
          </h2>
          <p className="text-white/50 text-lg mb-8">
            Book a free consultation and we'll help you find the right fit for your business.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-electric text-white font-semibold rounded-lg hover:bg-electric-dark transition-all shadow-xl shadow-electric/25"
            >
              Book a Free Consultation
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 px-8 py-4 border border-white/20 text-white/80 font-medium rounded-lg hover:bg-white/5 hover:border-white/30 transition-all"
            >
              Browse All Services
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
