/**
 * Yasir Zayed Logo — SVG recreation of the brand mark.
 *
 * Variants:
 *   "icon"  — the abstract tower/star mark only
 *   "full"  — mark + "YASIR ZAYED" wordmark + decorative divider
 *
 * Pass `color` to override fill (defaults to "currentColor").
 */

interface YasirZayedLogoProps {
  variant?: "icon" | "full";
  color?: string;
  className?: string;
  height?: number;
}

export default function YasirZayedLogo({
  variant = "icon",
  color = "currentColor",
  className = "",
  height,
}: YasirZayedLogoProps) {
  if (variant === "icon") {
    return (
      <svg
        viewBox="0 0 200 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={height ? { height, width: "auto" } : undefined}
        aria-label="Yasir Zayed"
      >
        {/* Four-pointed star */}
        <path
          d="M100 8 L104 24 L112 16 L108 32 L120 28 L108 40 L116 48 L104 44 L100 60 L96 44 L84 48 L92 40 L80 28 L92 32 L88 16 L96 24 Z"
          fill={color}
        />

        {/* Central spire — tall pointed blade */}
        <path
          d="M100 42 L107 70 L110 130 L112 170 L106 180 L100 185 L94 180 L88 170 L90 130 L93 70 Z"
          fill={color}
        />

        {/* Left outer wing — sweeping curve */}
        <path
          d="M93 72 C80 85 55 120 38 155 C30 170 28 185 34 195 C40 205 52 208 62 200 C72 192 80 175 86 155 L90 130 Z"
          fill={color}
        />

        {/* Right outer wing — sweeping curve */}
        <path
          d="M107 72 C120 85 145 120 162 155 C170 170 172 185 166 195 C160 205 148 208 138 200 C128 192 120 175 114 155 L110 130 Z"
          fill={color}
        />

        {/* Left inner angular element */}
        <path
          d="M88 148 L80 170 L72 188 L66 198 L74 205 L84 196 L90 178 L93 155 Z"
          fill={color}
        />

        {/* Right inner angular element */}
        <path
          d="M112 148 L120 170 L128 188 L134 198 L126 205 L116 196 L110 178 L107 155 Z"
          fill={color}
        />
      </svg>
    );
  }

  // Full logo: icon + wordmark + decorative line
  return (
    <svg
      viewBox="0 0 240 310"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={height ? { height, width: "auto" } : undefined}
      aria-label="Yasir Zayed"
    >
      {/* Four-pointed star */}
      <path
        d="M120 8 L124 24 L132 16 L128 32 L140 28 L128 40 L136 48 L124 44 L120 60 L116 44 L104 48 L112 40 L100 28 L112 32 L108 16 L116 24 Z"
        fill={color}
      />

      {/* Central spire */}
      <path
        d="M120 42 L127 70 L130 130 L132 170 L126 180 L120 185 L114 180 L108 170 L110 130 L113 70 Z"
        fill={color}
      />

      {/* Left outer wing */}
      <path
        d="M113 72 C100 85 75 120 58 155 C50 170 48 185 54 195 C60 205 72 208 82 200 C92 192 100 175 106 155 L110 130 Z"
        fill={color}
      />

      {/* Right outer wing */}
      <path
        d="M127 72 C140 85 165 120 182 155 C190 170 192 185 186 195 C180 205 168 208 158 200 C148 192 140 175 134 155 L130 130 Z"
        fill={color}
      />

      {/* Left inner angular element */}
      <path
        d="M108 148 L100 170 L92 188 L86 198 L94 205 L104 196 L110 178 L113 155 Z"
        fill={color}
      />

      {/* Right inner angular element */}
      <path
        d="M132 148 L140 170 L148 188 L154 198 L146 205 L136 196 L130 178 L127 155 Z"
        fill={color}
      />

      {/* YASIR ZAYED wordmark */}
      <text
        x="120"
        y="250"
        textAnchor="middle"
        fill={color}
        fontSize="26"
        fontFamily="'Georgia', 'Times New Roman', serif"
        letterSpacing="8"
        fontWeight="400"
      >
        YASIR ZAYED
      </text>

      {/* Decorative line left */}
      <line
        x1="40"
        y1="272"
        x2="108"
        y2="272"
        stroke={color}
        strokeWidth="1"
      />
      {/* Decorative line right */}
      <line
        x1="132"
        y1="272"
        x2="200"
        y2="272"
        stroke={color}
        strokeWidth="1"
      />
      {/* Decorative center star */}
      <path
        d="M120 266 L122 270 L126 268 L124 272 L128 274 L124 276 L126 280 L122 278 L120 282 L118 278 L114 280 L116 276 L112 274 L116 272 L114 268 L118 270 Z"
        fill={color}
      />
    </svg>
  );
}
