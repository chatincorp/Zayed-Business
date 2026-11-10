/**
 * TestimonialsSection — client quotes managed in the admin Testimonials panel.
 * Falls back to bundled quotes when no backend is attached or none are published.
 */

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Quote } from "lucide-react";
import { useSiteTestimonials } from "@/lib/siteContent";

const FALLBACK = [
  {
    quote: "Yasir Zayed restructured our sales process and our close rate nearly doubled in one quarter.",
    clientName: "Grace Mwangi",
    company: "Rift Valley Distributors",
    position: "Commercial Director",
  },
  {
    quote: "The security audit and camera deployment were handled end to end — professional from survey to handover.",
    clientName: "Peter Otieno",
    company: "Nairobi Logistics Hub",
    position: "Operations Manager",
  },
  {
    quote: "Their AI chatbot now handles most of our inbound enquiries, and the team finally has time to sell.",
    clientName: "Amina Hassan",
    company: "Coastline Retail",
    position: "Founder",
  },
];

export default function TestimonialsSection() {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  const live = useSiteTestimonials();
  const testimonials = live && live.length > 0 ? live : FALLBACK;

  return (
    <section id="testimonials" className="relative py-24 sm:py-32 bg-muted/30 overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" ref={ref}>
        <div className="text-center mb-14">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-electric text-xs font-semibold uppercase tracking-[0.25em] mb-4"
          >
            Client Voices
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight"
          >
            Trusted by Growing Businesses
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.slice(0, 3).map((t, i) => (
            <motion.figure
              key={`${t.clientName}-${i}`}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.08 }}
              className="rounded-2xl bg-card border border-border/60 p-7 flex flex-col hover:shadow-lg hover:shadow-black/5 transition-all"
            >
              <Quote className="w-7 h-7 text-electric/40 mb-4" />
              <blockquote className="text-sm text-foreground leading-relaxed flex-1">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 pt-5 border-t border-border/60">
                <p className="text-sm font-semibold text-foreground">{t.clientName}</p>
                <p className="text-xs text-muted-foreground">
                  {[t.position, t.company].filter(Boolean).join(" · ")}
                </p>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
