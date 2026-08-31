import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Bot,
  ArrowRight,
  Headphones,
  ShoppingCart,
  Headset,
  CalendarCheck,
  Send,
  User,
  Sparkles,
} from "lucide-react";

interface ChatMessage {
  id: number;
  sender: "bot" | "user";
  text: string;
  delay?: number;
}

const chatTabs = [
  {
    id: "sales",
    label: "Sales",
    icon: ShoppingCart,
    color: "emerald",
    messages: [
      { id: 1, sender: "bot" as const, text: "Welcome to Yasir Zayed! I'm your AI sales assistant. How can I help you today?" },
      { id: 2, sender: "user" as const, text: "Hi, I'm looking for a CRM system for my team of 25 people." },
      { id: 3, sender: "bot" as const, text: "Great choice! For a team of 25, I'd recommend our Growth CRM Package. It includes pipeline management, automated follow-ups, team dashboards and integrations with your existing tools." },
      { id: 4, sender: "user" as const, text: "What's the pricing like?" },
      { id: 5, sender: "bot" as const, text: "The Growth Package starts at $1,499/month and includes full CRM implementation, team training and 30 days of dedicated support. Would you like me to prepare a detailed proposal?" },
      { id: 6, sender: "user" as const, text: "Yes, please send me a proposal." },
      { id: 7, sender: "bot" as const, text: "I've scheduled a proposal for your review. Our sales team will reach out within 24 hours with a customized proposal. Is there anything specific you'd like included?" },
    ],
  },
  {
    id: "support",
    label: "Technical Support",
    icon: Headphones,
    color: "blue",
    messages: [
      { id: 1, sender: "bot" as const, text: "Hello! I'm your technical support assistant. I can help with system troubleshooting, setup guidance and maintenance questions. What's the issue?" },
      { id: 2, sender: "user" as const, text: "Our CCTV system in Building B is showing offline cameras on the dashboard." },
      { id: 3, sender: "bot" as const, text: "I'm sorry to hear that. Let me run a quick diagnostic. It looks like cameras B-04 through B-08 lost connection about 2 hours ago. This is typically caused by a network switch in that zone." },
      { id: 4, sender: "user" as const, text: "Can you fix it remotely?" },
      { id: 5, sender: "bot" as const, text: "I've initiated a remote reboot of the network switch serving Building B. The cameras should reconnect within 5 minutes. I'll monitor and notify you once they're all back online." },
      { id: 6, sender: "bot" as const, text: "✅ Update: 5 of 5 cameras are back online. All systems normal. I've logged this incident and scheduled a maintenance check for next week." },
    ],
  },
  {
    id: "customer",
    label: "Customer Care",
    icon: Headset,
    color: "purple",
    messages: [
      { id: 1, sender: "bot" as const, text: "Hi there! Welcome to Yasir Zayed Customer Care. I'm here to assist with any questions about your account, services or billing. How can I help?" },
      { id: 2, sender: "user" as const, text: "I need to update the billing information on my account." },
      { id: 3, sender: "bot" as const, text: "Of course! I can help you update your billing details. For security, I'll need to verify your identity first. Can you confirm the email address associated with your account?" },
      { id: 4, sender: "user" as const, text: "It's jane@acmecorp.co.ke" },
      { id: 5, sender: "bot" as const, text: "Thank you, Jane. I've sent a verification code to jane@acmecorp.co.ke. Once verified, I can help you update your payment method, billing address or invoice preferences." },
      { id: 6, sender: "user" as const, text: "Got it — the code is 482910." },
      { id: 7, sender: "bot" as const, text: "✅ Identity verified. You can now update your billing information. Would you like to change your payment method, update your billing address, or review your current invoices?" },
    ],
  },
  {
    id: "booking",
    label: "Booking & Reservation",
    icon: CalendarCheck,
    color: "amber",
    messages: [
      { id: 1, sender: "bot" as const, text: "Welcome! I'm your booking assistant. I can help you schedule consultations, book meetings or reserve time with our experts. What would you like to book?" },
      { id: 2, sender: "user" as const, text: "I'd like to book a security consultation for next week." },
      { id: 3, sender: "bot" as const, text: "I'd be happy to help with that! I have availability next week on Tuesday at 10:00 AM, Wednesday at 2:00 PM, or Thursday at 11:00 AM. Which works best for you?" },
      { id: 4, sender: "user" as const, text: "Wednesday at 2 PM works. Can it be a video call?" },
      { id: 5, sender: "bot" as const, text: "Perfect! I've booked a 45-minute video consultation with our Security Solutions team for Wednesday at 2:00 PM. You'll receive a calendar invite and video link at your registered email." },
      { id: 6, sender: "bot" as const, text: "📋 Booking confirmed:\n• Service: Security Consultation\n• Date: Wednesday, 2:00 PM\n• Format: Video Call\n• Duration: 45 minutes\n\nIs there anything specific you'd like the team to prepare for?" },
    ],
  },
];

const colorMap: Record<string, { bg: string; text: string; border: string; userBg: string }> = {
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20", userBg: "bg-emerald-500/20" },
  blue: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20", userBg: "bg-blue-500/20" },
  purple: { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/20", userBg: "bg-purple-500/20" },
  amber: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20", userBg: "bg-amber-500/20" },
};

export default function ChatbotDemo() {
  const [ref, inView] = useInView({ threshold: 0.15, triggerOnce: true });
  const [activeTab, setActiveTab] = useState("sales");
  const [visibleMessages, setVisibleMessages] = useState<number>(0);
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  const currentChat = chatTabs.find((t) => t.id === activeTab)!;
  const colors = colorMap[currentChat.color];

  useEffect(() => {
    setVisibleMessages(0);
    setIsTyping(false);

    let timeout: ReturnType<typeof setTimeout>;
    const showMessages = () => {
      let i = 0;
      const next = () => {
        if (i >= currentChat.messages.length) return;
        const msg = currentChat.messages[i];
        const delay = msg.sender === "user" ? 600 : 1200;

        if (msg.sender === "bot") {
          setIsTyping(true);
          timeout = setTimeout(() => {
            setIsTyping(false);
            setVisibleMessages(i + 1);
            i++;
            timeout = setTimeout(next, 400);
          }, 800);
        } else {
          timeout = setTimeout(() => {
            setVisibleMessages(i + 1);
            i++;
            timeout = setTimeout(next, delay);
          }, delay);
        }
      };
      timeout = setTimeout(next, 500);
    };

    if (inView) showMessages();
    return () => clearTimeout(timeout);
  }, [activeTab, inView, currentChat.messages.length]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [visibleMessages, isTyping]);

  return (
    <section className="relative py-24 sm:py-32 bg-background overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" ref={ref}>
        {/* Header */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-electric text-xs font-semibold uppercase tracking-[0.25em] mb-4 block"
          >
            AI Chatbot Demo
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight mb-4"
          >
            Your Business Never Closes
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            Explore how our AI chatbots handle real conversations across sales, support, customer care and bookings.
          </motion.p>
        </div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {chatTabs.map((tab) => {
            const Icon = tab.icon;
            const c = colorMap[tab.color];
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  activeTab === tab.id
                    ? `${c.bg} ${c.text} border ${c.border}`
                    : "text-muted-foreground hover:text-foreground hover:bg-muted border border-transparent"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </motion.div>

        {/* Chat window */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-lg mx-auto"
        >
          <div className="rounded-2xl bg-card border border-border shadow-2xl shadow-black/5 overflow-hidden">
            {/* Chat header */}
            <div className={`p-4 border-b border-border ${colors.bg}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-foreground font-bold text-sm">YZ AI Assistant</p>
                  <p className="text-emerald-500 text-xs flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                    Online now
                  </p>
                </div>
                <div className="ml-auto flex items-center gap-1.5">
                  <Sparkles className={`w-4 h-4 ${colors.text}`} />
                  <span className={`text-xs font-medium ${colors.text}`}>{currentChat.label}</span>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div ref={chatRef} className="h-[400px] overflow-y-auto p-4 space-y-4 scrollbar-none">
              <AnimatePresence mode="sync">
                {currentChat.messages.slice(0, visibleMessages).map((msg, i) => (
                  <motion.div
                    key={`${activeTab}-${msg.id}`}
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className={`flex gap-2 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.sender === "bot" && (
                      <div className="w-7 h-7 rounded-full bg-navy flex items-center justify-center shrink-0 mt-0.5">
                        <Bot className="w-3.5 h-3.5 text-white" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                        msg.sender === "user"
                          ? `${colors.userBg} text-white rounded-br-sm`
                          : "bg-muted text-foreground rounded-bl-sm"
                      }`}
                    >
                      {msg.text.split("\n").map((line, j) => (
                        <span key={j}>
                          {line}
                          {j < msg.text.split("\n").length - 1 && <br />}
                        </span>
                      ))}
                    </div>
                    {msg.sender === "user" && (
                      <div className="w-7 h-7 rounded-full bg-electric/20 flex items-center justify-center shrink-0 mt-0.5">
                        <User className="w-3.5 h-3.5 text-electric" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing indicator */}
              <AnimatePresence>
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex gap-2 items-end"
                  >
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
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Input bar */}
            <div className="p-4 border-t border-border">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-muted text-foreground text-sm placeholder:text-muted-foreground/60 border border-border focus:outline-none focus:ring-2 focus:ring-electric/30"
                  readOnly
                />
                <button className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors.bg} ${colors.text}`}>
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-12"
        >
          <a
            href="/contact"
            className="group inline-flex items-center gap-2 px-8 py-4 bg-electric text-white font-semibold text-sm rounded-xl hover:bg-electric-dark transition-all shadow-xl shadow-electric/20"
          >
            Build Your Custom Chatbot
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
