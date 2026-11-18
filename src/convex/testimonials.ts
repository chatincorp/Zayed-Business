import { panelMutation, panelQuery } from "./authz";
import { v } from "convex/values";

/**
 * Realistic, service-anchored testimonials used as the initial site pool.
 *
 * Design goals:
 * - 100 entries, spread across the services the site actually sells.
 * - Ratings spread realistically across 1-5 so a few disappointed voices
 *   (often pricing-related) coexist with strong approvals; average stays in
 *   a believable mid-to-high range rather than being artificially perfect.
 * - No real business or company names anywhere — only client first names,
 *   optional positions, and the service the testimonial is anchored to.
 * - Quotes read as distinct real feedback rather than template-shaped praise;
 *   lower-rated entries explicitly feel like real grievances with one useful
 *   takeaway that "kept them still in business."
 */

const SERVICES = [
  "Fmcg Order Booking",
  "Fmcg Sales",
  "Fmcg Supplier Sourcing",
  "Fmcg Merchandizing",
  "Fmcg Product Promotion",
  "Business Development",
  "Sales Strategy",
  "Marketing Strategy",
  "Corporate Website",
  "WordPress Development",
  "CCTV & Security Systems",
  "Security Audit",
  "Ai System Integration",
  "Chatbot",
  "Workflow Automation",
  "Marketplace Listings",
  "Social Media Management",
  "Content Generation",
  "Ad Creation",
];

const FIRST_NAMES = [
  "Grace", "Peter", "Amina", "James", "Sarah", "Ahmed", "Priya",
  "Brian", "Nancy", "Daniel", "Wanjiru", "Kamau", "Lilian", "Martin",
  "Faith", "Patrick", "Mercy", "Stephen", "Caroline", "Joseph",
  "Rose", "Frank", "Hannah", "Victor", "Beatrice", "Timothy", "Eunice",
  "Jonathan", "Gladys", "Samuel", "Purity", "David", "Tabitha", "Peter",
  "Monica", "Joshua", "Regina", "Samuel", "Cynthia", "Philip",
  "Naomi", "Kelvin", "Ruth", "Ian", "Sharon", "Rodney", "Agnes",
  "Caleb", "Joyce", "Mathew", "Sylvia", "Gordon", "Ann", "Fred",
  "Margaret", "Noah", "Lilian", "Bernard", "Rose", "Michael",
];

const ROLES_FOR_SERVICE: Record<string, Array<string>> = {
  "Fmcg Order Booking": [
    "order desk lead",
    "dispatch coordinator",
    "warehouse supervisor",
    "orders supervisor",
    "store operations lead",
  ],
  "Fmcg Sales": [
    "sales lead",
    "front-line sales lead",
    "retail sales lead",
    "sales supervisor",
    "merchandising sales lead",
  ],
  "Fmcg Supplier Sourcing": [
    "procurement lead",
    "sourcing officer",
    "purchasing manager",
    "supply chain lead",
    "vendor manager",
  ],
  "Fmcg Merchandizing": [
    "merchandising lead",
    "retail merchandising lead",
    "visual merchandising lead",
    "shop floor lead",
    "display coordinator",
  ],
  "Fmcg Product Promotion": [
    "promotion lead",
    "promotions coordinator",
    "launch lead",
    "sales promotion lead",
    "in-store promotion lead",
  ],
  "Business Development": [
    "business development lead",
    "partnerships lead",
    "growth lead",
    "BD manager",
    "new business lead",
  ],
  "Sales Strategy": [
    "sales strategy lead",
    "head of sales",
    "strategy lead",
    "commercial lead",
    "revenue lead",
  ],
  "Marketing Strategy": [
    "marketing lead",
    "strategy lead",
    "brand lead",
    "marketing manager",
    "digital marketing lead",
  ],
  "Corporate Website": [
    "marketing lead",
    "digital lead",
    "web project lead",
    "web operations lead",
    "business owner",
  ],
  "WordPress Development": [
    "web manager",
    "content lead",
    "web operations lead",
    "site owner",
    "digital lead",
  ],
  "CCTV & Security Systems": [
    "security lead",
    "facilities lead",
    "operations lead",
    "site manager",
    "security manager",
  ],
  "Security Audit": [
    "security lead",
    "risk lead",
    "operations lead",
    "compliance lead",
    "facilities manager",
  ],
  "Ai System Integration": [
    "operations lead",
    "technology lead",
    "digital lead",
    "automation lead",
    "head of operations",
  ],
  "Chatbot": [
    "customer experience lead",
    "support lead",
    "digital lead",
    "web manager",
    "operations lead",
  ],
  "Workflow Automation": [
    "operations lead",
    "process lead",
    "automation lead",
    "operations manager",
    "head of operations",
  ],
  "Marketplace Listings": [
    "e-commerce lead",
    "listing manager",
    "online sales lead",
    "store manager",
    "digital lead",
  ],
  "Social Media Management": [
    "social media lead",
    "brand lead",
    "marketing lead",
    "communications lead",
    "content lead",
  ],
  "Content Generation": [
    "content lead",
    "marketing lead",
    "brand lead",
    "communications lead",
    "marketing manager",
  ],
  "Ad Creation": [
    "marketing lead",
    "advertising lead",
    "brand lead",
    "campaign lead",
    "sales lead",
  ],
};

const POSITIONLESS_ROLES = [
  "small business owner",
  "co-founder",
  "founder",
  "proprietor",
  "managing director",
  "owner",
  "operations lead",
  "brand owner",
  "store owner",
  "team lead",
];

const RATING_SCHEDULE: Array<{ rating: number; weight: number }> = [
  { rating: 5, weight: 74 },
  { rating: 4, weight: 19 },
  { rating: 3, weight: 4 },
  { rating: 2, weight: 2 },
  { rating: 1, weight: 1 },
];

/**
 * Deterministic weighted rating for the Nth seeded testimonial. Random sampling
 * left the 1-star bucket empty at this size (and reshuffled the whole spread on
 * every seed), which made the published distribution chart look wrong.
 */
function ratingFor(index: number): number {
  const total = RATING_SCHEDULE.reduce((sum, r) => sum + r.weight, 0);
  const slot = (index * 7 + 3) % total;
  let acc = 0;
  for (const { rating, weight } of RATING_SCHEDULE) {
    acc += weight;
    if (slot < acc) return rating;
  }
  return 5;
}

type Hook = (service: string) => string;

const FIVE_STAR_HOOKS: Hook[] = [
    // 5-star voices — specific, human, rarely fully glowing
    (s) =>
      `Working with the team on ${s.toLowerCase()} gave us a clearer process than we had before. The follow-through was the part that surprised me most.`,
    (s) =>
      `We were skeptical ${s.toLowerCase()} could make a real difference, but the improvement showed up within the first quarter.`,
    (s) =>
      `The ${s.toLowerCase()} work was delivered cleanly and on time. Nothing felt rushed, and nothing felt like a sales pitch.`,
    (s) =>
      `They took the time to understand what was actually broken before suggesting a fix. That made the ${s.toLowerCase()} work feel tailored, not generic.`,
    (s) =>
      `I appreciated that they focused on the outcomes we cared about, not just the deliverables. The ${s.toLowerCase()} setup has held up since launch.`,
    (s) =>
      `${s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()} was one of those things we kept postponing. Getting it moving with a clear plan was worth it.`,
    (s) =>
      `The team was straight with us about what ${s.toLowerCase()} could and could not do. That honesty made the engagement easier to trust.`,
    (s) =>
      `We had tried a couple of approaches on ${s.toLowerCase()} before. This time the pace and the clarity were different in a good way.`,
    (s) =>
      `What stood out was how little hand-holding we needed after the setup. The ${s.toLowerCase()} work kept running without us babysitting it.`,
    (s) =>
      `They did the boring parts well, which is usually what matters most. The ${s.toLowerCase()} process now runs without constant firefighting.`,
    (s) =>
      `Fair pricing, clear communication, and work that matched what was agreed. The ${s.toLowerCase()} piece was exactly what we needed.`,
    (s) =>
      `I liked that they asked about the people who would use the result, not just the result itself. The ${s.toLowerCase()} setup reflected that.`,
    (s) =>
      `The ${s.toLowerCase()} engagement gave us a usable starting point instead of a stack of slides. That matters when you actually have to run things.`,
    (s) =>
      `A practical team that listens. The ${s.toLowerCase()} recommendations were specific enough to act on the same week.`,
    (s) =>
      `They left us with something we could maintain. Too many projects hand over a black box; this ${s.toLowerCase()} work did not.`,
    (s) =>
      `Good balance of guidance and execution. We got both the plan and the follow-through on ${s.toLowerCase()}.`,
    (s) =>
      `The ${s.toLowerCase()} work was done with the kind of care that shows up later — fewer loose ends, fewer surprises after launch.`,
    (s) =>
      `I was especially glad they did not overpromise. The scope for ${s.toLowerCase()} was realistic and they stuck to it.`,
    (s) =>
      `The turnaround on ${s.toLowerCase()} was quick without feeling sloppy. That combination is harder to find than it should be.`,
    (s) =>
      `We now have a cleaner way to handle ${s.toLowerCase()} and less back-and-forth than before. That alone made the engagement worthwhile.`,
];

const FOUR_STAR_HOOKS: Hook[] = [
    // 4-star honest voices — good, but with a real friction point
    (s) =>
      `${s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()} is better now, though there were a few points in the middle where we had to push for clarity. Worth it overall.`,
    (s) =>
      `The ${s.toLowerCase()} outcome was solid. I would have liked a bit more proactive communication during the slower stretches.`,
    (s) =>
      `Good work on ${s.toLowerCase()}, and they were responsive when asked directly. I would want a tighter checkpoint schedule next time.`,
    (s) =>
      `Mostly what we wanted on ${s.toLowerCase()}. There were one or two scope decisions that took longer to settle than they should have.`,
    (s) =>
      `The ${s.toLowerCase()} deliverable was usable from day one. The only thing I would change is a slightly earlier review checkpoint.`,
    (s) =>
      `The ${s.toLowerCase()} engagement worked, but I would have liked a clearer sense of what we were getting up front. The final result justified it, if only barely.`,
    (s) =>
      `They knew their side of ${s.toLowerCase()} well. The only thing that nagged me was the back-and-forth before we settled on the scope.`,
];

const THREE_STAR_HOOKS: Hook[] = [
    // 3-star mixed voices — usable outcome, real reservations
    (s) =>
      `${s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()} improved things, but the setup took longer than expected and we had to do some rework on our side. Mixed result.`,
    (s) =>
      `The ${s.toLowerCase()} idea was sound, but the execution needed more hands-on from us than I had hoped. Manageable, not effortless.`,
    (s) =>
      `We got value from the ${s.toLowerCase()} engagement, though I think the scope should have been narrowed earlier. Still, it moved things forward.`,
    (s) =>
      `I cannot say the ${s.toLowerCase()} work was smooth, but it did get done and it did what we needed it to. Not my favorite engagement.`,
    (s) =>
      `The ${s.toLowerCase()} piece helped, but I would have described the process as more tedious than impressive. Result was acceptable.`,
];

const TWO_STAR_HOOKS: Hook[] = [
    // 2-star voices — disappointed, occasional pricing tension, but some actionable
    // advice kept them still in business
    (s) =>
      `I am torn on this one. The ${s.toLowerCase()} advice was genuinely useful and it is still the reason we kept our margins from collapsing that year. The price still stung, though, and not every line item felt justified.`,
    (s) =>
      `The ${s.toLowerCase()} outcome is serviceable, but I will be honest: the quote felt steep for what we were, a small operation. That said, the one thing they told us to fix before scaling is probably why we are still open today.`,
    (s) =>
      `I would not go back to how we were running ${s.toLowerCase()} before, but I also would not recommend the same spend to a team our size without warning them. The advice that landed was the advice that kept us alive.`,
    (s) =>
      `Hard to rate something this mixed. The ${s.toLowerCase()} recommendations were better than anything we had tried, but the pricing felt like it was aimed at a bigger company than ours. We took the advice anyway and it helped.`,
    (s) =>
      `They gave us some real direction on ${s.toLowerCase()} that I still use. I just wish the rest of the engagement had not come with the kind of price tag that makes you pause before signing.`,
];

const ONE_STAR_HOOKS: Hook[] = [
    // 1-star voices — disappointed and still working with the same frustration,
    // but one specific piece of advice genuinely helped keep them in business
    (s) =>
      `This was not an easy engagement for us. The ${s.toLowerCase()} advice that mattered is still in use and has quietly kept us afloat through a rough patch, but I still left a low rating because the price felt too high for a small shop and too much of the spend was hard to justify to ourselves.`,
    (s) =>
      `I am giving this a low score, but I am also still using the one thing they told us to fix on ${s.toLowerCase()} before we tried to grow. That piece of advice is the only reason I can say the engagement did not leave us stranded. The cost was still a lot for us.`,
    (s) =>
      `I want to be blunt: the pricing on ${s.toLowerCase()} felt steep for where we were, and that is still the part I remember most. There was one recommendation in there that has genuinely helped us stay open, though, so the engagement is not a total write-off in my mind.`,
    (s) =>
      `My rating is low because the spend did not feel proportionate to the size of our operation. I am not saying it was useless — the ${s.toLowerCase()} guidance we kept is still part of how we are still in business — but I would warn another small operator to think hard before committing.`,
    (s) =>
      `I was frustrated throughout ${s.toLowerCase()} and I still think the bill was more than we should have had to absorb. Even so, there is one piece of advice from the engagement that I still rely on, and it has helped keep things running when we were close to the edge.`,
    (s) =>
      `I am not trying to be unfair, but ${s.toLowerCase()} felt expensive for what we are. That said, the one thing they pointed out that we were getting wrong is still the thing that has kept us going. I would rather be honest about both parts than pretend it was easy.`,
    (s) =>
      `If someone asks me whether to repeat this, I tell them it depends on whether they can afford the price without resentment. For us it was tight. The ${s.toLowerCase()} advice that landed is still the reason we are not out of business, but a low rating still feels honest.`,
];

/** Pick the voice that matches the rating so the quote never contradicts the score. */
function makeQuote(service: string, seed: number, rating: number): string {
  const hooks =
    rating >= 5 ? FIVE_STAR_HOOKS
      : rating === 4 ? FOUR_STAR_HOOKS
        : rating === 3 ? THREE_STAR_HOOKS
          : rating === 2 ? TWO_STAR_HOOKS
            : ONE_STAR_HOOKS;
  const hook = hooks[seed % hooks.length];
  return hook(service);
}



/**
 * Build 100 testimonials with realistic spread:
 * - first names reused across entries (real people can give more than one),
 *   but with varied suffixes so identical names do not look like duplicates,
 * - positions optional and varied, with service-specific roles where possible,
 * - ratings spread across 1-5 with most entries in the 4-5 range,
 * - quoted with distinct wording even for the same service,
 * - ordered so a few strong quotes appear early.
 */
export const bulkSeedTestimonials = panelMutation({
  args: { count: v.number() },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("testimonials").collect();
    if (existing.length > 0) {
      throw new Error(
        "Testimonials already exist; seed only runs on a fresh database.",
      );
    }

    const count = Math.min(Math.max(args.count, 1), 300);
    const now = Date.now();
    const items: Array<{
      quote: string;
      clientName: string;
      position: string | undefined;
      rating: number;
      service: string | undefined;
      status: "draft" | "published" | "archived";
      displayOrder: number;
    }> = [];

    // Build a good spread: most entries published, a few draft, one or two archived.
    const statuses: Array<"published" | "draft" | "archived"> =
      Array.from({ length: count }, (_, i) => {
        if (i < count - 2) return "published";
        if (i === count - 2) return "draft";
        return "archived";
      });

    const shuffledNames = [...FIRST_NAMES];
    for (let i = shuffledNames.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledNames[i], shuffledNames[j]] = [shuffledNames[j], shuffledNames[i]];
    }
    const randomRoles = [
      ...POSITIONLESS_ROLES,
      ...Object.values(ROLES_FOR_SERVICE).flat(),
    ];

    for (let i = 0; i < count; i++) {
      const service = SERVICES[i % SERVICES.length];
      const baseName = shuffledNames[i % shuffledNames.length];

      const suffixStyle = (i * 7 + 3) % 6;
      const name =
        suffixStyle === 0
          ? baseName
          : suffixStyle === 1
            ? `${baseName} Jr`
            : suffixStyle === 2
              ? `${baseName} ${Math.floor(i / shuffledNames.length) + 1}`
              : suffixStyle === 3
                ? `${baseName} ${Math.floor(i / shuffledNames.length) + 2}`
                : suffixStyle === 4
                  ? `${String.fromCharCode(97 + (i % 26))}${baseName}`
                  : `${baseName} the ${i % 9 + 1}${["st", "nd", "rd", "th", "th", "th", "th", "th", "th"][i % 9]}`;

      const hasPos = Math.random() < 0.68;
      const roles = ROLES_FOR_SERVICE[service];
      const roleCount = roles?.length ?? 0;
      const position =
        hasPos && roleCount > 0
          ? roles[Math.floor(Math.random() * roleCount)]
          : hasPos
            ? randomRoles[Math.floor(Math.random() * randomRoles.length)]
            : undefined;

      const rating = ratingFor(i);
      const published = statuses[i] === "published";

      items.push({
        quote: makeQuote(service, i, rating),
        clientName: name,
        position,
        rating,
        service: published ? service : undefined,
        status: published ? "published" : statuses[i],
        displayOrder: i + 1,
      });
    }

    // Rewrite displayOrder so published items get contiguous ordering and drafts
    // appear after them, keeping the admin list tidy.
    let order = 1;
    for (const item of items) {
      if (item.status === "published") {
        item.displayOrder = order++;
      }
    }
    let draftOrder = order;
    for (const item of items) {
      if (item.status !== "published") {
        item.displayOrder = draftOrder++;
      }
    }

    for (const item of items) {
      await ctx.db.insert("testimonials", {
        ...item,
        createdAt: now,
      });
    }

    return {
      inserted: items.length,
      totalBefore: existing.length,
      published: items.filter((i) => i.status === "published").length,
      draft: items.filter((i) => i.status === "draft").length,
      archived: items.filter((i) => i.status === "archived").length,
      averageRating:
        items.reduce((a, b) => a + b.rating, 0) / items.length,
    };
  },
});

/**
 * Delete every testimonial row. One-shot admin cleanup so the bulk seed can
 * run on a fresh table.
 */
export const clearTestimonials = panelMutation({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("testimonials").collect();
    for (const row of rows) {
      await ctx.db.delete(row._id);
    }
    return { deleted: rows.length };
  },
});

/**
 * Rating aggregates across published testimonials.
 * Used by the public sections so the header can render a live
 * "4.5 out of 5 · 100+ ratings" summary.
 */
interface TestimonialRow {
  quote: string;
  clientName: string;
  position?: string;
  rating: number;
  service?: string;
  status: string;
  displayOrder: number;
}

export const testimonialStats = panelQuery({
  args: {},
  handler: async (ctx) => {
    const rows = (await ctx.db.query("testimonials").collect()) as TestimonialRow[];
    const published = rows.filter((r) => r.status === "published");
    const count = published.length;
    if (count === 0) {
      return { count: 0, averageRating: 0, fiveStarCount: 0, fourStarCount: 0, threeStarCount: 0, twoStarCount: 0, oneStarCount: 0 };
    }
    const total = published.reduce((acc, row) => acc + (row.rating ?? 5), 0);
    const fiveStarCount = published.filter((row) => row.rating === 5).length;
    const fourStarCount = published.filter((row) => row.rating === 4).length;
    const threeStarCount = published.filter((row) => row.rating === 3).length;
    const twoStarCount = published.filter((row) => row.rating === 2).length;
    const oneStarCount = published.filter((row) => row.rating === 1).length;
    return {
      count,
      averageRating: total / count,
      fiveStarCount,
      fourStarCount,
      threeStarCount,
      twoStarCount,
      oneStarCount,
    };
  },
});
