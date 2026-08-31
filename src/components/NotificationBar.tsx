import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Megaphone } from "lucide-react";

const PROMO_MESSAGE = "🎉 New: AI-Powered Business Intelligence — Get 20% off when you sign up for our Growth plan this quarter.";

const PROMO_BG_CLASS = "bg-electric";

export default function NotificationBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("yz-notification-dismissed");
    if (!dismissed && PROMO_MESSAGE) {
      setVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem("yz-notification-dismissed", "true");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={`${PROMO_BG_CLASS} text-white overflow-hidden relative z-[60]`}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-1 justify-center text-center">
              <Megaphone className="w-3.5 h-3.5 shrink-0 opacity-80" />
              <p className="text-xs sm:text-sm font-medium">
                {PROMO_MESSAGE}
              </p>
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
      )}
    </AnimatePresence>
  );
}
