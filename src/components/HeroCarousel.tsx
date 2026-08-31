import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { Link } from "react-router";
import { cn } from "@/lib/utils";

/* ── Slide Data ─────────────────────────────────────────────────── */

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
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=85&auto=format",
    imageAlt: "Modern boardroom with city skyline",
    overlayColor: "from-[#060e1a]/95 via-[#0a1628]/80 to-[#0a1628]/50",
    accentColor: "#0ea5e9",
  },
  {
    id: 2,
    eyebrow: "Sales Services",
    headline: "Stop Guessing. Start Closing.",
    description:
      "We build sales engines that are predictable, repeatable and actually enjoyable to run. From pipeline strategy to team training, we make revenue feel systematic.",
    cta: "See Our Sales Services",
    ctaLink: "/services",
    secondary: "Talk to a Sales Expert",
    secondaryLink: "/contact",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1920&q=85&auto=format",
    imageAlt: "Analytics dashboard on large screen",
    overlayColor: "from-[#081420]/95 via-[#0a1628]/80 to-[#0a1628]/50",
    accentColor: "#22d3ee",
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
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1920&q=85&auto=format",
    imageAlt: "Creative branding workspace",
    overlayColor: "from-[#0a1028]/95 via-[#0a1628]/78 to-[#0a1628]/50",
    accentColor: "#a78bfa",
  },
  {
    id: 4,
    eyebrow: "Security Solutions",
    headline: "Sleep Well. We've Got It Covered.",
    subheading: "Your Trusted Security Partner",
    description:
      "Professional security technology — CCTV, access control, intrusion detection — designed to protect what matters most. Custom-built for your environment.",
    cta: "Explore Security",
    ctaLink: "/services",
    secondary: "Request a Security Assessment",
    secondaryLink: "/contact",
    image:
      "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=1920&q=85&auto=format",
    imageAlt: "Security operations center",
    overlayColor: "from-[#060e18]/95 via-[#0a1628]/82 to-[#0a1628]/50",
    accentColor: "#06b6d4",
  },
  {
    id: 5,
    eyebrow: "Custom Web Development",
    headline: "Websites That Don't Just Look Good — They Work Hard",
    description:
      "Bespoke digital experiences designed around your brand, your customers and your business goals. Corporate sites, e-commerce, portals and platforms.",
    cta: "Build Your Website",
    ctaLink: "/services",
    secondary: "View Our Work",
    secondaryLink: "/services",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&q=85&auto=format",
    imageAlt: "Code on screen with development workspace",
    overlayColor: "from-[#0a1428]/95 via-[#0a1628]/78 to-[#0a1628]/50",
    accentColor: "#818cf8",
  },
  {
    id: 6,
    eyebrow: "AI System Integration",
    headline: "Make Your Business Smarter, Not Just Automated",
    description:
      "We weave AI into your existing tools and workflows so your team works faster, your decisions are sharper and your customers get a better experience.",
    cta: "Explore AI Solutions",
    ctaLink: "/services",
    secondary: "Talk to an AI Specialist",
    secondaryLink: "/contact",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1920&q=85&auto=format",
    imageAlt: "Artificial intelligence visualization",
    overlayColor: "from-[#081428]/95 via-[#0a1628]/80 to-[#0a1628]/50",
    accentColor: "#3b82f6",
  },
  {
    id: 7,
    eyebrow: "Custom AI Chatbots",
    headline: "Your Business Never Closes. Neither Does Your AI.",
    description:
      "Custom-built chatbots that know your business inside and out — answering questions, capturing leads and connecting customers to your systems, 24/7.",
    cta: "Build Your Chatbot",
    ctaLink: "/services",
    secondary: "See AI in Action",
    secondaryLink: "/services",
    image:
      "https://images.unsplash.com/photo-1531746790095-e5995f604a3b?w=1920&q=85&auto=format",
    imageAlt: "AI assistant interface",
    overlayColor: "from-[#0a1628]/95 via-[#0a1628]/80 to-[#0a1628]/50",
    accentColor: "#10b981",
  },
];

/* ── SVG Illustrations — one per slide, large & purposeful ──────── */

function SlideIllustration({ index }: { index: number }) {
  const cls = "w-full h-full";

  const illustrations = [
    /* 0 — Business Development: growth chart with cityscape */
    <svg key={0} viewBox="0 0 400 400" fill="none" className={cls}>
      {/* Cityscape silhouette */}
      <rect x="20" y="280" width="40" height="100" rx="2" fill="currentColor" opacity="0.06" />
      <rect x="70" y="240" width="35" height="140" rx="2" fill="currentColor" opacity="0.08" />
      <rect x="115" y="260" width="45" height="120" rx="2" fill="currentColor" opacity="0.05" />
      <rect x="170" y="200" width="30" height="180" rx="2" fill="currentColor" opacity="0.07" />
      <rect x="210" y="220" width="50" height="160" rx="2" fill="currentColor" opacity="0.06" />
      <rect x="270" y="180" width="35" height="200" rx="2" fill="currentColor" opacity="0.09" />
      <rect x="315" y="250" width="40" height="130" rx="2" fill="currentColor" opacity="0.05" />
      {/* Rising growth line */}
      <path d="M30 320 C80 310, 120 280, 160 240 S240 160, 280 120 S340 80, 380 40"
        stroke="url(#grad1)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <circle cx="160" cy="240" r="5" fill="currentColor" opacity="0.3" />
      <circle cx="280" cy="120" r="5" fill="currentColor" opacity="0.4" />
      <circle cx="380" cy="40" r="6" fill="currentColor" opacity="0.5" />
      {/* Data points with glow */}
      <circle cx="380" cy="40" r="12" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
      <circle cx="380" cy="40" r="20" fill="none" stroke="currentColor" strokeWidth="0.3" opacity="0.1" />
      {/* Percentage label */}
      <text x="340" y="70" fill="currentColor" fontSize="14" fontWeight="bold" opacity="0.2">+47%</text>
      <defs>
        <linearGradient id="grad1" x1="30" y1="320" x2="380" y2="40">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.1" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.4" />
        </linearGradient>
      </defs>
    </svg>,

    /* 1 — Sales: pipeline funnel with metrics */
    <svg key={1} viewBox="0 0 400 400" fill="none" className={cls}>
      {/* Funnel shape */}
      <path d="M60 60 L340 60 L280 140 L120 140 Z" fill="currentColor" opacity="0.06" stroke="currentColor" strokeWidth="0.8" />
      <path d="M120 160 L280 160 L250 240 L150 240 Z" fill="currentColor" opacity="0.08" stroke="currentColor" strokeWidth="0.8" />
      <path d="M150 260 L250 260 L220 340 L180 340 Z" fill="currentColor" opacity="0.1" stroke="currentColor" strokeWidth="0.8" />
      {/* Labels */}
      <text x="175" y="105" fill="currentColor" fontSize="11" fontWeight="600" opacity="0.25" textAnchor="middle">LEADS</text>
      <text x="175" y="210" fill="currentColor" fontSize="11" fontWeight="600" opacity="0.3" textAnchor="middle">QUALIFY</text>
      <text x="175" y="310" fill="currentColor" fontSize="11" fontWeight="600" opacity="0.35" textAnchor="middle">CLOSE</text>
      {/* Flow arrows */}
      <path d="M200 140 L200 160" stroke="currentColor" strokeWidth="1" opacity="0.2" markerEnd="url(#arrowS)" />
      <path d="M200 240 L200 260" stroke="currentColor" strokeWidth="1" opacity="0.25" markerEnd="url(#arrowS)" />
      {/* Metric boxes */}
      <rect x="310" y="75" width="60" height="30" rx="4" fill="currentColor" opacity="0.08" stroke="currentColor" strokeWidth="0.5" />
      <text x="340" y="95" fill="currentColor" fontSize="10" opacity="0.2" textAnchor="middle">2,400</text>
      <rect x="310" y="175" width="60" height="30" rx="4" fill="currentColor" opacity="0.1" stroke="currentColor" strokeWidth="0.5" />
      <text x="340" y="195" fill="currentColor" fontSize="10" opacity="0.25" textAnchor="middle">480</text>
      <rect x="310" y="275" width="60" height="30" rx="4" fill="currentColor" opacity="0.12" stroke="currentColor" strokeWidth="0.5" />
      <text x="340" y="295" fill="currentColor" fontSize="10" opacity="0.3" textAnchor="middle">120</text>
      <defs>
        <marker id="arrowS" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" opacity="0.2" />
        </marker>
      </defs>
    </svg>,

    /* 2 — Marketing: brand network / ecosystem */
    <svg key={2} viewBox="0 0 400 400" fill="none" className={cls}>
      {/* Central brand node */}
      <circle cx="200" cy="200" r="35" fill="currentColor" opacity="0.08" stroke="currentColor" strokeWidth="1" />
      <text x="200" y="196" fill="currentColor" fontSize="10" fontWeight="700" opacity="0.25" textAnchor="middle">BRAND</text>
      <text x="200" y="210" fill="currentColor" fontSize="8" opacity="0.15" textAnchor="middle">CORE</text>
      {/* Orbital nodes */}
      {[
        { x: 200, y: 80, label: "SOCIAL" },
        { x: 310, y: 130, label: "CONTENT" },
        { x: 330, y: 240, label: "DIGITAL" },
        { x: 260, y: 330, label: "EMAIL" },
        { x: 140, y: 330, label: "PR" },
        { x: 70, y: 240, label: "SEO" },
        { x: 90, y: 130, label: "ADS" },
      ].map((n, i) => (
        <g key={i}>
          <line x1="200" y1="200" x2={n.x} y2={n.y} stroke="currentColor" strokeWidth="0.5" opacity="0.1" />
          <circle cx={n.x} cy={n.y} r="24" fill="currentColor" opacity="0.06" stroke="currentColor" strokeWidth="0.6" />
          <text x={n.x} y={n.y + 4} fill="currentColor" fontSize="8" fontWeight="600" opacity="0.2" textAnchor="middle">{n.label}</text>
        </g>
      ))}
      {/* Outer ring */}
      <circle cx="200" cy="200" r="150" stroke="currentColor" strokeWidth="0.3" opacity="0.06" />
      <circle cx="200" cy="200" r="120" stroke="currentColor" strokeWidth="0.3" opacity="0.04" strokeDasharray="4 4" />
    </svg>,

    /* 3 — Security: shield with monitoring elements */
    <svg key={3} viewBox="0 0 400 400" fill="none" className={cls}>
      {/* Shield */}
      <path d="M200 40 L320 90 L320 200 C320 280 265 340 200 370 C135 340 80 280 80 200 L80 90 Z"
        fill="currentColor" opacity="0.05" stroke="currentColor" strokeWidth="1.2" />
      <path d="M200 70 L290 110 L290 200 C290 265 250 315 200 340 C150 315 110 265 110 200 L110 110 Z"
        fill="currentColor" opacity="0.04" stroke="currentColor" strokeWidth="0.6" />
      {/* Camera icons inside shield */}
      <rect x="160" y="130" width="30" height="20" rx="3" stroke="currentColor" strokeWidth="0.8" opacity="0.2" />
      <circle cx="175" cy="140" r="5" stroke="currentColor" strokeWidth="0.8" opacity="0.2" />
      <rect x="210" y="130" width="30" height="20" rx="3" stroke="currentColor" strokeWidth="0.8" opacity="0.2" />
      <circle cx="225" cy="140" r="5" stroke="currentColor" strokeWidth="0.8" opacity="0.2" />
      {/* Lock icon */}
      <rect x="180" y="190" width="40" height="30" rx="4" stroke="currentColor" strokeWidth="1" opacity="0.25" />
      <path d="M190 190 L190 178 C190 170 195 165 200 165 C205 165 210 170 210 178 L210 190"
        stroke="currentColor" strokeWidth="1" opacity="0.2" />
      <circle cx="200" cy="205" r="3" fill="currentColor" opacity="0.25" />
      {/* Scanning line */}
      <line x1="110" y1="250" x2="290" y2="250" stroke="currentColor" strokeWidth="0.5" opacity="0.12" strokeDasharray="3 3" />
      {/* Status indicators */}
      <circle cx="140" cy="280" r="4" fill="#22c55e" opacity="0.3" />
      <text x="150" y="284" fill="currentColor" fontSize="8" opacity="0.2">ONLINE</text>
      <circle cx="220" cy="280" r="4" fill="#22c55e" opacity="0.3" />
      <text x="230" y="284" fill="currentColor" fontSize="8" opacity="0.2">ACTIVE</text>
      <circle cx="300" cy="280" r="4" fill="#22c55e" opacity="0.3" />
      <text x="160" y="310" fill="currentColor" fontSize="8" opacity="0.15" textAnchor="middle">12 CAMERAS · 3 ACCESS POINTS · ALL SECURE</text>
    </svg>,

    /* 4 — Web Dev: code + wireframe composition */
    <svg key={4} viewBox="0 0 400 400" fill="none" className={cls}>
      {/* Browser window */}
      <rect x="40" y="60" width="320" height="240" rx="8" fill="currentColor" opacity="0.05" stroke="currentColor" strokeWidth="1" />
      {/* Title bar */}
      <rect x="40" y="60" width="320" height="28" rx="8" fill="currentColor" opacity="0.04" />
      <circle cx="58" cy="74" r="4" fill="currentColor" opacity="0.12" />
      <circle cx="72" cy="74" r="4" fill="currentColor" opacity="0.12" />
      <circle cx="86" cy="74" r="4" fill="currentColor" opacity="0.12" />
      <rect x="130" y="70" width="180" height="8" rx="4" fill="currentColor" opacity="0.06" />
      {/* Wireframe blocks */}
      <rect x="55" y="100" width="140" height="12" rx="2" fill="currentColor" opacity="0.06" />
      <rect x="55" y="120" width="100" height="8" rx="2" fill="currentColor" opacity="0.04" />
      <rect x="55" y="140" width="290" height="80" rx="4" fill="currentColor" opacity="0.06" stroke="currentColor" strokeWidth="0.5" />
      <rect x="210" y="100" width="130" height="120" rx="4" fill="currentColor" opacity="0.05" stroke="currentColor" strokeWidth="0.5" />
      <rect x="55" y="230" width="130" height="10" rx="2" fill="currentColor" opacity="0.05" />
      <rect x="55" y="248" width="90" height="10" rx="2" fill="currentColor" opacity="0.04" />
      {/* Code overlay */}
      <rect x="60" y="280" width="280" height="90" rx="6" fill="currentColor" opacity="0.07" stroke="currentColor" strokeWidth="0.6" />
      <text x="75" y="300" fill="currentColor" fontSize="8" fontFamily="monospace" opacity="0.2">{"<div class='hero'>"}</text>
      <text x="85" y="314" fill="currentColor" fontSize="8" fontFamily="monospace" opacity="0.16">{"<h1>Welcome</h1>"}</text>
      <text x="85" y="328" fill="currentColor" fontSize="8" fontFamily="monospace" opacity="0.16">{"<p>Premium digital</p>"}</text>
      <text x="75" y="342" fill="currentColor" fontSize="8" fontFamily="monospace" opacity="0.2">{"</div>"}</text>
      {/* Cursor blink */}
      <rect x="198" y="318" width="1" height="12" fill="currentColor" opacity="0.3">
        <animate attributeName="opacity" values="0.3;0;0.3" dur="1.2s" repeatCount="indefinite" />
      </rect>
    </svg>,

    /* 5 — AI Integration: neural network connecting systems */
    <svg key={5} viewBox="0 0 400 400" fill="none" className={cls}>
      {/* Central AI node */}
      <circle cx="200" cy="200" r="30" fill="currentColor" opacity="0.1" stroke="currentColor" strokeWidth="1.2" />
      <text x="200" y="196" fill="currentColor" fontSize="11" fontWeight="700" opacity="0.3" textAnchor="middle">AI</text>
      <text x="200" y="210" fill="currentColor" fontSize="7" opacity="0.18" textAnchor="middle">ENGINE</text>
      {/* Pulse rings */}
      <circle cx="200" cy="200" r="45" stroke="currentColor" strokeWidth="0.4" opacity="0.08">
        <animate attributeName="r" values="45;65;45" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.08;0.02;0.08" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="200" cy="200" r="60" stroke="currentColor" strokeWidth="0.3" opacity="0.05">
        <animate attributeName="r" values="60;80;60" dur="4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.05;0.01;0.05" dur="4s" repeatCount="indefinite" />
      </circle>
      {/* Connected systems */}
      {[
        { x: 80, y: 100, label: "CRM" },
        { x: 320, y: 100, label: "ERP" },
        { x: 340, y: 240, label: "WEB" },
        { x: 280, y: 350, label: "DATA" },
        { x: 120, y: 350, label: "MAIL" },
        { x: 60, y: 240, label: "API" },
      ].map((n, i) => (
        <g key={i}>
          <line x1="200" y1="200" x2={n.x} y2={n.y}
            stroke="currentColor" strokeWidth="0.6" opacity="0.12" strokeDasharray="3 3">
            <animate attributeName="stroke-dashoffset" from="0" to="12" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
          </line>
          <circle cx={n.x} cy={n.y} r="20" fill="currentColor" opacity="0.06" stroke="currentColor" strokeWidth="0.8" />
          <text x={n.x} y={n.y + 4} fill="currentColor" fontSize="9" fontWeight="600" opacity="0.22" textAnchor="middle">{n.label}</text>
        </g>
      ))}
      {/* Data flow particles */}
      <circle r="2" fill="currentColor" opacity="0.3">
        <animateMotion dur="3s" repeatCount="indefinite" path="M200,200 L80,100" />
      </circle>
      <circle r="2" fill="currentColor" opacity="0.25">
        <animateMotion dur="3.5s" repeatCount="indefinite" path="M200,200 L320,100" />
      </circle>
      <circle r="2" fill="currentColor" opacity="0.2">
        <animateMotion dur="4s" repeatCount="indefinite" path="M200,200 L340,240" />
      </circle>
    </svg>,

    /* 6 — AI Chatbot: conversation interface */
    <svg key={6} viewBox="0 0 400 400" fill="none" className={cls}>
      {/* Chat window */}
      <rect x="60" y="40" width="280" height="320" rx="12" fill="currentColor" opacity="0.05" stroke="currentColor" strokeWidth="0.8" />
      {/* Header */}
      <rect x="60" y="40" width="280" height="40" rx="12" fill="currentColor" opacity="0.05" />
      <rect x="60" y="68" width="280" height="12" fill="currentColor" opacity="0.05" />
      <circle cx="85" cy="60" r="10" fill="currentColor" opacity="0.1" stroke="currentColor" strokeWidth="0.6" />
      <text x="85" cy="64" y="64" fill="currentColor" fontSize="8" fontWeight="700" opacity="0.25" textAnchor="middle">AI</text>
      <text x="105" y="58" fill="currentColor" fontSize="9" fontWeight="600" opacity="0.2">Yasir AI Assistant</text>
      <text x="105" y="68" fill="currentColor" fontSize="7" opacity="0.12">Online now</text>
      {/* Bot message */}
      <rect x="80" y="100" width="180" height="40" rx="10" fill="currentColor" opacity="0.06" />
      <text x="95" y="118" fill="currentColor" fontSize="8" opacity="0.2">Hi! I can help you find the</text>
      <text x="95" y="130" fill="currentColor" fontSize="8" opacity="0.2">right security solution.</text>
      {/* User message */}
      <rect x="160" y="160" width="160" height="35" rx="10" fill="currentColor" opacity="0.08" />
      <text x="175" y="178" fill="currentColor" fontSize="8" opacity="0.22">I need CCTV for my office</text>
      {/* Bot reply */}
      <rect x="80" y="210" width="200" height="50" rx="10" fill="currentColor" opacity="0.06" />
      <text x="95" y="228" fill="currentColor" fontSize="8" opacity="0.2">Great choice! Based on your</text>
      <text x="95" y="240" fill="currentColor" fontSize="8" opacity="0.2">space, I recommend 4K IP</text>
      <text x="95" y="252" fill="currentColor" fontSize="8" opacity="0.18">cameras with night vision.</text>
      {/* Typing indicator */}
      <rect x="80" y="280" width="60" height="30" rx="10" fill="currentColor" opacity="0.05" />
      <circle cx="96" cy="295" r="3" fill="currentColor" opacity="0.15">
        <animate attributeName="opacity" values="0.15;0.05;0.15" dur="1s" repeatCount="indefinite" />
      </circle>
      <circle cx="110" cy="295" r="3" fill="currentColor" opacity="0.15">
        <animate attributeName="opacity" values="0.05;0.15;0.05" dur="1s" repeatCount="indefinite" begin="0.2s" />
      </circle>
      <circle cx="124" cy="295" r="3" fill="currentColor" opacity="0.15">
        <animate attributeName="opacity" values="0.15;0.05;0.15" dur="1s" repeatCount="indefinite" begin="0.4s" />
      </circle>
      {/* Input bar */}
      <rect x="80" y="325" width="240" height="24" rx="12" fill="currentColor" opacity="0.06" stroke="currentColor" strokeWidth="0.5" />
      <text x="100" y="341" fill="currentColor" fontSize="8" opacity="0.12">Type a message...</text>
    </svg>,
  ];

  return (
    <div className="absolute inset-0 flex items-center justify-end pointer-events-none">
      <div className="w-[340px] h-[340px] lg:w-[420px] lg:h-[420px] xl:w-[480px] xl:h-[480px] mr-4 lg:mr-12 xl:mr-20 text-white/40">
        <motion.div
          key={`illust-${index}`}
          initial={{ opacity: 0, scale: 0.85, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.9, rotate: 5 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="w-full h-full"
        >
          {illustrations[index]}
        </motion.div>
      </div>
    </div>
  );
}

/* ── Main Component ─────────────────────────────────────────────── */

const AUTOPLAY_MS = 9000;

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState<Record<number, boolean>>({});

  const goTo = useCallback(
    (index: number) => {
      setDirection(index > current ? 1 : -1);
      setCurrent(index);
      setProgress(0);
    },
    [current]
  );

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((p) => (p + 1) % slides.length);
    setProgress(0);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((p) => (p - 1 + slides.length) % slides.length);
    setProgress(0);
  }, []);

  /* Autoplay with progress */
  useEffect(() => {
    if (isPaused) return;
    const tick = 40;
    const id = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          next();
          return 0;
        }
        return p + 100 / (AUTOPLAY_MS / tick);
      });
    }, tick);
    return () => clearInterval(id);
  }, [isPaused, next]);

  /* Preload images */
  useEffect(() => {
    slides.forEach((s, i) => {
      const img = new Image();
      img.onload = () => setImagesLoaded((prev) => ({ ...prev, [i]: true }));
      img.src = s.image;
    });
  }, []);

  const slide = slides[current];

  const contentVariants = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 80 : -80 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -80 : 80 }),
  };

  return (
    <section
      id="hero"
      className="relative h-[100svh] min-h-[640px] overflow-hidden bg-navy-dark"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Hero carousel"
    >
      {/* ── Background images ── */}
      <AnimatePresence mode="sync">
        <motion.div
          key={`bg-${current}`}
          initial={{ opacity: 0, scale: 1.12 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.06 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${slide.image})`,
              animation: "kenBurns 14s ease-in-out infinite alternate",
            }}
          />
          {/* Cinematic overlays */}
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-r",
              slide.overlayColor
            )}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-transparent to-navy-dark/30" />
          {/* Subtle color wash matching slide accent */}
          <div
            className="absolute inset-0 mix-blend-overlay opacity-20"
            style={{
              background: `radial-gradient(ellipse at 70% 50%, ${slide.accentColor}33 0%, transparent 70%)`,
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* ── Grid pattern ── */}
      <div className="absolute inset-0 bg-grid-pattern-dark opacity-15 pointer-events-none" />

      {/* ── Illustration ── */}
      <SlideIllustration index={current} />

      {/* ── Text Content ── */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          variants={contentVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 flex items-center z-10"
        >
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 w-full pt-24 pb-24">
            <div className="max-w-2xl">
              {/* Eyebrow */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.5 }}
                className="mb-5"
              >
                <span
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-[11px] font-semibold uppercase tracking-[0.2em] backdrop-blur-md"
                  style={{
                    borderColor: `${slide.accentColor}30`,
                    backgroundColor: `${slide.accentColor}10`,
                    color: slide.accentColor,
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full animate-pulse"
                    style={{ backgroundColor: slide.accentColor }}
                  />
                  {slide.eyebrow}
                </span>
              </motion.div>

              {/* Subheading */}
              {slide.subheading && (
                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.5 }}
                  className="text-xs font-semibold uppercase tracking-[0.25em] mb-3"
                  style={{ color: `${slide.accentColor}CC` }}
                >
                  {slide.subheading}
                </motion.p>
              )}

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.3,
                  duration: 0.8,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="font-display text-[2.5rem] sm:text-5xl md:text-6xl lg:text-[4.5rem] font-bold text-white leading-[1.06] tracking-tight mb-6"
              >
                {slide.headline}
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="text-base sm:text-lg text-white/50 max-w-lg leading-relaxed mb-10"
              >
                {slide.description}
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65, duration: 0.6 }}
                className="flex flex-wrap gap-4"
              >
                <Link
                  to={slide.ctaLink}
                  className="group inline-flex items-center gap-2.5 px-8 py-4 text-white font-semibold text-sm rounded-xl transition-all duration-300 hover:-translate-y-0.5 shadow-xl"
                  style={{
                    backgroundColor: slide.accentColor,
                    boxShadow: `0 8px 30px ${slide.accentColor}30`,
                  }}
                >
                  {slide.cta}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to={slide.secondaryLink}
                  className="inline-flex items-center gap-2 px-8 py-4 border border-white/15 text-white/70 font-medium text-sm rounded-xl hover:bg-white/5 hover:border-white/25 hover:text-white transition-all duration-300 hover:-translate-y-0.5 backdrop-blur-sm"
                >
                  {slide.secondary}
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ── Bottom Controls ── */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 pb-8">
          <div className="flex items-end justify-between">
            {/* Slide counter */}
            <div className="flex items-baseline gap-1.5">
              <span
                className="text-6xl sm:text-7xl font-bold tabular-nums"
                style={{ color: `${slide.accentColor}15` }}
              >
                {String(current + 1).padStart(2, "0")}
              </span>
              <span className="text-xs text-white/20 font-medium tracking-wider">
                / {String(slides.length).padStart(2, "0")}
              </span>
            </div>

            {/* Progress + arrows */}
            <div className="flex items-center gap-6">
              {/* Progress bars */}
              <div className="hidden sm:flex items-center gap-2">
                {slides.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className="relative h-[3px] rounded-full overflow-hidden transition-all duration-500 bg-white/10"
                    style={{ width: i === current ? 48 : 14 }}
                    aria-label={`Go to slide ${i + 1}: ${s.eyebrow}`}
                  >
                    {i === current && (
                      <motion.span
                        className="absolute inset-y-0 left-0 rounded-full"
                        style={{
                          width: `${progress}%`,
                          backgroundColor: slide.accentColor,
                        }}
                      />
                    )}
                    {i < current && (
                      <span
                        className="absolute inset-y-0 left-0 rounded-full w-full opacity-40"
                        style={{ backgroundColor: slide.accentColor }}
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Pause indicator */}
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="p-1.5 rounded-full text-white/20 hover:text-white/50 transition-colors"
                aria-label={isPaused ? "Resume autoplay" : "Pause autoplay"}
              >
                {isPaused ? (
                  <Play className="w-3 h-3" />
                ) : (
                  <span className="block w-3 h-3 border-l-2 border-r-2 border-current" />
                )}
              </button>

              {/* Arrows */}
              <div className="flex items-center gap-2">
                <button
                  onClick={prev}
                  className="p-2.5 rounded-full border border-white/10 text-white/30 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all duration-200"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={next}
                  className="p-2.5 rounded-full border border-white/10 text-white/30 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all duration-200"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom fade ── */}
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-navy to-transparent pointer-events-none z-[15]" />

      {/* ── Ken Burns keyframes ── */}
      <style>{`
        @keyframes kenBurns {
          0% { transform: scale(1) translate(0, 0); }
          100% { transform: scale(1.08) translate(-1.5%, -0.8%); }
        }
      `}</style>
    </section>
  );
}
