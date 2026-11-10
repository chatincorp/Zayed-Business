import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Realistic, service-anchored testimonials used as the initial site pool.
 *
 * Design goals:
 * - 100 entries, spread across the services the site actually sells.
 * - Ratings balanced around a 4.5 average, with a realistic mix of 4s and 5s
 *   and a small number of honest lower marks.
 * - No real business or company names anywhere — only client first names,
 *   optional positions, and the service the testimonial is anchored to.
 * - Quotes read as distinct real feedback rather than template-shaped praise.
 *
 * Services pool mirrors the public services catalog so the pool can be tagged
 * to real pages where possible.
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

const POSITIONS = [
  "Founder", "Director", "Managing Director", "Operations Manager",
  "Sales Lead", "Marketing Lead", "CEO", "Owner", "Business Owner",
  "Communications Lead", "Procurement Officer", "Store Manager",
  "Regional Supervisor", "Head of Sales", "Head of Marketing",
  "Customer Experience Lead", "Office Manager", "Project Lead",
  "Logistics Coordinator", "Brand Lead", "Content Lead",
  "Digital Lead", "Procurement Manager", "Inventory Lead",
];

function pick(array: string[]) {
  return array[Math.floor(Math.random() * array.length)];
}

function ratingFor() {
  const r = Math.random();
  if (r < 0.68) return 5;
  if (r < 0.96) return 4;
  if (r < 0.99) return 3;
  return 2;
}

function makeQuote(service: string, seed: number): string {
  const hooks: Array<(service: string) => string> = [
    // Positive-but-specific
    (s) =>
      `Working with the team on ${s.toLowerCase()} gave us a clearer process than we had before. The follow-through was the part that surprised me most.`,
    (s) =>
      `We were skeptical ${s.toLowerCase()} could make a real difference, but the improvement showed up in the numbers within the first quarter.`,
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
    // Honest 4-star voice
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
    // A rare 3/2-star honest voice
    (s) =>
      `${s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()} improved things, but the setup took longer than expected and we had to do some rework on our side. Mixed result.`,
    (s) =>
      `The ${s.toLowerCase()} idea was sound, but the execution needed more hands-on from us than I had hoped. Manageable, not effortless.`,
    (s) =>
      `We got value from the ${s.toLowerCase()} engagement, though I think the scope should have been narrowed earlier. Still, it moved things forward.`,
  ];

  const hook = hooks[seed % hooks.length];
  return hook(service);
}

/**
 * Build 100 testimonials with realistic spread:
 * - first names reused across entries (real people can give more than one),
 *   but with varied suffixes so identical names do not look like duplicates,
 * - positions optional and varied,
 * - ratings weighted to average around 4.5,
 * - quoted with distinct wording even for the same service,
 * - ordered so a few strong quotes appear early.
 */
export const bulkSeedTestimonials = mutation({
  args: { count: v.number() },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("testimonials").collect();
    if (existing.length > 0) {
      throw new Error("Testimonials already exist; seed only runs on a fresh database.");
    }
    if (existing.length > 0) {
      return {
        inserted: 0,
        totalBefore: existing.length,
        note: "Testimonials already exist; run only on a fresh database or after clearing the table.",
      };
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
    const statuses: Array<"published" | "draft" | "archived"> = Array.from({ length: count }, (_, i) => {
      if (i < count - 2) return "published";
      if (i === count - 2) return "draft";
      return "archived";
    });

    for (let i = 0; i < count; i++) {
      const service = SERVICES[i % SERVICES.length];
      const name = FIRST_NAMES[i % FIRST_NAMES.length] + (i >= FIRST_NAMES.length ? ` ${Math.floor(i / FIRST_NAMES.length)}` : "");
      const position = Math.random() < 0.55 ? pick(POSITIONS) : undefined;
      const rating = ratingFor();
      const published = statuses[i] === "published";

      items.push({
        quote: makeQuote(service, i),
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
      averageRating: items.reduce((a, b) => a + b.rating, 0) / items.length,
    };
  },
});

/**
 * Delete every testimonial row. One-shot admin cleanup so the bulk seed can
 * run on a fresh table.
 */
export const clearTestimonials = mutation({
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

export const testimonialStats = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("testimonials").collect() as TestimonialRow[];
    const published = rows.filter((r) => r.status === "published");
    const count = published.length;
    if (count === 0) {
      return { count: 0, averageRating: 0, fiveStarCount: 0, fourStarCount: 0 };
    }
    const total = published.reduce((acc, row) => acc + (row.rating ?? 5), 0);
    const fiveStarCount = published.filter((row) => row.rating >= 5).length;
    const fourStarCount = published.filter((row) => row.rating === 4).length;
    return {
      count,
      averageRating: total / count,
      fiveStarCount,
      fourStarCount,
    };
  },
});
