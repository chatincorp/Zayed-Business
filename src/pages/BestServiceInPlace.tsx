import { Link, Navigate, useParams } from "react-router";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FloatingWidgets from "@/components/FloatingWidgets";
import { useSEO } from "@/lib/seo";
import {
  bestPath,
  deliveryNote,
  findPlace,
  findService,
  isIndexablePair,
  localAngle,
  nationalProfile,
  LOCAL_PLACES,
  LOCAL_SERVICES,
} from "@/data/localSeo";
import { ArrowLeft, ArrowRight, Check, MapPin, Calendar, MessageSquare } from "lucide-react";

/**
 * Programmatic local landing page: /best/<service>/<place>
 *
 * Answers the "best <service> in <city|town|country|region|continent>" query
 * with page-specific copy, an areaServed-aware Service schema, an FAQPage and
 * internal links to adjacent service/place combinations.
 */
export default function BestServiceInPlace() {
  const { serviceSlug, placeSlug } = useParams<{ serviceSlug: string; placeSlug: string }>();
  const service = findService(serviceSlug);
  const place = findPlace(placeSlug);

  // A local page exists only for combinations the matrix actually covers; the
  // rest fall through to the coverage index instead of rendering a thin page.
  const resolved =
    service !== undefined && place !== undefined && isIndexablePair(service, place);
  const indexable = resolved;
  const path = `/best/${serviceSlug ?? ""}/${placeSlug ?? ""}`;
  const title = resolved
    ? `Best ${service.name} in ${place.name} (2026)`
    : "Local service coverage";
  const pricing = resolved
    ? `${service.pricing.charAt(0).toUpperCase()}${service.pricing.slice(1)}`
    : "";
  const description = resolved
    ? `${service.name} ${place.phrase} from Yasir Zayed: ${service.summary}. ${pricing}.`
    : "Local service coverage from Yasir Zayed.";

  useSEO({
    title,
    description,
    path,
    noindex: !indexable,
    keywords: resolved
      ? [
          `best ${service.name} ${place.phrase}`,
          `${service.name} ${place.name}`,
          `${service.name} ${place.phrase}`,
          `${service.slug.replace(/-/g, " ")} ${place.name}`,
          `Yasir Zayed ${place.name}`,
        ].join(", ")
      : undefined,
    jsonLd: resolved
      ? [
          {
            "@context": "https://schema.org",
            "@type": "Service",
            name: `${service.name} ${place.phrase}`,
            serviceType: service.name,
            description: `${service.summary}. ${service.detail}`,
            url: `https://yasirzayed.com${path}`,
            provider: {
              "@type": "Organization",
              "@id": "https://yasirzayed.com/#organization",
              name: "Yasir Zayed",
              url: "https://yasirzayed.com/",
              telephone: "+254-114-712-989",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Nairobi",
                addressRegion: "Nairobi County",
                addressCountry: "KE",
              },
            },
            areaServed: {
              "@type":
                place.kind === "country"
                  ? "Country"
                  : place.kind === "city" || place.kind === "town"
                    ? "City"
                    : "Place",
              name: place.name,
            },
            offers: {
              "@type": "Offer",
              priceCurrency: "USD",
              description: `Pricing: ${service.pricing}`,
              availability: "https://schema.org/InStock",
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: `How much does ${service.name} cost ${place.phrase}?`,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: `Pricing for ${service.name} ${place.phrase} is ${service.pricing}. After a discovery call we quote against your actual scope, sites and volumes, so there are no surprise line items.`,
                },
              },
              {
                "@type": "Question",
                name: `Do you deliver ${service.name} ${place.phrase}?`,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: `Yes. Yasir Zayed delivers ${service.name} ${place.phrase}, covering ${place.areas.join(", ")}. ${place.context}`,
                },
              },
              {
                "@type": "Question",
                name: `How do we start ${service.name} ${place.phrase}?`,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: `Open an account or book a consultation through the contact page. We confirm scope, timeline and pricing in writing before work starts, usually within two working days.`,
                },
              },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://yasirzayed.com/" },
              { "@type": "ListItem", position: 2, name: "Best by location", item: "https://yasirzayed.com/best" },
              {
                "@type": "ListItem",
                position: 3,
                name: `${service.name} ${place.phrase}`,
                item: `https://yasirzayed.com${path}`,
              },
            ],
          },
        ]
      : undefined,
  });

  // The twelve national "/best/<service>/kenya" pages were near-duplicates of
  // each other and of the service pages. They are consolidated: old links land
  // on the service page, which already carries the national coverage copy.
  if (service && placeSlug === "kenya") {
    return <Navigate to={`/services/${service.slug}`} replace />;
  }

  if (!service || !place || !resolved) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="mx-auto max-w-2xl px-4 pt-40 pb-24 text-center">
          <h1 className="font-display text-2xl font-bold text-foreground mb-3">
            That location page doesn&apos;t exist
          </h1>
          <p className="text-muted-foreground text-sm mb-6">
            That service and location combination isn&apos;t one we publish. Pick from the
            coverage index, or see {" "}
            <Link to="/best" className="text-electric hover:underline">
              every local page we actually maintain
            </Link>
            .
          </p>
          <Link
            to="/best"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-electric text-white rounded-lg text-sm font-semibold"
          >
            View all locations
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const otherPlaces = LOCAL_PLACES.filter((item) => item.slug !== place.slug).slice(0, 5);
  const otherServices = LOCAL_SERVICES.filter((item) => item.slug !== service.slug).slice(0, 6);
  const national = place.kind === "country" ? nationalProfile(service) : undefined;
  const angle = national?.angle ?? localAngle(service, place);
  const deliveryCopy = national?.model ?? deliveryNote(place);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="relative pt-32 pb-16 sm:pt-36 sm:pb-20 bg-navy-dark overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern-dark" />
        <div className="absolute top-1/4 right-1/3 w-[400px] h-[400px] bg-electric/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-2 text-sm text-white/40 mb-8">
            <Link to="/" className="hover:text-white/70 transition-colors">Home</Link>
            <span>/</span>
            <Link to="/best" className="hover:text-white/70 transition-colors">Best by location</Link>
            <span>/</span>
            <span className="text-white/70">{place.name}</span>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-electric/10 text-electric text-xs font-semibold uppercase tracking-wider mb-4"
          >
            <MapPin className="w-3.5 h-3.5" />
            {service.name} · {place.name}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-4 max-w-4xl"
          >
            Best {service.name} {place.phrase}
          </motion.h1>

          <p className="text-lg sm:text-xl text-white/50 leading-relaxed max-w-3xl mb-8">
            {service.summary.charAt(0).toUpperCase() + service.summary.slice(1)} — delivered{" "}
            {place.phrase} by a team that works to one process, one reporting standard and one point
            of accountability.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-electric text-white font-semibold text-sm rounded-lg hover:bg-electric-dark transition-all shadow-lg shadow-electric/20"
            >
              <Calendar className="w-4 h-4" />
              Book a consultation
            </Link>
            <Link
              to={`/services/${service.slug}`}
              className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 text-white/80 font-medium text-sm rounded-lg hover:bg-white/5 hover:border-white/30 transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              Full service details
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr,360px] gap-16">
            <div>
              <div className="mb-14">
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  {service.name} for businesses {place.phrase}
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">{place.context}</p>
                {angle && (
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    <span className="text-foreground font-medium">
                      {national ? "The national picture. " : "The local picture. "}
                    </span>
                    {angle}
                  </p>
                )}
                <p className="text-muted-foreground leading-relaxed mb-4">{service.detail}</p>
                <p className="text-muted-foreground leading-relaxed">
                  Engagements {place.phrase} are priced {service.pricing}. We confirm scope,
                  timeline and price in writing before work starts.
                </p>
              </div>

              <div className="mb-14">
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  How we work {place.phrase}
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {deliveryCopy}
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Every engagement starts with an assessment of what exists today — sites,
                  outlets, systems and current spend — so the plan is built on your actual
                  operation rather than a template.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  What moves the price is specific: the number of sites or outlets, how far
                  apart they are, the volumes involved, how much of the work we run versus
                  support, and how quickly you need it live. Those five answers turn a range
                  into a fixed quote.
                </p>
              </div>

              <div className="mb-14">
                <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                  Why {place.name} clients choose Yasir Zayed
                </h2>
                <div className="space-y-3">
                  {service.proofPoints.map((point) => (
                    <div key={point} className="flex items-start gap-3 p-4 rounded-xl bg-muted/50">
                      <div className="w-6 h-6 rounded-full bg-electric/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5 text-electric" />
                      </div>
                      <span className="text-sm text-foreground font-medium">{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-14">
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  What the engagement includes
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {service.outcomes.map((outcome) => (
                    <div
                      key={outcome}
                      className="flex items-center gap-3 p-3 rounded-lg border border-border/50"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-electric shrink-0" />
                      <span className="text-sm text-foreground">{outcome}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-14">
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  {national ? "County coverage" : `Areas covered ${place.phrase}`}
                </h2>
                {national ? (
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                        Core delivery counties
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {national.primary.map((area) => (
                          <span key={area} className="px-3 py-1.5 rounded-full bg-electric/10 text-foreground text-sm font-medium">
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                        Covered from those clusters
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {national.secondary.map((area) => (
                          <span key={area} className="px-3 py-1.5 rounded-full bg-muted text-muted-foreground text-sm">
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Outside these counties the same process runs with a travel plan agreed up
                      front, so the scope and the price are settled before mobilisation rather
                      than after the first invoice.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {place.areas.map((area) => (
                      <span
                        key={area}
                        className="px-3 py-1.5 rounded-full bg-muted text-foreground text-sm"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                  {service.name} {place.phrase} — common questions
                </h2>
                <div className="space-y-4">
                  {[
                    {
                      q: `How much does ${service.name} cost ${place.phrase}?`,
                      a: `Pricing is ${service.pricing}. After a discovery call we quote against your actual scope, sites and volumes, so there are no surprise line items.`,
                    },
                    {
                      q: `Do you deliver ${service.name} ${place.phrase}?`,
                      a: national
                        ? `Yes — core delivery is in ${national.primary.join(", ")}, with ${national.secondary.join(", ")} covered from those clusters. ${national.model}`
                        : `Yes — we cover ${place.areas.join(", ")} and the surrounding area. ${place.context}`,
                    },
                    {
                      q: `How do we start ${service.name} ${place.phrase}?`,
                      a: "Open an account or book a consultation through the contact page. We confirm scope, timeline and pricing in writing, usually within two working days.",
                    },
                  ].map((faq) => (
                    <div key={faq.q} className="p-5 rounded-xl bg-muted/50 border border-border/50">
                      <h3 className="font-semibold text-foreground text-sm mb-2">{faq.q}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:sticky lg:top-24 h-fit space-y-6">
              <div className="p-6 rounded-2xl bg-navy text-white">
                <h2 className="font-display text-lg font-bold mb-2">
                  Start {service.name} {place.phrase}
                </h2>
                <p className="text-white/50 text-sm mb-5">
                  Tell us the sites, volumes and timeline. We come back with a scoped plan and a
                  fixed price.
                </p>
                <Link
                  to="/contact"
                  className="block w-full text-center px-5 py-3 bg-electric text-white font-semibold text-sm rounded-lg hover:bg-electric-dark transition-all"
                >
                  Book a consultation
                </Link>
              </div>

              <div className="p-6 rounded-2xl bg-card border border-border">
                <h2 className="font-semibold text-foreground text-sm mb-4">
                  {service.name} in other locations
                </h2>
                <div className="space-y-1">
                  {otherPlaces.map((other) => (
                    <Link
                      key={other.slug}
                      to={bestPath(service.slug, other.slug)}
                      className="flex items-center justify-between p-2.5 rounded-lg hover:bg-muted text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <span>
                        {service.name} in {other.name}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-card border border-border">
                <h2 className="font-semibold text-foreground text-sm mb-4">
                  Other services in {place.name}
                </h2>
                <div className="space-y-1">
                  {otherServices.map((other) => (
                    <Link
                      key={other.slug}
                      to={bestPath(other.slug, place.slug)}
                      className="block p-2.5 rounded-lg hover:bg-muted text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {other.name} in {place.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <Link
              to="/best"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              All services by location
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <FloatingWidgets />
    </div>
  );
}
