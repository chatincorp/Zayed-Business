import type { LucideIcon } from "lucide-react";
import {
  ClipboardList,
  ShoppingCart,
  Truck,
  Store,
  Tag,
  PackageCheck,
  Boxes,
  LineChart,
} from "lucide-react";

export const FMCG_CATEGORIES = [
  "Food & Groceries",
  "Beverages",
  "Personal Care & Beauty",
  "Home Care",
  "Baby & Kids",
  "General FMCG",
] as const;

export type FmcgCategory = (typeof FMCG_CATEGORIES)[number];

export const FMCG_PAYMENT_TERMS = [
  "100% on delivery",
  "30% deposit, 70% on delivery",
  "50% deposit, 50% on delivery",
  "Net 14 days",
  "Net 30 days",
] as const;

export interface FmcgService {
  slug: string;
  title: string;
  short: string;
  summary: string;
  deliverables: string[];
  icon: LucideIcon;
}

export const FMCG_SERVICES: FmcgService[] = [
  {
    slug: "fmcg-order-booking",
    title: "FMCG Order Booking",
    short: "Order Booking",
    summary:
      "A disciplined order-capture engine for distributors and depots: planned call cycles, verified quantities, credit checks and confirmed dispatch dates.",
    deliverables: [
      "Outlet and distributor call cycles",
      "Order capture with MOQ and pricing checks",
      "Credit-limit and outstanding-balance review",
      "Dispatch confirmation and delivery tracking",
    ],
    icon: ClipboardList,
  },
  {
    slug: "fmcg-sales",
    title: "FMCG Sales",
    short: "Sales",
    summary:
      "Route-to-market strategy and field sales execution that turns coverage into repeatable volume across modern and traditional trade.",
    deliverables: [
      "Route-to-market and distributor design",
      "Field team structure, targets and incentives",
      "Key-account and modern-trade negotiation",
      "Sales reporting and sell-out visibility",
    ],
    icon: ShoppingCart,
  },
  {
    slug: "fmcg-supplier-sourcing",
    title: "FMCG Supplier Sourcing",
    short: "Supplier Sourcing",
    summary:
      "Vetted manufacturers and import partners, benchmarked landed cost, and supply plans that protect margin and availability.",
    deliverables: [
      "Manufacturer and importer vetting",
      "Landed-cost and MOQ benchmarking",
      "Sample, quality and compliance checks",
      "Lead-time and replenishment planning",
    ],
    icon: Truck,
  },
  {
    slug: "fmcg-merchandizing",
    title: "FMCG Merchandizing",
    short: "Merchandizing",
    summary:
      "Shelf standards that sell: planograms, visibility audits and merchandiser coverage that convert footfall into basket share.",
    deliverables: [
      "Planogram and shelf-share design",
      "Merchandiser recruitment and coverage",
      "Display and POSM installation",
      "Shelf audits with photo evidence",
    ],
    icon: Store,
  },
  {
    slug: "fmcg-product-promotion",
    title: "FMCG Product Promotion",
    short: "Product Promotion",
    summary:
      "Trade and consumer promotions built around measurable lift — sampling, activations, trade offers and shopper campaigns.",
    deliverables: [
      "Promotion calendar and mechanics",
      "Trade offers and push-pull bundles",
      "In-store and market activations",
      "Redemption tracking and ROI reporting",
    ],
    icon: Tag,
  },
];

export const FMCG_PROCESS = [
  {
    step: "01",
    title: "Brief & scope",
    description:
      "We map your products, territory, volume targets and current route-to-market, then agree the service scope and KPIs.",
    icon: LineChart,
  },
  {
    step: "02",
    title: "Supply & listing",
    description:
      "Suppliers are vetted and onboarded, products are listed with MOQ, pricing and payment terms, and stock is confirmed.",
    icon: Boxes,
  },
  {
    step: "03",
    title: "Sell & book",
    description:
      "Field teams book wholesale orders, merchandisers secure shelf space and promotions create pull-through at the point of sale.",
    icon: ClipboardList,
  },
  {
    step: "04",
    title: "Fulfil & report",
    description:
      "The order desk reviews every booking, confirms dispatch, tracks delivery and reports sell-out against the agreed KPIs.",
    icon: PackageCheck,
  },
];

export const WHOLESALE_COUNTIES = [
  "Nairobi",
  "Kiambu",
  "Machakos",
  "Kajiado",
  "Nakuru",
  "Mombasa",
  "Kisumu",
  "Uasin Gishu",
  "Nyeri",
  "Meru",
  "Kakamega",
  "Other",
];

export function formatKes(value: number): string {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);
}

export const FMCG_CONTACT = {
  email: "fmcg@yasirzayed.com",
  phone: "+254 114 712 989",
  whatsapp: "+254 717 227 012",
};
