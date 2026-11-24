import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { X, Megaphone } from "lucide-react";
import { useHomepageSettings } from "@/lib/siteContent";

const FALLBACK_MESSAGE =
  "🎉 New: AI-Powered Business Intelligence — Get 20% off when you sign up for our Growth plan this quarter.";

function wasDismissed(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("yz-notification-dismissed") === "true";
}

export default function NotificationBar() {
  // Message and on/off state are edited in the admin Homepage Manager.
  const settings = useHomepageSettings();
  const message = settings?.notification.message || FALLBACK_MESSAGE;
  const enabled = settings?.notification.enabled ?? true;
  const [dismissed, setDismissed] = useState(wasDismissed);
  const barRef = useRef<HTMLDivElement>(null);

  const visible = enabled && !dismissed && message.length > 0;

  // Publish the bar's height so the fixed header can sit directly below it.
  // ResizeObserver keeps the value true while the bar animates open/closed and
  // when the message wraps onto a second line on small screens.
  useEffect(() => {
    const root = document.documentElement;
    const el = barRef.current;
    if (!el) return;
    const sync = () =>
      root.style.setProperty("--yz-banner-height", `${el.getBoundingClientRect().height}px`);
    sync();
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(sync);
    observer?.observe(el);
    window.addEventListener("resize", sync);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", sync);
      root.style.setProperty("--yz-banner-height", "0px");
    };
  }, []);

  const handleDismiss = () => {
    localStorage.setItem("yz-notification-dismissed", "true");
    setDismissed(true);
  };

  return (
    <motion.div
      ref={barRef}
      initial={false}
      animate={{ height: visible ? "auto" : 0, opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      aria-hidden={!visible}
      className="bg-electric text-white overflow-hidden relative z-[60]"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1 justify-center text-center">
          <Megaphone className="w-3.5 h-3.5 shrink-0 opacity-80" />
          <p className="text-xs sm:text-sm font-medium">{message}</p>
        </div>
        <button
          onClick={handleDismiss}
          className="p-1 rounded-full hover:bg-white/20 transition-colors shrink-0"
          aria-label="Dismiss notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}
