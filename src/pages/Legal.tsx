import { Link, useLocation } from "react-router";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FloatingWidgets from "@/components/FloatingWidgets";
import { useSEO } from "@/lib/seo";
import { ArrowLeft, Cookie, ScrollText, ShieldCheck } from "lucide-react";

const LAST_UPDATED = "9 November 2026";

interface LegalDoc {
  title: string;
  eyebrow: string;
  description: string;
  icon: typeof ShieldCheck;
  sections: { heading: string; body: string[] }[];
}

const CONTACT_LINES = [
  "Yasir Zayed",
  "Nairobi, Kenya",
  "Email: info@yasirzayed.com",
  "Phone: +254 114 712 989 · +254 717 227 012",
];

const documents: Record<string, LegalDoc> = {
  "/privacy": {
    title: "Privacy Policy",
    eyebrow: "Legal",
    description:
      "How Yasir Zayed collects, uses, stores and protects personal information when you use yasirzayed.com or engage our services.",
    icon: ShieldCheck,
    sections: [
      {
        heading: "1. Who we are",
        body: [
          "Yasir Zayed is a business, FMCG, technology and security solutions company based in Nairobi, Kenya. We are the data controller for personal information collected through this website and in the course of delivering our services.",
          "This policy explains what we collect, why we collect it, how it is protected and the choices available to you. It applies to our website, enquiries, proposals, projects and client communications.",
        ],
      },
      {
        heading: "2. Information we collect",
        body: [
          "Information you give us: your name, email address, phone number, company and position, the service you are interested in, project details and any message or document you send us through our contact forms, email, phone or WhatsApp.",
          "Information created during an engagement: proposals, contracts, invoices, project notes, correspondence and deliverable files.",
          "Technical information: pages visited, approximate location derived from your IP address, browser and device type, and referral source. We use this in aggregate to understand how the site is used and to keep it secure.",
          "We do not knowingly collect sensitive personal data (such as health or biometric data) through this website. Please do not send sensitive information through the contact forms.",
        ],
      },
      {
        heading: "3. How we use your information",
        body: [
          "To respond to enquiries, prepare quotations, schedule consultations and deliver the services you request.",
          "To manage projects, invoices, payments and support requests, and to keep accurate business records.",
          "To improve our website, services and marketing, and to send updates you have asked to receive. You can opt out of marketing messages at any time.",
          "To meet legal, tax, accounting and regulatory obligations, and to detect or prevent fraud and misuse.",
        ],
      },
      {
        heading: "4. Lawful bases",
        body: [
          "We process personal data on the bases recognised by the Kenya Data Protection Act, 2019: your consent, performance of a contract with you, compliance with a legal obligation, and our legitimate interests in running and improving our business — balanced against your rights.",
        ],
      },
      {
        heading: "5. Sharing your information",
        body: [
          "We do not sell your personal information. We share it only where necessary with: service providers who host our website, deliver email, process payments (such as Paystack) or support our operations; professional advisers such as accountants and lawyers; and authorities where required by law.",
          "Where a provider processes data on our behalf, we require appropriate confidentiality and data-protection obligations. Some providers may process data outside Kenya; where that happens we take reasonable steps to ensure an appropriate level of protection.",
        ],
      },
      {
        heading: "6. Retention",
        body: [
          "We keep enquiry records for as long as needed to respond and for a reasonable period afterwards. Project, contract and financial records are retained for the period required by Kenyan tax and company law. When information is no longer needed, we delete or anonymise it.",
        ],
      },
      {
        heading: "7. Security",
        body: [
          "We use appropriate technical and organisational measures to protect personal information, including access controls, secure connections and restricted internal access. No method of transmission or storage is completely secure, so we cannot guarantee absolute security, but we work to protect your data and to respond promptly to any incident.",
        ],
      },
      {
        heading: "8. Your rights",
        body: [
          "Subject to applicable law, you may request access to the personal data we hold about you, ask us to correct or delete it, object to or restrict certain processing, withdraw consent, or request a portable copy.",
          "To exercise a right, email info@yasirzayed.com. We may need to verify your identity before acting. You also have the right to complain to the Office of the Data Protection Commissioner (ODPC) in Kenya.",
        ],
      },
      {
        heading: "9. Cookies and local storage",
        body: [
          "We use a small number of cookies and browser storage entries to remember your preferences and keep the site working. Details are set out in our Cookie Policy.",
        ],
      },
      {
        heading: "10. Children",
        body: [
          "Our services are intended for businesses and adults. We do not knowingly collect personal information from children. If you believe a child has provided us with personal data, contact us and we will remove it.",
        ],
      },
      {
        heading: "11. Changes to this policy",
        body: [
          `We may update this policy from time to time. The current version is dated ${LAST_UPDATED} and will always be available on this page. Material changes will be highlighted on the website where appropriate.`,
        ],
      },
      {
        heading: "12. Contact",
        body: [
          "For privacy questions or requests, contact us using the details below. We aim to respond within a reasonable period and in any event within the timelines required by law.",
          ...CONTACT_LINES,
        ],
      },
    ],
  },
  "/terms": {
    title: "Terms of Service",
    eyebrow: "Legal",
    description:
      "The terms that govern use of the Yasir Zayed website and the professional services we provide.",
    icon: ScrollText,
    sections: [
      {
        heading: "1. About these terms",
        body: [
          "These terms govern your use of yasirzayed.com and the professional services provided by Yasir Zayed. By using the website or engaging our services, you agree to these terms.",
          "A signed proposal, statement of work or service agreement takes precedence over these general terms where the two differ.",
        ],
      },
      {
        heading: "2. Services and proposals",
        body: [
          "We provide business development, FMCG, sales and marketing, security, web development, AI and related professional services. The scope, deliverables, timeline and fees for each engagement are set out in a written proposal or statement of work.",
          "Unless stated otherwise, proposals are valid for 30 days. Any work outside the agreed scope will be quoted and agreed before it begins.",
        ],
      },
      {
        heading: "3. Your responsibilities",
        body: [
          "You agree to provide accurate information, timely feedback, access to the people and materials we reasonably need, and any licences or permissions required for the work. Delays in these inputs may affect timelines.",
          "You confirm that any content or material you provide does not infringe third-party rights and that you are authorised to share it with us.",
        ],
      },
      {
        heading: "4. Fees and payment",
        body: [
          "Fees are stated in the applicable proposal or invoice. We may invoice in US dollars or Kenyan shillings; currency conversion and any bank or payment-provider charges are disclosed before payment.",
          "Payments made through third-party providers such as Paystack are subject to those providers' terms. Unless agreed otherwise, invoices are payable on the terms stated on the invoice, and work may be paused while an invoice remains overdue.",
        ],
      },
      {
        heading: "5. Changes to scope",
        body: [
          "Changes requested after work begins are handled through a written change request describing the additional work, fee and timeline impact. We will not proceed with out-of-scope work until the change is agreed.",
        ],
      },
      {
        heading: "6. Intellectual property",
        body: [
          "On full payment, you receive ownership of the final deliverables created specifically for you under the engagement, except for third-party materials, open-source components and our pre-existing tools, frameworks and know-how, which remain ours and may be licensed to you for use with the deliverables.",
          "Unless you ask us not to, we may reference the engagement in our portfolio and marketing in a way that does not disclose your confidential information.",
        ],
      },
      {
        heading: "7. Confidentiality",
        body: [
          "Each party agrees to keep the other's confidential information private and to use it only for the purposes of the engagement. This obligation continues after the engagement ends. It does not apply to information that is public, independently developed, or required to be disclosed by law.",
        ],
      },
      {
        heading: "8. Third-party services",
        body: [
          "Some services rely on third-party platforms such as hosting providers, payment processors, AI providers and communication tools. We are not responsible for outages, policy changes or acts of those providers, but we will make reasonable efforts to help resolve issues and to choose reliable providers.",
        ],
      },
      {
        heading: "9. Warranties and liability",
        body: [
          "We provide our services with reasonable skill and care and in line with the agreed scope. Except as required by law, we do not warrant specific commercial outcomes, rankings, sales results or uninterrupted availability of third-party platforms.",
          "To the maximum extent permitted by law, our total liability arising from an engagement is limited to the fees paid for the affected services, and we are not liable for indirect or consequential loss. Nothing in these terms limits liability that cannot lawfully be limited.",
        ],
      },
      {
        heading: "10. Termination",
        body: [
          "Either party may terminate an engagement in accordance with the applicable agreement or on written notice if the other party materially breaches these terms and does not remedy the breach within a reasonable period. On termination, you remain liable for work performed and costs committed up to that point.",
        ],
      },
      {
        heading: "11. Governing law",
        body: [
          "These terms are governed by the laws of Kenya. The parties will first attempt to resolve disputes amicably; if that fails, the courts of Kenya have jurisdiction.",
        ],
      },
      {
        heading: "12. Contact",
        body: [
          "Questions about these terms can be sent to:",
          ...CONTACT_LINES,
        ],
      },
    ],
  },
  "/cookies": {
    title: "Cookie Policy",
    eyebrow: "Legal",
    description:
      "Which cookies and browser storage entries yasirzayed.com uses, why, and how you can control them.",
    icon: Cookie,
    sections: [
      {
        heading: "1. What cookies are",
        body: [
          "Cookies are small text files stored by your browser when you visit a website. Similar technologies, such as local storage, keep small amounts of data on your device. They help a site remember your choices and work reliably.",
        ],
      },
      {
        heading: "2. What we use",
        body: [
          "Essential storage: we use local storage entries such as yz-auth-session (to keep you signed in to the website workspace) and yz-policy-accepted (to remember that you accepted our policy notice). These are needed for the features to work.",
          "Preference storage: we may remember choices such as cookie consent so that we do not ask you again on every visit.",
          "Analytics: if analytics is enabled, we use aggregated usage information to understand which pages are visited and how the site performs. We do not use it to identify you personally.",
          "Third-party content: pages may load fonts, images or embedded content from third parties (for example Google Fonts and news image sources). Those providers may set their own cookies or receive technical information such as your IP address under their own policies.",
        ],
      },
      {
        heading: "3. Managing cookies",
        body: [
          "You can accept or decline non-essential cookies through the cookie notice on the site, and you can clear or block cookies and local storage in your browser settings. Blocking essential storage may prevent sign-in, preference memory or other features from working.",
          "Browser help pages explain how to manage cookies for Chrome, Safari, Firefox, Edge and most mobile browsers.",
        ],
      },
      {
        heading: "4. Do Not Track",
        body: [
          "Some browsers send a Do Not Track signal. Because there is no consistent industry standard, we do not currently respond to it automatically, but we keep our use of tracking to a minimum.",
        ],
      },
      {
        heading: "5. Changes",
        body: [
          `We may update this policy as our website changes. The current version is dated ${LAST_UPDATED}.`,
        ],
      },
      {
        heading: "6. Contact",
        body: [
          "For questions about cookies or privacy, contact us:",
          ...CONTACT_LINES,
        ],
      },
    ],
  },
};

export default function Legal() {
  const { pathname } = useLocation();
  const normalized = pathname.replace(/\/+$/, "") || "/privacy";
  const doc = documents[normalized] ?? documents["/privacy"];
  const Icon = doc.icon;

  useSEO({
    title: doc.title,
    description: doc.description,
    path: normalized,
    keywords: `${doc.title}, Yasir Zayed legal, privacy, terms, cookies, Kenya`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: `${doc.title} — Yasir Zayed`,
      url: `https://yasirzayed.com${normalized}`,
      description: doc.description,
      inLanguage: "en",
      isPartOf: { "@id": "https://yasirzayed.com/#website" },
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="relative overflow-hidden bg-navy-dark pb-14 pt-32 sm:pb-16 sm:pt-36">
        <div className="absolute inset-0 bg-grid-pattern-dark" />
        <div className="absolute right-1/4 top-1/3 h-[420px] w-[420px] rounded-full bg-electric/5 blur-[120px]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 text-sm text-white/40 transition-colors hover:text-white/70"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
          <div className="flex items-start gap-4">
            <div className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-electric/10">
              <Icon className="h-5 w-5 text-electric" />
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-electric">
                {doc.eyebrow}
              </p>
              <h1 className="font-display text-3xl font-bold text-white sm:text-4xl md:text-5xl">
                {doc.title}
              </h1>
              <p className="mt-3 text-sm text-white/40">
                Last updated: {LAST_UPDATED}
              </p>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
        <p className="mb-10 text-base leading-relaxed text-muted-foreground">
          {doc.description}
        </p>

        <div className="space-y-10">
          {doc.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="font-display text-xl font-bold text-foreground">
                {section.heading}
              </h2>
              <div className="mt-3 space-y-3">
                {section.body.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="text-sm leading-relaxed text-muted-foreground"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap gap-4 border-t border-border pt-8 text-sm">
          <Link to="/privacy" className="text-electric hover:underline">
            Privacy Policy
          </Link>
          <Link to="/terms" className="text-electric hover:underline">
            Terms of Service
          </Link>
          <Link to="/cookies" className="text-electric hover:underline">
            Cookie Policy
          </Link>
          <Link to="/contact" className="text-electric hover:underline">
            Contact us
          </Link>
        </div>
      </main>

      <Footer />
      <FloatingWidgets />
    </div>
  );
}
