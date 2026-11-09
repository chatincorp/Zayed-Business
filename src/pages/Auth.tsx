import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { useAuth } from "@/hooks/use-auth";
import { useSEO } from "@/lib/seo";
import { ArrowRight, Loader2, Mail, ArrowLeft, RefreshCw, ShieldCheck } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router";
import PolicyConsent from "@/components/PolicyConsent";

interface AuthProps {
  redirectAfterAuth?: string;
}

function resolveRedirectAfterAuth(
  returnTo: string | null,
  fallback = "/dashboard",
) {
  if (returnTo?.startsWith("/") && !returnTo.startsWith("//")) {
    return returnTo;
  }
  return fallback;
}

/* ── Math challenge ────────────────────────────────────────────────
 * Replaces email verification codes. Reconstructed on every attempt so
 * the answer is never reused, and simple enough to solve in seconds.
 */

interface Puzzle {
  prompt: string;
  answer: number;
}

const rand = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

function createPuzzle(): Puzzle {
  switch (rand(1, 3)) {
    case 1: {
      const a = rand(12, 48);
      const b = rand(4, 19);
      const c = rand(2, 9);
      return { prompt: `${a} + ${b} − ${c}`, answer: a + b - c };
    }
    case 2: {
      const a = rand(2, 9);
      const b = rand(2, 9);
      const c = rand(1, 15);
      return { prompt: `${a} × ${b} + ${c}`, answer: a * b + c };
    }
    default: {
      const a = rand(30, 80);
      const b = rand(4, 20);
      const c = rand(1, 9);
      return { prompt: `${a} − ${b} + ${c}`, answer: a - b + c };
    }
  }
}

type Step = "signIn" | "policyConsent" | "verify";

function Auth({ redirectAfterAuth }: AuthProps = {}) {
  useSEO({
    title: "Sign In",
    description:
      "Sign in to your Yasir Zayed workspace to manage services, projects and enquiries.",
    noindex: true,
  });

  const { isLoading: authLoading, isAuthenticated, signIn } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = resolveRedirectAfterAuth(
    searchParams.get("returnTo"),
    redirectAfterAuth,
  );

  const [step, setStep] = useState<Step>("signIn");
  const [email, setEmail] = useState("");
  const [puzzle, setPuzzle] = useState<Puzzle>(createPuzzle);
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [failedChecks, setFailedChecks] = useState(0);

  const [policyAccepted, setPolicyAccepted] = useState(() => {
    try {
      return localStorage.getItem("yz-policy-accepted") === "true";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate(redirect);
    }
  }, [authLoading, isAuthenticated, navigate, redirect]);

  const startVerification = (nextEmail: string) => {
    setEmail(nextEmail);
    setPuzzle(createPuzzle());
    setAnswer("");
    setFailedChecks(0);
    setError(null);
    setStep("verify");
  };

  const handleEmailSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const submitted = email.trim().toLowerCase();
    if (!submitted) {
      setError("Please enter your email address.");
      return;
    }

    // Show policy consent before allowing registration/sign-in
    if (!policyAccepted) {
      setEmail(submitted);
      setStep("policyConsent");
      return;
    }

    startVerification(submitted);
  };

  const handlePolicyAccept = () => {
    try {
      localStorage.setItem("yz-policy-accepted", "true");
    } catch {
      // Storage unavailable — continue for this session.
    }
    setPolicyAccepted(true);
    if (email.trim()) {
      startVerification(email.trim().toLowerCase());
    } else {
      setStep("signIn");
    }
  };

  const handlePolicyDecline = () => {
    setStep("signIn");
  };

  const handlePuzzleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const parsed = Number(answer.trim());
    if (!answer.trim() || !Number.isFinite(parsed)) {
      setError("Enter the answer to the puzzle.");
      return;
    }

    if (parsed !== puzzle.answer) {
      setFailedChecks((count) => count + 1);
      setPuzzle(createPuzzle());
      setAnswer("");
      setError("That answer isn't right. Here's a fresh puzzle — try again.");
      return;
    }

    setIsLoading(true);
    try {
      await signIn({ email });
      navigate(redirect);
    } catch (signInError) {
      console.error("Sign-in error:", signInError);
      setError("We couldn't create your session. Please try again.");
      setIsLoading(false);
    }
  };

  const handleNewPuzzle = () => {
    setPuzzle(createPuzzle());
    setAnswer("");
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-navy-dark">
      {/* Background */}
      <div className="absolute inset-0 bg-grid-pattern-dark opacity-30" />
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-electric/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 p-6">
        <Link to="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white/80 text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>
      </div>

      {/* Auth Content */}
      <div className="flex-1 flex items-center justify-center relative z-10 px-4">
        <div className="flex items-center justify-center h-full flex-col w-full max-w-md">
          {/* Logo */}
          <div className="mb-8 text-center">
            <Link to="/" className="inline-flex items-center gap-3 group mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-electric to-electric-dark flex items-center justify-center">
                <span className="text-white font-bold text-base">YZ</span>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-white font-bold text-base tracking-tight leading-none">
                  YASIR ZAYED
                </span>
                <span className="text-[10px] text-white/40 tracking-[0.12em] uppercase leading-none mt-0.5">
                  Business • Security • Technology
                </span>
              </div>
            </Link>
          </div>

          {/* Policy Consent Modal */}
          {step === "policyConsent" && (
            <PolicyConsent
              onAccept={handlePolicyAccept}
              onDecline={handlePolicyDecline}
            />
          )}

          <Card className="w-full border-white/10 bg-card/50 backdrop-blur-xl shadow-2xl shadow-black/20">
            {step !== "verify" ? (
              <>
                <CardHeader className="text-center">
                  <CardTitle className="text-xl font-display">
                    Welcome Back
                  </CardTitle>
                  <CardDescription>
                    Sign in with your email — no verification code required
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleEmailSubmit}>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          name="email"
                          placeholder="you@example.com"
                          type="email"
                          autoComplete="email"
                          value={email}
                          onChange={(event) => setEmail(event.target.value)}
                          className="pl-9"
                          disabled={isLoading}
                          required
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                      >
                        Continue with Email
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                      <p className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                        Email verification is replaced by a quick math check
                      </p>
                    </div>
                    {error && (
                      <p className="mt-3 text-sm text-red-500 text-center">{error}</p>
                    )}
                  </CardContent>
                </form>
              </>
            ) : (
              <>
                <CardHeader className="text-center">
                  <CardTitle className="text-xl font-display">
                    Verify You&apos;re Human
                  </CardTitle>
                  <CardDescription>
                    Solve the puzzle to continue as{" "}
                    <span className="font-medium text-foreground">{email}</span>
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handlePuzzleSubmit}>
                  <CardContent className="pb-4">
                    <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-6 text-center">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35 mb-3">
                        Math challenge
                      </p>
                      <div className="flex flex-wrap items-center justify-center gap-3">
                        <span className="font-display text-3xl font-bold tracking-tight text-white tabular-nums">
                          {puzzle.prompt}
                        </span>
                        <span className="font-display text-3xl font-bold text-electric">=</span>
                        <Input
                          name="puzzleAnswer"
                          inputMode="numeric"
                          pattern="-?[0-9]*"
                          autoFocus
                          autoComplete="off"
                          aria-label="Answer to the math challenge"
                          value={answer}
                          onChange={(event) => setAnswer(event.target.value)}
                          disabled={isLoading}
                          className="w-24 text-center text-xl font-bold tabular-nums"
                          placeholder="?"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleNewPuzzle}
                        disabled={isLoading}
                        className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-medium text-white/40 hover:text-white/70 transition-colors"
                      >
                        <RefreshCw className="h-3 w-3" />
                        New puzzle
                      </button>
                    </div>

                    {error && (
                      <p role="alert" className="mt-3 text-sm text-red-500 text-center">
                        {error}
                      </p>
                    )}
                    {failedChecks > 0 && !error && (
                      <p className="mt-3 text-xs text-muted-foreground text-center">
                        {failedChecks} incorrect {failedChecks === 1 ? "attempt" : "attempts"} — no account is locked.
                      </p>
                    )}
                    <p className="mt-3 text-[11px] text-muted-foreground text-center leading-relaxed">
                      No codes are sent to your inbox. Your session is stored in this
                      browser, so you can sign back in instantly.
                    </p>
                  </CardContent>
                  <CardFooter className="flex-col gap-3">
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading || !answer.trim()}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        <>
                          Verify &amp; Sign In
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        setStep("signIn");
                        setAnswer("");
                        setError(null);
                      }}
                      disabled={isLoading}
                      className="w-full text-muted-foreground"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Use a different email
                    </Button>
                  </CardFooter>
                </form>
              </>
            )}
          </Card>

          <p className="mt-8 text-center text-xs text-white/30 max-w-sm">
            By continuing, you agree to Yasir Zayed&apos;s{" "}
            <a href="#" className="underline hover:text-white/50">Terms of Service</a>{" "}
            and{" "}
            <a href="#" className="underline hover:text-white/50">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage(props: AuthProps) {
  return (
    <Suspense>
      <Auth {...props} />
    </Suspense>
  );
}
