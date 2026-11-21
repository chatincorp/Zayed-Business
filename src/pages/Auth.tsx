import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import PolicyConsent from "@/components/PolicyConsent";

import { useAuth } from "@/hooks/use-auth";
import { useSEO } from "@/lib/seo";
import { ArrowLeft, ArrowRight, Loader2, Lock, Mail, User } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";

interface AuthProps {
  redirectAfterAuth?: string;
}

type Mode = "signin" | "signup";

function resolveRedirectAfterAuth(
  returnTo: string | null,
  fallback: string | undefined,
) {
  if (returnTo) return returnTo;
  if (fallback) return fallback;
  return "/dashboard";
}

function friendlyError(error: unknown): string {
  const message =
    error instanceof Error ? error.message : String(error ?? "Unknown error");
  if (/invalid credentials/i.test(message)) {
    return "That email and password combination doesn't match an account.";
  }
  if (/already exists|already has/i.test(message)) {
    return "An account with that email already exists — sign in instead.";
  }
  if (/password/i.test(message) && /characters|short/i.test(message)) {
    return "Passwords must be at least 8 characters long.";
  }
  return message;
}

function Auth({ redirectAfterAuth }: AuthProps = {}) {
  useSEO({
    title: "Sign In",
    description:
      "Sign in to your Yasir Zayed account — client workspace, supplier portal or staff admin panel.",
    noindex: true,
  });

  const {
    isLoading,
    isAuthenticated,
    isStaff,
    policyAccepted,
    signIn,
    signUp,
    acceptPolicy,
  } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = resolveRedirectAfterAuth(
    searchParams.get("returnTo"),
    redirectAfterAuth,
  );

  const [mode, setMode] = useState<Mode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPolicy, setShowPolicy] = useState(false);
  const [acceptedThisSession, setAcceptedThisSession] = useState(false);
  const [continueAfterPolicy, setContinueAfterPolicy] = useState(false);

  // Signed-in accounts whose policy acceptance is missing must accept it once;
  // the acceptance is written to their user record in Convex.
  useEffect(() => {
    if (isLoading || !isAuthenticated) return;
    if (!policyAccepted && !acceptedThisSession) {
      setShowPolicy(true);
    }
  }, [isLoading, isAuthenticated, policyAccepted, acceptedThisSession]);

  useEffect(() => {
    if (isLoading || !isAuthenticated) return;
    if (!policyAccepted && !acceptedThisSession) return;
    if (isStaff && (redirect === "/dashboard" || redirect === "/")) {
      navigate("/admin", { replace: true });
      return;
    }
    navigate(redirect, { replace: true });
  }, [
    isLoading,
    isAuthenticated,
    isStaff,
    policyAccepted,
    acceptedThisSession,
    redirect,
    navigate,
  ]);

  const authenticate = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      if (mode === "signup") {
        await signUp({ email, password, name });
        try {
          await acceptPolicy();
        } catch {
          // Acceptance is retried from the consent dialog if it is still needed.
        }
      } else {
        await signIn({ email, password });
      }
    } catch (authError) {
      setError(friendlyError(authError));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const normalized = email.trim().toLowerCase();
    if (!normalized.includes("@")) {
      setError("Enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setError("Passwords must be at least 8 characters long.");
      return;
    }
    if (mode === "signup" && !acceptedThisSession && !policyAccepted) {
      setContinueAfterPolicy(true);
      setShowPolicy(true);
      return;
    }
    await authenticate();
  };

  const handlePolicyAccept = async () => {
    setAcceptedThisSession(true);
    setShowPolicy(false);
    if (isAuthenticated) {
      try {
        await acceptPolicy();
      } catch {
        // Recorded on next successful sign-in if this fails transiently.
      }
    }
    if (continueAfterPolicy) {
      setContinueAfterPolicy(false);
      await authenticate();
    }
  };

  const handlePolicyDecline = () => {
    setShowPolicy(false);
    setContinueAfterPolicy(false);
    if (!isAuthenticated) {
      setError("You must accept the policies to create an account.");
    }
  };

  const switchMode = () => {
    setMode(mode === "signin" ? "signup" : "signin");
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-navy-dark">
      <div className="absolute inset-0 bg-grid-pattern-dark opacity-30" />
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-electric/5 rounded-full blur-[120px] pointer-events-none" />

      {showPolicy && (
        <PolicyConsent
          onAccept={handlePolicyAccept}
          onDecline={handlePolicyDecline}
        />
      )}

      <div className="relative z-10 p-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-white/50 hover:text-white/80 text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center relative z-10 px-4 py-8">
        <div className="flex items-center justify-center h-full flex-col w-full max-w-md">
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

          <Card className="w-full border-white/10 bg-card/50 backdrop-blur-xl shadow-2xl shadow-black/20">
            <CardHeader className="text-center">
              <CardTitle className="text-xl font-display">
                {mode === "signin" ? "Welcome Back" : "Create Your Account"}
              </CardTitle>
              <CardDescription>
                {mode === "signin"
                  ? "Sign in with your email and password."
                  : "Client accounts are created instantly. Staff access is issued by an administrator."}
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {mode === "signup" && (
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      name="name"
                      placeholder="Full name"
                      autoComplete="name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      className="pl-9"
                      disabled={isSubmitting}
                    />
                  </div>
                )}

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
                    disabled={isSubmitting}
                    required
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    name="password"
                    placeholder="Password (8+ characters)"
                    type="password"
                    autoComplete={
                      mode === "signin" ? "current-password" : "new-password"
                    }
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="pl-9"
                    disabled={isSubmitting}
                    required
                  />
                </div>

                {error && (
                  <p className="text-rose-400 text-sm text-center">{error}</p>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting || isLoading}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {mode === "signin" ? "Signing in…" : "Creating account…"}
                    </>
                  ) : (
                    <>
                      {mode === "signin" ? "Sign In" : "Create Account"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>

                <p className="text-center text-xs text-white/40 leading-relaxed">
                  Staff and administrator accounts are created by an
                  administrator — sign in with the credentials you were issued.
                  There is no staff sign-up.
                </p>
              </CardContent>
            </form>

            <div className="px-6 pb-6 text-center">
              <button
                type="button"
                onClick={switchMode}
                className="text-sm text-electric hover:text-electric-light transition-colors"
              >
                {mode === "signin"
                  ? "New client? Create an account"
                  : "Already have an account? Sign in"}
              </button>
            </div>
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
