import { useState } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FloatingWidgets from "@/components/FloatingWidgets";
import { useSEO } from "@/lib/seo";
import {
  ArrowRight,
  Package,
  ClipboardList,
  Store,
  User,
  LogIn,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  FileCheck2,
} from "lucide-react";
import { useAuth } from "@/lib/auth";

const FmcgAccountSteps = [
  {
    icon: Store,
    title: "Create your FMCG account",
    description:
      "Sign in with your official business email so your application is tied to a verified account, not an anonymous form.",
  },
  {
    icon: FileCheck2,
    title: "Submit your business documents",
    description:
      "Directors' ID copies, CR12 for companies, county business permit and a storefront image so we can verify the supply base.",
  },
  {
    icon: ClipboardList,
    title: "Choose your service category",
    description:
      "Lock in the FMCG category you will supply. It is fixed after submission to keep your records and buyer expectations consistent.",
  },
  {
    icon: Package,
    title: "Get approved and list products",
    description:
      "Once approved, add products with pricing, MOQ, payment terms and photos from your dashboard and reach the wholesale desk.",
  },
];

export default function FmcgAccountFlow() {
  useSEO({
    title: "FMCG Account Onboarding & Login — Suppliers & Wholesalers",
    description:
      "Open an FMCG account with Yasir Zayed as a supplier or wholesale buyer. Supplier onboarding requires ID, business registration, CR12, county permit and storefront image. FMCG services are priced upon request.",
    path: "/fmcg/account",
    keywords:
      "FMCG account Kenya, wholesale account, supplier onboarding Kenya, FMCG supplier registration, price upon request FMCG",
    noindex: true,
  });

  const [activeTab, setActiveTab] = useState<"login" | "onboarding-leader" | "onboarding-wholesaler">("login");
  const { isAuthenticated, user, signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSolving, setIsSolving] = useState(false);

  const handleLoginSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    if (!email.trim() || !password) {
      setError("Enter the email and password for your FMCG account.");
      return;
    }

    setIsSolving(true);
    try {
      await signIn({ email: email.trim().toLowerCase(), password });
    } catch {
      setError("That email and password do not match an FMCG account.");
      return;
    } finally {
      setIsSolving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf7f0]">
      <Navigation />

      <section className="relative overflow-hidden bg-[#080b10] pb-16 pt-32 sm:pb-20 sm:pt-36">
        <div className="absolute inset-0 bg-grid-pattern-dark opacity-50" />
        <div className="pointer-events-none absolute -top-32 right-0 h-[560px] w-[560px] rounded-full bg-amber-400/12 blur-[150px]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="mb-10 flex items-center gap-2 text-xs text-white/35">
            <Link to="/" className="transition-colors hover:text-white/70">Home</Link>
            <span>/</span>
            <Link to="/fmcg" className="transition-colors hover:text-white/70">FMCG</Link>
            <span>/</span>
            <span className="text-white/60">Account</span>
          </nav>

          <div className="grid items-center gap-12 lg:grid-cols-[1.15fr,0.85fr]">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-300/25 bg-amber-300/[0.07] px-3.5 py-1.5"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
                <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-amber-200">
                  FMCG accounts
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 }}
                className="font-display text-4xl font-bold leading-[1.05] text-white sm:text-5xl md:text-6xl"
              >
                Log in or onboard into the FMCG desk.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.16 }}
                className="mt-6 max-w-xl text-base leading-relaxed text-white/55 sm:text-lg"
              >
                Suppliers and wholesale buyers both work through an FMCG account.
                Sign in to continue, or follow the onboarding path that matches your
                role and we will take it from there.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.24 }}
                className="mt-8 rounded-2xl border border-amber-300/20 bg-amber-300/[0.05] p-5"
              >
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-amber-200">
                      Both paths use one account
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-white/50">
                      The same login covers your supplier application, your wholesale
                      bookings and your account notes. You only need one email.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22 }}
              className="rounded-2xl border border-white/10 bg-white/[0.035] p-6 backdrop-blur-sm sm:p-7"
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-300/80 mb-4">
                Choose your path
              </p>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setActiveTab("onboarding-leader")}
                  className={`w-full rounded-xl border p-4 text-left transition-colors ${
                    activeTab === "onboarding-leader"
                      ? "border-amber-300 bg-amber-300/10 text-amber-200"
                      : "border-white/10 bg-white/[0.03] text-white/70 hover:border-white/20"
                  }`}
                >
                  <span className="font-semibold text-sm">For suppliers</span>
                  <p className="mt-1 text-xs leading-relaxed">
                    Manufacturers, importers and distributors who want to list products
                    and reach the wholesale desk.
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("onboarding-wholesaler")}
                  className={`w-full rounded-xl border p-4 text-left transition-colors ${
                    activeTab === "onboarding-wholesaler"
                      ? "border-amber-300 bg-amber-300/10 text-amber-200"
                      : "border-white/10 bg-white/[0.03] text-white/70 hover:border-white/20"
                  }`}
                >
                  <span className="font-semibold text-sm">For wholesale buyers</span>
                  <p className="mt-1 text-xs leading-relaxed">
                    Retailers, distributors and businesses that want to book bulk
                    volumes through the account-linked booking flow.
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("login")}
                  className={`w-full rounded-xl border p-4 text-left transition-colors ${
                    activeTab === "login"
                      ? "border-amber-300 bg-amber-300/10 text-amber-200"
                      : "border-white/10 bg-white/[0.03] text-white/70 hover:border-white/20"
                  }`}
                >
                  <span className="font-semibold text-sm">Just sign in</span>
                  <p className="mt-1 text-xs leading-relaxed">
                    You already have an FMCG account and want to continue where you
                    left off.
                  </p>
                </button>
              </div>

              {isAuthenticated && (
                <div className="mt-4 rounded-xl border border-emerald-300/20 bg-emerald-500/10 px-4 py-3">
                  <p className="flex items-center gap-2 text-xs text-emerald-200">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-300" />
                    Signed in as {user?.email}. You can continue in the FMCG desk.
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-5 lg:gap-8">
            <div className="lg:col-span-2">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-amber-700">
                Sign in to your FMCG account
              </p>
              <h2 className="font-display text-2xl font-bold leading-tight text-navy sm:text-3xl">
                {activeTab === "login"
                  ? "Continue in the FMCG desk"
                  : activeTab === "onboarding-leader"
                  ? "Onboard as a supplier"
                  : "Onboard as a wholesale buyer"}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-600 lg:sticky lg:top-24">
                {activeTab === "login" && (
                  <>
                    Sign in with the email tied to your FMCG account. If you do not
                    have one yet, pick the onboarding path above and we will set it up.
                  </>
                )}
                {activeTab === "onboarding-leader" && (
                  <>
                    Suppliers register through a document-led process. Your account is
                    created first, then your business documents and category are
                    submitted for review. The category is locked at submission.
                  </>
                )}
                {activeTab === "onboarding-wholesaler" && (
                  <>
                    Wholesale buyers open an account so bookings, delivery notes and
                    payment terms are tied to your business, not an anonymous form.
                  </>
                )}
              </p>
            </div>

            <div className="lg:col-span-3 rounded-2xl border border-slate-200 bg-card p-6 sm:p-8">
              {activeTab === "login" ? (
                <FmcgLoginForm
                  user={user}
                  isSolving={isSolving}
                  email={email}
                  password={password}
                  error={error}
                  onEmailChange={setEmail}
                  onPasswordChange={setPassword}
                  onSubmit={handleLoginSubmit}
                  onCancel={() => {}}
                />
              ) : activeTab === "onboarding-leader" ? (
                <FmcgOnboardingCard
                  role="supplier"
                  steps={FmcgAccountSteps}
                  existingUser={isAuthenticated}
                  existingEmail={user?.email}
                />
              ) : (
                <FmcgOnboardingCard
                  role="wholesaler"
                  steps={FmcgAccountSteps.filter((step) => step.icon !== FileCheck2)}
                  existingUser={isAuthenticated}
                  existingEmail={user?.email}
                />
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-amber-700">
                Pricing
              </p>
              <h2 className="font-display text-2xl font-bold leading-tight text-navy sm:text-3xl">
                FMCG services are priced on request.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                Every FMCG service is scoped to the business, the territory and the
                volume we are moving together. We do not publish a fixed price list
                for the FMCG desk — instead we review your brief and come back with a
                clear proposal and payment terms.
              </p>

              <ul className="mt-6 space-y-4">
                {[
                  {
                    title: "Order Booking",
                    note: "Setup is scoped to your outlets, call cycles and dispatch handoff.",
                  },
                  {
                    title: "Sales & Route-to-Market",
                    note: "Priced on the territory, team structure and coverage plan.",
                  },
                  {
                    title: "Supplier Sourcing",
                    note: "Depends on the product, landed-cost work and onboarding depth.",
                  },
                  {
                    title: "Merchandizing",
                    note: "Set against the outlet estate, display standards and audit coverage.",
                  },
                  {
                    title: "Product Promotion",
                    note: "Built around the mechanic, activation footprint and measurement plan.",
                  },
                ].map((item) => (
                  <li
                    key={item.title}
                    className="rounded-xl border border-slate-200 bg-[#faf7f0] p-4"
                  >
                    <span className="font-semibold text-navy text-sm">{item.title}</span>
                    <p className="mt-1 text-xs text-slate-500">{item.note}</p>
                  </li>
                ))}
              </ul>

              <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-amber-800">
                  Request FMCG pricing
                </p>
                <p className="mt-1 text-sm leading-relaxed text-amber-900/75">
                  Send a short brief with your category, volume and territory. The FMCG
                  desk will reply with a scoped proposal and payment terms.
                </p>
                <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                  <a
                    href={`mailto:fmcg@yasirzayed.com?subject=Request FMCG pricing`}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-light"
                  >
                    Request pricing
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                  <Link
                    to="/fmcg"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-navy hover:border-amber-400"
                  >
                    Back to FMCG services
                  </Link>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-[#faf7f0] p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 shrink-0 text-amber-700" />
                <div>
                  <p className="font-display text-lg font-bold text-navy">Account-linked FMCG work</p>
                  <p className="text-xs text-slate-500">One account, several ways to engage</p>
                </div>
              </div>

              <ul className="mt-6 space-y-4">
                {[
                  "Supplier applications are tied to your account and documents.",
                  "Wholesale bookings can be reviewed against your account history.",
                  "Pricing requests are scoped against the same account context.",
                  "Approved suppliers get product dashboards from the same login.",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-slate-600">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-3">
                <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />
                <p className="text-[11px] leading-snug text-slate-500">
                  Account details are used only for FMCG service and booking
                  administration, not for marketing lists.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <FloatingWidgets />
    </div>
  );
}

function FmcgLoginForm({
  user,
  isSolving,
  email,
  password,
  error,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onCancel,
}: {
  user: { email?: string } | null;
  isSolving: boolean;
  email: string;
  password: string;
  error: string | null;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-6">
        <label className="block">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35">
            Email
          </span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            autoFocus
            required
            value={email}
            onChange={(event) => onEmailChange(event.target.value)}
            disabled={isSolving}
            placeholder="you@company.com"
            className="mt-2 w-full rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-amber-300/40 disabled:cursor-not-allowed"
          />
        </label>
        <label className="mt-4 block">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35">
            Password
          </span>
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => onPasswordChange(event.target.value)}
            disabled={isSolving}
            placeholder="Your account password"
            className="mt-2 w-full rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-amber-300/40 disabled:cursor-not-allowed"
          />
        </label>
        {error && <p className="mt-3 text-xs text-red-400">{error}</p>}
        <p className="mt-3 text-[11px] leading-relaxed text-white/35">
          Accounts are held in the Zayed workspace, so the same email and password work
          on every device.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <button
          type="submit"
          disabled={isSolving || !email.trim() || !password}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-amber-300 to-[#E8C56A] px-6 py-3 text-sm font-semibold text-[#1a1305] transition-all hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSolving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              <LogIn className="h-4 w-4" />
              Sign in to my FMCG account
            </>
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSolving}
          className="w-full text-center text-xs text-white/40 hover:text-white/70 transition-colors disabled:cursor-not-allowed"
        >
          {user ? "Use a different account" : "Cancel"}
        </button>
      </div>
    </form>
  );
}

function FmcgOnboardingCard({
  role,
  steps,
  existingUser,
  existingEmail,
}: {
  role: "supplier" | "wholesaler";
  steps: Array<{ icon: React.ElementType; title: string; description: string }>;
  existingUser: boolean;
  existingEmail?: string;
}) {
  const roleLabel = role === "supplier" ? "Supplier onboarding" : "Wholesale buyer onboarding";
  const roleNote = role === "supplier"
    ? "You will submit business documents and lock your FMCG category. The category cannot be changed after submission."
    : "You will create an account and link your business so bookings and delivery notes are tied to your company.";

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy text-white text-xs font-bold">
          {role === "supplier" ? <Store className="h-4 w-4" /> : <Package className="h-4 w-4" />}
        </span>
        <span className="text-sm font-semibold text-navy">{roleLabel}</span>
      </div>

      {existingUser ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
          <p className="flex items-start gap-2 text-sm text-emerald-900/80">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
            <span>
              You are already signed in as {existingEmail}. Continue with the{" "}
              <Link
                to={role === "supplier" ? "/supplier/register" : "/fmcg/account"}
                className="font-semibold underline"
              >
                {role === "supplier" ? "supplier registration" : "wholesale account setup"}
              </Link>{" "}
              from there.
            </span>
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4">
          <p className="text-sm text-amber-900/80">{roleNote}</p>
        </div>
      )}

      <ol className="space-y-4">
        {steps.map((step, index) => {
          return (
            <li key={step.title} className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-300 bg-white font-mono text-xs font-bold text-navy">
                {index + 1}
              </span>
              <div>
                <p className="text-sm font-semibold text-navy">{step.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">{step.description}</p>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[11px] text-slate-500">
          {role === "supplier"
            ? "Supplier registration requires an account and approved documents."
            : "Wholesale account setup is reviewed by the FMCG desk."}
        </p>
        <Link
          to={role === "supplier" ? "/supplier/register" : "/fmcg/account"}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-300 to-[#E8C56A] px-5 py-2.5 text-sm font-semibold text-[#1a1305] transition-all hover:brightness-105"
        >
          {role === "supplier" ? "Start supplier registration" : "Open wholesale account"}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <p className="text-center text-xs text-slate-400">
        Not ready to register?{" "} <Link
              to="/fmcg/account"
              className="font-semibold underline"
            >
              Sign in instead
            </Link>
      </p>
    </div>
  );
}
