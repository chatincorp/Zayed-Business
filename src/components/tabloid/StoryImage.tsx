/**
 * StoryImage — covers for tabloid posts.
 *
 * Two rules:
 *  1. If the story came with its own image from the original source, that image
 *     is used (credit shown by the caller). Journalism should look like the
 *     story it belongs to.
 *  2. If it did not, the post gets its own generated cover: a desk photograph
 *     from the local editorial set, cropped, tone-shifted and stamped with a
 *     monogram derived from the headline, so no two posts share a cover even
 *     when they share a desk.
 *
 * Nothing is hotlinked: the desk set lives in public/images/tabloid.
 */

export type StoryImageVariant = "lead" | "card" | "thumb" | "hero";

const DESK_IMAGES: Record<string, string> = {
  africa: "/images/tabloid/africa.jpg",
  finance: "/images/tabloid/finance.jpg",
  technology: "/images/tabloid/technology.jpg",
  business: "/images/tabloid/business.jpg",
  security: "/images/tabloid/security.jpg",
};

/**
 * Map whatever desk label the feed uses (“Global Finance”, “tech”, “Cyber”,
 * “Kenya”) onto the five editorial photo desks, so a cover matches its story
 * instead of defaulting to the same picture for everything.
 */
export function deskFor(category: string): string {
  const value = category.toLowerCase();
  if (/security|cyber|surveillance|crime|fraud|data protection/.test(value)) return "security";
  if (/financ|market|invest|econom|bank|rate|trade|stock|forex/.test(value)) return "finance";
  if (/tech|ai\b|artificial|software|startup|digital|telecom|internet/.test(value)) return "technology";
  if (/africa|kenya|nairobi|east africa|continent/.test(value)) return "africa";
  return "business";
}

/** Accent rail per desk. */
const DESK_ACCENT: Record<string, string> = {
  africa: "from-amber-400/90 via-amber-400/20",
  finance: "from-emerald-400/90 via-emerald-400/20",
  technology: "from-electric/90 via-electric/20",
  business: "from-sky-400/90 via-sky-400/20",
  security: "from-rose-400/90 via-rose-400/20",
};

/** Stable per-post hash so a cover never changes between renders. */
function seedOf(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) % 1_000_003;
  }
  return hash;
}

const STOP_WORDS = new Set([
  "the", "a", "an", "and", "of", "in", "on", "for", "to", "is", "are", "as",
  "its", "it", "has", "have", "with", "at", "by", "from", "that", "this",
]);

/** Two-letter stamp taken from the headline, e.g. "Kenya Just Had…" → KJ. */
function monogramOf(title: string): string {
  const words = title
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word.toLowerCase()));
  const letters = (words.length >= 2 ? [words[0], words[1]] : [title])
    .map((word) => word[0] ?? "")
    .join("")
    .toUpperCase();
  return letters || "ZT";
}

export function coverFor(item: { id: string; category: string; image?: string }): string {
  if (item.image) return item.image;
  return DESK_IMAGES[deskFor(item.category)];
}

export default function StoryImage({
  item,
  variant = "card",
  className = "",
  label,
  credit,
}: {
  item: { id: string; title: string; category: string; image?: string };
  variant?: StoryImageVariant;
  className?: string;
  label?: string;
  credit?: string;
}) {
  const seed = seedOf(`${item.id}${item.title}`);
  const desk = deskFor(item.category);
  const accent = DESK_ACCENT[desk];
  const isSourceImage = Boolean(item.image);
  // Five deterministic crops + a small tone shift so posts on the same desk
  // still read as different photographs.
  const position = ["50% 40%", "35% 55%", "65% 45%", "45% 60%", "58% 35%"][seed % 5];
  const hue = ((seed % 9) - 4) * 3; // -12deg … +12deg
  const monogram = monogramOf(item.title);
  const issue = String((seed % 89) + 10);

  return (
    <div className={`relative overflow-hidden bg-[#0a0f1a] ${className}`}>
      <img
        src={coverFor(item)}
        alt={item.title}
        loading={variant === "hero" || variant === "lead" ? "eager" : "lazy"}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        style={{
          objectPosition: position,
          filter: isSourceImage ? "none" : `saturate(0.85) contrast(1.05) hue-rotate(${hue}deg)`,
        }}
      />

      {/* Duotone wash + desk accent + grain: the publication's look. */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#060a14] via-[#060a14]/45 to-transparent" />
      <div className="absolute inset-0 bg-[#060a14]/25 mix-blend-multiply" />
      <div
        className={`absolute inset-y-0 left-0 w-1 bg-gradient-to-b ${accent} to-transparent opacity-80`}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.5) 0.5px, transparent 0.6px)",
          backgroundSize: "4px 4px",
        }}
      />

      {/* Post-specific stamp so re-used desk art is never a repeated picture. */}
      {variant !== "thumb" && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-3 right-2 select-none font-black leading-none tracking-tighter text-white/[0.14]"
          style={{ fontSize: variant === "lead" || variant === "hero" ? 132 : 78 }}
        >
          {monogram}
        </span>
      )}

      {label && (
        <span className="absolute top-3 left-4 text-[10px] font-bold uppercase tracking-[0.22em] text-white/80">
          {label}
        </span>
      )}

      {credit && (
        <span className="absolute bottom-2 left-4 text-[9px] uppercase tracking-wider text-white/45">
          {credit}
        </span>
      )}

      {variant !== "thumb" && (
        <span className="absolute bottom-2.5 right-3 font-mono text-[10px] tabular-nums text-white/40">
          No. {issue}
        </span>
      )}
    </div>
  );
}
