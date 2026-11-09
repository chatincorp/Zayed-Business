import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Globe,
  Shield,
  TrendingUp,
  Users,
  BarChart3,
  Building2,
  ArrowUpRight,
  Search,
} from "lucide-react";

const navLinks = [
  { label: "Solutions", href: "#capabilities" },
  { label: "Insights", href: "#insights" },
  { label: "About Us", href: "#about" },
  { label: "Responsibility", href: "#responsibility" },
  { label: "Careers", href: "#careers" },
];

const testimonials = [
  {
    quote:
      "Their technology-driven approach to portfolio management gave us clarity we'd been missing for years. The transition was seamless and the results speak for themselves.",
    name: "Amara Okafor",
    title: "CFO, Pan-African Logistics Group",
  },
  {
    quote:
      "A rare combination of deep market expertise and genuine partnership. They challenge our assumptions in exactly the right moments.",
    name: "David Kimura",
    title: "Managing Director, Eastgate Capital",
  },
  {
    quote:
      "From due diligence to execution, the team operated at an institutional standard while remaining agile enough for our mid-market reality.",
    name: "Sofia Alvarez",
    title: "CEO, Meridian Holdings",
  },
];

const offices = [
  { city: "New York", detail: "725 Fifth Avenue, NY 10022", phone: "+1 212 555 0140" },
  { city: "London", detail: "25 Canada Square, E14 5LQ", phone: "+44 20 7946 0230" },
  { city: "Nairobi", detail: "Riverside Drive, Westlands", phone: "+254 114 712 989" },
  { city: "Singapore", detail: "1 Raffles Place, 048616", phone: "+65 6011 0230" },
];

const stats = [
  { value: "$10T+", label: "Assets Under Management" },
  { value: "70+", label: "Countries Served" },
  { value: "1988", label: "Founded" },
  { value: "190K+", label: "Employees Worldwide" },
];

const capabilities = [
  {
    icon: TrendingUp,
    title: "Investment Management",
    desc: "Comprehensive portfolio management across equity, fixed income, alternatives and multi-asset strategies.",
  },
  {
    icon: Shield,
    title: "Risk Management",
    desc: "Advanced risk analytics and monitoring systems that help identify, measure and mitigate portfolio risks.",
  },
  {
    icon: Globe,
    title: "Global Markets",
    desc: "Deep market intelligence across equities, fixed income, currencies and commodities worldwide.",
  },
  {
    icon: BarChart3,
    title: "Financial Technology",
    desc: "Proprietary platforms powering investment decisions with AI-driven analytics and real-time data.",
  },
  {
    icon: Building2,
    title: "Corporate Solutions",
    desc: "End-to-end financial solutions for corporations including treasury, financing and advisory.",
  },
  {
    icon: Users,
    title: "Client Advisory",
    desc: "Dedicated relationship teams providing customized strategies aligned with institutional objectives.",
  },
];

const insights = [
  {
    category: "Market Commentary",
    title: "Navigating the New Rate Environment: What Investors Need to Know",
    date: "August 28, 2026",
    readTime: "8 min read",
  },
  {
    category: "Research Report",
    title: "Global Outlook: Resilience Amid Uncertainty",
    date: "August 25, 2026",
    readTime: "12 min read",
  },
  {
    category: "Investment Strategy",
    title: "The Role of Private Markets in Modern Portfolios",
    date: "August 22, 2026",
    readTime: "6 min read",
  },
  {
    category: "ESG Insight",
    title: "Sustainable Finance: Bridging the Gap Between Goals and Reality",
    date: "August 20, 2026",
    readTime: "10 min read",
  },
];

const leadership = [
  { name: "Robert Kapito", title: "President" },
  { name: "Larry Fink", title: "Chairman & CEO" },
  { name: "Samuel Pollack", title: "Chief Investment Officer" },
  { name: "Manish Mehta", title: "Chief Financial Officer" },
];

function HeroParallax() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <div ref={ref} className="relative h-[100vh] overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1e]/80 via-[#0a0f1e]/60 to-[#0a0f1e]/90" />
      </motion.div>

      <motion.div style={{ opacity }} className="relative z-10 h-full flex flex-col justify-center px-8 sm:px-16 lg:px-24">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-[#60a5fa] text-xs font-semibold uppercase tracking-[0.3em] mb-6"
          >
            Yasir Zayed Capital Advisory
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-[1.1] mb-6"
          >
            Building a More
            <br />
            <span className="text-[#60a5fa]">Sustainable</span> Financial Future
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-white/60 text-lg sm:text-xl max-w-2xl mb-10 leading-relaxed"
          >
            We help organizations navigate complexity, manage risk and unlock
            growth through technology-driven financial solutions and strategic
            advisory services.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="flex flex-wrap gap-4"
          >
            <a
              href="#capabilities"
              className="group flex items-center gap-2 bg-[#60a5fa] hover:bg-[#3b82f6] text-white px-8 py-4 rounded-sm text-sm font-semibold transition-all"
            >
              Our Capabilities
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#insights"
              className="flex items-center gap-2 border border-white/20 text-white/80 hover:text-white hover:border-white/40 px-8 py-4 rounded-sm text-sm font-semibold transition-all"
            >
              View Insights
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <ChevronDown className="w-5 h-5 text-white/30 animate-bounce" />
        </motion.div>
      </motion.div>
    </div>
  );
}

function ScrollingStats() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section ref={containerRef} className="relative py-20 bg-[#0a0f1e]">
      <div className="mx-auto max-w-7xl px-8 sm:px-16 lg:px-24">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
                {stat.value}
              </div>
              <div className="text-white/40 text-sm uppercase tracking-wider">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AutoScrollingCapabilities() {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let pos = 0;
    const speed = 0.5;
    let raf: number;

    const tick = () => {
      pos += speed;
      if (pos >= el.scrollWidth - el.clientWidth) pos = 0;
      el.scrollLeft = pos;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section id="capabilities" className="py-24 bg-[#f8fafc]">
      <div className="mx-auto max-w-7xl px-8 sm:px-16 lg:px-24 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-[#60a5fa] text-xs font-semibold uppercase tracking-[0.25em] mb-4">
            What We Do
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0a0f1e] mb-4">
            Our Capabilities
          </h2>
          <p className="text-gray-500 max-w-2xl text-lg">
            Comprehensive financial solutions powered by technology and deep
            market expertise.
          </p>
        </motion.div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide px-8 sm:px-16 lg:px-24 pb-4"
        style={{ scrollbarWidth: "none" }}
      >
        {[...capabilities, ...capabilities].map((cap, i) => {
          const Icon = cap.icon;
          return (
            <motion.div
              key={`${cap.title}-${i}`}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="flex-shrink-0 w-[320px] p-8 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-[#60a5fa]/20 transition-all duration-300 group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-lg bg-[#60a5fa]/10 flex items-center justify-center mb-5 group-hover:bg-[#60a5fa]/20 transition-colors">
                <Icon className="w-6 h-6 text-[#60a5fa]" />
              </div>
              <h3 className="text-lg font-bold text-[#0a0f1e] mb-3">
                {cap.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">
                {cap.desc}
              </p>
              <div className="flex items-center gap-1 text-[#60a5fa] text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                Learn more <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

function InsightsSection() {
  return (
    <section id="insights" className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-8 sm:px-16 lg:px-24">
        <div className="flex items-end justify-between mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-[#60a5fa] text-xs font-semibold uppercase tracking-[0.25em] mb-4">
              Latest Thinking
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0a0f1e]">
              Insights & Research
            </h2>
          </motion.div>
          <motion.a
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            href="/tabloid"
            className="hidden sm:flex items-center gap-2 text-[#60a5fa] text-sm font-semibold hover:underline"
          >
            View All <ArrowUpRight className="w-4 h-4" />
          </motion.a>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {insights.map((item, i) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group p-8 rounded-xl border border-gray-100 hover:border-[#60a5fa]/20 hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-semibold text-[#60a5fa] uppercase tracking-wider">
                  {item.category}
                </span>
                <span className="text-gray-300">·</span>
                <span className="text-xs text-gray-400">{item.date}</span>
              </div>
              <h3 className="text-xl font-bold text-[#0a0f1e] mb-3 group-hover:text-[#60a5fa] transition-colors leading-snug">
                {item.title}
              </h3>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">{item.readTime}</span>
                <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-[#60a5fa] transition-colors" />
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function LeadershipSection() {
  return (
    <section className="py-24 bg-[#0a0f1e]">
      <div className="mx-auto max-w-7xl px-8 sm:px-16 lg:px-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="text-[#60a5fa] text-xs font-semibold uppercase tracking-[0.25em] mb-4">
            Our Leadership
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Guided by Experience
          </h2>
          <p className="text-white/40 max-w-2xl mx-auto text-lg">
            A seasoned leadership team with decades of combined experience in
            global finance and technology.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {leadership.map((person, i) => (
            <motion.div
              key={person.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group text-center"
            >
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#60a5fa]/20 to-[#60a5fa]/5 mx-auto mb-4 flex items-center justify-center group-hover:from-[#60a5fa]/30 transition-colors">
                <span className="text-2xl font-bold text-[#60a5fa]">
                  {person.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
              </div>
              <h3 className="text-white font-semibold mb-1">{person.name}</h3>
              <p className="text-white/40 text-sm">{person.title}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section id="about" className="py-24 bg-[#0a0f1e]">
      <div className="mx-auto max-w-7xl px-8 sm:px-16 lg:px-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="text-[#60a5fa] text-xs font-semibold uppercase tracking-[0.25em] mb-4">
            Client Outcomes
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Trusted in the Moments That Matter
          </h2>
          <p className="text-white/40 max-w-2xl mx-auto text-lg">
            From mid-market operators to institutional allocators, our clients
            stay because the results compound.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="p-8 rounded-xl bg-white/[0.03] border border-white/5 hover:border-[#60a5fa]/20 transition-colors"
            >
              <div className="text-[#60a5fa] text-3xl leading-none mb-4">&ldquo;</div>
              <blockquote className="text-white/70 leading-relaxed mb-6 text-[15px]">
                {t.quote}
              </blockquote>
              <figcaption>
                <div className="font-semibold text-white text-sm">{t.name}</div>
                <div className="text-white/40 text-xs mt-0.5">{t.title}</div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function ResponsibilitySection() {
  const pillars = [
    {
      icon: Globe,
      title: "Financial Inclusion",
      desc: "Expanding access to capital and tools for underserved businesses across our markets.",
      metric: "120K+ businesses financed",
    },
    {
      icon: Shield,
      title: "Responsible AI",
      desc: "Governance-first deployment of AI with bias audits and human oversight on every model.",
      metric: "100% models audited",
    },
    {
      icon: Users,
      title: "Talent Development",
      desc: "Training the next generation of analysts through structured programs and mentorship.",
      metric: "400+ graduates yearly",
    },
  ];

  return (
    <section id="responsibility" className="py-24 bg-[#f8fafc]">
      <div className="mx-auto max-w-7xl px-8 sm:px-16 lg:px-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14"
        >
          <div className="text-[#60a5fa] text-xs font-semibold uppercase tracking-[0.25em] mb-4">
            Responsibility
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0a0f1e] mb-4">
            Impact Beyond the Balance Sheet
          </h2>
          <p className="text-gray-500 max-w-2xl text-lg">
            Sustainable performance means measuring what we contribute, not just
            what we capture.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {pillars.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-8 bg-white rounded-xl border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 rounded-lg bg-[#60a5fa]/10 flex items-center justify-center mb-5">
                  <Icon className="w-6 h-6 text-[#60a5fa]" />
                </div>
                <h3 className="text-lg font-bold text-[#0a0f1e] mb-3">{p.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">{p.desc}</p>
                <div className="text-[#60a5fa] text-sm font-semibold">{p.metric}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CareersSection() {
  const roles = [
    { title: "Quantitative Analyst", team: "Investment Engineering", loc: "New York / Hybrid" },
    { title: "Senior Backend Engineer", team: "Platform", loc: "London / Remote" },
    { title: "Client Portfolio Manager", team: "Advisory", loc: "Nairobi / On-site" },
    { title: "AI Risk Researcher", team: "Risk & Compliance", loc: "Singapore / Hybrid" },
  ];

  return (
    <section id="careers" className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-8 sm:px-16 lg:px-24">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-[#60a5fa] text-xs font-semibold uppercase tracking-[0.25em] mb-4">
              Careers
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0a0f1e]">
              Build With Us
            </h2>
          </motion.div>
          <p className="text-gray-500 max-w-md text-sm leading-relaxed">
            We hire people who challenge consensus respectfully and execute
            relentlessly. Four teams are currently growing.
          </p>
        </div>

        <div className="divide-y divide-gray-100 border-t border-b border-gray-100">
          {roles.map((r, i) => (
            <motion.a
              key={r.title}
              href="/contact"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="group flex flex-wrap items-center justify-between gap-3 py-5 cursor-pointer"
            >
              <div>
                <div className="font-semibold text-[#0a0f1e] group-hover:text-[#60a5fa] transition-colors">
                  {r.title}
                </div>
                <div className="text-sm text-gray-400 mt-0.5">{r.team}</div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-gray-400">{r.loc}</span>
                <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-[#60a5fa] transition-colors" />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

function OfficesSection() {
  return (
    <section className="py-20 bg-[#070c16]">
      <div className="mx-auto max-w-7xl px-8 sm:px-16 lg:px-24">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Global Presence
          </h2>
          <p className="text-white/30 text-sm max-w-md">
            Four offices across three continents — one operating standard.
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {offices.map((o, i) => (
            <motion.div
              key={o.city}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="p-6 rounded-xl bg-white/[0.03] border border-white/5"
            >
              <div className="text-white font-semibold mb-2">{o.city}</div>
              <div className="text-white/40 text-sm leading-relaxed">{o.detail}</div>
              <div className="text-[#60a5fa] text-sm mt-3">{o.phone}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function NewsletterCTA() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  return (
    <section className="py-24 bg-gradient-to-br from-[#0d1730] to-[#0a0f1e]">
      <div className="mx-auto max-w-4xl px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Insights Delivered Monthly
          </h2>
          <p className="text-white/50 text-lg mb-10 max-w-2xl mx-auto">
            Market analysis, research notes and strategy briefings from our
            investment committees — no noise, one email a month.
          </p>

          {subscribed ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span className="text-emerald-300 font-medium">
                You're subscribed. First briefing arrives next month.
              </span>
            </motion.div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (email.includes("@")) setSubscribed(true);
              }}
              className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="flex-1 px-5 py-4 rounded-sm bg-white/5 border border-white/10 text-white placeholder:text-white/30 outline-none focus:border-[#60a5fa]/50 transition-colors"
              />
              <button
                type="submit"
                className="bg-[#60a5fa] hover:bg-[#3b82f6] text-white px-8 py-4 rounded-sm text-sm font-semibold transition-all"
              >
                Subscribe
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-12 bg-[#070c16] border-t border-white/5">
      <div className="mx-auto max-w-7xl px-8 sm:px-16 lg:px-24">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#60a5fa] flex items-center justify-center">
              <span className="text-white text-xs font-bold">YZ</span>
            </div>
            <span className="text-white/80 font-semibold text-sm">
              YASIR ZAYED
            </span>
          </div>
          <div className="flex gap-8 text-white/30 text-sm">
            <a href="/privacy" className="hover:text-white/60 transition-colors">
              Privacy
            </a>
            <a href="/terms" className="hover:text-white/60 transition-colors">
              Terms
            </a>
            <a href="/cookies" className="hover:text-white/60 transition-colors">
              Cookies
            </a>
          </div>
          <div className="text-white/20 text-xs">
            © 2026 Yasir Zayed. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function DemoCorporate() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Sticky Nav */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#0a0f1e]/95 backdrop-blur-md shadow-lg border-b border-white/5"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-7xl px-8 sm:px-16 lg:px-24 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#60a5fa] flex items-center justify-center">
              <span className="text-white text-xs font-bold">YZ</span>
            </div>
            <span className="text-white font-bold text-sm tracking-wide">
              YASIR ZAYED
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-white/60 hover:text-white text-sm transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <Search className="w-4 h-4 text-white/40 hover:text-white cursor-pointer transition-colors" />
            <a
              href="/contact"
              className="bg-[#60a5fa] hover:bg-[#3b82f6] text-white px-5 py-2 rounded-sm text-xs font-semibold transition-all"
            >
              Contact Us
            </a>
          </div>
        </div>
      </nav>

      <HeroParallax />
      <ScrollingStats />
      <AutoScrollingCapabilities />
      <InsightsSection />
      <TestimonialsSection />
      <ResponsibilitySection />
      <LeadershipSection />
      <CareersSection />
      <OfficesSection />
      <NewsletterCTA />
      <Footer />

      {/* Back to demos link */}
      <div className="fixed bottom-6 left-6 z-50">
        <a
          href="/"
          className="flex items-center gap-2 bg-[#0a0f1e]/90 backdrop-blur text-white/70 hover:text-white px-4 py-2 rounded-lg text-xs font-medium transition-all border border-white/10"
        >
          ← Back to Yasir Zayed
        </a>
      </div>
    </div>
  );
}
