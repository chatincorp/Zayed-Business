/**
 * Yasir Zayed Logo — vector recreation of the golden brand emblem.
 *
 * Variants:
 *   "icon"  — the emblem only (star, spire, radiating blades, sweeping wings)
 *   "full"  — emblem + decorative divider + small star flourish (no wordmark)
 *
 * Fill modes:
 *   - default: metallic gold gradient
 *   - pass `color` (e.g. "white") for a solid fill
 *
 * The name was removed from the mark per brand direction — the wordmark
 * lives as HTML text next to the emblem where needed (nav, footer).
 */

import { useId } from "react";

interface YasirZayedLogoProps {
  variant?: "icon" | "full";
  color?: string;
  className?: string;
  height?: number;
}

// Left-half geometry; the right half is a mirrored copy for perfect symmetry.
const LEFT_SHAPE_PATHS = [
  // Central spire — left half (thin slit separates it from the right half)
  "M200 92 L191 220 L189 280 L192 352 L200 448 L197 352 L197 130 Z",
  // Inner radiating blade (adjacent to the spire)
  "M170 150 L177 172 L177 396 L170 414 L163 396 L163 172 Z",
  // Outer radiating blade
  "M138 225 L144 245 L144 390 L138 406 L132 390 L132 245 Z",
  // Outer sweeping wing
  "M148 258 C112 298 80 360 52 432 C96 418 132 396 154 368 C162 330 157 292 148 258 Z",
  // Inner sweeping wing
  "M162 330 C142 362 122 398 110 436 C134 426 154 410 168 390 C172 368 169 348 162 330 Z",
  // Small angular shard at the base
  "M186 378 L177 410 L170 440 L184 428 L193 402 Z",
];

// Four-pointed star crowning the emblem
const STAR_PATH =
  "M200 8 C203.5 24 212 32.5 228 36 C212 39.5 203.5 48 200 64 C196.5 48 188 39.5 172 36 C188 32.5 196.5 24 200 8 Z";

export default function YasirZayedLogo({
  variant = "icon",
  color,
  className = "",
  height,
}: YasirZayedLogoProps) {
  const uid = useId().replace(/:/g, "");
  const goldId = `yz-gold-${uid}`;
  const fill = color ? color : `url(#${goldId})`;
  const isFull = variant === "full";

  const shapes = (mirrored: boolean) => (
    <g transform={mirrored ? "translate(400,0) scale(-1,1)" : undefined}>
      {LEFT_SHAPE_PATHS.map((d) => (
        <path key={d} d={d} fill={fill} />
      ))}
    </g>
  );

  return (
    <svg
      viewBox={isFull ? "0 0 400 506" : "0 0 400 460"}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={height ? { height, width: "auto" } : undefined}
      role="img"
      aria-label="Yasir Zayed emblem"
    >
      {!color && (
        <defs>
          <linearGradient
            id={goldId}
            gradientUnits="userSpaceOnUse"
            x1="200"
            y1="8"
            x2="200"
            y2="448"
          >
            <stop offset="0" stopColor="#F8E7A0" />
            <stop offset="0.28" stopColor="#EFC75E" />
            <stop offset="0.55" stopColor="#D9A62E" />
            <stop offset="0.8" stopColor="#B67B14" />
            <stop offset="1" stopColor="#8A5510" />
          </linearGradient>
        </defs>
      )}

      <path d={STAR_PATH} fill={fill} />
      {shapes(false)}
      {shapes(true)}

      {isFull && (
        <g stroke={fill} strokeWidth="1.5">
          <line x1="70" y1="489" x2="180" y2="489" />
          <line x1="220" y1="489" x2="330" y2="489" />
          <path
            d="M200 476 C202 484 206 488 213.5 489 C206 490 202 494 200 502 C198 494 194 490 186.5 489 C194 488 198 484 200 476 Z"
            fill={fill}
            stroke="none"
          />
        </g>
      )}
    </svg>
  );
}
