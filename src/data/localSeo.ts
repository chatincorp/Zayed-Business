/**
 * Local-SEO landing page matrix.
 *
 * Every entry renders a real page at /best/<service>/<place> with its own
 * title, canonical, H1 and structured data, so "best <service> in <place>"
 * searches land on a page that actually answers them.
 *
 * The copy itself lives in src/data/localSeoData.json so build scripts can read
 * it with plain JSON on any Node version (importing a .ts file only works on
 * Node 22.6+ with type stripping). Edit the JSON, or the .ts source it was
 * exported from, then run `npm run sitemap`.
 */

import raw from "./localSeoData.json";

export interface LocalService {
  /** Slug used by /services/<slug> and /best/<slug>/<place>. */
  slug: string;
  /** Display name, e.g. "CCTV & Surveillance Systems". */
  name: string;
  /** One-line summary used in introductions and meta descriptions. */
  summary: string;
  /** Longer paragraph explaining the offer. */
  detail: string;
  /** What buyers get. */
  outcomes: string[];
  /** Starting price or pricing model. */
  pricing: string;
  /** Headline proof points used on every page for this service. */
  proofPoints: string[];
  /** "on-site" work cannot be promised worldwide; "remote" work can. */
  delivery: "on-site" | "remote";
  /** Places this service actually has a local page for. */
  places: string[];
}

export interface LocalPlace {
  slug: string;
  name: string;
  /** City, town, county, country, region or continent. */
  kind: "city" | "town" | "county" | "country" | "region" | "continent";
  /** Grammatically correct phrase, e.g. "in Nairobi" or "across Kenya". */
  phrase: string;
  /** Unique local-market sentence(s) for this place. */
  context: string;
  /** Neighbourhoods / coverage areas named on the page. */
  areas: string[];
}

export const LOCAL_SERVICES = raw.services as unknown as LocalService[];
export const LOCAL_PLACES = raw.places as unknown as LocalPlace[];

/** Hand-written local angle per service/place pair (city pages only). */
const LOCAL_ANGLES = raw.localAngles as unknown as Record<string, string>;

export interface NationalProfile {
  /** What is actually different about selling this service across the country. */
  angle: string;
  /** How the work is delivered nationally. */
  model: string;
  /** Counties that carry most of the volume. */
  primary: string[];
  /** Counties reached from the primary clusters. */
  secondary: string[];
}

/**
 * Per-service national profiles. Without these the 12 country pages were the
 * same page twelve times; each profile now supplies its own national angle,
 * delivery model and county coverage.
 */
const KENYA_NATIONAL = raw.kenyaNational as unknown as Record<string, NationalProfile>;

export function nationalProfile(service: LocalService): NationalProfile | undefined {
  return KENYA_NATIONAL[service.slug];
}

export function localAngle(service: LocalService, place: LocalPlace): string | undefined {
  return LOCAL_ANGLES[`${service.slug}/${place.slug}`];
}

export function bestPath(serviceSlug: string, placeSlug: string): string {
  return `/best/${serviceSlug}/${placeSlug}`;
}

export function findService(slug?: string): LocalService | undefined {
  return LOCAL_SERVICES.find((service) => service.slug === slug);
}

export function findPlace(slug?: string): LocalPlace | undefined {
  return LOCAL_PLACES.find((place) => place.slug === slug);
}

/**
 * Thin-content defence.
 *
 * A page exists only for a place where the service actually has field
 * coverage: the five cities, with each city page carrying its own local angle.
 * National pages were consolidated into the service pages instead of keeping
 * twelve near-identical "/best/<service>/kenya" duplicates.
 */
export function isIndexablePair(service: LocalService, place: LocalPlace): boolean {
  return service.places.includes(place.slug);
}

/** Every indexable service × place pair, in sitemap order. */
export function indexablePairs(): Array<{ service: LocalService; place: LocalPlace }> {
  return LOCAL_SERVICES.flatMap((service) =>
    LOCAL_PLACES.filter((place) => isIndexablePair(service, place)).map((place) => ({
      service,
      place,
    })),
  );
}

/**
 * How engagements actually run in this kind of place. Combined with the
 * service copy and the place context, this keeps every page substantive
 * instead of a template with the city swapped out.
 */
export function deliveryNote(place: LocalPlace): string {
  switch (place.kind) {
    case "city":
      return `Work in ${place.name} runs from a local base: site visits or outlet rides inside the city, a named contact on WhatsApp and phone, and reporting issued at the end of each week rather than the end of the quarter.`;
    case "town":
      return `${place.name} engagements are planned around travel: we batch site visits, agree the visit calendar up front and keep day-to-day coordination on calls and shared documents so travel time never becomes your delay.`;
    case "county":
      return `County-wide work in ${place.name} is delivered in waves, with a coverage map agreed before the first visit so no ward is assumed covered when it is not.`;
    case "country":
      return `National programmes across ${place.name} use one process, one reporting pack and one accountable lead, with regional coordinators handling day-to-day execution on the ground.`;
    case "region":
      return `Regional work across ${place.name} is scoped country by country: local requirements, local pricing and local logistics are confirmed before a single regional commitment is made.`;
    case "continent":
      return `Multi-country work across ${place.name} starts with a short feasibility pass — regulation, logistics, payment norms and local partners — before we commit to a delivery plan.`;
    default:
      return `We confirm scope, sites, timelines and reporting lines in writing before work starts.`;
  }
}
