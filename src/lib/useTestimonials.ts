import { useSiteTestimonials } from "./siteContent";
import { isBackendConfigured } from "./backend";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

export interface TestimonialWithRating {
  _id?: string;
  quote: string;
  clientName: string;
  position?: string;
  rating: number;
  service?: string;
  status: string;
  displayOrder: number;
}

export interface TestimonialStats {
  count: number;
  averageRating: number;
  fiveStarCount: number;
  fourStarCount: number;
  threeStarCount: number;
  twoStarCount: number;
  oneStarCount: number;
}

/** Published testimonials, enriched with rating defaults when the field is absent. */
export function useTestimonials(): TestimonialWithRating[] | undefined {
  const data = useSiteTestimonials();
  if (!data) return undefined;
  return data.map((t) => ({
    _id: (t as TestimonialWithRating)._id,
    quote: t.quote,
    clientName: t.clientName,
    position: (t as TestimonialWithRating).position,
    rating: (t as TestimonialWithRating).rating ?? 5,
    service: (t as TestimonialWithRating).service,
    status: t.status,
    displayOrder: t.displayOrder,
  }));
}

/** Live rating aggregates for published testimonials. Returns undefined until
 * the Convex client is mounted and the query resolves, and also when the site
 * is running as a static bundle with no backend attached (calling useQuery
 * without a ConvexProvider would throw). */
export function useTestimonialStats(): TestimonialStats | undefined {
  if (!isBackendConfigured) return undefined;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useQuery(api.testimonials.testimonialStats) as TestimonialStats | undefined;
}
