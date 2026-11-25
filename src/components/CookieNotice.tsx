import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, X, Settings, CheckCircle2 } from "lucide-react";

/**
 * A consent toggle. Rendered as a real button with `role="switch"` so it is
 * tab-reachable, toggles with Space/Enter and reports its state to screen
 * readers — the plain clickable `div`s it replaces were invisible to both.
 */
function ConsentSwitch({
  id,
  label,
  description,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors">
      <div className="cursor-pointer" onClick={onChange}>
        <p id={`${id}-label`} className="text-sm font-medium text-foreground">
          {label}
        </p>
        <p id={`${id}-description`} className="text-xs text-muted-foreground">
          {description}
        </p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={`${id}-label`}
        aria-describedby={`${id}-description`}
        onClick={onChange}
        className={`relative w-11 h-6 shrink-0 rounded-full transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-electric focus-visible:ring-offset-2 focus-visible:ring-offset-card ${
          checked ? "bg-electric" : "bg-muted border border-border"
        }`}
      >
        <span
          aria-hidden="true"
          className={`w-5 h-5 rounded-full bg-white shadow-sm absolute top-0.5 transition-all ${
            checked ? "left-[22px]" : "left-0.5"
          }`}
        />
      </button>
    </div>
  );
}

export default function CookieNotice() {
  const [visible, setVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [cookieless] = useState(true);
  const [analyticsConsent, setAnalyticsConsent] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("yz-cookie-notice-dismissed");
    if (!dismissed) {
      const timer = setTimeout(() => setVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(
      "yz-cookie-preferences",
      JSON.stringify({
        essential: true,
        analytics: analyticsConsent,
        marketing: marketingConsent,
        cookieless,
      })
    );
    localStorage.setItem("yz-cookie-notice-dismissed", "true");
    setVisible(false);
  };

  const handleDismiss = () => {
    // Default: cookieless mode
    localStorage.setItem(
      "yz-cookie-preferences",
      JSON.stringify({
        essential: true,
        analytics: false,
        marketing: false,
        cookieless: true,
      })
    );
    localStorage.setItem("yz-cookie-notice-dismissed", "true");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed bottom-0 left-0 right-0 z-[90] p-4"
        >
          <div className="mx-auto max-w-4xl">
            <div className="rounded-2xl bg-card/95 backdrop-blur-xl border border-border shadow-2xl shadow-black/10 overflow-hidden">
              {/* Top notification bar */}
              <div className="flex items-center gap-3 px-5 py-3 bg-electric/5 border-b border-border">
                <Shield className="w-4 h-4 text-electric shrink-0" />
                <p className="text-sm text-foreground font-medium flex-1">
                  🛡️ <strong>Privacy-First Website</strong> — This site operates in cookieless mode by default
                </p>
                <button
                  onClick={handleDismiss}
                  className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5">
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  Yasir Zayed respects your privacy. This website does <strong>not</strong> use tracking cookies, analytics scripts or advertising pixels by default. Your browsing data stays yours.
                </p>

                {!showSettings ? (
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={handleAccept}
                      className="flex items-center gap-2 px-5 py-2.5 bg-electric text-white text-sm font-semibold rounded-lg hover:bg-electric-dark transition-all"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Continue Cookieless
                    </button>
                    <button
                      onClick={() => setShowSettings(true)}
                      className="flex items-center gap-2 px-5 py-2.5 border border-border text-foreground text-sm font-medium rounded-lg hover:bg-muted transition-all"
                    >
                      <Settings className="w-4 h-4" />
                      Manage Preferences
                    </button>
                    <button
                      onClick={handleDismiss}
                      className="px-5 py-2.5 text-muted-foreground text-sm font-medium hover:text-foreground transition-colors"
                    >
                      Dismiss
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                      <div>
                        <p className="text-sm font-medium text-foreground">Essential Cookies</p>
                        <p className="text-xs text-muted-foreground">Required for core website functionality</p>
                      </div>
                      <div className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-semibold">
                        Always On
                      </div>
                    </div>

                    <ConsentSwitch
                      id="cookie-analytics"
                      label="Analytics Cookies"
                      description="Help us understand how visitors use the site"
                      checked={analyticsConsent}
                      onChange={() => setAnalyticsConsent(!analyticsConsent)}
                    />

                    <ConsentSwitch
                      id="cookie-marketing"
                      label="Marketing Cookies"
                      description="Used for targeted advertising and remarketing"
                      checked={marketingConsent}
                      onChange={() => setMarketingConsent(!marketingConsent)}
                    />

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        onClick={handleAccept}
                        className="flex items-center gap-2 px-5 py-2.5 bg-electric text-white text-sm font-semibold rounded-lg hover:bg-electric-dark transition-all"
                      >
                        Save Preferences
                      </button>
                      <button
                        onClick={() => setShowSettings(false)}
                        className="px-5 py-2.5 text-muted-foreground text-sm font-medium hover:text-foreground transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                <p className="text-[11px] text-muted-foreground/60 mt-4">
                  Read our full{" "}
                  <a href="/privacy" className="underline hover:text-muted-foreground">
                    Privacy Policy
                  </a>
                  {" "}for details on how we handle your data.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
