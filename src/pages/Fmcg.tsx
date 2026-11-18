import { Link } from "react-router";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FloatingWidgets from "@/components/FloatingWidgets";
import FmcgEnquirySection from "@/components/fmcg/FmcgLeadForm";
import { useSEO } from "@/lib/seo";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  ClipboardList,
  FileCheck2,
  Lock,
  ShieldCheck,
  Store,
  Truck,
  Users,
  PackageCheck,
} from "lucide-react";
import {
  FMCG_CATEGORIES,
  FMCG_PROCESS,
  FMCG_SERVICES,
} from "@/data/fmcg";

const faqs = [
  {
    q: "What does the FMCG desk actually manage?",
    a: "Order booking, sales and route-to-market, supplier sourcing, merchandizing and product promotion. You can engage one service or the full chain, and every engagement has a named lead with agreed KPIs.",
  },
  {
    q: "Can I place a wholesale order without an account?",
    a: "Yes. Use the wholesale booking page to build a bulk order and submit it for review. No account and no online payment are required. The order desk confirms stock, payment terms and delivery before anything is dispatched.",
  },
  {
    q: "Who can register as a supplier?",
    a: "Registered manufacturers, importers, distributors and aggregators with valid business documentation. Registration requires your ID, business registration, director IDs or CR12 for companies, county business permit and a storefront image.",
  },
  {
    q: "Why is the supplier service category locked?",
    a: "The category you choose at registration determines how your products are listed, merchandised and matched to demand. It is fixed after submission to keep supplier records and buyer expectations consistent. Choose carefully and contact the desk if your business genuinely spans categories.",
  },
  {
    q: "Do you deliver outside Nairobi?",
    a: "Yes. Wholesale fulfilment covers major Kenyan counties through our depot and supplier network. Delivery timing and cost are confirmed by the order desk after reviewing your booking.",
  },
];

export default function Fmcg() {
  useSEO({
    title: "FMCG Services in Kenya — Order Booking, Sales, Sourcing & Distribution",
    description:
      "End-to-end FMCG services in Kenya: order booking, route-to-market sales, supplier sourcing, merchandizing and product promotion. Book wholesale volumes or register as a supplier with Yasir Zayed.",
    path: "/fmcg",
    keywords:
      "FMCG services Kenya, FMCG distribution Nairobi, wholesale order booking, FMCG supplier sourcing, merchandizing Kenya, product promotion, FMCG supplier registration",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "Service",
        name: "FMCG Distribution & Trade Services",
        serviceType: "FMCG services",
        description:
          "Order booking, sales, supplier sourcing, merchandizing and product promotion for fast-moving consumer goods in Kenya and East Africa.",
        url: "https://yasirzayed.com/fmcg",
        provider: {
          "@type": "Organization",
          "@id": "https://yasirzayed.com/#organization",
          name: "Yasir Zayed",
          url: "https://yasirzayed.com/",
          telephone: "+254-114-712-989",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Nairobi",
            addressCountry: "KE",
          },
        },
        areaServed: ["Kenya", "East Africa"],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "FMCG services",
          itemListElement: FMCG_SERVICES.map((service) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: service.title,
              url: `https://yasirzayed.com/services/${service.slug}`,
            },
          })),
        },
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: faq.a },
        })),
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://yasirzayed.com/" },
          { "@type": "ListItem", position: 2, name: "FMCG", item: "https://yasirzayed.com/fmcg" },
        ],
      },
    ],
  });

  return (
    <div className="min-h-screen bg-[#faf7f0]">
      <Navigation />

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#080b10] pb-16 pt-32 sm:pb-20 sm:pt-36">
        <div className="absolute inset-0 bg-grid-pattern-dark opacity-50" />
        <div className="pointer-events-none absolute -top-32 right-0 h-[560px] w-[560px] rounded-full bg-amber-400/12 blur-[150px]" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-electric/10 blur-[130px]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="mb-10 flex items-center gap-2 text-xs text-white/35" aria-label="Breadcrumb">
            <Link to="/" className="transition-colors hover:text-white/70">Home</Link>
            <span>/</span>
            <span className="text-white/60">FMCG</span>
          </nav>

          <div className="grid items-center gap-12 lg:grid-cols-[1.15fr,0.85fr]">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-300/25 bg-amber-300/[0.07] px-3.5 py-1.5"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
                <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-amber-200">
                  FMCG Distribution & Trade
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 }}
                className="font-display text-4xl font-bold leading-[1.05] text-white sm:text-5xl md:text-6xl"
              >
                FMCG growth,
                <br />
                <span className="bg-gradient-to-r from-amber-200 via-[#E8C56A] to-amber-500 bg-clip-text text-transparent">
                  from depot to shelf.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.16 }}
                className="mt-6 max-w-xl text-base leading-relaxed text-white/55 sm:text-lg"
              >
                One accountable team for order booking, sales, supplier sourcing,
                merchandizing and promotion. We move volume, protect margin and put
                your products where shoppers can see them.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.24 }}
                className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
              >
                <Link
                  to="/wholesale"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-amber-300 to-[#E8C56A] px-6 py-3.5 text-sm font-semibold text-[#1a1305] shadow-lg shadow-amber-400/10 transition-all hover:brightness-105"
                >
                  <PackageCheck className="h-4 w-4" />
                  Book a wholesale order
                </Link>
                <Link
                  to="/supplier/register"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 px-6 py-3.5 text-sm font-medium text-white/80 transition-colors hover:border-white/30 hover:bg-white/5 hover:text-white"
                >
                  <Store className="h-4 w-4" />
                  Register as a supplier
                </Link>
                <a
                  href="#fmcg-enquiry"
                  className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3.5 text-sm font-medium text-white/50 transition-colors hover:text-white"
                >
                  Talk to the desk <ArrowRight className="h-4 w-4" />
                </a>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="mt-6 text-[11px] uppercase tracking-[0.18em] text-white/25"
              >
                Nairobi-based · Kenya & East Africa · Manufacturers, distributors, wholesalers, retailers
              </motion.p>
            </div>

            {/* Stats panel */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22 }}
              className="rounded-2xl border border-white/10 bg-white/[0.035] p-6 backdrop-blur-sm sm:p-7"
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-300/80">
                The desk at a glance
              </p>
              <div className="mt-5 grid grid-cols-2 gap-5">
                {[
                  { value: "5", label: "Integrated service lines" },
                  { value: "47", label: "County delivery reach" },
                  { value: "1", label: "Accountable FMCG lead" },
                  { value: "24h", label: "Enquiry response target" },
                ].map((stat) => (
                  <div key={stat.label} className="border-t border-white/10 pt-4">
                    <p className="font-display text-3xl font-bold text-white">{stat.value}</p>
                    <p className="mt-1 text-[11px] leading-snug text-white/40">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-xl border border-amber-300/15 bg-amber-300/[0.05] p-4">
                <p className="flex items-center gap-2 text-xs font-semibold text-amber-200">
                  <ShieldCheck className="h-4 w-4" />
                  Free 30-minute route-to-market review
                </p>
                <p className="mt-1.5 text-[11px] leading-relaxed text-white/40">
                  A practical read on coverage, pricing and quick wins — no obligation.
                </p>
                <a
                  href="#fmcg-enquiry"
                  className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold text-amber-200 hover:underline"
                >
                  Request the review <ArrowUpRight className="h-3 w-3" />
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Category strip */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-8 gap-y-3 px-4 py-5 sm:px-6 lg:px-8">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            Categories we move
          </span>
          {FMCG_CATEGORIES.map((category) => (
            <span key={category} className="text-xs font-medium text-slate-600">
              {category}
            </span>
          ))}
        </div>
      </div>

      {/* Services */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-amber-700">
              What we do
            </p>
            <h2 className="font-display text-3xl font-bold leading-tight text-navy sm:text-4xl md:text-5xl">
              Five services. One accountable team.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600">
              Every FMCG service opens into its own detailed page with scope,
              deliverables, process and pricing guidance — so you can engage exactly
              what you need.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {FMCG_SERVICES.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.article
                  key={service.slug}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, delay: (index % 3) * 0.07 }}
                  className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-amber-300 hover:shadow-xl hover:shadow-amber-900/5"
                >
                  <div className="mb-5 flex items-center justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="font-mono text-[10px] text-slate-300">0{index + 1}</span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-navy">{service.title}</h3>
                  <p className="mt-2.5 flex-1 text-sm leading-relaxed text-slate-500">
                    {service.summary}
                  </p>
                  <ul className="mt-5 space-y-2 border-t border-slate-100 pt-4">
                    {service.deliverables.slice(0, 3).map((item) => (
                      <li key={item} className="flex items-start gap-2 text-xs text-slate-600">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={`/services/${service.slug}`}
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-navy transition-colors group-hover:text-amber-700"
                  >
                    Explore {service.short}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </motion.article>
              );
            })}

            {/* Consultation card */}
            <div className="flex flex-col justify-between rounded-2xl bg-navy p-6 text-white">
              <div>
                <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-amber-300">
                  <Users className="h-5 w-5" />
                </span>
                <h3 className="font-display text-xl font-bold">Not sure where to start?</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-white/50">
                  Most FMCG problems show up in more than one place. We will map the
                  chain, show you where volume is leaking and recommend the smallest
                  engagement that fixes it.
                </p>
              </div>
              <a
                href="#fmcg-enquiry"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-amber-300 hover:underline"
              >
                Book a route-to-market review <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Wholesale */}
      <section className="relative overflow-hidden bg-navy-dark py-20 sm:py-24">
        <div className="absolute inset-0 bg-grid-pattern-dark opacity-40" />
        <div className="pointer-events-none absolute -right-20 top-0 h-[420px] w-[420px] rounded-full bg-amber-400/10 blur-[140px]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr,0.9fr] lg:gap-16">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-amber-300">
                Wholesale order booking
              </p>
              <h2 className="font-display text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">
                Buy bulk. Book in minutes.
                <span className="block text-white/35">We review every order.</span>
              </h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-white/50">
                Build a basket from live supplier listings with clear MOQs, case
                pricing and payment terms. The page books your order — it never
                charges you. Our order desk reviews stock, terms and delivery, then
                confirms.
              </p>

              <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                {[
                  "No account needed to book",
                  "No online payment collected",
                  "Order desk review before dispatch",
                  "Reference number for every booking",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-white/60">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
                    {item}
                  </li>
                ))}
              </ul>

              <Link
                to="/wholesale"
                className="mt-8 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-300 to-[#E8C56A] px-6 py-3.5 text-sm font-semibold text-[#1a1305] transition-all hover:brightness-105"
              >
                Start a wholesale booking
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm sm:p-7">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">
                How booking works
              </p>
              <ol className="mt-5 space-y-4">
                {[
                  { title: "Choose products", text: "Filter by category and add quantities that meet each supplier's MOQ." },
                  { title: "Define delivery", text: "Give us the business, county and delivery address for the drop." },
                  { title: "Order desk review", text: "We confirm stock, payment terms and logistics — then send a reference." },
                ].map((item, index) => (
                  <li key={item.title} className="flex gap-3.5">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-300/10 font-mono text-[11px] font-bold text-amber-300">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-white">{item.title}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-white/40">{item.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="mt-6 flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-3">
                <Lock className="h-3.5 w-3.5 shrink-0 text-amber-300" />
                <p className="text-[11px] leading-snug text-white/40">
                  No card details are requested. Payment is agreed with the order desk.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Suppliers */}
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.95fr,1.05fr] lg:gap-16">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-amber-700">
                For suppliers
              </p>
              <h2 className="font-display text-3xl font-bold leading-tight text-navy sm:text-4xl">
                Put your products in front of real wholesale demand.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                We onboard manufacturers, importers and distributors into a managed
                FMCG supply base. Registration is document-led and reviewed by our
                team before your products go live.
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {[
                  { icon: FileCheck2, label: "Directors' ID copies" },
                  { icon: FileCheck2, label: "CR12 for companies" },
                  { icon: FileCheck2, label: "County business permit" },
                  { icon: Store, label: "Business storefront image" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 rounded-xl border border-slate-200 bg-[#fafbfc] px-4 py-3"
                  >
                    <item.icon className="h-4 w-4 shrink-0 text-amber-600" />
                    <span className="text-xs font-medium text-slate-600">{item.label}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
                <Lock className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
                <p className="text-xs leading-relaxed text-amber-900/75">
                  <span className="font-semibold">Your category is locked at registration.</span>{" "}
                  It determines how products are listed and matched to buyers, so it
                  cannot be changed after submission.
                </p>
              </div>

              <Link
                to="/supplier/register"
                className="mt-8 inline-flex items-center gap-2 rounded-lg bg-navy px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-navy-light"
              >
                Register your business
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-[#faf7f0] p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy text-white">
                  <Truck className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-display text-lg font-bold text-navy">Supplier onboarding path</p>
                  <p className="text-xs text-slate-500">Three steps, document-led review</p>
                </div>
              </div>

              <ol className="mt-6 space-y-5">
                {[
                  {
                    title: "Create your account",
                    text: "Sign in with your official email so your application is tied to a verified account.",
                  },
                  {
                    title: "Submit business documents",
                    text: "Identity, registration, CR12 or director IDs, county permit and storefront image.",
                  },
                  {
                    title: "Get approved and list",
                    text: "Once approved, add products with pricing, MOQ, payment terms and photos from your dashboard.",
                  },
                ].map((step, index) => (
                  <li key={step.title} className="flex gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-300 bg-white font-mono text-xs font-bold text-navy">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-navy">{step.title}</p>
                      <p className="mt-1 text-xs leading-relaxed text-slate-500">{step.text}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="mt-6 flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-3">
                <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />
                <p className="text-[11px] leading-snug text-slate-500">
                  Documents are stored securely and used only for verification.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="border-y border-slate-200 bg-[#faf7f0] py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-amber-700">
              How we work
            </p>
            <h2 className="font-display text-3xl font-bold leading-tight text-navy sm:text-4xl">
              A visible chain, not a black box.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600">
              Every engagement follows the same operating rhythm, so you always know
              what is moving, who owns it and what happens next.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FMCG_PROCESS.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.step} className="relative rounded-2xl border border-slate-200 bg-white p-6">
                  <div className="mb-5 flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy text-white">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="font-mono text-[10px] text-slate-300">{step.step}</span>
                  </div>
                  <h3 className="font-display text-base font-bold text-navy">{step.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-500">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <FmcgEnquirySection />

      {/* FAQ */}
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-amber-700">
              Common questions
            </p>
            <h2 className="font-display text-3xl font-bold text-navy sm:text-4xl">
              The things buyers and suppliers ask first.
            </h2>
          </div>

          <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200">
            {faqs.map((faq) => (
              <details key={faq.q} className="group px-5 py-4 sm:px-6 sm:py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-navy">
                  {faq.q}
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-500">{faq.a}</p>
              </details>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl bg-[#faf7f0] p-6 text-center sm:flex-row sm:text-left">
            <div className="flex items-center gap-3">
              <ClipboardList className="h-5 w-5 shrink-0 text-amber-700" />
              <p className="text-sm text-slate-600">
                Still deciding? Send a short brief and we will reply with a plan.
              </p>
            </div>
            <a
              href="#fmcg-enquiry"
              className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-navy hover:text-amber-700"
            >
              Talk to the FMCG desk <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <Footer />
      <FloatingWidgets />
    </div>
  );
}
