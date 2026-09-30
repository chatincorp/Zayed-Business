import { useParams, Link } from "react-router";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FloatingWidgets from "@/components/FloatingWidgets";
import { useSEO } from "@/lib/seo";
import {
  ArrowLeft,
  Check,
  Calendar,
  MessageSquare,
} from "lucide-react";

const serviceData: Record<string, {
  title: string;
  tagline: string;
  description: string;
  longDescription: string;
  category: string;
  categoryLabel: string;
  icon: string;
  accentColor: string;
  bgColor: string;
  price: string;
  benefits: string[];
  features: string[];
  process: string[];
  faqs: { q: string; a: string }[];
}> = {
  "strategic-business-planning": {
    title: "Strategic Business Planning",
    tagline: "Chart a clear path from where you are to where you want to be",
    description: "Comprehensive business strategies aligned with your vision, market conditions and growth objectives.",
    longDescription: "Every great business starts with a clear plan. We work alongside your leadership team to map out where your business stands today, where the market is heading and exactly how to position yourself for sustainable growth. Our strategic planning engagements combine deep market research, competitive analysis and practical execution roadmaps that your team can act on immediately.",
    category: "business",
    categoryLabel: "Business Development",
    icon: "TrendingUp",
    accentColor: "text-electric",
    bgColor: "bg-electric/10",
    price: "From $2,500",
    benefits: [
      "Clear direction aligned with your business vision",
      "Data-driven decisions backed by market research",
      "Identified growth opportunities before competitors",
      "A roadmap your entire team can follow",
      "Reduced risk through informed planning",
      "Measurable milestones and accountability",
    ],
    features: [
      "Comprehensive market and competitive analysis",
      "Business model assessment and optimization",
      "Growth strategy development",
      "Financial projections and scenario planning",
      "Implementation roadmap with milestones",
      "Quarterly strategy review sessions",
    ],
    process: [
      "Discovery call to understand your business",
      "Deep-dive into current operations and market position",
      "Strategy development and scenario planning",
      "Presentation of findings and recommended approach",
      "Implementation support and ongoing guidance",
    ],
    faqs: [
      { q: "How long does a strategic planning engagement take?", a: "Typically 3–6 weeks, depending on the scope and complexity of your business." },
      { q: "Do you work with startups as well as established companies?", a: "We work with businesses at every stage — from early-stage startups to established enterprises." },
      { q: "What deliverables will I receive?", a: "You'll receive a full strategic plan including market analysis, competitive positioning, growth roadmap and financial projections." },
    ],
  },
  "cctv-surveillance-systems": {
    title: "CCTV & Surveillance Systems",
    tagline: "See everything. Miss nothing. Stay protected.",
    description: "Professional CCTV and IP camera systems designed to protect your premises with crystal-clear monitoring.",
    longDescription: "Our security team designs, installs and maintains surveillance systems tailored to your specific environment. Whether you need a simple four-camera setup for a small office or a networked HD solution across multiple facilities, we source the right equipment and build a system you can depend on. Every installation includes thorough planning, professional mounting, network configuration and full handover training.",
    category: "security",
    categoryLabel: "Security Solutions",
    icon: "Shield",
    accentColor: "text-cyan-400",
    bgColor: "bg-cyan-400/10",
    price: "Custom Quote",
    benefits: [
      "24/7 monitoring with crystal-clear image quality",
      "Deterrence that reduces incidents before they happen",
      "Remote access from your phone or computer",
      "Scalable systems that grow with your needs",
      "Professional installation and support",
      "Peace of mind for your business and property",
    ],
    features: [
      "IP and HD camera systems",
      "PTZ (pan-tilt-zoom) cameras",
      "Night vision and low-light technology",
      "Remote monitoring and mobile access",
      "Video analytics and motion detection",
      "Cloud and local storage options",
    ],
    process: [
      "On-site security assessment",
      "Custom system design and equipment selection",
      "Professional installation and configuration",
      "System testing and quality assurance",
      "Handover training and ongoing support",
    ],
    faqs: [
      { q: "How many cameras do I need?", a: "It depends on the size and layout of your property. We'll assess your premises and recommend the optimal number and placement." },
      { q: "Can I view cameras remotely?", a: "Yes — all our systems include secure remote access via smartphone app or web browser." },
      { q: "What kind of maintenance do the systems require?", a: "We offer ongoing maintenance packages to keep your system running at peak performance." },
    ],
  },
  "custom-corporate-websites": {
    title: "Custom Corporate Websites",
    tagline: "Your digital flagship, built to convert",
    description: "Bespoke websites engineered for performance, aesthetics and business results.",
    longDescription: "We build corporate websites that do more than look good — they drive real business outcomes. Every project starts with understanding your brand, your audience and your goals. We then design and develop a custom website that reflects your professional identity, loads fast on every device and guides visitors toward the actions that matter most to your business.",
    category: "digital",
    categoryLabel: "Web Development",
    icon: "Globe",
    accentColor: "text-sky-400",
    bgColor: "bg-sky-400/10",
    price: "From $5,000",
    benefits: [
      "A website that truly represents your brand",
      "Fast load times and smooth performance",
      "Mobile-first responsive design",
      "SEO-optimized architecture",
      "Easy content management",
      "Built for conversions, not just visitors",
    ],
    features: [
      "Custom UI/UX design",
      "Responsive mobile-first development",
      "SEO-optimized structure",
      "CMS integration",
      "Performance optimization",
      "Analytics and tracking setup",
    ],
    process: [
      "Discovery and requirements gathering",
      "Design concepts and wireframes",
      "Development and content integration",
      "Testing, QA and performance optimization",
      "Launch and post-launch support",
    ],
    faqs: [
      { q: "How long does it take to build a website?", a: "A typical corporate website takes 4–8 weeks from kickoff to launch, depending on scope." },
      { q: "Will I be able to update the website myself?", a: "Absolutely. We build on user-friendly CMS platforms so your team can manage content without developer support." },
      { q: "Do you provide hosting?", a: "We can recommend and set up reliable hosting for you, or work with your existing provider." },
    ],
  },
  "ai-system-integration": {
    title: "AI System Integration",
    tagline: "Make your business intelligent — not just automated",
    description: "Integrate AI into existing business systems to automate workflows, improve decisions and create smarter experiences.",
    longDescription: "AI isn't a buzzword when it's woven into the fabric of how your business actually operates. We connect intelligent automation to your existing CRM, databases, websites and workflows so your team works faster, your decisions are sharper and your customers get a better experience — all without ripping out what already works.",
    category: "ai",
    categoryLabel: "AI & Automation",
    icon: "Bot",
    accentColor: "text-violet-400",
    bgColor: "bg-violet-400/10",
    price: "From $5,000",
    benefits: [
      "Faster processes through intelligent automation",
      "Better decisions powered by real-time data",
      "Improved customer experience at every touchpoint",
      "Seamless integration with your existing tools",
      "Scalable AI that grows with your business",
      "Competitive advantage through smarter operations",
    ],
    features: [
      "AI workflow automation",
      "Intelligent document processing",
      "AI-powered analytics and reporting",
      "CRM and business system integration",
      "Custom AI assistants and knowledge systems",
      "API development and integration",
    ],
    process: [
      "Assessment of current systems and workflows",
      "AI opportunity identification and roadmap",
      "Solution design and development",
      "Integration, testing and deployment",
      "Training, monitoring and continuous improvement",
    ],
    faqs: [
      { q: "Do I need to replace my existing systems?", a: "No. We integrate AI into your current tools — no rip-and-replace required." },
      { q: "How long does integration take?", a: "Most projects are delivered within 4–10 weeks, depending on complexity." },
      { q: "Is my data secure?", a: "Security is built into every integration. We follow strict data protection protocols and keep your information within your control." },
    ],
  },
};

// Fallback for services not yet in the detail data
function getDefaultService(slug: string) {
  return {
    title: slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" "),
    tagline: "A tailored solution for your business",
    description: "Professional services delivered with precision and care.",
    longDescription: "We deliver this service with the same attention to detail and commitment to results that defines everything we do at Yasir Zayed. Our team works closely with you to understand your specific needs and craft a solution that delivers real, measurable impact for your business.",
    category: "business",
    categoryLabel: "Our Services",
    icon: "TrendingUp",
    accentColor: "text-electric",
    bgColor: "bg-electric/10",
    price: "Custom Quote",
    benefits: [
      "Tailored to your specific business needs",
      "Delivered by experienced professionals",
      "Measurable results and clear outcomes",
      "Ongoing support and guidance",
    ],
    features: [
      "Comprehensive needs assessment",
      "Custom solution design",
      "Professional implementation",
      "Quality assurance and testing",
      "Training and handover",
    ],
    process: [
      "Initial consultation and discovery",
      "Solution design and planning",
      "Development and implementation",
      "Review, testing and launch",
      "Ongoing support and optimization",
    ],
    faqs: [
      { q: "How do I get started?", a: "Book a free consultation and we'll discuss your needs, timeline and budget." },
      { q: "What's the typical timeline?", a: "Most projects are completed within 2–8 weeks, depending on scope." },
    ],
  };
}

export default function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const service = serviceData[slug || ""] || getDefaultService(slug || "");

  useSEO({
    title: `${service.title} — ${service.categoryLabel}`,
    description: service.description || service.longDescription?.slice(0, 155) || `Professional ${service.title.toLowerCase()} from Yasir Zayed.`,
    path: `/services/${slug ?? ""}`,
    keywords: `${service.title}, ${service.categoryLabel}, ${service.title} Kenya, business services, Yasir Zayed`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Service",
      name: service.title,
      serviceType: service.categoryLabel,
      description: service.description,
      url: `https://yasirzayed.com/services/${slug ?? ""}`,
      provider: {
        "@type": "Organization",
        name: "Yasir Zayed",
        url: "https://yasirzayed.com/",
        telephone: "+254-114-712-989",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Nairobi",
          addressCountry: "KE",
        },
      },
      areaServed: ["Kenya", "East Africa", "Global"],
      ...(service.faqs?.length
        ? {
            mainEntity: service.faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }
        : {}),
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero */}
      <section className="relative pt-32 pb-16 sm:pt-36 sm:pb-20 bg-navy-dark overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern-dark" />
        <div className="absolute top-1/4 right-1/3 w-[400px] h-[400px] bg-electric/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-white/40 mb-8"
          >
            <Link to="/" className="hover:text-white/70 transition-colors">Home</Link>
            <span>/</span>
            <Link to="/services" className="hover:text-white/70 transition-colors">Services</Link>
            <span>/</span>
            <span className="text-white/70">{service.title}</span>
          </motion.div>

          <div className="grid lg:grid-cols-[1fr,auto] gap-12 items-center">
            <div>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`inline-block px-3 py-1 rounded-full ${service.bgColor} ${service.accentColor} text-xs font-semibold uppercase tracking-wider mb-4`}
              >
                {service.categoryLabel}
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-4"
              >
                {service.title}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg sm:text-xl text-white/50 leading-relaxed max-w-2xl mb-8"
              >
                {service.tagline}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-3"
              >
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-electric text-white font-semibold text-sm rounded-lg hover:bg-electric-dark transition-all shadow-lg shadow-electric/20"
                >
                  <Calendar className="w-4 h-4" />
                  Book a Consultation
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 text-white/80 font-medium text-sm rounded-lg hover:bg-white/5 hover:border-white/30 transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  Ask a Question
                </Link>
              </motion.div>
            </div>

            {/* Price card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="hidden lg:block p-8 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-sm min-w-[240px]"
            >
              <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-2">Starting At</p>
              <p className="text-3xl font-bold text-white mb-4">{service.price}</p>
              <Link
                to="/pricing"
                className="block text-center text-sm text-electric hover:underline mb-4"
              >
                View all pricing plans
              </Link>
              <Link
                to="/contact"
                className="block w-full text-center px-5 py-3 bg-electric text-white font-semibold text-sm rounded-lg hover:bg-electric-dark transition-all"
              >
                Get Started
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr,360px] gap-16">
            {/* Main content */}
            <div>
              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-16"
              >
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">Overview</h2>
                <p className="text-muted-foreground leading-relaxed text-base">
                  {service.longDescription}
                </p>
              </motion.div>

              {/* Benefits */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-16"
              >
                <h2 className="font-display text-2xl font-bold text-foreground mb-6">What You Get</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {service.benefits.map((b) => (
                    <div key={b} className="flex items-start gap-3 p-4 rounded-xl bg-muted/50">
                      <div className="w-6 h-6 rounded-full bg-electric/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5 text-electric" />
                      </div>
                      <span className="text-sm text-foreground font-medium">{b}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Features */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-16"
              >
                <h2 className="font-display text-2xl font-bold text-foreground mb-6">What's Included</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {service.features.map((f) => (
                    <div key={f} className="flex items-center gap-3 p-3 rounded-lg border border-border/50">
                      <div className="w-1.5 h-1.5 rounded-full bg-electric shrink-0" />
                      <span className="text-sm text-foreground">{f}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Process */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-16"
              >
                <h2 className="font-display text-2xl font-bold text-foreground mb-6">How It Works</h2>
                <div className="space-y-4">
                  {service.process.map((step, i) => (
                    <div key={step} className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-navy text-white text-xs font-bold flex items-center justify-center shrink-0">
                        {i + 1}
                      </div>
                      <div className="pt-1">
                        <p className="text-foreground font-medium">{step}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* FAQs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="font-display text-2xl font-bold text-foreground mb-6">Common Questions</h2>
                <div className="space-y-4">
                  {service.faqs.map((faq) => (
                    <div key={faq.q} className="p-5 rounded-xl bg-muted/50 border border-border/50">
                      <h3 className="font-semibold text-foreground text-sm mb-2">{faq.q}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:sticky lg:top-24 h-fit space-y-6">
              {/* CTA Card */}
              <div className="p-6 rounded-2xl bg-navy text-white">
                <h3 className="font-display text-lg font-bold mb-2">Ready to get started?</h3>
                <p className="text-white/50 text-sm mb-5">
                  Book a free consultation and let's discuss how this service can help your business.
                </p>
                <Link
                  to="/contact"
                  className="block w-full text-center px-5 py-3 bg-electric text-white font-semibold text-sm rounded-lg hover:bg-electric-dark transition-all"
                >
                  Book a Consultation
                </Link>
              </div>

              {/* Related Services */}
              <div className="p-6 rounded-2xl bg-card border border-border">
                <h3 className="font-semibold text-foreground text-sm mb-4">Related Services</h3>
                <div className="space-y-2">
                  <Link to="/services" className="block p-3 rounded-lg hover:bg-muted text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Browse All Services
                  </Link>
                  <Link to="/pricing" className="block p-3 rounded-lg hover:bg-muted text-sm text-muted-foreground hover:text-foreground transition-colors">
                    View Pricing
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Back link */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12">
        <Link
          to="/services"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all services
        </Link>
      </div>

      <Footer />
      <FloatingWidgets />
    </div>
  );
}
