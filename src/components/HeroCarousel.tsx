import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router";
import { cn } from "@/lib/utils";

const slides = [
  {
    id: 1,
    eyebrow: "Business Development",
    headline: "Your Next Chapter Starts With a Better Strategy",
    description:
      "We help businesses cut through the noise, find untapped opportunities and build plans that actually work — not just strategy decks that collect dust.",
    cta: "Explore Consulting",
    ctaLink: "/services",
    secondary: "Book a Free Consultation",
    secondaryLink: "/contact",
    gradient: "from-navy via-navy-dark to-charcoal",
    accent: "from-electric/20 to-electric-dark/10",
  },
  {
    id: 2,
    eyebrow: "Sales Services",
    headline: "Stop Guessing. Start Closing.",
    description:
      "We build sales engines that are predictable, repeatable and actually enjoyable to run. From pipeline strategy to team training, we make revenue feel systematic.",
    cta: "See Our Sales Services",
    ctaLink: "/services/sales-strategy-development",
    secondary: "Talk to a Sales Expert",
    secondaryLink: "/contact",
    gradient: "from-[#0c1a30] via-[#0f2240] to-navy",
    accent: "from-blue-500/20 to-cyan-500/10",
  },
  {
    id: 3,
    eyebrow: "Marketing Services",
    headline: "Your Brand Deserves to Be the One They Remember",
    description:
      "We craft marketing strategies that make your business impossible to ignore — from brand positioning to digital campaigns that actually move the needle.",
    cta: "Explore Marketing",
    ctaLink: "/services",
    secondary: "Talk to a Strategist",
    secondaryLink: "/contact",
    gradient: "from-[#0a1830] via-[#0d2040] to-charcoal",
    accent: "from-indigo-500/20 to-electric/10",
  },
  {
    id: 4,
    eyebrow: "Security Solutions",
    headline: "Sleep Well. We've Got It Covered.",
    description:
      "Professional security technology — CCTV, access control, intrusion detection — designed to protect what matters most. Custom-built for your environment.",
    cta: "Explore Security",
    ctaLink: "/services/cctv-surveillance-systems",
    secondary: "Request a Security Assessment",
    secondaryLink: "/contact",
    gradient: "from-[#081420] via-[#0c1e35] to-navy-dark",
    accent: "from-cyan-500/20 to-blue-500/10",
    subheading: "Your Trusted Security Partner",
  },
  {
    id: 5,
    eyebrow: "Custom Web Development",
    headline: "Websites That Don't Just Look Good — They Work Hard",
    description:
      "Bespoke digital experiences designed around your brand, your customers and your business goals. Corporate sites, e-commerce, portals and platforms.",
    cta: "Build Your Website",
    ctaLink: "/services/custom-corporate-websites",
    secondary: "View Our Work",
    secondaryLink: "/services",
    gradient: "from-navy via-[#0f1d38] to-charcoal",
    accent: "from-violet-500/20 to-electric/10",
  },
  {
    id: 6,
    eyebrow: "AI System Integration",
    headline: "Make Your Business Smarter, Not Just Automated",
    description:
      "We weave AI into your existing tools and workflows so your team works faster, your decisions are sharper and your customers get a better experience — all without the disruption.",
    cta: "Explore AI Solutions",
    ctaLink: "/services/ai-system-integration",
    secondary: "Talk to an AI Specialist",
    secondaryLink: "/contact",
    gradient: "from-[#0a1530] via-[#0e1e40] to-navy",
    accent: "from-electric/25 to-violet-500/10",
  },
  {
    id: 7,
    eyebrow: "Custom AI Chatbots",
    headline: "Your Business Never Closes. Neither Does Your AI.",
    description:
      "Custom-built chatbots that know your business inside and out — answering questions, capturing leads and connecting customers to your systems, 24/7.",
    cta: "Build Your Chatbot",
    ctaLink: "/services/custom-ai-chatbots",
    secondary: "See AI in Action",
    secondaryLink: "/services",
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
