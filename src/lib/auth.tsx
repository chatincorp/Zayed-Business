/**
 * Client-side authentication.
 *
 * The site ships as a static bundle, so sign-in must not depend on an email
 * provider or a server round-trip. A user verifies with a math challenge on
 * the Auth page and we keep the resulting session in localStorage.
 *
 * This is an access gate for the demo workspace — not a security boundary.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export interface AuthUser {
  name?: string;
  email?: string;
}

interface AuthSession extends AuthUser {
  createdAt: number;
}

export interface AuthContextValue {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: AuthUser | null;
  signIn: (details: { email: string; name?: string }) => Promise<void>;
  signOut: () => Promise<void>;
}

const STORAGE_KEY = "yz-auth-session";

function readSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<AuthSession>;
    if (typeof parsed?.email !== "string" || !parsed.email) return null;
    return {
      email: parsed.email,
      name: typeof parsed.name === "string" ? parsed.name : undefined,
      createdAt:
        typeof parsed.createdAt === "number" ? parsed.createdAt : Date.now(),
    };
  } catch {
    return null;
  }
}

/** "jane.doe@example.com" → "Jane Doe" */
function nameFromEmail(email: string): string | undefined {
  const local = email.split("@")[0]?.trim();
  if (!local) return undefined;
  const words = local
    .split(/[._\-+]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
  return words.length > 0 ? words.join(" ") : undefined;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(readSession);

  // Keep tabs in sync when the user signs in or out in another window.
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return;
      setSession(readSession());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const signIn = useCallback(
    async ({ email, name }: { email: string; name?: string }) => {
      const normalized = email.trim().toLowerCase();
      if (!normalized) throw new Error("Please enter your email address.");

      const next: AuthSession = {
        email: normalized,
        name: name?.trim() || nameFromEmail(normalized),
        createdAt: Date.now(),
      };

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Private browsing/quota — the session still works for this tab.
      }
      setSession(next);
    },
    [],
  );

  const signOut = useCallback(async () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Storage unavailable — clearing state is enough.
    }
    setSession(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      isLoading: false,
      isAuthenticated: session !== null,
      user: session ? { name: session.name, email: session.email } : null,
      signIn,
      signOut,
    }),
    [session, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return context;
}
