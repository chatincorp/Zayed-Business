import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  Send,
  X,
  Minus,
  MessageSquare,
  ChevronDown,
  Sparkles,
  Phone,
  Calendar,
  Shield,
  Globe,
  Cpu,
  BarChart3,
  Target,
} from "lucide-react";

interface Message {
  id: number;
  sender: "bot" | "user";
  text: string;
  timestamp: Date;
  quickReplies?: QuickReply[];
}

interface QuickReply {
  label: string;
  action: string;
  icon?: React.ReactNode;
}

/* ── Curated Knowledge Base ─────────────────────────────────── */

const knowledgeBase: Record<string, { text: string; quickReplies?: QuickReply[] }> = {
  greeting: {
    text: "Hello! 👋 I'm YasBot, the intelligent assistant for Yasir Zayed. I can help you with:\n\n• Our services and solutions\n• Pricing and plans\n• Scheduling a consultation\n• Technical support\n• General inquiries\n\nWhat would you like to know?",
    quickReplies: [
      { label: "Our Services", action: "services", icon: <Sparkles className="w-3 h-3" /> },
      { label: "Pricing", action: "pricing", icon: <BarChart3 className="w-3 h-3" /> },
      { label: "Book Consultation", action: "book", icon: <Calendar className="w-3 h-3" /> },
      { label: "Contact Us", action: "contact", icon: <Phone className="w-3 h-3" /> },
    ],
  },
  services: {
    text: "We offer a comprehensive range of services:\n\n📊 **Business Development** — Strategic planning, market research, growth strategies\n\n💼 **Sales & Marketing** — Sales strategy, CRM, lead generation, digital marketing\n\n🌐 **Web Development** — Corporate websites, web apps, e-commerce platforms\n\n🤖 **AI Integration** — AI systems, custom chatbots, workflow automation\n\n🔒 **Security Solutions** — CCTV, access control, intrusion detection\n\n⚙️ **WordPress Development** — Custom themes, WooCommerce, plugins\n\nWould you like details on any specific service?",
    quickReplies: [
      { label: "AI Solutions", action: "ai", icon: <Cpu className="w-3 h-3" /> },
      { label: "Web Development", action: "web", icon: <Globe className="w-3 h-3" /> },
      { label: "Security", action: "security", icon: <Shield className="w-3 h-3" /> },
      { label: "Business Dev", action: "business", icon: <Target className="w-3 h-3" /> },
    ],
  },
  ai: {
    text: "Our AI solutions include:\n\n🤖 **Custom AI Chatbots** — Intelligent conversational systems built for your business, handling sales, support, bookings and more.\n\n🧠 **AI System Integration** — Embed AI into your existing tools and workflows for smarter decisions.\n\n⚡ **Workflow Automation** — Connect your tools and automate repetitive processes.\n\n📈 **AI Analytics** — Data-driven insights powered by machine learning.\n\nAll solutions are tailored to your specific business needs. Shall I connect you with our AI specialist?",
    quickReplies: [
      { label: "Book AI Consultation", action: "book_ai" },
      { label: "View Pricing", action: "pricing" },
      { label: "See Demo", action: "demo" },
    ],
  },
  web: {
    text: "Our web development services:\n\n🌐 **Corporate Websites** — Modern, responsive, high-performance sites built around your brand.\n\n💻 **Web Applications** — Custom dashboards, portals and business tools.\n\n🛒 **E-Commerce** — Feature-rich online stores with seamless checkout.\n\n📝 **WordPress** — Custom themes, WooCommerce, and bespoke functionality.\n\nStarting from $2,500 for corporate sites. Want to discuss your project?",
    quickReplies: [
      { label: "Get a Quote", action: "quote" },
      { label: "View Portfolio", action: "portfolio" },
      { label: "Book Consultation", action: "book" },
    ],
  },
  security: {
    text: "Our security solutions:\n\n📹 **CCTV & Surveillance** — Professional IP camera systems with remote monitoring.\n\n🔐 **Access Control** — Keycard, biometric and smart entry systems.\n\n🚨 **Intrusion Detection** — Alarm systems with 24/7 monitoring.\n\n🛡️ **Security Assessments** — Comprehensive on-site audits with detailed reports.\n\nAll installations are custom-designed for your environment. Need a security assessment?",
    quickReplies: [
      { label: "Request Assessment", action: "book_security" },
      { label: "View Solutions", action: "services" },
      { label: "Contact Sales", action: "contact" },
    ],
  },
  business: {
    text: "Our business development services:\n\n📋 **Strategic Planning** — Comprehensive growth strategies aligned with your vision.\n\n🔍 **Market Research** — Data-driven intelligence for better decisions.\n\n🏢 **Company Registration** — Full registration services in Kenya for local and foreign companies.\n\n🤝 **Partnership Development** — Strategic alliances that create mutual value.\n\n📈 **Expansion Strategy** — Market entry and geographic growth roadmaps.\n\nWe register Private Ltd, PLC, Sole Proprietorships, Partnerships, and more. Kenya is our base country.",
    quickReplies: [
      { label: "Register a Company", action: "register" },
      { label: "Book Strategy Session", action: "book" },
      { label: "View Fees", action: "pricing" },
    ],
  },
  pricing: {
    text: "Our subscription plans:\n\n⚡ **Starter** — $499/month\nMonthly strategy sessions, email support, basic market research.\n\n👑 **Growth** — $1,499/month (Most Popular)\nWeekly sessions, dedicated account manager, full sales & marketing strategy, AI recommendations.\n\n🏢 **Enterprise** — Custom pricing\nSenior-level partnership, unlimited consulting, full tech implementation, 24/7 support.\n\nAdd-ons available: Security Assessment ($750), AI Chatbot ($2,500), Custom Landing Page ($1,500).",
    quickReplies: [
      { label: "View All Plans", action: "view_pricing" },
      { label: "Compare Plans", action: "compare" },
      { label: "Book Free Consultation", action: "book" },
    ],
  },
  book: {
    text: "I'd love to connect you with our team! You can:\n\n📞 **Call us:**\n• +254 114 712 989\n• +254 717 227 012\n\n📧 **Email:** info@yasirzayed.com\n\n📅 **Book online:** Visit our contact page to schedule an appointment, meeting or request a quotation.\n\n💬 **WhatsApp:** Chat with us instantly on WhatsApp.\n\nWhich would you prefer?",
    quickReplies: [
      { label: "Visit Contact Page", action: "contact_page" },
      { label: "WhatsApp Us", action: "whatsapp" },
      { label: "Call Now", action: "call" },
    ],
  },
  contact: {
    text: "Here's how to reach us:\n\n📞 **Phone:**\n• +254 114 712 989\n• +254 717 227 012\n\n📧 **Email:** info@yasirzayed.com\n\n📍 **Location:** Kenya (Base Country)\n\n🌐 **Website:** yasirzayed.com\n\n💬 **WhatsApp:** +254 717 227 012\n\nOur team typically responds within 24 hours.",
    quickReplies: [
      { label: "Book Consultation", action: "book" },
      { label: "Send WhatsApp", action: "whatsapp" },
      { label: "Back to Menu", action: "greeting" },
    ],
  },
  book_ai: {
    text: "Great choice! To book an AI consultation:\n\n1. Visit our **Contact** page\n2. Select **Book an Appointment**\n3. Choose **AI Consultation**\n4. Pick your preferred date and time\n\nOr message us on WhatsApp for a faster response. Our AI specialists are available Monday–Friday, 8 AM–6 PM EAT.",
    quickReplies: [
      { label: "Go to Contact Page", action: "contact_page" },
      { label: "WhatsApp Us", action: "whatsapp" },
    ],
  },
  book_security: {
    text: "To request a security assessment:\n\n1. Visit our **Contact** page\n2. Select **Request a Quotation**\n3. Choose **Security** as the service\n4. Describe your premises and requirements\n\nOur security team will prepare a custom proposal within 48 hours. Assessments start at **$750**.",
    quickReplies: [
      { label: "Request Quotation", action: "contact_page" },
      { label: "WhatsApp Us", action: "whatsapp" },
    ],
  },
  quote: {
    text: "To get a custom quote for web development:\n\n1. Visit our **Contact** page\n2. Select **Request a Quotation**\n3. Choose **Web Development** or **WordPress**\n4. Describe your project requirements\n\nWe typically respond with a detailed proposal within 2–3 business days.",
    quickReplies: [
      { label: "Request Quote", action: "contact_page" },
      { label: "View Pricing", action: "pricing" },
    ],
  },
  register: {
    text: "We offer full company registration services in **Kenya**:\n\n📋 **Private Limited Company** — KES 25,000–45,000 (5–10 days)\n📋 **Public Limited Company** — KES 65,000–120,000 (10–15 days)\n📋 **Limited by Guarantee** — KES 20,000–35,000\n📋 **Sole Proprietorship** — KES 8,000–15,000\n📋 **Partnership** — KES 15,000–28,000\n📋 **Community Groups** — KES 5,000–12,000\n\nWe also handle **foreign company registration** — branch offices, subsidiaries and joint ventures.\n\nPartners can facilitate investments in other jurisdictions where our operations are limited.",
    quickReplies: [
      { label: "Start Registration", action: "contact_page" },
      { label: "View All Fees", action: "pricing" },
    ],
  },
  whatsapp: {
    text: "Click the button below to chat with us on WhatsApp: 💬\n\nYou'll be connected with our team directly. We typically respond within minutes during business hours.",
    quickReplies: [
      { label: "Open WhatsApp", action: "whatsapp_link" },
      { label: "Back to Menu", action: "greeting" },
    ],
  },
  demo: {
    text: "You can see live demos on our homepage! Scroll down to find:\n\n🖥️ **AI Integration Preview** — Watch a system transform before and after AI.\n💬 **Chatbot Demo** — See our AI chatbots in action across different tabs.\n⚡ **Workflow Automation** — Animated pipeline showing connected tools.\n🌐 **Live Demo Previews** — Interactive mockups of websites, web apps and e-commerce stores.\n\nVisit our homepage to explore all demos.",
    quickReplies: [
      { label: "Go to Homepage", action: "home" },
      { label: "Back to Menu", action: "greeting" },
    ],
  },
  fallback: {
    text: "I'm not sure I understand that fully. Let me connect you with our team for personalized assistance.\n\nYou can:\n📞 Call: +254 717 227 012\n📧 Email: info@yasirzayed.com\n💬 WhatsApp: +254 717 227 012\n\nOr choose from the options below:",
    quickReplies: [
      { label: "Our Services", action: "services" },
      { label: "Book Consultation", action: "book" },
      { label: "Contact Us", action: "contact" },
      { label: "Back to Menu", action: "greeting" },
    ],
  },
};

function getResponse(input: string): { text: string; quickReplies?: QuickReply[] } {
  const lower = input.toLowerCase();

  if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey") || lower.includes("start") || lower.includes("menu")) {
    return knowledgeBase.greeting;
  }
  if (lower.includes("service") || lower.includes("what do you") || lower.includes("offer") || lower.includes("help")) {
    return knowledgeBase.services;
  }
  if (lower.includes("ai") || lower.includes("chatbot") || lower.includes("automation") || lower.includes("intelligent")) {
    return knowledgeBase.ai;
  }
  if (lower.includes("web") || lower.includes("website") || lower.includes("develop") || lower.includes("wordpress") || lower.includes("ecommerce") || lower.includes("e-commerce")) {
    return knowledgeBase.web;
  }
  if (lower.includes("security") || lower.includes("cctv") || lower.includes("surveillance") || lower.includes("access control") || lower.includes("alarm")) {
    return knowledgeBase.security;
  }
  if (lower.includes("business") || lower.includes("growth") || lower.includes("strategy") || lower.includes("strategic") || lower.includes("register") || lower.includes("company")) {
    return knowledgeBase.business;
  }
  if (lower.includes("pric") || lower.includes("cost") || lower.includes("plan") || lower.includes("fee") || lower.includes("how much") || lower.includes("rate")) {
    return knowledgeBase.pricing;
  }
  if (lower.includes("book") || lower.includes("appointment") || lower.includes("meeting") || lower.includes("schedule") || lower.includes("consult")) {
    return knowledgeBase.book;
  }
  if (lower.includes("contact") || lower.includes("phone") || lower.includes("email") || lower.includes("reach") || lower.includes("call")) {
    return knowledgeBase.contact;
  }
  if (lower.includes("whatsapp") || lower.includes("wa ") || lower.includes("chat on")) {
    return knowledgeBase.whatsapp;
  }
  if (lower.includes("demo") || lower.includes("preview") || lower.includes("example") || lower.includes("sample")) {
    return knowledgeBase.demo;
  }
  if (lower.includes("register") || lower.includes("incorporat") || lower.includes("formation") || lower.includes("sole proprietor")) {
    return knowledgeBase.register;
  }
  if (lower.includes("quote") || lower.includes("quotation") || lower.includes("proposal") || lower.includes("estimate")) {
    return knowledgeBase.quote;
  }

  return knowledgeBase.fallback;
}

/* ── Component ─────────────────────────────────────────────── */

export default function YasBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const idCounter = useRef(0);

  const navigate = useNavigate();
  const greetingSentRef = useRef(false);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > 0 || isTyping) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const openChat = useCallback(() => {
    setIsOpen(true);
    setIsMinimized(false);
    setUnreadCount(0);
    if (!greetingSentRef.current) {
      greetingSentRef.current = true;
      const greeting = knowledgeBase.greeting;
      setMessages([
        {
          id: 1,
          sender: "bot",
          text: greeting.text,
          timestamp: new Date(),
          quickReplies: greeting.quickReplies,
        },
      ]);
    }
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const nextId = useCallback(() => {
    idCounter.current += 1;
    return idCounter.current;
  }, []);

  const handleQuickReply = useCallback((action: string) => {
    if (action === "contact_page") {
      navigate("/contact");
      return;
    }
    if (action === "home") {
      navigate("/");
      return;
    }
    if (action === "view_pricing") {
      navigate("/pricing");
      return;
    }
    if (action === "whatsapp_link") {
      window.location.assign("https://wa.me/254717227012?text=Hello%20Yasir%20Zayed%2C%20I%27d%20like%20to%20inquire%20about%20your%20services.");
      return;
    }
    if (action === "call") {
      window.location.assign("tel:+254717227012");
      return;
    }

    const response = knowledgeBase[action] || knowledgeBase.fallback;

    const userMsg: Message = {
      id: nextId(),
      sender: "user",
      text: action.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    const delay = 800 + (idCounter.current % 600);
    setTimeout(() => {
      const botMsg: Message = {
        id: nextId(),
        sender: "bot",
        text: response.text,
        timestamp: new Date(),
        quickReplies: response.quickReplies,
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
      if (!isOpen) setUnreadCount((c) => c + 1);
    }, delay);
  }, [navigate, nextId, isOpen]);

  const handleSend = useCallback(() => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: nextId(),
      sender: "user",
      text: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    const response = getResponse(input);

    const delay = 800 + (idCounter.current % 800);
    setTimeout(() => {
      const botMsg: Message = {
        id: nextId(),
        sender: "bot",
        text: response.text,
        timestamp: new Date(),
        quickReplies: response.quickReplies,
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
      if (!isOpen) setUnreadCount((c) => c + 1);
    }, delay);
  }, [input, nextId, isOpen]);

  return (
    <>
      {/* ── Chat Window ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed bottom-24 right-4 sm:right-6 z-[80] w-[360px] max-w-[calc(100vw-2rem)] rounded-2xl bg-card border border-border shadow-2xl shadow-black/15 overflow-hidden flex flex-col"
            style={{ height: isMinimized ? "auto" : "520px" }}
          >
            {/* Header */}
            <div className="bg-navy-dark px-4 py-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-electric to-electric-dark flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-white font-bold text-sm">YasBot</span>
                    <Sparkles className="w-3 h-3 text-electric" />
                  </div>
                  <span className="text-white/40 text-[10px]">AI Assistant • Online</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  aria-label={isMinimized ? "Expand chat" : "Minimize chat"}
                  className="p-1.5 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/10 transition-colors"
                >
                  {isMinimized ? <ChevronDown className="w-4 h-4 rotate-180" /> : <Minus className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  aria-label="Close chat"
                  className="p-1.5 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            {!isMinimized && (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-none bg-background">
                  {messages.map((msg) => (
                    <div key={msg.id}>
                      <div className={`flex gap-2 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                        {msg.sender === "bot" && (
                          <div className="w-7 h-7 rounded-full bg-navy flex items-center justify-center shrink-0 mt-0.5">
                            <Bot className="w-3.5 h-3.5 text-white" />
                          </div>
                        )}
                        <div
                          className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                            msg.sender === "user"
                              ? "bg-electric text-white rounded-br-sm"
                              : "bg-muted text-foreground rounded-bl-sm"
                          }`}
                        >
                          {msg.text.split("**").map((part, i) =>
                            i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                          )}
                        </div>
                      </div>
                      {msg.quickReplies && msg.sender === "bot" && (
                        <div className="flex flex-wrap gap-1.5 mt-2 ml-9">
                          {msg.quickReplies.map((qr) => (
                            <button
                              key={qr.action}
                              onClick={() => handleQuickReply(qr.action)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-electric/10 text-electric text-xs font-medium hover:bg-electric/20 transition-colors border border-electric/15"
                            >
                              {qr.icon}
                              {qr.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex gap-2 items-end">
                      <div className="w-7 h-7 rounded-full bg-navy flex items-center justify-center shrink-0">
                        <Bot className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1.5">
                        {[0, 1, 2].map((i) => (
                          <motion.span
                            key={i}
                            className="w-2 h-2 rounded-full bg-muted-foreground/40"
                            animate={{ opacity: [0.3, 0.8, 0.3] }}
                            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Input */}
                <div className="p-3 border-t border-border bg-card shrink-0">
                  <div className="flex items-center gap-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSend()}
                      placeholder="Ask YasBot anything..."
                      className="flex-1 px-3.5 py-2.5 rounded-xl bg-muted text-foreground text-sm placeholder:text-muted-foreground/50 border-0 focus:outline-none focus:ring-2 focus:ring-electric/30"
                    />
                    <button
                      onClick={handleSend}
                      disabled={!input.trim()}
                      aria-label="Send message"
                      className="w-9 h-9 rounded-xl bg-electric text-white flex items-center justify-center hover:bg-electric-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FAB Button ── */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
        onClick={() => {
          if (isOpen) {
            setIsOpen(false);
          } else {
            openChat();
          }
        }}
        className="fixed bottom-6 right-4 sm:right-6 z-[80] w-14 h-14 rounded-full bg-gradient-to-br from-electric to-electric-dark text-white shadow-xl shadow-electric/30 flex items-center justify-center hover:shadow-electric/50 hover:scale-105 transition-all duration-200"
        aria-label="Open YasBot chat"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <MessageSquare className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Unread badge */}
        <AnimatePresence>
          {unreadCount > 0 && !isOpen && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center"
            >
              {unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}
