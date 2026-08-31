import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router";
import { cn } from "@/lib/utils";

const slides = [
  {
    id: 1,
    eyebrow: "Business Development",
    headline: "Turn Business Potential Into Sustainable Growth",
    description:
      "Strategic business planning, market intelligence, business model optimization and growth strategies that help organizations make better decisions and pursue sustainable opportunities.",
    cta: "Explore Business Consulting",
    ctaLink: "/#services",
    secondary: "Book a Strategy Session",
    secondaryLink: "/contact",
    gradient: "from-navy via-navy-dark to-charcoal",
    accent: "from-electric/20 to-electric-dark/10",
  },
  {
    id: 2,
    eyebrow: "Sales Services",
    headline: "Build Sales Systems That Perform",
    description:
      "Create stronger and more predictable sales operations through sales strategy, process optimization, CRM, team development, performance management and lead generation.",
    cta: "Explore Sales Services",
    ctaLink: "/#sales",
    secondary: "Request a Consultation",
    secondaryLink: "/contact",
    gradient: "from-[#0c1a30] via-[#0f2240] to-navy",
    accent: "from-blue-500/20 to-cyan-500/10",
  },
  {
    id: 3,
    eyebrow: "Marketing Services",
    headline: "Make Your Brand Impossible to Ignore",
    description:
      "Build a stronger market presence through strategic marketing, brand positioning, digital marketing, content, social media and customer experience optimization.",
    cta: "Explore Marketing Services",
    ctaLink: "/#marketing",
    secondary: "Talk to an Expert",
    secondaryLink: "/contact",
    gradient: "from-[#0a1830] via-[#0d2040] to-charcoal",
    accent: "from-indigo-500/20 to-electric/10",
  },
  {
    id: 4,
    eyebrow: "Security Solutions",
    headline: "Secure Your World With Confidence",
    description:
      "Professional security technology, surveillance and access solutions designed to protect businesses, homes and institutions.",
    cta: "Explore Security Solutions",
    ctaLink: "/#security",
    secondary: "Request a Security Assessment",
    secondaryLink: "/contact",
    gradient: "from-[#081420] via-[#0c1e35] to-navy-dark",
    accent: "from-cyan-500/20 to-blue-500/10",
    subheading: "Your Trusted Security Solutions Partner",
  },
  {
    id: 5,
    eyebrow: "Custom Web Development",
    headline: "Digital Experiences Built Around Your Business",
    description:
      "Custom websites and web applications designed around your brand, customers and business processes — from corporate websites to advanced digital platforms.",
    cta: "Build My Website",
    ctaLink: "/contact",
    secondary: "View Our Work",
    secondaryLink: "/#technology",
    gradient: "from-navy via-[#0f1d38] to-charcoal",
    accent: "from-violet-500/20 to-electric/10",
  },
  {
    id: 6,
    eyebrow: "AI System Integration",
    headline: "Connect Your Business to Intelligent AI",
    description:
      "Integrate AI into existing business systems to automate workflows, improve decision-making, process information and create smarter customer experiences.",
    cta: "Explore AI Solutions",
    ctaLink: "/#ai",
    secondary: "Talk to an AI Specialist",
    secondaryLink: "/contact",
    gradient: "from-[#0a1530] via-[#0e1e40] to-navy",
    accent: "from-electric/25 to-violet-500/10",
  },
  {
    id: 7,
    eyebrow: "Custom AI Chatbots",
    headline: "Your Business. Always Ready to Respond.",
    description:
      "Intelligent custom chatbots designed around your business to answer questions, assist customers, capture leads and connect users to your systems.",
    cta: "Build an AI Chatbot",
    ctaLink: "/contact",
    secondary: "Explore AI Solutions",
    secondaryLink: "/#ai",
    gradient: "from-[#0c1628] via-[#101e3a] to-navy-dark",
    accent: "from-electric/20 to-emerald-500/10",
  },
];

const AUTOPLAY_INTERVAL = 7000;

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const goTo = useCallback(
    (index: number) => {
      setDirection(index > current ? 1 : -1);
      setCurrent(index);
    },
    [current]
  );

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(next, AUTOPLAY_INTERVAL);
    return () => clearInterval(timer);
  }, [isPaused, next]);

  const slide = slides[current];

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? "-100%" : "100%",
      opacity: 0,
    }),
  };

  return (
    <section
      id="hero"
      className="relative h-[100svh] min-h-[600px] overflow-hidden bg-navy-dark"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Hero carousel"
    >
      {/* Background grid pattern */}
      <div className="absolute inset-0 bg-grid-pattern-dark opacity-30" />

      {/* Animated background gradient */}
      <div className="absolute inset-0">
        <motion.div
          key={`bg-${current}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className={cn("absolute inset-0 bg-gradient-to-br", slide.gradient)}
        />
      </div>

      {/* Accent glow */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          key={`glow-${current}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2 }}
          className={cn(
            "absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-br blur-[120px]",
            slide.accent
          )}
        />
      </div>

      {/* Diagonal decorative lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] border border-white/[0.03] rotate-45 rounded-3xl" />
        <div className="absolute -bottom-20 -left-20 w-[300px] h-[300px] border border-electric/[0.05] rotate-12 rounded-2xl" />
      </div>

      {/* Content */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 flex items-center"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full pt-20">
            <div className="max-w-3xl">
              {/* Eyebrow */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="mb-6"
              >
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-electric/10 border border-electric/20 text-electric text-xs font-semibold uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 rounded-full bg-electric animate-pulse" />
                  {slide.eyebrow}
                </span>
              </motion.div>

              {/* Subheading (only for security slide) */}
              {slide.subheading && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="text-electric-light/70 text-sm font-medium uppercase tracking-[0.2em] mb-3"
                >
                  {slide.subheading}
                </motion.p>
              )}

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight mb-6"
              >
                {slide.headline}
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="text-lg sm:text-xl text-white/60 max-w-xl leading-relaxed mb-10"
              >
                {slide.description}
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="flex flex-wrap gap-4"
              >
                <Link
                  to={slide.ctaLink}
                  className="group inline-flex items-center gap-2 px-7 py-3.5 bg-electric text-white font-semibold text-sm rounded-lg hover:bg-electric-dark transition-all duration-300 shadow-lg shadow-electric/25 hover:shadow-electric/40 hover:-translate-y-0.5"
                >
                  {slide.cta}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to={slide.secondaryLink}
                  className="inline-flex items-center gap-2 px-7 py-3.5 border border-white/20 text-white/80 font-medium text-sm rounded-lg hover:bg-white/5 hover:border-white/30 transition-all duration-300 hover:-translate-y-0.5"
                >
                  {slide.secondary}
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Slide number */}
      <div className="absolute bottom-8 left-4 sm:left-8 lg:left-12">
        <motion.div
          key={`num-${current}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-baseline gap-1"
        >
          <span className="text-4xl sm:text-5xl font-bold text-white/10">
            {String(current + 1).padStart(2, "0")}
          </span>
          <span className="text-sm text-white/30 font-medium">
            / {String(slides.length).padStart(2, "0")}
          </span>
        </motion.div>
      </div>

      {/* Progress indicators */}
      <div className="absolute bottom-8 right-4 sm:right-8 lg:right-12 flex items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={cn(
              "transition-all duration-500 rounded-full",
              i === current
                ? "w-8 h-1.5 bg-electric"
                : "w-1.5 h-1.5 bg-white/20 hover:bg-white/40"
            )}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Navigation arrows */}
      <div className="absolute bottom-8 right-4 sm:right-8 lg:right-12 hidden sm:flex items-center gap-2 ml-6">
        <button
          onClick={prev}
          className="p-2 rounded-full border border-white/10 text-white/40 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all duration-200"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={next}
          className="p-2 rounded-full border border-white/10 text-white/40 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all duration-200"
          aria-label="Next slide"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-navy-dark to-transparent pointer-events-none" />
    </section>
  );
}
