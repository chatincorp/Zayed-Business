import { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Shield, CheckCircle2, ArrowRight, Loader2 } from "lucide-react";

interface PaystackCheckoutProps {
  planName: string;
  amount: number; // in KES
  description: string;
  email?: string;
  onSuccess?: (reference: string) => void;
  onClose?: () => void;
  variant?: "primary" | "secondary";
  className?: string;
}

const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || "";

export default function PaystackCheckout({
  planName,
  amount,
  description,
  email: initialEmail,
  onSuccess,
  onClose,
  variant = "primary",
  className = "",
}: PaystackCheckoutProps) {
  const [email, setEmail] = useState(initialEmail || "");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [reference, setReference] = useState("");

  const handlePayment = async () => {
    if (!email) return;

    if (!PAYSTACK_PUBLIC_KEY) {
      // Demo mode — simulate payment
      setLoading(true);
      await new Promise((r) => setTimeout(r, 2000));
      const mockRef = `YZ-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
      setReference(mockRef);
      setSuccess(true);
      setLoading(false);
      onSuccess?.(mockRef);
      return;
    }

    setLoading(true);

    try {
      // Dynamically import paystack to avoid SSR issues
      const PaystackPop = (await import("@paystack/inline-js")).default;
      const popup = new PaystackPop();

      popup.newTransaction({
        key: PAYSTACK_PUBLIC_KEY,
        email,
        amount: amount * 100, // Paystack uses kobo/pesewas
        currency: "KES",
        ref: `YZ-${Date.now()}`,
        metadata: {
          plan: planName,
          custom_fields: [
            {
              display_name: "Plan",
              variable_name: "plan",
              value: planName,
            },
          ],
        },
        onSuccess: (transaction: { reference: string }) => {
          setReference(transaction.reference);
          setSuccess(true);
          setLoading(false);
          onSuccess?.(transaction.reference);
        },
        onClose: () => {
          setLoading(false);
          onClose?.();
        },
      });
    } catch {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center"
      >
        <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
        <h4 className="font-bold text-foreground text-lg mb-1">Payment Successful</h4>
        <p className="text-muted-foreground text-sm mb-2">
          Thank you for purchasing <strong>{planName}</strong>.
        </p>
        <p className="text-muted-foreground text-xs font-mono">
          Reference: {reference}
        </p>
      </motion.div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {!initialEmail && (
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-electric/30 focus:border-electric transition-all"
          />
        </div>
      )}

      {/* Payment summary */}
      <div className="p-4 rounded-xl bg-muted/50 border border-border/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">{planName}</span>
          <span className="text-sm font-bold text-foreground">
            KES {amount.toLocaleString()}
          </span>
        </div>
        <p className="text-xs text-muted-foreground/60">{description}</p>
      </div>

      <button
        onClick={handlePayment}
        disabled={loading || !email}
        className={`group w-full flex items-center justify-center gap-2 py-3.5 rounded-lg text-sm font-semibold transition-all ${
          variant === "primary"
            ? "bg-electric text-white hover:bg-electric-dark shadow-lg shadow-electric/20 disabled:opacity-50"
            : "bg-foreground text-primary-foreground hover:opacity-90 disabled:opacity-50"
        }`}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="w-4 h-4" />
            Subscribe Now — KES {amount.toLocaleString()}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </button>

      <div className="flex items-center justify-center gap-2 text-[11px] text-muted-foreground/50">
        <Shield className="w-3 h-3" />
        <span>Secure checkout powered by Paystack. Your payment details are encrypted.</span>
      </div>
    </div>
  );
}

/* ── Service Checkout Link Generator ───────────────────────────── */

interface ServiceCheckoutProps {
  serviceName: string;
  basePrice: number; // in KES
  description: string;
}

export function ServiceCheckoutLink({
  serviceName,
  basePrice,
  description,
}: ServiceCheckoutProps) {
  const [customAmount, setCustomAmount] = useState(basePrice);
  const [customerEmail, setCustomerEmail] = useState("");

  const generateCheckoutLink = () => {
    const encodedName = encodeURIComponent(serviceName);
    const encodedDesc = encodeURIComponent(description);
    // Paystack payment link format (requires Paystack dashboard setup)
    return `https://paystack.com/pay/yasirzayed?amount=${customAmount * 100}&email=${customerEmail}&plan=${encodedName}&metadata[service]=${encodedDesc}`;
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">Service</label>
        <input
          type="text"
          value={serviceName}
          readOnly
          className="w-full px-4 py-3 rounded-lg bg-muted text-foreground text-sm border border-border"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">Amount (KES)</label>
        <input
          type="number"
          value={customAmount}
          onChange={(e) => setCustomAmount(Number(e.target.value))}
          min={100}
          className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-electric/30"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">Your Email</label>
        <input
          type="email"
          value={customerEmail}
          onChange={(e) => setCustomerEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-electric/30"
        />
      </div>
      <a
        href={generateCheckoutLink()}
        target="_blank"
        rel="noopener noreferrer"
        className="group w-full flex items-center justify-center gap-2 py-3.5 rounded-lg text-sm font-semibold bg-electric text-white hover:bg-electric-dark shadow-lg shadow-electric/20 transition-all"
      >
        <CreditCard className="w-4 h-4" />
        Subscribe Now
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </a>
    </div>
  );
}
