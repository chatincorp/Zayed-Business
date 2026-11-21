import { Link } from "react-router";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FloatingWidgets from "@/components/FloatingWidgets";
import { useSEO } from "@/lib/seo";
import { bestPath, isIndexablePair, LOCAL_PLACES, LOCAL_SERVICES } from "@/data/localSeo";
import { MapPin } from "lucide-react";

/**
 * Index for the local landing pages: /best
 * Lists the curated matrix by location so every local page is one click from
 * here (and therefore crawlable from the sitemap).
 */
export default function BestIndex() {
  useSEO({
    title: "Best Business, FMCG, Security & Technology Services by Location",
    description:
      "Local pages for FMCG order booking, field sales, supplier sourcing and CCTV in Nairobi, Mombasa, Kisumu, Nakuru and Eldoret — plus every service delivered across Kenya.",
    path: "/best",
    keywords:
      "best business services Nairobi, best FMCG services Kenya, best CCTV installation Nairobi, best AI integration East Africa, best web design Mombasa, Yasir Zayed locations",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Services by location",
        url: "https://yasirzayed.com/best",
        about: LOCAL_SERVICES.map((service) => service.name),
          mainEntity: {
          "@type": "ItemList",
          numberOfItems: LOCAL_SERVICES.flatMap((service) =>
            LOCAL_PLACES.filter((place) => isIndexablePair(service, place)),
          ).length,
          itemListElement: LOCAL_PLACES.map((place, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: `Services in ${place.name}`,
            url: `https://yasirzayed.com/best/${LOCAL_SERVICES[0].slug}/${place.slug}`,
          })),
        },
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://yasirzayed.com/" },
          { "@type": "ListItem", position: 2, name: "Best by location", item: "https://yasirzayed.com/best" },
        ],
      },
    ],
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="relative pt-32 pb-14 bg-navy-dark overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern-dark" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-electric/10 text-electric text-xs font-semibold uppercase tracking-wider mb-4">
            <MapPin className="w-3.5 h-3.5" />
            Coverage
          </p>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
            Best services by location
          </h1>
          <p className="text-lg text-white/50 max-w-3xl">
            {LOCAL_SERVICES.flatMap((service) =>
              LOCAL_PLACES.filter((place) => isIndexablePair(service, place)),
            ).length}{" "}
            local pages across the five cities where field work actually happens. Pick one to see
            what we deliver there, how it is priced and how to start. National coverage for every
            other service lives on its{" "}
            <Link to="/services" className="text-amber-200 hover:underline">
              service page
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-14">
          {LOCAL_PLACES.filter((place) =>
            LOCAL_SERVICES.some((service) => isIndexablePair(service, place)),
          ).map((place) => (
            <div key={place.slug}>
              <div className="flex flex-wrap items-baseline gap-3 mb-4">
                <h2 className="font-display text-xl font-bold text-foreground">
                  Services in {place.name}
                </h2>
                <span className="text-xs uppercase tracking-wider text-muted-foreground">
                  {place.kind}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-3 max-w-3xl">{place.context}</p>
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-5">
                {LOCAL_SERVICES.filter((service) => isIndexablePair(service, place)).length}{" "}
                {LOCAL_SERVICES.filter((service) => isIndexablePair(service, place)).length === 1
                  ? "service"
                  : "services"}{" "}
                with a dedicated page
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {LOCAL_SERVICES.filter((service) => isIndexablePair(service, place)).map((service) => (
                  <Link
                    key={service.slug}
                    to={bestPath(service.slug, place.slug)}
                    className="p-3 rounded-lg border border-border bg-card text-sm text-foreground hover:border-electric/40 hover:bg-muted/40 transition-colors"
                  >
                    {service.name} in {place.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
      <FloatingWidgets />
    </div>
  );
}
