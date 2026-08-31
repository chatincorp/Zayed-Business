import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import {
  Search,
  ArrowRight,
  TrendingUp,
  BarChart3,
  Megaphone,
  Radio,
  Shield,
  Globe,
  Bot,
  Zap,
  Calendar,
} from "lucide-react";

const categories = [
  { id: "all", label: "All Services" },
  { id: "business", label: "Business Development" },
  { id: "sales", label: "Sales" },
  { id: "marketing", label: "Marketing" },
  { id: "promotional", label: "Promotional" },
  { id: "security", label: "Security" },
  { id: "digital", label: "Web Development" },
  { id: "wordpress", label: "WordPress" },
  { id: "ai", label: "AI & Automation" },
];

const services = [
  {
    slug: "strategic-business-planning",
    title: "Strategic Business Planning",
    category: "business",
    tagline: "Chart a clear path forward",
    description: "Comprehensive business strategies aligned with your vision, market conditions and growth objectives.",
    icon: TrendingUp,
    accentColor: "text-electric",
    bgColor: "bg-electric/10",
    price: "From $2,500",
    popular: true,
  },
  {
    slug: "market-research-analysis",
    title: "Market Research & Analysis",
    category: "business",
    tagline: "Data that drives decisions",
    description: "Data-driven market intelligence to identify opportunities, understand competitors and inform strategic decisions.",
    icon: TrendingUp,
    accentColor: "text-electric",
    bgColor: "bg-electric/10",
    price: "From $1,800",
    popular: false,
  },
  {
    slug: "business-model-optimization",
    title: "Business Model Optimization",
    category: "business",
    tagline: "Strengthen your foundation",
    description: "Refine and strengthen your business model for improved profitability, scalability and market relevance.",
    icon: TrendingUp,
    accentColor: "text-electric",
    bgColor: "bg-electric/10",
    price: "From $3,000",
    popular: false,
  },
  {
    slug: "sales-strategy-development",
    title: "Sales Strategy Development",
    category: "sales",
    tagline: "Sell with precision",
    description: "Custom sales strategies aligned with your business goals, market position and competitive landscape.",
    icon: BarChart3,
    accentColor: "text-blue-400",
    bgColor: "bg-blue-400/10",
    price: "From $2,200",
    popular: true,
  },
  {
    slug: "sales-process-optimization",
    title: "Sales Process Optimization",
    category: "sales",
    tagline: "Streamline every deal",
    description: "Streamline and optimize your sales pipeline for maximum efficiency and conversion rates.",
    icon: BarChart3,
    accentColor: "text-blue-400",
    bgColor: "bg-blue-400/10",
    price: "From $1,500",
    popular: false,
  },
  {
    slug: "crm-implementation",
    title: "CRM Implementation & Optimization",
    category: "sales",
    tagline: "Your customers, organized",
    description: "Select, implement and optimize CRM systems that drive sales performance and customer relationships.",
    icon: BarChart3,
    accentColor: "text-blue-400",
    bgColor: "bg-blue-400/10",
    price: "From $3,500",
    popular: false,
  },
  {
    slug: "marketing-strategy-planning",
    title: "Marketing Strategy & Planning",
    category: "marketing",
    tagline: "Make your brand unforgettable",
    description: "Comprehensive marketing strategies aligned with business objectives and market opportunities.",
    icon: Megaphone,
    accentColor: "text-indigo-400",
    bgColor: "bg-indigo-400/10",
    price: "From $2,000",
    popular: true,
  },
  {
    slug: "brand-development-positioning",
    title: "Brand Development & Positioning",
    category: "marketing",
    tagline: "Stand out, stay top of mind",
    description: "Build a distinctive brand identity that resonates with your target audience and market position.",
    icon: Megaphone,
    accentColor: "text-indigo-400",
    bgColor: "bg-indigo-400/10",
    price: "From $3,200",
    popular: false,
  },
  {
    slug: "digital-marketing-strategy",
    title: "Digital Marketing Strategy",
    category: "marketing",
    tagline: "Reach the right people, everywhere",
    description: "Multi-channel digital marketing strategies that drive awareness, engagement and conversions.",
    icon: Megaphone,
    accentColor: "text-indigo-400",
    bgColor: "bg-indigo-400/10",
    price: "From $2,500",
    popular: false,
  },
  {
    slug: "promotional-campaign-development",
    title: "Promotional Campaign Development",
    category: "promotional",
    tagline: "Campaigns that convert",
    description: "Strategic promotional campaigns designed to increase brand visibility, drive engagement and generate leads.",
    icon: Radio,
    accentColor: "text-violet-400",
    bgColor: "bg-violet-400/10",
    price: "From $1,800",
    popular: false,
  },
  {
    slug: "product-launch-support",
    title: "Product Launch Support",
    category: "promotional",
    tagline: "Launch with impact",
    description: "End-to-end product launch strategies from pre-launch buzz to post-launch momentum and optimization.",
    icon: Radio,
    accentColor: "text-violet-400",
    bgColor: "bg-violet-400/10",
    price: "From $4,000",
    popular: false,
  },
  {
    slug: "event-marketing-management",
    title: "Event Marketing & Management",
    category: "promotional",
    tagline: "Events that matter",
    description: "Plan, promote and manage events that create meaningful connections and measurable business outcomes.",
    icon: Radio,
    accentColor: "text-violet-400",
    bgColor: "bg-violet-400/10",
    price: "From $2,500",
    popular: false,
  },
  {
    slug: "cctv-surveillance-systems",
    title: "CCTV & Surveillance Systems",
    category: "security",
    tagline: "See everything, miss nothing",
    description: "Professional CCTV and IP camera systems designed to protect your premises with crystal-clear monitoring.",
    icon: Shield,
    accentColor: "text-cyan-400",
    bgColor: "bg-cyan-400/10",
    price: "Custom Quote",
    popular: true,
  },
  {
    slug: "access-control-systems",
    title: "Access Control Systems",
    category: "security",
    tagline: "Control who gets in",
    description: "Modern access control solutions from keycards to biometric systems for complete entry management.",
    icon: Shield,
    accentColor: "text-cyan-400",
    bgColor: "bg-cyan-400/10",
    price: "Custom Quote",
    popular: false,
  },
  {
    slug: "intrusion-alarm-systems",
    title: "Intrusion Alarm Systems",
    category: "security",
    tagline: "Instant alerts, total peace of mind",
    description: "Detection and alert systems that keep your property safe around the clock.",
    icon: Shield,
    accentColor: "text-cyan-400",
    bgColor: "bg-cyan-400/10",
    price: "Custom Quote",
    popular: false,
  },
  {
    slug: "custom-corporate-websites",
    title: "Custom Corporate Websites",
    category: "digital",
    tagline: "Your digital flagship",
    description: "Bespoke websites engineered for performance, aesthetics and business results.",
    icon: Globe,
    accentColor: "text-sky-400",
    bgColor: "bg-sky-400/10",
    price: "From $5,000",
    popular: true,
  },
  {
    slug: "web-applications",
    title: "Web Applications",
    category: "digital",
    tagline: "Powerful tools, built for you",
    description: "Custom web applications that solve complex business challenges with elegant, intuitive interfaces.",
    icon: Globe,
    accentColor: "text-sky-400",
    bgColor: "bg-sky-400/10",
    price: "From $8,000",
    popular: false,
  },
  {
    slug: "ecommerce-platforms",
    title: "E-Commerce Platforms",
    category: "digital",
    tagline: "Sell everywhere, beautifully",
    description: "Feature-rich online stores that turn browsers into buyers with seamless checkout experiences.",
    icon: Globe,
    accentColor: "text-sky-400",
    bgColor: "bg-sky-400/10",
    price: "From $7,500",
    popular: false,
  },
  {
    slug: "custom-wordpress-themes",
    title: "Custom WordPress Themes",
    category: "wordpress",
    tagline: "WordPress, elevated",
    description: "Bespoke WordPress themes engineered around your brand, content and business goals.",
    icon: Globe,
    accentColor: "text-amber-400",
    bgColor: "bg-amber-400/10",
    price: "From $3,500",
    popular: true,
  },
  {
    slug: "wordpress-woocommerce",
    title: "WooCommerce Development",
    category: "wordpress",
    tagline: "Your shop, your rules",
    description: "Custom WooCommerce stores with seamless payment, inventory and shipping integrations.",
    icon: Globe,
    accentColor: "text-amber-400",
    bgColor: "bg-amber-400/10",
    price: "From $4,000",
    popular: false,
  },
  {
    slug: "ai-system-integration",
    title: "AI System Integration",
    category: "ai",
    tagline: "Make your business intelligent",
    description: "Integrate AI into existing business systems to automate workflows, improve decisions and create smarter experiences.",
    icon: Bot,
    accentColor: "text-violet-400",
    bgColor: "bg-violet-400/10",
    price: "From $5,000",
    popular: true,
  },
  {
    slug: "custom-ai-chatbots",
    title: "Custom AI Chatbots",
    category: "ai",
    tagline: "Always-on customer support",
    description: "Intelligent chatbots built around your business to answer questions, capture leads and assist customers.",
    icon: Bot,
    accentColor: "text-violet-400",
    bgColor: "bg-violet-400/10",
    price: "From $3,500",
    popular: false,
  },
  {
    slug: "workflow-automation",
    title: "Workflow Automation",
    category: "ai",
    tagline: "Automate the busywork",
    description: "Connect your tools and automate repetitive processes so your team can focus on what matters.",
    icon: Zap,
    accentColor: "text-emerald-400",
    bgColor: "bg-emerald-400/10",
    price: "From $2,800",
    popular: false,
  },
];

export default function Catalog() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = useMemo(() => {
    return services.filter((s) => {
      const matchesCategory = activeCategory === "all" || s.category === activeCategory;
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        s.title.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.tagline.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [search, activeCategory]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero */}
      <section className="relative pt-32 pb-16 sm:pt-36 sm:pb-20 bg-navy-dark overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern-dark" />
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-electric/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <p className="text-electric text-xs font-semibold uppercase tracking-[0.25em] mb-4">
              Our Services
            </p>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
              Everything Your Business Needs
            </h1>
            <p className="text-lg sm:text-xl text-white/50 leading-relaxed mb-10 max-w-2xl">
              From strategy and sales to security, technology and artificial intelligence — explore every way we help businesses grow, operate smarter and stay protected.
            </p>

            {/* Search */}
            <div className="relative max-w-lg">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search services..."
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-electric/40 focus:border-electric/30 transition-all"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="sticky top-18 z-20 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 py-3 overflow-x-auto scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  activeCategory === cat.id
                    ? "bg-navy text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {cat.label}
                {cat.id !== "all" && (
                  <span className="ml-1.5 text-xs opacity-50">
                    ({services.filter((s) => s.category === cat.id).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <p className="text-muted-foreground text-sm">
              {filtered.length} {filtered.length === 1 ? "service" : "services"} found
            </p>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <Search className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
              <p className="text-foreground font-semibold mb-2">No services found</p>
              <p className="text-muted-foreground text-sm">
                Try a different search term or category.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((service, i) => {
                const Icon = service.icon;
                return (
                  <motion.div
                    key={service.slug}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.04 }}
                  >
                    <Link
                      to={`/services/${service.slug}`}
                      className="group block h-full p-6 rounded-2xl bg-card border border-border/60 hover:border-border hover:shadow-xl hover:shadow-black/5 transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-11 h-11 rounded-xl ${service.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className={`w-5 h-5 ${service.accentColor}`} />
                        </div>
                        {service.popular && (
                          <span className="px-2.5 py-0.5 rounded-full bg-electric/10 text-electric text-[10px] font-bold uppercase tracking-wider">
                            Popular
                          </span>
                        )}
                      </div>

                      <h3 className="font-display text-lg font-bold text-foreground mb-1 group-hover:text-electric transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-xs text-muted-foreground font-medium mb-3 italic">
                        {service.tagline}
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                        {service.description}
                      </p>

                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-sm font-semibold text-foreground">
                          {service.price}
                        </span>
                        <div className="flex items-center gap-1 text-sm font-medium text-electric opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                          View Details
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* CTA */}
          <div className="text-center mt-16 py-12 rounded-2xl bg-muted/50 border border-border/50">
            <h3 className="font-display text-xl font-bold text-foreground mb-2">
              Not sure what you need?
            </h3>
            <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
              Tell us about your business and goals — we'll recommend the right combination of services.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-electric text-white font-semibold text-sm rounded-lg hover:bg-electric-dark transition-all shadow-lg shadow-electric/20"
              >
                <Calendar className="w-4 h-4" />
                Book a Free Consultation
              </Link>
              <Link
                to="/pricing"
                className="inline-flex items-center gap-2 px-6 py-3 border border-border text-foreground font-medium text-sm rounded-lg hover:bg-muted transition-all"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
