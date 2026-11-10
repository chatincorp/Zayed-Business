/**
 * SectionGate — renders a public route only while its section flag is enabled
 * and (when a matching page record exists) that page is published.
 *
 * Admins control this from Website → Site Sections and Website → Pages.
 */

import type { ReactNode } from "react";
import { Link } from "react-router";
import { Clock, ArrowLeft, Phone } from "lucide-react";
import Navigation from "./Navigation";
import Footer from "./Footer";
import { useSectionFlags, useSitePages } from "@/lib/siteContent";

function ComingSoon({ title }: { title: string }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <main className="flex-1 flex items-center justify-center px-4 py-32">
        <div className="max-w-lg text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-electric/10 flex items-center justify-center mb-6">
            <Clock className="w-8 h-8 text-electric" />
          </div>
          <p className="text-electric text-xs font-semibold uppercase tracking-[0.25em] mb-3">
            Coming Soon
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {title} is being prepared
          </h1>
          <p className="text-muted-foreground mb-8">
            This section is temporarily unavailable while we finish publishing it.
            Everything else on the site is still live — or talk to our team directly.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-electric text-white text-sm font-semibold rounded-lg hover:bg-electric-dark transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to home
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-border text-foreground text-sm font-semibold rounded-lg hover:bg-muted transition-colors"
            >
              <Phone className="w-4 h-4" /> Contact us
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export function SectionGate({
  title,
  section,
  slug,
  children,
}: {
  title: string;
  section?: string;
  slug?: string;
  children: ReactNode;
}) {
  const flags = useSectionFlags();
  const pages = useSitePages();

  const sectionLive = section ? flags[section] !== false : true;
  const matchedPage = slug ? pages?.find((p) => p.slug === slug) : undefined;
  const pageLive = matchedPage ? matchedPage.status === "published" : true;

  if (!sectionLive || !pageLive) return <ComingSoon title={title} />;
  return <>{children}</>;
}

export default SectionGate;
