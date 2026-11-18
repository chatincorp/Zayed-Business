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

export interface WholesaleProduct {
  id: string;
  backendId?: string;
  name: string;
  supplierName: string;
  category: string;
  unit: string;
  caseSize: number;
  moq: number;
  pricePerUnit: number;
  currency: string;
  paymentTerms: string;
  imageUrl: string;
  stockNote: string;
}

export const DEMO_WHOLESALE_PRODUCTS: WholesaleProduct[] = [
  {
    id: "demo-rice-25",
    name: "Long Grain Rice 25kg",
    supplierName: "Mwangi Grain Traders",
    category: "Food & Groceries",
    unit: "bag",
    caseSize: 1,
    moq: 20,
    pricePerUnit: 2650,
    currency: "KES",
    paymentTerms: "30% deposit, 70% on delivery",
    imageUrl:
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80",
    stockNote: "Nairobi depot · 2–3 days",
  },
  {
    id: "demo-oil-20l",
    name: "Cooking Oil 20L Jerrycan",
    supplierName: "Golden Harvest Oils",
    category: "Food & Groceries",
    unit: "jerrycan",
    caseSize: 1,
    moq: 15,
    pricePerUnit: 3450,
    currency: "KES",
    paymentTerms: "100% on delivery",
    imageUrl:
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&q=80",
    stockNote: "Nairobi depot · same week",
  },
  {
    id: "demo-water-500",
    name: "Drinking Water 500ml × 24",
    supplierName: "AquaPure Kenya",
    category: "Beverages",
    unit: "case",
    caseSize: 24,
    moq: 40,
    pricePerUnit: 480,
    currency: "KES",
    paymentTerms: "50% deposit, 50% on delivery",
    imageUrl:
      "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=800&q=80",
    stockNote: "Nairobi depot · 1–2 days",
  },
  {
    id: "demo-soap-800",
    name: "Laundry Bar Soap 800g × 12",
    supplierName: "CleanCo Home Care",
    category: "Home Care",
    unit: "case",
    caseSize: 12,
    moq: 25,
    pricePerUnit: 960,
    currency: "KES",
    paymentTerms: "Net 14 days",
    imageUrl:
      "https://images.unsplash.com/photo-1585421514738-01798e348b17?w=800&q=80",
    stockNote: "Nairobi depot · 3–5 days",
  },
  {
    id: "demo-maize-2kg",
    name: "Maize Flour 2kg × 12",
    supplierName: "Highland Mills",
    category: "Food & Groceries",
    unit: "case",
    caseSize: 12,
    moq: 30,
    pricePerUnit: 780,
    currency: "KES",
    paymentTerms: "30% deposit, 70% on delivery",
    imageUrl:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80",
    stockNote: "Nakuru mill · 2–4 days",
  },
  {
    id: "demo-coffee-500",
    name: "Roasted Coffee 500g × 12",
    supplierName: "Rift Valley Roasters",
    category: "Beverages",
    unit: "case",
    caseSize: 12,
    moq: 10,
    pricePerUnit: 2400,
    currency: "KES",
    paymentTerms: "50% deposit, 50% on delivery",
    imageUrl:
      "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&q=80",
    stockNote: "Nairobi roastery · 2–3 days",
  },
  {
    id: "demo-toothpaste",
    name: "Toothpaste 100ml × 48",
    supplierName: "SmileCare Distributors",
    category: "Personal Care & Beauty",
    unit: "case",
    caseSize: 48,
    moq: 8,
    pricePerUnit: 3840,
    currency: "KES",
    paymentTerms: "Net 30 days",
    imageUrl:
      "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=800&q=80",
    stockNote: "Nairobi depot · 3–5 days",
  },
  {
    id: "demo-diapers",
    name: "Baby Diapers Jumbo Pack × 6",
    supplierName: "LittleSteps Baby",
    category: "Baby & Kids",
    unit: "pack",
    caseSize: 6,
    moq: 12,
    pricePerUnit: 1800,
    currency: "KES",
    paymentTerms: "100% on delivery",
    imageUrl:
      "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800&q=80",
    stockNote: "Nairobi depot · 2–3 days",
  },
  {
    id: "demo-sugar-50",
    name: "Refined Sugar 50kg",
    supplierName: "Chemelil Sweeteners",
    category: "Food & Groceries",
    unit: "bag",
    caseSize: 1,
    moq: 20,
    pricePerUnit: 6900,
    currency: "KES",
    paymentTerms: "30% deposit, 70% on delivery",
    imageUrl:
      "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800&q=80",
    stockNote: "Kisumu mill · 4–6 days",
  },
  {
    id: "demo-tissue",
    name: "Facial Tissue 10-Pack Bale",
    supplierName: "SoftFold Paper",
    category: "Home Care",
    unit: "bale",
    caseSize: 10,
    moq: 15,
    pricePerUnit: 1250,
    currency: "KES",
    paymentTerms: "Net 14 days",
    imageUrl:
      "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&q=80",
    stockNote: "Thika plant · 2–4 days",
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
