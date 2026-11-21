import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { useMutation, useQuery } from "convex/react";
import type { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useAuth } from "@/lib/auth";
import { useSEO } from "@/lib/seo";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  FileText,
  Image as ImageIcon,
  Loader2,
  Lock,
  Mail,
  Package,
  Pencil,
  Plus,
  Save,
  Store,
  Upload,
  XCircle,
} from "lucide-react";
import {
  FMCG_CONTACT,
  FMCG_PAYMENT_TERMS,
  formatKes,
} from "@/data/fmcg";

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 disabled:bg-slate-50 disabled:text-slate-500";

const productStatusStyles: Record<string, string> = {
  pending_review: "border-amber-200 bg-amber-50 text-amber-800",
  approved: "border-emerald-200 bg-emerald-50 text-emerald-700",
  rejected: "border-red-200 bg-red-50 text-red-700",
  archived: "border-slate-200 bg-slate-100 text-slate-500",
};

const productStatusLabels: Record<string, string> = {
  pending_review: "Pending review",
  approved: "Live",
  rejected: "Rejected",
  archived: "Archived",
};

export default function SupplierDashboard() {
  const { user } = useAuth();
  const email = user?.email ?? "";

  useSEO({
    title: "Supplier Dashboard — Manage FMCG Listings",
    description:
      "Manage your approved FMCG supplier listings, upload product images and set wholesale MOQs, pricing and payment terms.",
    path: "/supplier/dashboard",
    noindex: true,
  });

  const supplier = useQuery(api.fmcg.getSupplierByEmail, email ? { email } : "skip");
  const products = useQuery(
    api.fmcg.listSupplierProducts,
    email ? { supplierEmail: email } : "skip",
  );
  const access = useQuery(api.fmcg.portalAccess, email ? { email } : "skip");
  // Posting products is limited to admins and to accounts holding the
  // supplier role (granted by an admin when the application is approved).
  const canList =
    access === undefined ||
    access.role === "supplier" ||
    access.role === "admin" ||
    access.role === "super_admin";
  const generateUploadUrl = useMutation(api.fmcg.generateUploadUrl);
  const createProduct = useMutation(api.fmcg.createProduct);
  const updateProduct = useMutation(api.fmcg.updateProduct);
  const claimListingRole = useMutation(api.fmcg.claimSupplierListingRole);

  const formRef = useRef<HTMLFormElement>(null);
  const [formKey, setFormKey] = useState(0);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState("");
  const [editMoq, setEditMoq] = useState("");
  const [editStock, setEditStock] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  // An approved supplier who created their account after approval can claim
  // the listing role once; the server only grants it to the matching account.
  useEffect(() => {
    if (!email || supplier?.status !== "approved" || canList) return;
    void claimListingRole({ email }).catch(() => undefined);
  }, [email, supplier?.status, canList, claimListingRole]);

  async function uploadImage(file: File): Promise<Id<"_storage">> {
    const uploadUrl = await generateUploadUrl();
    const response = await fetch(uploadUrl, {
      method: "POST",
      headers: { "Content-Type": file.type || "application/octet-stream" },
      body: file,
    });
    if (!response.ok) throw new Error("Product image upload failed. Please try again.");
    const payload = (await response.json()) as { storageId?: string };
    if (!payload.storageId) throw new Error("The image upload did not return a storage id.");
    return payload.storageId as Id<"_storage">;
  }

  function startEdit(product: {
    _id: string;
    pricePerUnit: number;
    moq: number;
    stockQuantity?: number;
  }) {
    setEditingId(product._id);
    setEditPrice(String(product.pricePerUnit));
    setEditMoq(String(product.moq));
    setEditStock(product.stockQuantity === undefined ? "" : String(product.stockQuantity));
  }

  async function saveEdit(productId: Id<"fmcgProducts">) {
    setSavingEdit(true);
    try {
      await updateProduct({
        supplierEmail: email,
        actorEmail: email,
        productId,
        pricePerUnit: Number(editPrice),
        moq: Number(editMoq),
        stockQuantity: editStock.trim() === "" ? undefined : Number(editStock),
      });
      toast.success("Listing updated and sent back for review.");
      setEditingId(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update the listing.");
    } finally {
      setSavingEdit(false);
    }
  }

  async function handleAddProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supplier || supplier.status !== "approved") return;
    if (!imageFile) {
      setError("Upload a clear product image before submitting your listing.");
      return;
    }
    setError(null);
    setSubmitting(true);

    const form = new FormData(event.currentTarget);
    try {
      const imageStorageId = imageFile ? await uploadImage(imageFile) : undefined;
      await createProduct({
        supplierEmail: email,
        actorEmail: email,
        name: String(form.get("name") ?? ""),
        description: String(form.get("description") ?? "") || undefined,
        unit: String(form.get("unit") ?? ""),
        caseSize: Number(form.get("caseSize") ?? 1),
        moq: Number(form.get("moq") ?? 1),
        pricePerUnit: Number(form.get("pricePerUnit") ?? 0),
        stockQuantity:
          String(form.get("stockQuantity") ?? "").trim() === ""
            ? undefined
            : Number(form.get("stockQuantity")),
        leadTime: String(form.get("leadTime") ?? "") || undefined,
        paymentTerms: String(form.get("paymentTerms") ?? supplier.paymentTerms),
        imageStorageId,
      });
      toast.success("Product submitted for review.");
      formRef.current?.reset();
      setImageFile(null);
      setFormKey((key) => key + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add the product. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#faf7f0]">
      <Navigation />

      <section className="relative overflow-hidden bg-navy-dark pb-14 pt-32 sm:pt-36">
        <div className="absolute inset-0 bg-grid-pattern-dark opacity-40" />
        <div className="pointer-events-none absolute -right-24 top-0 h-[420px] w-[420px] rounded-full bg-amber-400/10 blur-[140px]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="mb-8 flex items-center gap-2 text-xs text-white/35" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-white/70">Home</Link>
            <span>/</span>
            <Link to="/fmcg" className="hover:text-white/70">FMCG</Link>
            <span>/</span>
            <span className="text-white/60">Supplier dashboard</span>
          </nav>

          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-amber-300">
                Supplier workspace
              </p>
              <h1 className="font-display text-3xl font-bold text-white sm:text-4xl md:text-5xl">
                {supplier ? supplier.businessName : "Your supplier account"}
              </h1>
              <p className="mt-3 flex items-center gap-2 text-sm text-white/45">
                <Mail className="h-3.5 w-3.5" /> {email}
              </p>
            </div>
            {supplier && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-amber-300/25 bg-amber-300/10 px-3 py-1.5 text-[11px] font-semibold text-amber-200">
                  <Lock className="mr-1 inline h-3 w-3" />
                  {supplier.category}
                </span>
                <Link
                  to="/supplier/register"
                  className="rounded-lg border border-white/15 px-4 py-2 text-xs font-medium text-white/70 transition-colors hover:border-white/30 hover:text-white"
                >
                  Application details
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {supplier === undefined ? (
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading your supplier account...
            </div>
          ) : supplier === null ? (
            <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-8 text-center sm:p-10">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50">
                <Store className="h-6 w-6 text-amber-600" />
              </div>
              <h2 className="font-display text-xl font-bold text-navy">No supplier account yet</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-500">
                Register your business, upload your documents and choose your
                category. Once approved, you can list products here.
              </p>
              <Link
                to="/supplier/register"
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-light"
              >
                Start registration <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <>
              {/* Status */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Account status</p>
                  <div className="mt-2">
                    {supplier.status === "approved" ? (
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700">
                        <CheckCircle2 className="h-4 w-4" /> Approved
                      </span>
                    ) : supplier.status === "pending" ? (
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-700">
                        <Clock className="h-4 w-4" /> Under review
                      </span>
                    ) : supplier.status === "rejected" ? (
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-700">
                        <XCircle className="h-4 w-4" /> Not approved
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600">
                        <XCircle className="h-4 w-4" /> Suspended
                      </span>
                    )}
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Locked category</p>
                  <p className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-navy">
                    <Lock className="h-3.5 w-3.5 text-amber-600" /> {supplier.category}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Payment terms</p>
                  <p className="mt-2 text-sm font-semibold text-navy">{supplier.paymentTerms}</p>
                </div>
              </div>

              {supplier.status === "pending" && (
                <div className="mt-5 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
                  <div>
                    <p className="text-sm font-semibold text-amber-900">Your application is being verified</p>
                    <p className="mt-1 text-xs leading-relaxed text-amber-900/70">
                      We review documents within 2–3 business days. Product listing
                      unlocks as soon as your account is approved.
                    </p>
                  </div>
                </div>
              )}

              {supplier.status === "rejected" && (
                <div className="mt-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-5">
                  <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                  <div>
                    <p className="text-sm font-semibold text-red-800">Application not approved</p>
                    <p className="mt-1 text-xs leading-relaxed text-red-800/80">
                      {supplier.reviewNotes ||
                        "Please contact the FMCG desk to review the decision and resubmit corrected documents."}
                    </p>
                    <a href={`mailto:${FMCG_CONTACT.email}`} className="mt-2 inline-block text-xs font-semibold text-red-900 underline">
                      Contact the desk
                    </a>
                  </div>
                </div>
              )}

              <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr,1.1fr]">
                {/* Add product */}
                <div className="h-fit rounded-2xl border border-slate-200 bg-white p-6 sm:p-7">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400 text-[#1a1305]">
                      <Plus className="h-4 w-4" />
                    </span>
                    <div>
                      <h2 className="font-display text-lg font-bold text-navy">Add a product</h2>
                      <p className="text-xs text-slate-400">Submitted listings go for review</p>
                    </div>
                  </div>

                  {supplier.status !== "approved" || !canList ? (
                    <div className="mt-6 rounded-xl border border-dashed border-slate-200 bg-[#fafbfc] px-4 py-8 text-center">
                      <Lock className="mx-auto mb-2 h-5 w-5 text-slate-300" />
                      <p className="text-xs leading-relaxed text-slate-500">
                        {supplier.status !== "approved"
                          ? "Product listing is available once your supplier account is approved."
                          : "Listing access is not enabled on this account yet. Ask an admin to assign the supplier role under Users, then sign in again."}
                      </p>
                    </div>
                  ) : (
                    <form key={formKey} ref={formRef} onSubmit={handleAddProduct} className="mt-6 space-y-4">
                      <div>
                        <label htmlFor="product-name" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                          Product name *
                        </label>
                        <input id="product-name" name="name" required className={inputClass} placeholder="e.g. Long Grain Rice 25kg" />
                      </div>

                      <div>
                        <label htmlFor="product-description" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                          Short description
                        </label>
                        <textarea
                          id="product-description"
                          name="description"
                          rows={3}
                          className={`${inputClass} resize-none`}
                          placeholder="Packaging, grade, shelf life or brand notes."
                        />
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label htmlFor="product-category" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                            Category (locked)
                          </label>
                          <div className="relative">
                            <input
                              id="product-category"
                              value={supplier.category}
                              readOnly
                              disabled
                              className={`${inputClass} pr-9`}
                            />
                            <Lock className="absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                          </div>
                        </div>
                        <div>
                          <label htmlFor="product-unit" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                            Selling unit *
                          </label>
                          <input id="product-unit" name="unit" required className={inputClass} placeholder="case, bag, jerrycan" />
                        </div>
                        <div>
                          <label htmlFor="product-case" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                            Units per selling unit *
                          </label>
                          <input id="product-case" name="caseSize" type="number" min={1} defaultValue={1} required className={inputClass} />
                        </div>
                        <div>
                          <label htmlFor="product-moq" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                            MOQ (units) *
                          </label>
                          <input id="product-moq" name="moq" type="number" min={1} defaultValue={10} required className={inputClass} />
                        </div>
                        <div>
                          <label htmlFor="product-price" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                            Price per unit (KES) *
                          </label>
                          <input id="product-price" name="pricePerUnit" type="number" min={1} step="0.01" required className={inputClass} placeholder="e.g. 2650" />
                        </div>
                        <div>
                          <label htmlFor="product-stock" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                            Units available now
                          </label>
                          <input id="product-stock" name="stockQuantity" type="number" min={0} className={inputClass} placeholder="e.g. 480" />
                        </div>
                        <div>
                          <label htmlFor="product-lead" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                            Lead time
                          </label>
                          <input id="product-lead" name="leadTime" className={inputClass} placeholder="e.g. 2–3 days from confirmation" />
                        </div>
                        <div>
                          <label htmlFor="product-terms" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                            Payment terms *
                          </label>
                          <select id="product-terms" name="paymentTerms" required defaultValue={supplier.paymentTerms} className={inputClass}>
                            {FMCG_PAYMENT_TERMS.map((term) => (
                              <option key={term} value={term}>{term}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                          Product image *
                        </span>
                        <label
                          htmlFor="product-image"
                          className={`flex cursor-pointer items-center gap-3 rounded-xl border border-dashed px-4 py-4 transition-colors ${
                            imageFile
                              ? "border-emerald-300 bg-emerald-50/50"
                              : "border-slate-300 bg-[#fafbfc] hover:border-amber-400"
                          }`}
                        >
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-slate-400">
                            {imageFile ? <ImageIcon className="h-4 w-4 text-emerald-600" /> : <Upload className="h-4 w-4" />}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-xs font-medium text-navy">
                              {imageFile ? imageFile.name : "Upload a clear product photo"}
                            </span>
                            <span className="mt-0.5 block text-[11px] text-slate-400">
                              Required. JPG or PNG, up to 10MB. Shown to wholesale buyers.
                            </span>
                          </span>
                        </label>
                        <input
                          id="product-image"
                          type="file"
                          accept=".jpg,.jpeg,.png"
                          className="sr-only"
                          onChange={(event) => {
                            const file = event.target.files?.[0] ?? null;
                            if (file && file.size > 10 * 1024 * 1024) {
                              toast.error("Image is larger than 10MB.");
                              return;
                            }
                            setImageFile(file);
                          }}
                        />
                      </div>

                      {error && (
                        <p className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-xs text-destructive">
                          {error}
                        </p>
                      )}

                      <button
                        type="submit"
                        disabled={submitting}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-amber-400 to-[#E8C56A] px-4 py-3 text-sm font-semibold text-[#1a1305] transition-all hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                        {submitting ? "Submitting product..." : "Submit product for review"}
                      </button>
                    </form>
                  )}
                </div>

                {/* Listings */}
                <div>
                  <div className="mb-4 flex items-end justify-between gap-3">
                    <div>
                      <h2 className="font-display text-xl font-bold text-navy">Your listings</h2>
                      <p className="mt-0.5 text-xs text-slate-400">
                        {products === undefined
                          ? "Loading..."
                          : `${products.length} product${products.length === 1 ? "" : "s"} submitted`}
                      </p>
                    </div>
                    <Link to="/wholesale" className="text-xs font-semibold text-amber-700 hover:underline">
                      View wholesale page
                    </Link>
                  </div>

                  {products === undefined ? (
                    <div className="space-y-3">
                      {[0, 1, 2].map((item) => (
                        <div key={item} className="h-24 animate-pulse rounded-2xl border border-slate-200 bg-white" />
                      ))}
                    </div>
                  ) : products.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
                      <Package className="mx-auto mb-3 h-8 w-8 text-slate-300" />
                      <p className="text-sm font-semibold text-navy">No products listed yet</p>
                      <p className="mx-auto mt-1 max-w-xs text-xs leading-relaxed text-slate-500">
                        Add your first product with pricing, MOQ and an image. The
                        order desk reviews it before it appears to buyers.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {products.map((product) => (
                        <article key={product._id} className="rounded-2xl border border-slate-200 bg-white p-4">
                          <div className="flex gap-4">
                            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                              {product.resolvedImageUrl ? (
                                <img src={product.resolvedImageUrl} alt={product.name} className="h-full w-full object-cover" />
                              ) : (
                                <div className="flex h-full items-center justify-center">
                                  <ImageIcon className="h-5 w-5 text-slate-300" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-start justify-between gap-2">
                                <div>
                                  <h3 className="text-sm font-semibold text-navy">{product.name}</h3>
                                  <p className="mt-0.5 text-[11px] text-slate-400">
                                    {product.category} · {product.caseSize > 1 ? `${product.caseSize} units per ${product.unit}` : `per ${product.unit}`}
                                  </p>
                                </div>
                                <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${productStatusStyles[product.status] ?? productStatusStyles.pending_review}`}>
                                  {productStatusLabels[product.status] ?? product.status}
                                </span>
                              </div>
                              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500">
                                <span className="font-semibold text-navy">{formatKes(product.pricePerUnit)} / {product.unit}</span>
                                <span>MOQ {product.moq}</span>
                                <span>
                                  {product.stockQuantity === undefined
                                    ? "Stock on request"
                                    : `${product.stockQuantity} in stock`}
                                </span>
                                {product.leadTime && <span>{product.leadTime}</span>}
                                <span>{product.paymentTerms}</span>
                              </div>

                              {product.status !== "archived" && (
                                editingId === product._id ? (
                                  <div className="mt-3 grid gap-2 rounded-xl border border-amber-200 bg-amber-50/50 p-3 sm:grid-cols-3">
                                    <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                                      Price
                                      <input
                                        value={editPrice}
                                        onChange={(event) => setEditPrice(event.target.value)}
                                        type="number"
                                        min={1}
                                        className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs text-navy focus:border-amber-400 focus:outline-none"
                                      />
                                    </label>
                                    <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                                      MOQ
                                      <input
                                        value={editMoq}
                                        onChange={(event) => setEditMoq(event.target.value)}
                                        type="number"
                                        min={1}
                                        className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs text-navy focus:border-amber-400 focus:outline-none"
                                      />
                                    </label>
                                    <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                                      In stock
                                      <input
                                        value={editStock}
                                        onChange={(event) => setEditStock(event.target.value)}
                                        type="number"
                                        min={0}
                                        className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs text-navy focus:border-amber-400 focus:outline-none"
                                      />
                                    </label>
                                    <div className="flex items-center gap-2 sm:col-span-3">
                                      <button
                                        onClick={() => saveEdit(product._id)}
                                        disabled={savingEdit}
                                        className="inline-flex items-center gap-1.5 rounded-md bg-navy px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-navy-light disabled:opacity-60"
                                      >
                                        {savingEdit ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
                                        Save changes
                                      </button>
                                      <button
                                        onClick={() => setEditingId(null)}
                                        className="text-[11px] font-medium text-slate-500 hover:text-navy"
                                      >
                                        Cancel
                                      </button>
                                      <span className="ml-auto text-[10px] text-slate-400">
                                        Price, MOQ and stock edits are re-reviewed.
                                      </span>
                                    </div>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => startEdit(product)}
                                    className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-semibold text-amber-700 hover:underline"
                                  >
                                    <Pencil className="h-3 w-3" /> Update price, MOQ or stock
                                  </button>
                                )
                              )}
                            </div>
                          </div>
                          {product.status === "rejected" && (
                            <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-[11px] text-red-700">
                              This listing was not approved. Contact the order desk for details.
                            </p>
                          )}
                        </article>
                      ))}
                    </div>
                  )}

                  <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
                    <div className="flex items-start gap-3">
                      <FileText className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                      <div>
                        <p className="text-xs font-semibold text-navy">How listing review works</p>
                        <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
                          Every product is checked for pricing, MOQ and image quality.
                          Approved listings appear on the{" "}
                          <Link to="/wholesale" className="font-semibold text-amber-700 hover:underline">
                            wholesale booking page
                          </Link>{" "}
                          where buyers can order in bulk.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
