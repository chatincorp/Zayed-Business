import { motion } from "framer-motion";
import { Link } from "react-router";
import { useInView } from "react-intersection-observer";
import { ShoppingBag, Monitor, FileText, BarChart2, ArrowRight } from "lucide-react";

const briefings = [
  {
    slug: "marketplace-listings",
    title: "Marketplace Product Listings",
    tagline: "Found where buyers shop",
    description:
      "Get your products listed and visible on Jumia, Jiji and Kilimall — the places customers are already searching — with correct titles, clear descriptions, strong photos and credible profiles.",
    icon: ShoppingBag,
    color: "text-sky-400",
    bgColor: "bg-sky-400/10",
    link: "/services/marketplace-listings",
  },
  {
    slug: "account-social-media-management",
    title: "Account & Social Media Management",
    tagline: "Stay active, stay on-brand",
    description:
      "Day-to-day management of your social accounts so your brand stays visible, consistent and responding — content planning, posting, replies and a calendar that keeps the voice steady.",
    icon: Monitor,
    color: "text-sky-400",
    bgColor: "bg-sky-400/10",
    link: "/services/account-social-media-management",
  },
  {
    slug: "content-generation",
    title: "Content Generation",
    tagline: "Produced, not promised",
    description:
      "Words, visuals and ideas produced for your channels — social posts, captions, product copy, campaign lines and content that feeds your website, email and ads.",
    icon: FileText,
    color: "text-sky-400",
    bgColor: "bg-sky-400/10",
    link: "/services/content-generation",
  },
  {
    slug: "ad-generation",
    title: "Ad Generation",
    tagline: "Ads that earn attention",
    description:
      "Ads in the formats that work — organic natural ads and AI-generated ads, image or video or both, plus radio-style ads with natural or AI voice-overs.",
    icon: BarChart2,
    color: "text-sky-400",
    bgColor: "bg-sky-400/10",
    link: "/services/ad-generation",
  },
];

export default function AddedServicesBriefing() {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section
      ref={ref}
      className="relative py-20 sm:py-28 bg-navy-dark overflow-hidden"
    >
      <div className="absolute inset-0 bg-grid-pattern-dark" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-sky-400 text-xs font-semibold uppercase tracking-[0.25em] mb-4 block"
          >
            Recently Added
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-4"
          >
            More Ways We Help Your Business Grow
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-white/50 text-lg max-w-2xl mx-auto"
          >
            From marketplace listings and social media management to content generation and ad creation — new services built around where buyers and audiences actually pay attention.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {briefings.map((b, i) => {
            const Icon = b.icon;
            return (
              <motion.div
                key={b.slug}
                initial={{ opacity: 0, y: 25 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.08 }}
                className="group p-6 rounded-2xl bg-card border border-border/60 hover:border-sky-500/30 hover:shadow-xl hover:shadow-black/5 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-11 h-11 rounded-xl ${b.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-5 h-5 ${b.color}`} />
                  </div>
                  <Link
                    to={b.link}
                    className="text-[10px] font-semibold uppercase tracking-wider text-sky-400 group-hover:text-sky-300 transition-colors"
                  >
                    Learn more
                    <ArrowRight className="inline w-3 h-3 ml-0.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                <h3 className="font-display text-lg font-bold text-foreground mb-1 group-hover:text-sky-400 transition-colors">
                  {b.title}
                </h3>
                <p className="text-xs text-muted-foreground font-medium mb-3 italic">
                  {b.tagline}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {b.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 px-6 py-3 bg-sky-400 text-navy-dark font-semibold text-sm rounded-lg hover:bg-sky-300 transition-all shadow-lg shadow-sky-400/20"
          >
            View All Services
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
