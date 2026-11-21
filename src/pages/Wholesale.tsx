import { useMemo, useState } from "react";
import { Link } from "react-router";
import { useMutation, useQuery } from "convex/react";
import type { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { isBackendConfigured } from "@/lib/backend";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FloatingWidgets from "@/components/FloatingWidgets";
import { useSEO } from "@/lib/seo";
import {
  ArrowDown,
  ArrowRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  Loader2,
  Lock,
  Mail,
  Minus,
  Package,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Trash2,
  Truck,
} from "lucide-react";
import {
  FMCG_CATEGORIES,
  FMCG_CONTACT,
  WHOLESALE_COUNTIES,
  formatKes,
} from "@/data/fmcg";

interface WholesaleProduct {
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
  stockQuantity?: number;
  leadTime?: string;
}

interface CartLine {
  product: WholesaleProduct;
  quantity: number;
}

type Cart = Record<string, CartLine>;

interface BookingPayload {
  clientName: string;
  businessName: string;
  email: string;
  phone: string;
  county: string;
  deliveryAddress?: string;
  preferredDate?: string;
  notes?: string;
  collectionMethod?: "delivery" | "pickup";
  collectionPoint?: string;
  collectionContactName?: string;
  collectionContactPhone?: string;
  collectionIdNumber?: string;
  collectionNotes?: string;
  items: Array<{
    productId?: string;
    name: string;
    supplierName: string;
    quantity: number;
    unit: string;
    caseSize: number;
    unitPrice: number;
  }>;
}

interface BookingResult {
  reference: string;
  estimatedTotal: number;
  currency: string;
}

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20";

function cartTotal(cart: Cart): number {
  return Object.values(cart).reduce(
    (sum, line) => sum + line.quantity * line.product.pricePerUnit,
    0,
  );
}

function cartCount(cart: Cart): number {
  return Object.values(cart).reduce((sum, line) => sum + line.quantity, 0);
}

export default function Wholesale() {
  useSEO({
    title: "Wholesale Order Booking — Bulk FMCG Supply in Kenya",
    description:
      "Book bulk FMCG volumes online: clear MOQs, case pricing and supplier payment terms. Orders are reviewed by the Yasir Zayed order desk before dispatch — no online payment.",
    path: "/wholesale",
    keywords:
      "wholesale FMCG Kenya, bulk order booking Nairobi, wholesale food suppliers Kenya, order desk, FMCG wholesale prices",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "Service",
        name: "FMCG Wholesale Order Booking",
        serviceType: "Wholesale FMCG supply",
        description:
          "Online wholesale order booking for FMCG products in Kenya. Bulk quantities are reviewed and confirmed by the order desk; no payment is processed online.",
        url: "https://yasirzayed.com/wholesale",
        provider: {
          "@type": "Organization",
          "@id": "https://yasirzayed.com/#organization",
          name: "Yasir Zayed",
          url: "https://yasirzayed.com/",
          telephone: "+254-114-712-989",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Nairobi",
            addressCountry: "KE",
          },
        },
        areaServed: ["Kenya"],
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://yasirzayed.com/" },
          { "@type": "ListItem", position: 2, name: "FMCG", item: "https://yasirzayed.com/fmcg" },
          { "@type": "ListItem", position: 3, name: "Wholesale", item: "https://yasirzayed.com/wholesale" },
        ],
      },
    ],
  });

  return (
    <div className="min-h-screen bg-[#faf7f0]">
      <Navigation />
      {isBackendConfigured ? (
        <LiveWholesale />
      ) : (
        <WholesaleView products={[]} />
      )}
      <Footer />
      <FloatingWidgets />
    </div>
  );
}

function LiveWholesale() {
  const liveProducts = useQuery(api.fmcg.listProducts);
  const bookOrder = useMutation(api.fmcg.bookOrder);

  const products = useMemo<WholesaleProduct[]>(() => {
    if (!liveProducts) return [];
    return liveProducts.map((product) => ({
      id: product._id,
      backendId: product._id,
      name: product.name,
      supplierName: product.supplierName,
      category: product.category,
      unit: product.unit,
      caseSize: product.caseSize,
      moq: product.moq,
      pricePerUnit: product.pricePerUnit,
      currency: product.currency,
      paymentTerms: product.paymentTerms,
      imageUrl: product.resolvedImageUrl ?? product.imageUrl ?? "",
      stockNote:
        product.stockQuantity === undefined
          ? "Approved supplier listing · stock confirmed on review"
          : product.stockQuantity > 0
            ? `${product.stockQuantity} ${product.unit}s in stock`
            : "Out of stock · ask the desk for the next delivery",
      stockQuantity: product.stockQuantity,
      leadTime: product.leadTime,
    }));
  }, [liveProducts]);

  return (
    <WholesaleView
      products={products}
      loading={liveProducts === undefined}
      onBook={async (payload) => {
        const result = await bookOrder({
          ...payload,
          items: payload.items.map((item) => ({
            ...item,
            productId: item.productId as Id<"fmcgProducts"> | undefined,
          })),
        });
        return {
          reference: result.reference,
          estimatedTotal: result.estimatedTotal,
          currency: result.currency,
        };
      }}
    />
  );
}

function WholesaleView({
  products,
  loading = false,
  onBook,
}: {
  products: WholesaleProduct[];
  loading?: boolean;
  onBook?: (payload: BookingPayload) => Promise<BookingResult>;
}) {
  const [cart, setCart] = useState<Cart>({});
  const [category, setCategory] = useState("All categories");
  const [collectionMethod, setCollectionMethod] = useState<"delivery" | "pickup">("delivery");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<BookingResult | null>(null);

  const categories = useMemo(() => {
    const present = Array.from(new Set(products.map((product) => product.category)));
    const ordered = FMCG_CATEGORIES.filter((item) => present.includes(item));
    return ["All categories", ...ordered, ...present.filter((item) => !(ordered as string[]).includes(item))];
  }, [products]);

  const visibleProducts =
    category === "All categories"
      ? products
      : products.filter((product) => product.category === category);

  const lines = Object.values(cart);
  const total = cartTotal(cart);
  const count = cartCount(cart);

  function addToCart(product: WholesaleProduct) {
    setConfirmation(null);
    setCart((current) => ({
      ...current,
      [product.id]: current[product.id] ?? { product, quantity: product.moq },
    }));
  }

  /** Highest quantity the supplier can actually supply for this line. */
  function maxQuantity(product: WholesaleProduct) {
    return product.stockQuantity ?? Number.POSITIVE_INFINITY;
  }

  function changeQuantity(productId: string, delta: number) {
    setCart((current) => {
      const line = current[productId];
      if (!line) return current;
      const ceiling = maxQuantity(line.product);
      const next = Math.min(ceiling, Math.max(line.product.moq, line.quantity + delta));
      return { ...current, [productId]: { ...line, quantity: next } };
    });
  }

  function removeLine(productId: string) {
    setCart((current) => {
      const next = { ...current };
      delete next[productId];
      return next;
    });
  }

  function goToBooking() {
    document.getElementById("booking-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function handleBook(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!onBook || lines.length === 0) return;
    setError(null);
    setSubmitting(true);
    const form = new FormData(event.currentTarget);
    try {
      const result = await onBook({
        clientName: String(form.get("clientName") ?? ""),
        businessName: String(form.get("businessName") ?? ""),
        email: String(form.get("email") ?? ""),
        phone: String(form.get("phone") ?? ""),
        county: String(form.get("county") ?? ""),
        deliveryAddress:
          collectionMethod === "delivery"
            ? String(form.get("deliveryAddress") ?? "")
            : undefined,
        preferredDate: String(form.get("preferredDate") ?? "") || undefined,
        notes: String(form.get("notes") ?? "") || undefined,
        collectionMethod,
        collectionPoint:
          collectionMethod === "pickup"
            ? String(form.get("collectionPoint") ?? "")
            : undefined,
        collectionContactName:
          collectionMethod === "pickup"
            ? String(form.get("collectionContactName") ?? "")
            : undefined,
        collectionContactPhone:
          collectionMethod === "pickup"
            ? String(form.get("collectionContactPhone") ?? "")
            : undefined,
        collectionIdNumber:
          collectionMethod === "pickup"
            ? String(form.get("collectionIdNumber") ?? "") || undefined
            : undefined,
        collectionNotes:
          collectionMethod === "pickup"
            ? String(form.get("collectionNotes") ?? "") || undefined
            : undefined,
        items: lines.map((line) => ({
          productId: line.product.backendId,
          name: line.product.name,
          supplierName: line.product.supplierName,
          quantity: line.quantity,
          unit: line.product.unit,
          caseSize: line.product.caseSize,
          unitPrice: line.product.pricePerUnit,
        })),
      });
      setConfirmation(result);
      setCart({});
      window.setTimeout(() => {
        document.getElementById("booking-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit your booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-[#faf7f0] pb-14 pt-32 sm:pb-16 sm:pt-36">
        <div className="pointer-events-none absolute -right-32 top-20 h-[480px] w-[480px] rounded-full bg-amber-200/40 blur-[130px]" />
        <div className="pointer-events-none absolute -left-24 bottom-0 h-[300px] w-[300px] rounded-full bg-sky-200/30 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="mb-8 flex items-center gap-2 text-xs text-slate-400" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-slate-700">Home</Link>
            <span>/</span>
            <Link to="/fmcg" className="hover:text-slate-700">FMCG</Link>
            <span>/</span>
            <span className="text-slate-600">Wholesale</span>
          </nav>

          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr,0.95fr]">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-300/60 bg-white px-3.5 py-1.5">
                <ShoppingCart className="h-3.5 w-3.5 text-amber-700" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-800">
                  Wholesale order booking
                </span>
              </div>
              <h1 className="font-display text-4xl font-bold leading-[1.05] text-navy sm:text-5xl md:text-6xl">
                Wholesale, without
                <br />
                the <span className="text-amber-600">runaround.</span>
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
                Build a bulk basket with clear MOQs, case pricing and payment terms.
                Submit it to the order desk for review — we confirm stock, terms and
                delivery before anything moves. No payment is taken online.
              </p>

              <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3">
                {[
                  "Clear MOQs and case pricing",
                  "Human review of every order",
                  "No online payment",
                ].map((item) => (
                  <span key={item} className="flex items-center gap-2 text-xs font-medium text-slate-600">
                    <BadgeCheck className="h-4 w-4 text-amber-600" />
                    {item}
                  </span>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#wholesale-catalog"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-navy px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-navy-light"
                >
                  Browse wholesale products
                  <ArrowDown className="h-4 w-4" />
                </a>
                {count > 0 && (
                  <button
                    onClick={goToBooking}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-navy transition-colors hover:border-amber-400"
                  >
                    Review {count} unit{count === 1 ? "" : "s"} booked
                    <ArrowRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category strip */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl overflow-x-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex min-w-max items-center gap-2">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${
                  category === item
                    ? "border-navy bg-navy text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:border-amber-300 hover:text-navy"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Catalog */}
      <section id="wholesale-catalog" className="scroll-mt-24 bg-[#faf7f0] py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-amber-700">
                Wholesale catalogue
              </p>
              <h2 className="font-display text-2xl font-bold text-navy sm:text-3xl">
                {category === "All categories" ? "Everything available to book" : category}
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              {loading
                ? "Loading supplier listings..."
                : `${visibleProducts.length} product${visibleProducts.length === 1 ? "" : "s"} · prices in KES`}
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr,340px]">
            <div>
              {loading ? (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white">
                      <div className="aspect-[4/3] bg-slate-100" />
                      <div className="space-y-3 p-5">
                        <div className="h-3 w-1/3 rounded bg-slate-100" />
                        <div className="h-4 w-3/4 rounded bg-slate-100" />
                        <div className="h-3 w-1/2 rounded bg-slate-100" />
                        <div className="h-9 w-full rounded-lg bg-slate-100" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : visibleProducts.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
                  <Package className="mx-auto mb-3 h-8 w-8 text-slate-300" />
                  <p className="text-sm font-semibold text-navy">Nothing listed here yet</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Choose another category or ask the desk for a specific product.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {visibleProducts.map((product) => {
                    const line = cart[product.id];
                    return (
                      <article
                        key={product.id}
                        className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:border-amber-300 hover:shadow-lg hover:shadow-amber-900/5"
                      >
                        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                          {product.imageUrl ? (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                              loading="lazy"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <Package className="h-8 w-8 text-slate-300" />
                            </div>
                          )}
                          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-semibold text-slate-700 backdrop-blur">
                            {product.category}
                          </span>
                        </div>

                        <div className="flex flex-1 flex-col p-5">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-700">
                            {product.supplierName}
                          </p>
                          <h3 className="mt-1 font-display text-base font-bold leading-snug text-navy">
                            {product.name}
                          </h3>
                          <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
                            {product.caseSize > 1
                              ? `${product.caseSize} units per ${product.unit}`
                              : `Sold per ${product.unit}`}{" "}
                            · MOQ {product.moq} {product.unit}s
                          </p>
                          <p className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-400">
                            <Truck className="h-3 w-3" /> {product.stockNote}
                          </p>

                          <div className="mt-4 flex items-end justify-between gap-3 border-t border-slate-100 pt-4">
                            <div>
                              <p className="font-display text-lg font-bold text-navy">
                                {formatKes(product.pricePerUnit)}
                              </p>
                              <p className="text-[10px] text-slate-400">per {product.unit}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-[10px] font-medium text-slate-500">{product.paymentTerms}</p>
                              <p className="text-[10px] text-slate-400">payment terms</p>
                            </div>
                          </div>

                          <div className="mt-4">
                            {line ? (
                              <div className="flex items-center justify-between rounded-lg border border-amber-300 bg-amber-50/60 p-1">
                                <button
                                  onClick={() => changeQuantity(product.id, -1)}
                                  disabled={line.quantity <= product.moq}
                                  className="flex h-8 w-8 items-center justify-center rounded-md text-navy transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-30"
                                  aria-label={`Reduce ${product.name} quantity`}
                                >
                                  <Minus className="h-3.5 w-3.5" />
                                </button>
                                <span className="text-xs font-semibold text-navy">
                                  {line.quantity} {product.unit}s
                                </span>
                                <button
                                  onClick={() => changeQuantity(product.id, 1)}
                                  disabled={line.quantity >= maxQuantity(product)}
                                  className="flex h-8 w-8 items-center justify-center rounded-md text-navy transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-30"
                                  aria-label={`Increase ${product.name} quantity`}
                                >
                                  <Plus className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            ) : product.stockQuantity === 0 ? (
                              <button
                                disabled
                                className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-400"
                              >
                                Out of stock
                              </button>
                            ) : (
                              <button
                                onClick={() => addToCart(product)}
                                className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-navy/15 bg-navy/[0.03] px-4 py-2.5 text-xs font-semibold text-navy transition-colors hover:border-amber-400 hover:bg-amber-50"
                              >
                                <Plus className="h-3.5 w-3.5" />
                                Add {product.moq} {product.unit}s to order
                              </button>
                            )}
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Order summary */}
            <aside className="h-fit lg:sticky lg:top-24">
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-lg font-bold text-navy">Your order</h2>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-500">
                    {lines.length} line{lines.length === 1 ? "" : "s"}
                  </span>
                </div>

                {lines.length === 0 ? (
                  <div className="mt-6 rounded-xl border border-dashed border-slate-200 px-4 py-8 text-center">
                    <ShoppingCart className="mx-auto mb-2 h-6 w-6 text-slate-300" />
                    <p className="text-xs text-slate-500">
                      Add products to build a wholesale basket. Quantities start at
                      each supplier's MOQ.
                    </p>
                  </div>
                ) : (
                  <>
                    <ul className="mt-4 space-y-3">
                      {lines.map((line) => (
                        <li key={line.product.id} className="flex gap-3 border-b border-slate-100 pb-3">
                          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                            {line.product.imageUrl ? (
                              <img src={line.product.imageUrl} alt="" className="h-full w-full object-cover" />
                            ) : (
                              <div className="flex h-full items-center justify-center">
                                <Package className="h-4 w-4 text-slate-300" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-semibold text-navy">{line.product.name}</p>
                            <p className="text-[10px] text-slate-400">
                              {line.quantity} × {formatKes(line.product.pricePerUnit)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-semibold text-navy">
                              {formatKes(line.quantity * line.product.pricePerUnit)}
                            </p>
                            <button
                              onClick={() => removeLine(line.product.id)}
                              className="mt-1 inline-flex items-center gap-0.5 text-[10px] text-slate-400 hover:text-destructive"
                            >
                              <Trash2 className="h-2.5 w-2.5" /> remove
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-500">Estimated total</span>
                      <span className="font-display text-xl font-bold text-navy">{formatKes(total)}</span>
                    </div>
                    <p className="mt-1 text-[10px] leading-relaxed text-slate-400">
                      Final invoice is confirmed by the order desk after stock and
                      delivery review.
                    </p>

                    <button
                      onClick={goToBooking}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-amber-400 to-[#E8C56A] px-4 py-3 text-sm font-semibold text-[#1a1305] transition-all hover:brightness-105"
                    >
                      Continue to booking
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </>
                )}

                <div className="mt-5 flex items-start gap-2 border-t border-slate-100 pt-4">
                  <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" />
                  <p className="text-[10px] leading-relaxed text-slate-400">
                    This page only books your order. No card or payment details are
                    requested, and no order is dispatched before the desk confirms it.
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                  Need help choosing?
                </p>
                <a
                  href={`mailto:${FMCG_CONTACT.email}`}
                  className="mt-3 flex items-center gap-2 text-xs font-medium text-navy hover:text-amber-700"
                >
                  <Mail className="h-3.5 w-3.5" /> {FMCG_CONTACT.email}
                </a>
                <a
                  href="tel:+254114712989"
                  className="mt-2 flex items-center gap-2 text-xs font-medium text-navy hover:text-amber-700"
                >
                  <Truck className="h-3.5 w-3.5" /> {FMCG_CONTACT.phone}
                </a>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Booking form */}
      <section id="booking-form" className="scroll-mt-24 border-t border-slate-200 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {confirmation ? (
            <div className="mx-auto max-w-2xl rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center sm:p-10">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15">
                <CheckCircle2 className="h-8 w-8 text-emerald-600" />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-700">
                Booking submitted for review
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold text-navy sm:text-3xl">
                Reference {confirmation.reference}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                Your booking is with the order desk. We will review stock, payment
                terms and delivery, then contact you to confirm. Estimated value:{" "}
                <span className="font-semibold text-navy">
                  {formatKes(confirmation.estimatedTotal)}
                </span>
                .
              </p>
              <p className="mt-3 text-xs text-slate-500">
                No payment has been taken. Keep this reference for follow-up.
              </p>
              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  to="/portal"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-light"
                >
                  Track this booking
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="#wholesale-catalog"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-navy hover:border-amber-400"
                >
                  Book another order
                </a>
              </div>
            </div>
          ) : (
            <div className="grid gap-10 lg:grid-cols-[1.1fr,0.9fr] lg:gap-16">
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-amber-700">
                  Step 2 of 2
                </p>
                <h2 className="font-display text-3xl font-bold leading-tight text-navy sm:text-4xl">
                  Send the order to the desk.
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-500">
                  Tell us who is buying and where it is going. The order desk will
                  review your basket, confirm availability and payment terms, and
                  come back with a delivery plan.
                </p>

                {!onBook && (
                  <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-900/75">
                    Live booking is unavailable in this static build. Email{" "}
                    <a href={`mailto:${FMCG_CONTACT.email}`} className="font-semibold underline">
                      {FMCG_CONTACT.email}
                    </a>{" "}
                    with your basket and the desk will take it from there.
                  </div>
                )}

                <form onSubmit={handleBook} className="mt-7 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="ws-name" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Contact name *
                      </label>
                      <input id="ws-name" name="clientName" required className={inputClass} placeholder="Full name" />
                    </div>
                    <div>
                      <label htmlFor="ws-business" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Business / trading name *
                      </label>
                      <input id="ws-business" name="businessName" required className={inputClass} placeholder="Registered or trading name" />
                    </div>
                    <div>
                      <label htmlFor="ws-email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Email *
                      </label>
                      <input id="ws-email" name="email" type="email" required className={inputClass} placeholder="you@business.co.ke" />
                    </div>
                    <div>
                      <label htmlFor="ws-phone" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Phone / WhatsApp *
                      </label>
                      <input id="ws-phone" name="phone" type="tel" required className={inputClass} placeholder="+254 7xx xxx xxx" />
                    </div>
                    <div>
                      <label htmlFor="ws-county" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                        County *
                      </label>
                      <select id="ws-county" name="county" required className={inputClass} defaultValue="Nairobi">
                        {WHOLESALE_COUNTIES.map((county) => (
                          <option key={county} value={county}>{county}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="ws-date" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Preferred delivery date
                      </label>
                      <input
                        id="ws-date"
                        name="preferredDate"
                        type="date"
                        min={new Date().toISOString().split("T")[0]}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <fieldset>
                    <legend className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                      How do you want the goods? *
                    </legend>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {[
                        { value: "delivery" as const, label: "Deliver to us", hint: "We confirm the window and cost", icon: Truck },
                        { value: "pickup" as const, label: "We collect", hint: "Named collector at a collection point", icon: Building2 },
                      ].map((option) => (
                        <label
                          key={option.value}
                          className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 transition-colors ${
                            collectionMethod === option.value
                              ? "border-amber-400 bg-amber-50/60"
                              : "border-slate-200 bg-white hover:border-amber-300"
                          }`}
                        >
                          <input
                            type="radio"
                            name="collectionMethod"
                            value={option.value}
                            checked={collectionMethod === option.value}
                            onChange={() => setCollectionMethod(option.value)}
                            className="mt-1 h-3.5 w-3.5 accent-amber-500"
                          />
                          <span>
                            <span className="flex items-center gap-1.5 text-xs font-semibold text-navy">
                              <option.icon className="h-3.5 w-3.5 text-amber-600" />
                              {option.label}
                            </span>
                            <span className="mt-0.5 block text-[10px] text-slate-400">{option.hint}</span>
                          </span>
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  {collectionMethod === "delivery" ? (
                    <div>
                      <label htmlFor="ws-address" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Delivery address *
                      </label>
                      <input
                        id="ws-address"
                        name="deliveryAddress"
                        required
                        className={inputClass}
                        placeholder="Building, street, town / market and any delivery notes"
                      />
                    </div>
                  ) : (
                    <div className="rounded-xl border border-slate-200 bg-[#fafbfc] p-4">
                      <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                        Collection details
                      </p>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                          <label htmlFor="ws-collection-point" className="mb-1.5 block text-xs font-semibold text-slate-500">
                            Preferred collection point *
                          </label>
                          <input
                            id="ws-collection-point"
                            name="collectionPoint"
                            required
                            className={inputClass}
                            placeholder="e.g. Nairobi depot, Industrial Area — or ask the desk to advise"
                          />
                        </div>
                        <div>
                          <label htmlFor="ws-collector-name" className="mb-1.5 block text-xs font-semibold text-slate-500">
                            Person collecting *
                          </label>
                          <input
                            id="ws-collector-name"
                            name="collectionContactName"
                            required
                            className={inputClass}
                            placeholder="Full name on the ID"
                          />
                        </div>
                        <div>
                          <label htmlFor="ws-collector-phone" className="mb-1.5 block text-xs font-semibold text-slate-500">
                            Collector phone *
                          </label>
                          <input
                            id="ws-collector-phone"
                            name="collectionContactPhone"
                            type="tel"
                            required
                            className={inputClass}
                            placeholder="+254 7xx xxx xxx"
                          />
                        </div>
                        <div>
                          <label htmlFor="ws-collector-id" className="mb-1.5 block text-xs font-semibold text-slate-500">
                            ID / passport number
                          </label>
                          <input
                            id="ws-collector-id"
                            name="collectionIdNumber"
                            className={inputClass}
                            placeholder="Checked at handover"
                          />
                        </div>
                        <div>
                          <label htmlFor="ws-collector-notes" className="mb-1.5 block text-xs font-semibold text-slate-500">
                            Vehicle / collection notes
                          </label>
                          <input
                            id="ws-collector-notes"
                            name="collectionNotes"
                            className={inputClass}
                            placeholder="Pickup truck, gate access, timing"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <label htmlFor="ws-notes" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Notes for the order desk
                    </label>
                    <textarea
                      id="ws-notes"
                      name="notes"
                      rows={4}
                      className={`${inputClass} resize-none`}
                      placeholder="Brand preferences, packaging, invoicing requirements or split deliveries."
                    />
                  </div>

                  {error && (
                    <p className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                      {error}
                    </p>
                  )}

                  <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-slate-400">
                      {lines.length === 0
                        ? "Your basket is empty — add products above first."
                        : `${count} unit${count === 1 ? "" : "s"} · ${formatKes(total)} estimated`}
                    </p>
                    {onBook && (
                      <button
                        type="submit"
                        disabled={submitting || lines.length === 0}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-amber-400 to-[#E8C56A] px-6 py-3.5 text-sm font-semibold text-[#1a1305] transition-all hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ClipboardCheck className="h-4 w-4" />}
                        {submitting ? "Submitting booking..." : "Submit booking for review"}
                      </button>
                    )}
                  </div>
                  <p className="flex items-center gap-1.5 text-[10px] text-slate-400">
                    <ShieldCheck className="h-3 w-3" />
                    By submitting you are booking an order for review — not making a payment.
                  </p>
                </form>
              </div>

              {/* Form-side basket */}
              <aside className="h-fit rounded-2xl border border-slate-200 bg-[#faf7f0] p-6 lg:sticky lg:top-24">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg font-bold text-navy">Booking summary</h3>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    {lines.length} line{lines.length === 1 ? "" : "s"}
                  </span>
                </div>

                {lines.length === 0 ? (
                  <p className="mt-5 text-xs leading-relaxed text-slate-500">
                    Add products from the catalogue to see your wholesale basket here.
                  </p>
                ) : (
                  <ul className="mt-4 space-y-3">
                    {lines.map((line) => (
                      <li key={line.product.id} className="rounded-xl border border-slate-200 bg-white p-3">
                        <div className="flex justify-between gap-3">
                          <div>
                            <p className="text-xs font-semibold text-navy">{line.product.name}</p>
                            <p className="mt-0.5 text-[10px] text-slate-400">
                              {line.product.supplierName} · {line.quantity} {line.product.unit}s
                            </p>
                          </div>
                          <p className="shrink-0 text-xs font-semibold text-navy">
                            {formatKes(line.quantity * line.product.pricePerUnit)}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-2">
                          <span className="text-[10px] text-slate-400">{line.product.paymentTerms}</span>
                          <button
                            onClick={() => removeLine(line.product.id)}
                            className="text-[10px] text-slate-400 hover:text-destructive"
                          >
                            Remove
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4">
                  <span className="text-xs font-medium text-slate-500">Estimated total</span>
                  <span className="font-display text-xl font-bold text-navy">{formatKes(total)}</span>
                </div>

                <div className="mt-5 space-y-3 border-t border-slate-200 pt-4">
                  {[
                    { icon: ClipboardCheck, text: "Order desk checks stock and payment terms" },
                    { icon: Building2, text: "We confirm the business and delivery details" },
                    { icon: Truck, text: "Dispatch is scheduled only after confirmation" },
                  ].map((item) => (
                    <div key={item.text} className="flex items-start gap-2.5">
                      <item.icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" />
                      <p className="text-[11px] leading-relaxed text-slate-500">{item.text}</p>
                    </div>
                  ))}
                </div>
              </aside>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
