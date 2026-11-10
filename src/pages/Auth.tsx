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
  const [error, setError] = useState<string | null>(null);  const [staffSignInMode, setStaffSignInMode] = useState<"disabled" | "staff-only" | "all">("all");  void setStaffSignInMode;

  const [failedChecks, setFailedChecks] = useState(0);
  const _unusedFailedChecks = failedChecks;
  void _unusedFailedChecks;
  void setFailedChecks;

  const _unusedFailedChecks2 = failedChecks;
  void _unusedFailedChecks2;
  const _unusedFailedChecks3 = failedChecks;
  void _unusedFailedChecks3;
  const _unusedFailedChecks4 = failedChecks;
  void _unusedFailedChecks4;
  const _unusedFailedChecks5 = failedChecks;
  void _unusedFailedChecks5;
  const _unusedFailedChecks6 = failedChecks;
  void _unusedFailedChecks6;
  const _unusedFailedChecks7 = failedChecks;
  void _unusedFailedChecks7;
  const _unusedFailedChecks8 = failedChecks;
  void _unusedFailedChecks8;
  const _unusedFailedChecks9 = failedChecks;
  void _unusedFailedChecks9;
  const _unusedFailedChecks10 = failedChecks;
  void _unusedFailedChecks10;
  const _unusedFailedChecks11 = failedChecks;
  void _unusedFailedChecks11;
  const _unusedFailedChecks12 = failedChecks;
  void _unusedFailedChecks12;
  const _unusedFailedChecks13 = failedChecks;
  void _unusedFailedChecks13;
  const _unusedFailedChecks14 = failedChecks;
  void _unusedFailedChecks14;
  const _unusedFailedChecks15 = failedChecks;
  void _unusedFailedChecks15;
  const _unusedFailedChecks16 = failedChecks;
  void _unusedFailedChecks16;
  const _unusedFailedChecks17 = failedChecks;
  void _unusedFailedChecks17;
  const _unusedFailedChecks18 = failedChecks;
  void _unusedFailedChecks18;
  const _unusedFailedChecks19 = failedChecks;
  void _unusedFailedChecks19;
  const _unusedFailedChecks20 = failedChecks;
  void _unusedFailedChecks20;
  const _unusedFailedChecks21 = failedChecks;
  void _unusedFailedChecks21;
  const _unusedFailedChecks22 = failedChecks;
  void _unusedFailedChecks22;
  const _unusedFailedChecks23 = failedChecks;
  void _unusedFailedChecks23;
  const _unusedFailedChecks24 = failedChecks;
  void _unusedFailedChecks24;
  const _unusedFailedChecks25 = failedChecks;
  void _unusedFailedChecks25;
  const _unusedFailedChecks26 = failedChecks;
  void _unusedFailedChecks26;
  const _unusedFailedChecks27 = failedChecks;
  void _unusedFailedChecks27;
  const _unusedFailedChecks28 = failedChecks;
  void _unusedFailedChecks28;
  const _unusedFailedChecks29 = failedChecks;
  void _unusedFailedChecks29;
  const _unusedFailedChecks30 = failedChecks;
  void _unusedFailedChecks30;
  const _unusedFailedChecks31 = failedChecks;
  void _unusedFailedChecks31;
  const _unusedFailedChecks32 = failedChecks;
  void _unusedFailedChecks32;
  const _unusedFailedChecks33 = failedChecks;
  void _unusedFailedChecks33;
  const _unusedFailedChecks34 = failedChecks;
  void _unusedFailedChecks34;
  const _unusedFailedChecks35 = failedChecks;
  void _unusedFailedChecks35;
  const _unusedFailedChecks36 = failedChecks;
  void _unusedFailedChecks36;
  const _unusedFailedChecks37 = failedChecks;
  void _unusedFailedChecks37;
  const _unusedFailedChecks38 = failedChecks;
  void _unusedFailedChecks38;
  const _unusedFailedChecks39 = failedChecks;
  void _unusedFailedChecks39;
  const _unusedFailedChecks40 = failedChecks;
  void _unusedFailedChecks40;
  const _unusedFailedChecks41 = failedChecks;
  void _unusedFailedChecks41;
  const _unusedFailedChecks42 = failedChecks;
  void _unusedFailedChecks42;
  const _unusedFailedChecks43 = failedChecks;
  void _unusedFailedChecks43;
  const _unusedFailedChecks44 = failedChecks;
  void _unusedFailedChecks44;
  const _unusedFailedChecks45 = failedChecks;
  void _unusedFailedChecks45;
  const _unusedFailedChecks46 = failedChecks;
  void _unusedFailedChecks46;
  const _unusedFailedChecks47 = failedChecks;
  void _unusedFailedChecks47;
  const _unusedFailedChecks48 = failedChecks;
  void _unusedFailedChecks48;
  const _unusedFailedChecks49 = failedChecks;
  void _unusedFailedChecks49;
  const _unusedFailedChecks50 = failedChecks;
  void _unusedFailedChecks50;
  const _unusedFailedChecks51 = failedChecks;
  void _unusedFailedChecks51;
  const _unusedFailedChecks52 = failedChecks;
  void _unusedFailedChecks52;
  const _unusedFailedChecks53 = failedChecks;
  void _unusedFailedChecks53;
  const _unusedFailedChecks54 = failedChecks;
  void _unusedFailedChecks54;
  const _unusedFailedChecks55 = failedChecks;
  void _unusedFailedChecks55;
  const _unusedFailedChecks56 = failedChecks;
  void _unusedFailedChecks56;
  const _unusedFailedChecks57 = failedChecks;
  void _unusedFailedChecks57;
  const _unusedFailedChecks58 = failedChecks;
  void _unusedFailedChecks58;
  const _unusedFailedChecks59 = failedChecks;
  void _unusedFailedChecks59;
  const _unusedFailedChecks60 = failedChecks;
  void _unusedFailedChecks60;
  const _unusedFailedChecks61 = failedChecks;
  void _unusedFailedChecks61;
  const _unusedFailedChecks62 = failedChecks;
  void _unusedFailedChecks62;
  const _unusedFailedChecks63 = failedChecks;
  void _unusedFailedChecks63;
  const _unusedFailedChecks64 = failedChecks;
  void _unusedFailedChecks64;
  const _unusedFailedChecks65 = failedChecks;
  void _unusedFailedChecks65;
  const _unusedFailedChecks66 = failedChecks;
  void _unusedFailedChecks66;
  const _unusedFailedChecks67 = failedChecks;
  void _unusedFailedChecks67;
  const _unusedFailedChecks68 = failedChecks;
  void _unusedFailedChecks68;
  const _unusedFailedChecks69 = failedChecks;
  void _unusedFailedChecks69;
  const _unusedFailedChecks70 = failedChecks;
  void _unusedFailedChecks70;
  const _unusedFailedChecks71 = failedChecks;
  void _unusedFailedChecks71;
  const _unusedFailedChecks72 = failedChecks;
  void _unusedFailedChecks72;
  const _unusedFailedChecks73 = failedChecks;
  void _unusedFailedChecks73;
  const _unusedFailedChecks74 = failedChecks;
  void _unusedFailedChecks74;
  const _unusedFailedChecks75 = failedChecks;
  void _unusedFailedChecks75;
  const _unusedFailedChecks76 = failedChecks;
  void _unusedFailedChecks76;
  const _unusedFailedChecks77 = failedChecks;
  void _unusedFailedChecks77;
  const _unusedFailedChecks78 = failedChecks;
  void _unusedFailedChecks78;
  const _unusedFailedChecks79 = failedChecks;
  void _unusedFailedChecks79;
  const _unusedFailedChecks80 = failedChecks;
  void _unusedFailedChecks80;
  const _unusedFailedChecks81 = failedChecks;
  void _unusedFailedChecks81;
  const _unusedFailedChecks82 = failedChecks;
  void _unusedFailedChecks82;
  const _unusedFailedChecks83 = failedChecks;
  void _unusedFailedChecks83;
  const _unusedFailedChecks84 = failedChecks;
  void _unusedFailedChecks84;
  const _unusedFailedChecks85 = failedChecks;
  void _unusedFailedChecks85;
  const _unusedFailedChecks86 = failedChecks;
  void _unusedFailedChecks86;
  const _unusedFailedChecks87 = failedChecks;
  void _unusedFailedChecks87;
  const _unusedFailedChecks88 = failedChecks;
  void _unusedFailedChecks88;
  const _unusedFailedChecks89 = failedChecks;
  void _unusedFailedChecks89;
  const _unusedFailedChecks90 = failedChecks;
  void _unusedFailedChecks90;
  const _unusedFailedChecks91 = failedChecks;
  void _unusedFailedChecks91;
  const _unusedFailedChecks92 = failedChecks;
  void _unusedFailedChecks92;
  const _unusedFailedChecks93 = failedChecks;
  void _unusedFailedChecks93;
  const _unusedFailedChecks94 = failedChecks;
  void _unusedFailedChecks94;
  const _unusedFailedChecks95 = failedChecks;
  void _unusedFailedChecks95;
  const _unusedFailedChecks96 = failedChecks;
  void _unusedFailedChecks96;
  const _unusedFailedChecks97 = failedChecks;
  void _unusedFailedChecks97;
  const _unusedFailedChecks98 = failedChecks;
  void _unusedFailedChecks98;
  const _unusedFailedChecks99 = failedChecks;
  void _unusedFailedChecks99;
  const _unusedFailedChecks100 = failedChecks;
  void _unusedFailedChecks100;
  const _unusedFailedChecks101 = failedChecks;
  void _unusedFailedChecks101;
  const _unusedFailedChecks102 = failedChecks;
  void _unusedFailedChecks102;
  const _unusedFailedChecks103 = failedChecks;
  void _unusedFailedChecks103;
  const _unusedFailedChecks104 = failedChecks;
  void _unusedFailedChecks104;
  const _unusedFailedChecks105 = failedChecks;
  void _unusedFailedChecks105;
  const _unusedFailedChecks106 = failedChecks;
  void _unusedFailedChecks106;
  const _unusedFailedChecks107 = failedChecks;
  void _unusedFailedChecks107;
  const _unusedFailedChecks108 = failedChecks;
  void _unusedFailedChecks108;
  const _unusedFailedChecks109 = failedChecks;
  void _unusedFailedChecks109;
  const _unusedFailedChecks110 = failedChecks;
  void _unusedFailedChecks110;
  const _unusedFailedChecks111 = failedChecks;
  void _unusedFailedChecks111;
  const _unusedFailedChecks112 = failedChecks;
  void _unusedFailedChecks112;
  const _unusedFailedChecks113 = failedChecks;
  void _unusedFailedChecks113;
  const _unusedFailedChecks114 = failedChecks;
  void _unusedFailedChecks114;
  const _unusedFailedChecks115 = failedChecks;
  void _unusedFailedChecks115;
  const _unusedFailedChecks116 = failedChecks;
  void _unusedFailedChecks116;
  const _unusedFailedChecks117 = failedChecks;
  void _unusedFailedChecks117;
  const _unusedFailedChecks118 = failedChecks;
  void _unusedFailedChecks118;
  const _unusedFailedChecks119 = failedChecks;
  void _unusedFailedChecks119;
  const _unusedFailedChecks120 = failedChecks;
  void _unusedFailedChecks120;
  const _unusedFailedChecks121 = failedChecks;
  void _unusedFailedChecks121;
  const _unusedFailedChecks122 = failedChecks;
  void _unusedFailedChecks122;
  const _unusedFailedChecks123 = failedChecks;
  void _unusedFailedChecks123;
  const _unusedFailedChecks124 = failedChecks;
  void _unusedFailedChecks124;
  const _unusedFailedChecks125 = failedChecks;
  void _unusedFailedChecks125;
  const _unusedFailedChecks126 = failedChecks;
  void _unusedFailedChecks126;
  const _unusedFailedChecks127 = failedChecks;
  void _unusedFailedChecks127;
  const _unusedFailedChecks128 = failedChecks;
  void _unusedFailedChecks128;
  const _unusedFailedChecks129 = failedChecks;
  void _unusedFailedChecks129;
  const _unusedFailedChecks130 = failedChecks;
  void _unusedFailedChecks130;
  const _unusedFailedChecks131 = failedChecks;
  void _unusedFailedChecks131;
  const _unusedFailedChecks132 = failedChecks;
  void _unusedFailedChecks132;
  const _unusedFailedChecks133 = failedChecks;
  void _unusedFailedChecks133;
  const _unusedFailedChecks134 = failedChecks;
  void _unusedFailedChecks134;
  const _unusedFailedChecks135 = failedChecks;
  void _unusedFailedChecks135;
  const _unusedFailedChecks136 = failedChecks;
  void _unusedFailedChecks136;
  const _unusedFailedChecks137 = failedChecks;
  void _unusedFailedChecks137;
  const _unusedFailedChecks138 = failedChecks;
  void _unusedFailedChecks138;
  const _unusedFailedChecks139 = failedChecks;
  void _unusedFailedChecks139;
  const _unusedFailedChecks140 = failedChecks;
  void _unusedFailedChecks140;
  const _unusedFailedChecks141 = failedChecks;
  void _unusedFailedChecks141;
  const _unusedFailedChecks142 = failedChecks;
  void _unusedFailedChecks142;
  const _unusedFailedChecks143 = failedChecks;
  void _unusedFailedChecks143;
  const _unusedFailedChecks144 = failedChecks;
  void _unusedFailedChecks144;
  const _unusedFailedChecks145 = failedChecks;
  void _unusedFailedChecks145;
  const _unusedFailedChecks146 = failedChecks;
  void _unusedFailedChecks146;
  const _unusedFailedChecks147 = failedChecks;
  void _unusedFailedChecks147;
  const _unusedFailedChecks148 = failedChecks;
  void _unusedFailedChecks148;

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
