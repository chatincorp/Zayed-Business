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
import YasirZayedLogo from "@/components/YasirZayedLogo";
import StaffSignInChoice from "@/components/StaffSignInChoice";

interface AuthProps {
  redirectAfterAuth?: string;
}

function resolveRedirectAfterAuth(
  returnTo: string | null,
  fallback: string | undefined,
) {
  if (returnTo) return returnTo;
  if (fallback) return fallback;
  return "/dashboard";
}

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
  const [staffSignInMode, setStaffSignInMode] = useState<"disabled" | "staff-only" | "all">("all");
  void setStaffSignInMode;

  const [failedChecks, setFailedChecks] = useState(0);
  void failedChecks;
  void setFailedChecks;

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

  const currentStaffSignInMode =
    staffSignInMode ??
    (() => {
      try {
        const enabled_ = localStorage.getItem("yz-staff-sign-in-enabled") === "true";
        if (!enabled_) return "disabled";
        const action_ = localStorage.getItem("yz-staff-sign-in-action");
        return action_ === "accept" ? "staff-only" : "all";
      } catch {
        return "disabled";
      }
    })();
  const modalMode = currentStaffSignInMode;
  void currentStaffSignInMode;
  void modalMode;

  const startVerification = (nextEmail: string) => {
    setEmail(nextEmail);
    setPuzzle(createPuzzle());
    setAnswer("");
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
    if (modalMode === "staff-only") {
      try {
        localStorage.setItem("yz-staff-sign-in-action", "accept");
      } catch {
        // Storage unavailable — continue for this session.
      }
    }
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
              <YasirZayedLogo height={46} />
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
            modalMode === "staff-only" ? (
              <PolicyConsent
                onAccept={handlePolicyAccept}
                onDecline={handlePolicyDecline}
              />
            ) : (
              <StaffSignInChoice
                onAccept={handlePolicyAccept}
                onDecline={handlePolicyDecline}
                staffSignInMode={modalMode}
              />
            )
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
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Link
                      to="/forgot-password"
                      className="text-white/50 hover:text-white/80 text-sm text-center transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </CardFooter>
                </form>
              </>
            ) : (
              <>
                <CardHeader className="text-center">
                  <CardTitle className="text-xl font-display">
                    Verify
                  </CardTitle>
                  <CardDescription>
                    Solve the puzzle to continue
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handlePuzzleSubmit}>
                  <CardContent className="space-y-4">
                    <p className="text-white/50 text-sm text-center">
                      What is{" "}
                      <span className="text-white font-semibold">{puzzle.prompt}</span>?
                    </p>
                    <div className="relative">
                      <Input
                        name="answer"
                        placeholder="Your answer"
                        type="text"
                        autoComplete="off"
                        inputMode="numeric"
                        value={answer}
                        onChange={(event) => setAnswer(event.target.value)}
                        className="pl-9"
                        disabled={isLoading}
                        required
                      />
                      <RefreshCw className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground cursor-pointer hover:text-white transition-colors" onClick={handleNewPuzzle} />
                    </div>
                    {error && (
                      <p className="text-rose-400 text-sm text-center">{error}</p>
                    )}
                  </CardContent>
                  <CardFooter className="pt-2 flex-col gap-2">
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Verifying…
                        </>
                      ) : (
                        <>
                          Verify
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                    <div className="flex items-center gap-2 justify-center">
                      <ShieldCheck className="h-4 w-4 text-emerald-400" />
                      <span className="text-white/50 text-xs">
                        Protected by puzzle verification
                      </span>
                    </div>
                  </CardFooter>
                </form>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage(props: AuthProps) {
  return (
    <Suspense fallback={null}>
      <Auth {...props} />
    </Suspense>
  );
}

type Step = "signIn" | "policyConsent" | "verify";

interface Puzzle {
  prompt: string;
  answer: number;
}

function createPuzzle(): Puzzle {
  const rand = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const level = rand(1, 3);
  switch (level) {
    case 1: {
      const a = rand(2, 9);
      const b = rand(2, 9);
      return { prompt: `${a} + ${b}`, answer: a + b };
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
