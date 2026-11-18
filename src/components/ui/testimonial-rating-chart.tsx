import { TestimonialStats } from "@/lib/useTestimonials";

export function TestimonialRatingChart({ stats }: { stats: TestimonialStats }) {
  const entries = [
    { stars: 5, count: stats.fiveStarCount },
    { stars: 4, count: stats.fourStarCount },
    { stars: 3, count: stats.threeStarCount },
    { stars: 2, count: stats.twoStarCount },
    { stars: 1, count: stats.oneStarCount },
  ] as const;

  const max = Math.max(1, ...entries.map((e) => e.count));

  return (
    <div className="mt-6 flex flex-col gap-1.5 text-sm">
      {entries.map(({ stars, count }) => {
        const width = (count / max) * 100;
        return (
          <div key={stars} className="flex items-center gap-3">
            <span className="w-6 flex items-center justify-end text-muted-foreground text-xs tabular-nums">
              {stars}
            </span>
            <div className="flex-1 h-2.5 rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full rounded-full bg-amber-400/80"
                style={{ width: `${width}%` }}
              />
            </div>
            <span className="w-8 text-right text-muted-foreground text-xs tabular-nums">
              {count}
            </span>
          </div>
        );
      })}
    </div>
  );
}
