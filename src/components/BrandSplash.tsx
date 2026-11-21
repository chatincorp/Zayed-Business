import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import YasirZayedLogo from "./YasirZayedLogo";

/**
 * Brand splash + loading animation.
 *
 * The emblem draws itself in, the star catches the light, the wings lift and a
 * thin gold progress line runs under the wordmark. Shown once per browser
 * session on first load; `BrandLoader` reuses the same emblem as the route
 * loading state so navigation never falls back to plain "Loading...".
 */

const SPLASH_SESSION_KEY = "yz-splash-shown";
const SPLASH_DURATION = 1700;

function readSessionFlag(key: string) {
  try {
    return sessionStorage.getItem(key) === "1";
  } catch {
    return false;
  }
}

export function BrandLoader({
  label = "Loading",
  fullScreen = false,
}: {
  label?: string;
  fullScreen?: boolean;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className={
        fullScreen
          ? "min-h-screen flex flex-col items-center justify-center gap-5 bg-navy-dark"
          : "flex flex-col items-center justify-center gap-4 py-10"
      }
      role="status"
      aria-live="polite"
    >
      <div className="relative flex h-24 w-24 items-center justify-center">
        <motion.span
          aria-hidden
          className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(239,199,94,0.28),transparent_65%)]"
          animate={reduceMotion ? undefined : { scale: [0.9, 1.08, 0.9], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.span
          aria-hidden
          className="absolute inset-1 rounded-full border border-amber-300/15 border-t-amber-300/80"
          animate={reduceMotion ? undefined : { rotate: 360 }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          animate={reduceMotion ? undefined : { y: [-3, 3, -3] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <YasirZayedLogo height={58} />
        </motion.div>
      </div>
      <span className="text-[10px] font-semibold uppercase tracking-[0.32em] text-amber-200/70">
        {label}
      </span>
    </div>
  );
}

export default function BrandSplash() {
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<"in" | "out" | "gone">(() =>
    readSessionFlag(SPLASH_SESSION_KEY) ? "gone" : "in",
  );

  useEffect(() => {
    if (phase !== "in") return;
    try {
      sessionStorage.setItem(SPLASH_SESSION_KEY, "1");
    } catch {
      /* private mode: the splash simply shows again next load */
    }
    const fade = window.setTimeout(
      () => setPhase("out"),
      reduceMotion ? 200 : SPLASH_DURATION,
    );
    const done = window.setTimeout(
      () => setPhase("gone"),
      reduceMotion ? 400 : SPLASH_DURATION + 350,
    );
    return () => {
      window.clearTimeout(fade);
      window.clearTimeout(done);
    };
  }, [phase, reduceMotion]);

  if (phase === "gone") return null;

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden bg-[#070d18]"
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === "out" ? 0 : 1 }}
      transition={{ duration: 0.32 }}
      onClick={() => setPhase("out")}
    >
      <div className="absolute inset-0 bg-grid-pattern-dark opacity-60" />
      <motion.div
        aria-hidden
        className="absolute h-[560px] w-[560px] rounded-full blur-[120px]"
        style={{
          background:
            "conic-gradient(from 0deg, rgba(239,199,94,0.35), rgba(239,199,94,0.02), rgba(239,199,94,0.28), rgba(239,199,94,0.02), rgba(239,199,94,0.35))",
        }}
        animate={reduceMotion ? undefined : { rotate: 360, scale: [0.92, 1.04, 0.92] }}
        transition={{
          rotate: { duration: 9, repeat: Infinity, ease: "linear" },
          scale: { duration: 3.2, repeat: Infinity, ease: "easeInOut" },
        }}
      />

      <div className="relative flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 26, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <motion.div
            aria-hidden
            className="absolute -inset-10 rounded-full bg-amber-300/10 blur-2xl"
            animate={reduceMotion ? undefined : { opacity: [0.35, 0.8, 0.35] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="relative"
            animate={reduceMotion ? undefined : { y: [0, -5, 0] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <YasirZayedLogo height={172} className="relative drop-shadow-[0_10px_40px_rgba(239,199,94,0.25)]" />
            {/* Gold light sweeping across the emblem, like a polished metal shine. */}
            <span className="pointer-events-none absolute inset-0 overflow-hidden">
              <motion.span
                aria-hidden
                className="absolute -inset-y-10 w-14 -rotate-12 bg-gradient-to-r from-transparent via-white/35 to-transparent blur-[3px]"
                initial={{ x: -160, opacity: 0 }}
                animate={
                  reduceMotion ? undefined : { x: 300, opacity: [0, 0.9, 0.9, 0] }
                }
                transition={{
                  duration: 2.1,
                  repeat: Infinity,
                  repeatDelay: 1.7,
                  ease: "easeInOut",
                }}
              />
            </span>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="mt-8 text-center"
        >
          <p className="font-display text-lg font-bold tracking-[0.32em] text-white">YASIR ZAYED</p>
          <p className="mt-2 text-[10px] uppercase tracking-[0.26em] text-amber-200/60">
            Business · Security · Technology
          </p>
        </motion.div>

        <div className="mt-10 h-px w-56 overflow-hidden rounded-full bg-white/10">
          <motion.span
            className="block h-full w-full origin-left bg-gradient-to-r from-amber-200 via-amber-400 to-[#8A5510]"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{
              duration: reduceMotion ? 0.3 : 1.45,
              ease: [0.4, 0, 0.2, 1],
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}
