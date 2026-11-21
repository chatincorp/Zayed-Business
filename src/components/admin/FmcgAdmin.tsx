import { useMemo, useRef, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import type { Id } from "@/convex/_generated/dataModel";
import type { LucideIcon } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import {
  Archive,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Clock,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  Lock,
  Mail,
  MapPin,
  Loader2,
  MessageSquare,
  Package,
  Phone,
  Plus,
  Search,
  Store,
  Truck,
  Upload,
  UserRound,
  Users,
  XCircle,
} from "lucide-react";
import { formatKes } from "@/data/fmcg";
import { useAuth } from "@/lib/auth";

type TabId = "suppliers" | "products" | "orders" | "enquiries";

type SupplierStatus = "pending" | "approved" | "rejected" | "suspended";
type ProductStatus = "pending_review" | "approved" | "rejected" | "archived";
type OrderStatus = "pending_review" | "confirmed" | "processing" | "fulfilled" | "cancelled";
type EnquiryStatus = "new" | "contacted" | "qualified" | "closed";

const supplierStatusStyles: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  approved: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  rejected: "bg-red-500/10 text-red-600 border-red-500/20",
  suspended: "bg-muted text-muted-foreground border-border",
};

const productStatusStyles: Record<string, string> = {
  pending_review: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  approved: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  rejected: "bg-red-500/10 text-red-600 border-red-500/20",
  archived: "bg-muted text-muted-foreground border-border",
};

const orderStatusStyles: Record<string, string> = {
  pending_review: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  confirmed: "bg-sky-500/10 text-sky-600 border-sky-500/20",
  processing: "bg-violet-500/10 text-violet-600 border-violet-500/20",
  fulfilled: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  cancelled: "bg-red-500/10 text-red-600 border-red-500/20",
};

const enquiryStatusStyles: Record<string, string> = {
  new: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  contacted: "bg-sky-500/10 text-sky-600 border-sky-500/20",
  qualified: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  closed: "bg-muted text-muted-foreground border-border",
};

function prettyStatus(value: string) {
  return value.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatDate(timestamp: number) {
  return new Date(timestamp).toLocaleDateString("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function StatusPill({ status, styles }: { status: string; styles: Record<string, string> }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${styles[status] ?? styles.pending}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {prettyStatus(status)}
    </span>
  );
}

export default function FmcgAdmin({ initialTab = "suppliers" }: { initialTab?: TabId }) {
  const { user } = useAuth();
  const actorEmail = user?.email ?? "";
  const [tab, setTab] = useState<TabId>(initialTab);
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const suppliers = useQuery(api.fmcg.adminListSuppliers);
  const products = useQuery(api.fmcg.adminListProducts);
  const orders = useQuery(api.fmcg.adminListOrders);
  const enquiries = useQuery(api.fmcg.adminListEnquiries);
  const appUsers = useQuery(api.adminRbac.listAppUsers);

  const setSupplierStatus = useMutation(api.fmcg.setSupplierStatus);
  const setProductStatus = useMutation(api.fmcg.setProductStatus);
  const setOrderStatus = useMutation(api.fmcg.setOrderStatus);
  const setCommissionRule = useMutation(api.fmcg.setCommissionRule);
  const commissionRules = useQuery(api.fmcg.listCommissionRules, {});
  const setEnquiryStatus = useMutation(api.fmcg.setEnquiryStatus);
  const assignSalesRep = useMutation(api.fmcg.assignSalesRep);
  const setCollectionDetails = useMutation(api.fmcg.setCollectionDetails);
  const generateUploadUrl = useMutation(api.fmcg.generateUploadUrl);
  const createProduct = useMutation(api.fmcg.createProduct);

  const composerRef = useRef<HTMLFormElement>(null);
  const [composerOpen, setComposerOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [composerBusy, setComposerBusy] = useState(false);
  const [composerError, setComposerError] = useState<string | null>(null);
  const [tiers, setTiers] = useState<Array<{ thresholdQuantity: number; ratePercent: number }>>([
    { thresholdQuantity: 10, ratePercent: 4 },
  ]);
  const [addTierThreshold, setAddTierThreshold] = useState("");
  const [addTierRate, setAddTierRate] = useState("");

  const salesTeam = (appUsers ?? []).filter(
    (member) =>
      member.role === "sales" || member.role === "admin" || member.role === "super_admin",
  );

  const normalizedQuery = query.trim().toLowerCase();

  const filteredSuppliers = useMemo(
    () =>
      (suppliers ?? []).filter((supplier) =>
        !normalizedQuery
          ? true
          : [supplier.businessName, supplier.fullName, supplier.officialEmail, supplier.category, supplier.status]
              .join(" ")
              .toLowerCase()
              .includes(normalizedQuery),
      ),
    [suppliers, normalizedQuery],
  );

  const filteredProducts = useMemo(
    () =>
      (products ?? []).filter((product) =>
        !normalizedQuery
          ? true
          : [product.name, product.supplierName, product.category, product.status, product.paymentTerms]
              .join(" ")
              .toLowerCase()
              .includes(normalizedQuery),
      ),
    [products, normalizedQuery],
  );

  const filteredOrders = useMemo(
    () =>
      (orders ?? []).filter((order) =>
        !normalizedQuery
          ? true
          : [order.reference, order.clientName, order.businessName, order.email, order.county, order.status]
              .join(" ")
              .toLowerCase()
              .includes(normalizedQuery),
      ),
    [orders, normalizedQuery],
  );

  const filteredEnquiries = useMemo(
    () =>
      (enquiries ?? []).filter((enquiry) =>
        !normalizedQuery
          ? true
          : [enquiry.name, enquiry.businessName, enquiry.email, enquiry.service, enquiry.status]
              .join(" ")
              .toLowerCase()
              .includes(normalizedQuery),
      ),
    [enquiries, normalizedQuery],
  );

  const pendingSuppliers = (suppliers ?? []).filter((supplier) => supplier.status === "pending").length;
  const liveProducts = (products ?? []).filter((product) => product.status === "approved").length;
  const pendingOrders = (orders ?? []).filter((order) => order.status === "pending_review").length;
  const newEnquiries = (enquiries ?? []).filter((enquiry) => enquiry.status === "new").length;

  const tabs: Array<{ id: TabId; label: string; icon: LucideIcon; count: number }> = [
    { id: "suppliers", label: "Suppliers", icon: Store, count: suppliers?.length ?? 0 },
    { id: "products", label: "Products", icon: Package, count: products?.length ?? 0 },
    { id: "orders", label: "Orders", icon: ClipboardList, count: orders?.length ?? 0 },
    { id: "enquiries", label: "Enquiries", icon: MessageSquare, count: enquiries?.length ?? 0 },
  ];

  async function updateSupplier(id: Id<"suppliers">, status: SupplierStatus) {
    try {
      await setSupplierStatus({ id, status, actorEmail });
      toast.success(`Supplier ${status}.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update supplier.");
    }
  }

  async function updateProduct(id: Id<"fmcgProducts">, status: ProductStatus) {
    try {
      await setProductStatus({ id, status, actorEmail });
      toast.success(`Product ${prettyStatus(status).toLowerCase()}.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update product.");
    }
  }

  async function updateOrder(id: Id<"wholesaleOrders">, status: OrderStatus) {
    try {
      await setOrderStatus({ id, status, actorEmail, author: user?.name ?? actorEmail });
      toast.success(`Order marked ${prettyStatus(status).toLowerCase()}.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update order.");
    }
  }

  async function assignRep(orderId: Id<"wholesaleOrders">, repEmail: string) {
    const member = salesTeam.find((item) => item.email === repEmail);
    try {
      await assignSalesRep({
        orderId,
        repEmail: member?.email ?? undefined,
        repName: member?.name ?? undefined,
        actorEmail,
      });
      toast.success(member?.email ? `Assigned to ${member.name ?? member.email}.` : "Sales rep removed.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not assign the order.");
    }
  }

  async function handleCreateProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const supplierEmail = String(form.get("supplierEmail") ?? "").trim();
    if (!supplierEmail) {
      setComposerError("Choose the approved supplier this product belongs to.");
      return;
    }
    if (!imageFile) {
      setComposerError("Upload a product image before posting the listing.");
      return;
    }
    setComposerError(null);
    setComposerBusy(true);
    try {
      const uploadUrl = await generateUploadUrl();
      const response = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": imageFile.type || "application/octet-stream" },
        body: imageFile,
      });
      if (!response.ok) throw new Error("Product image upload failed. Try again.");
      const payload = (await response.json()) as { storageId?: string };
      if (!payload.storageId) throw new Error("The upload did not return a storage id.");

      const posted = await createProduct({
        supplierEmail,
        actorEmail,
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
        paymentTerms: String(form.get("paymentTerms") ?? "100% on delivery"),
        imageStorageId: payload.storageId as Id<"_storage">,
      });

      if (tiers.length > 0) {
        try {
          await setCommissionRule({
            productId: posted.id,
            supplierEmail,
            currency: "KES",
            tiers,
            actorEmail,
          });
        } catch (commissionError) {
          toast.warning(
            commissionError instanceof Error
              ? commissionError.message
              : "Could not save the commission rule. Set it from the product row later.",
          );
        }
      }

      toast.success("Product posted and queued for review.");
      composerRef.current?.reset();
      setImageFile(null);
      setTiers([{ thresholdQuantity: 10, ratePercent: 4 }]);
      setAddTierThreshold("");
      setAddTierRate("");
      setComposerOpen(false);
    } catch (error) {
      setComposerError(
        error instanceof Error ? error.message : "Could not post the product.",
      );
    } finally {
      setComposerBusy(false);
    }
  }

  async function updateEnquiry(id: Id<"fmcgEnquiries">, status: EnquiryStatus) {
    try {
      await setEnquiryStatus({ id, status, actorEmail });
      toast.success(`Enquiry marked ${prettyStatus(status).toLowerCase()}.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update enquiry.");
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h1 className="text-2xl font-bold text-foreground">FMCG Commerce</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Supplier applications, product listings, wholesale order bookings and
            FMCG enquiries in one desk.
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search suppliers, orders…"
            className="w-full rounded-lg border border-border bg-card py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-electric/20"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: "Pending suppliers", value: pendingSuppliers, icon: Clock, tone: "text-amber-600 bg-amber-500/10" },
          { label: "Live products", value: liveProducts, icon: Package, tone: "text-emerald-600 bg-emerald-500/10" },
          { label: "Orders to review", value: pendingOrders, icon: ClipboardList, tone: "text-sky-600 bg-sky-500/10" },
          { label: "New enquiries", value: newEnquiries, icon: MessageSquare, tone: "text-violet-600 bg-violet-500/10" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${stat.tone}`}>
                <stat.icon className="h-4 w-4" />
              </span>
              <span className="text-2xl font-bold text-foreground">{stat.value}</span>
            </div>
            <p className="mt-2 text-[11px] font-medium text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="mb-4 flex flex-wrap gap-1 rounded-xl border border-border bg-card p-1">
        {tabs.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setTab(item.id);
              setExpanded(null);
            }}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
              tab === item.id
                ? "bg-navy text-white"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <item.icon className="h-3.5 w-3.5" />
            {item.label}
            <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${tab === item.id ? "bg-white/15 text-white" : "bg-muted text-muted-foreground"}`}>
              {item.count}
            </span>
          </button>
        ))}
      </div>

      {/* Suppliers */}
      {tab === "suppliers" && (
        <div className="space-y-3">
          {suppliers === undefined ? (
            <LoadingRows />
          ) : filteredSuppliers.length === 0 ? (
            <EmptyState icon={Store} title="No supplier applications" text="Suppliers who register through the FMCG page will appear here with their documents." />
          ) : (
            filteredSuppliers.map((supplier) => {
              const isOpen = expanded === supplier._id;
              return (
                <div key={supplier._id} className="overflow-hidden rounded-xl border border-border bg-card">
                  <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <button
                      onClick={() => setExpanded(isOpen ? null : supplier._id)}
                      className="flex flex-1 items-start gap-3 text-left"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
                        <Store className="h-5 w-5" />
                      </span>
                      <span className="min-w-0">
                        <span className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-semibold text-foreground">{supplier.businessName}</span>
                          <StatusPill status={supplier.status} styles={supplierStatusStyles} />
                        </span>
                        <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">
                          {supplier.fullName} · {supplier.officialEmail}
                        </span>
                        <span className="mt-1 flex flex-wrap items-center gap-2 text-[10px] text-muted-foreground">
                          <span className="inline-flex items-center gap-1"><Lock className="h-2.5 w-2.5" /> {supplier.category}</span>
                          <span>·</span>
                          <span>{supplier.paymentTerms}</span>
                          <span>·</span>
                          <span>{formatDate(supplier.createdAt)}</span>
                        </span>
                      </span>
                      <ChevronDown className={`ml-auto h-4 w-4 shrink-0 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
                    </button>

                    <div className="flex shrink-0 flex-wrap items-center gap-1.5">
                      {supplier.status !== "approved" && (
                        <button
                          onClick={() => updateSupplier(supplier._id, "approved")}
                          className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/10 px-2.5 py-1.5 text-[11px] font-semibold text-emerald-600 hover:bg-emerald-500/15"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                        </button>
                      )}
                      {supplier.status !== "rejected" && (
                        <button
                          onClick={() => updateSupplier(supplier._id, "rejected")}
                          className="inline-flex items-center gap-1 rounded-lg bg-red-500/10 px-2.5 py-1.5 text-[11px] font-semibold text-red-600 hover:bg-red-500/15"
                        >
                          <XCircle className="h-3.5 w-3.5" /> Reject
                        </button>
                      )}
                      {supplier.status === "approved" && (
                        <button
                          onClick={() => updateSupplier(supplier._id, "suspended")}
                          className="inline-flex items-center gap-1 rounded-lg bg-muted px-2.5 py-1.5 text-[11px] font-medium text-muted-foreground hover:text-foreground"
                        >
                          Suspend
                        </button>
                      )}
                    </div>
                  </div>

                  {isOpen && (
                    <div className="border-t border-border bg-muted/30 p-4">
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {[
                          { label: "ID number", value: supplier.idNumber },
                          { label: "Business registration no.", value: supplier.registrationNumber },
                          { label: "County permit no.", value: supplier.countyPermitNumber || "Not provided" },
                          { label: "Personal phone", value: supplier.personalPhone },
                          { label: "Company phone", value: supplier.companyPhone },
                          { label: "Payment terms", value: supplier.paymentTerms },
                          { label: "Business address", value: supplier.businessAddress },
                          { label: "Submitted", value: formatDate(supplier.createdAt) },
                          { label: "Locked category", value: supplier.category },
                        ].map((item) => (
                          <div key={item.label}>
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                              {item.label}
                            </p>
                            <p className="mt-0.5 text-xs font-medium text-foreground">{item.value}</p>
                          </div>
                        ))}
                      </div>

                      {supplier.reviewNotes && (
                        <p className="mt-4 rounded-lg bg-amber-500/10 px-3 py-2 text-xs text-amber-700">
                          Review note: {supplier.reviewNotes}
                        </p>
                      )}

                      <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
                        {supplier.documentUrls.map((url, index) => (
                          <a
                            key={`${supplier._id}-doc-${index}`}
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-[11px] font-medium text-foreground hover:border-electric/40"
                          >
                            <FileText className="h-3.5 w-3.5 text-electric" />
                            ID / CR12 document {index + 1}
                            <ExternalLink className="h-2.5 w-2.5 text-muted-foreground" />
                          </a>
                        ))}
                        {supplier.countyPermitUrl && (
                          <a
                            href={supplier.countyPermitUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-[11px] font-medium text-foreground hover:border-electric/40"
                          >
                            <FileText className="h-3.5 w-3.5 text-electric" />
                            County permit
                            <ExternalLink className="h-2.5 w-2.5 text-muted-foreground" />
                          </a>
                        )}
                        {supplier.storefrontUrl && (
                          <a
                            href={supplier.storefrontUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-[11px] font-medium text-foreground hover:border-electric/40"
                          >
                            <ImageIcon className="h-3.5 w-3.5 text-electric" />
                            Storefront image
                            <ExternalLink className="h-2.5 w-2.5 text-muted-foreground" />
                          </a>
                        )}
                        <a
                          href={`mailto:${supplier.officialEmail}`}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-[11px] font-medium text-foreground hover:border-electric/40"
                        >
                          <Mail className="h-3.5 w-3.5 text-electric" /> Email supplier
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Products */}
      {tab === "products" && (
        <div className="space-y-3">
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold text-foreground">Post a product for a supplier</h2>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  Admin accounts can list products on behalf of any approved supplier.
                  Pricing, quantity and the per-product MOQ are set here.
                </p>
              </div>
              <button
                onClick={() => setComposerOpen((open) => !open)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-navy px-3 py-2 text-[11px] font-semibold text-white hover:bg-navy-light"
              >
                <Plus className="h-3.5 w-3.5" />
                {composerOpen ? "Close" : "Add product"}
              </button>
            </div>

            {composerOpen && (
              <form ref={composerRef} onSubmit={handleCreateProduct} className="mt-4 space-y-3 border-t border-border pt-4">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:col-span-2">
                    Supplier *
                    <select name="supplierEmail" required className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-2 text-xs text-foreground">
                      <option value="">Choose an approved supplier</option>
                      {suppliers === undefined ? null : (suppliers ?? []).filter((supplier) => supplier.status === "approved").map((supplier) => (
                        <option key={supplier._id} value={supplier.officialEmail}>{supplier.businessName} — {supplier.category}</option>
                      ))}
                    </select>
                  </label>
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:col-span-2">
                    Product name *
                    <input name="name" required placeholder="e.g. Long Grain Rice 25kg" className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-2 text-xs text-foreground" />
                  </label>
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:col-span-2 lg:col-span-4">
                    Short description
                    <input name="description" placeholder="Packaging, grade, shelf life" className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-2 text-xs text-foreground" />
                  </label>
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Selling unit *
                    <input name="unit" required placeholder="case, bag" className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-2 text-xs text-foreground" />
                  </label>
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Units per case *
                    <input name="caseSize" type="number" min={1} defaultValue={1} required className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-2 text-xs text-foreground" />
                  </label>
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    MOQ (units) *
                    <input name="moq" type="number" min={1} defaultValue={10} required className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-2 text-xs text-foreground" />
                  </label>
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Price per unit (KES) *
                    <input name="pricePerUnit" type="number" min={1} step="0.01" required className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-2 text-xs text-foreground" />
                  </label>
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Quantity available
                    <input name="stockQuantity" type="number" min={0} placeholder="e.g. 480" className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-2 text-xs text-foreground" />
                  </label>
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Lead time
                    <input name="leadTime" placeholder="e.g. 2–3 days" className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-2 text-xs text-foreground" />
                  </label>
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Payment terms *
                    <select name="paymentTerms" required defaultValue="100% on delivery" className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-2 text-xs text-foreground">
                      {["100% on delivery", "30% deposit, 70% on delivery", "50% deposit, 50% on delivery", "Net 14 days", "Net 30 days"].map((term) => (
                        <option key={term} value={term}>{term}</option>
                      ))}
                    </select>
                  </label>
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:col-span-2">
                    Product image *
                    <span className="mt-1 flex items-center gap-2 rounded-lg border border-dashed border-border bg-background px-2.5 py-2 text-xs text-muted-foreground">
                      <Upload className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{imageFile ? imageFile.name : "Choose a JPG or PNG"}</span>
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        required
                        onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
                        className="sr-only"
                      />
                    </span>
                  </label>
                </div>

                {composerError && (
                  <p className="rounded-lg bg-destructive/10 px-3 py-2 text-[11px] text-destructive">{composerError}</p>
                )}

                <fieldset className="rounded-lg border border-border bg-card p-3">
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Sales-rep commission *
                  </p>
                  <p className="mb-2 text-[11px] text-muted-foreground">
                    A rep earns this rate on a line only when the booked quantity meets the
                    MOQ threshold shown. Add the threshold that activates the higher rate.
                  </p>
                  <div className="mb-2 flex flex-wrap gap-2">
                    {tiers.map((tier, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-2 py-1 text-[11px] text-foreground"
                      >
                        {tier.ratePercent}% at {tier.thresholdQuantity}+
                        <button
                          type="button"
                          onClick={() => setTiers(tiers.filter((_, i) => i !== index))}
                          className="rounded-full bg-muted px-1 text-[10px] font-medium text-muted-foreground hover:text-foreground"
                          aria-label={`Remove tier ${index + 1}`}
                        >
                          <XCircle className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <label className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                      Threshold (units)
                      <input
                        type="number"
                        min={1}
                        value={addTierThreshold}
                        onChange={(event) => setAddTierThreshold(event.target.value)}
                        placeholder="10"
                        className="rounded-md border border-border bg-background px-2 py-1 text-[11px] text-foreground w-20"
                      />
                    </label>
                    <label className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                      Rate (%)
                      <input
                        type="number"
                        min={0}
                        step={0.5}
                        value={addTierRate}
                        onChange={(event) => setAddTierRate(event.target.value)}
                        placeholder="4"
                        className="rounded-md border border-border bg-background px-2 py-1 text-[11px] text-foreground w-16"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const threshold = Number(addTierThreshold);
                        const rate = Number(addTierRate);
                        if (!Number.isFinite(threshold) || threshold < 1) {
                          toast.error("Enter a whole-number threshold of at least 1.");
                          return;
                        }
                        if (!Number.isFinite(rate) || rate < 0) {
                          toast.error("Enter a commission rate of at least 0%.");
                          return;
                        }
                        if (tiers.some((tier) => tier.thresholdQuantity === threshold)) {
                          toast.error("A tier with that threshold already exists.");
                          return;
                        }
                        setTiers([...tiers, { thresholdQuantity: threshold, ratePercent: rate }]);
                        setAddTierThreshold("");
                        setAddTierRate("");
                      }}
                      className="rounded-md border border-border bg-background px-2.5 py-1 text-[11px] font-medium text-foreground hover:bg-muted"
                    >
                      Add tier
                    </button>
                  </div>
                  <p className="mt-1.5 text-[10px] text-muted-foreground">
                    The commission applies to the sales rep on the order, not the supplier.
                    The order desk generates the slip when the order reaches confirmed or
                    processing, and marks it paid when the order is fulfilled and paid.
                  </p>
                </fieldset>

                <button
                  type="submit"
                  disabled={composerBusy}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-amber-400 to-[#E8C56A] px-4 py-2 text-[11px] font-semibold text-[#1a1305] disabled:opacity-60"
                >
                  {composerBusy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
                  {composerBusy ? "Posting…" : "Post product"}
                </button>
              </form>
            )}
          </div>

          <div className="overflow-hidden rounded-xl border border-border bg-card">
          {products === undefined ? (
            <LoadingRows />
          ) : filteredProducts.length === 0 ? (
            <EmptyState icon={Package} title="No product listings" text="Approved suppliers can add products from their supplier dashboard." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-[10px] uppercase tracking-wider text-muted-foreground">
                    <th className="px-4 py-2.5 font-semibold">Product</th>
                    <th className="px-4 py-2.5 font-semibold">Category</th>
                    <th className="px-4 py-2.5 font-semibold">Pricing</th>
                    <th className="px-4 py-2.5 font-semibold">Commission</th>
                    <th className="px-4 py-2.5 font-semibold">Payment terms</th>
                    <th className="px-4 py-2.5 font-semibold">Status</th>
                    <th className="px-4 py-2.5 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product._id} className="border-b border-border last:border-0 hover:bg-muted/20">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-muted">
                            {product.resolvedImageUrl ? (
                              <a href={product.resolvedImageUrl} target="_blank" rel="noreferrer">
                                <img src={product.resolvedImageUrl} alt={product.name} className="h-full w-full object-cover" />
                              </a>
                            ) : (
                              <div className="flex h-full items-center justify-center">
                                <ImageIcon className="h-4 w-4 text-muted-foreground/50" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-foreground">{product.name}</p>
                            <p className="text-[10px] text-muted-foreground">{product.supplierName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[11px] text-muted-foreground">{product.category}</td>
                      <td className="px-4 py-3">
                        <p className="text-xs font-semibold text-foreground">{formatKes(product.pricePerUnit)} / {product.unit}</p>
                        <p className="text-[10px] text-muted-foreground">MOQ {product.moq} · {product.caseSize} per {product.unit}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {product.stockQuantity === undefined
                            ? "Stock on request"
                            : `${product.stockQuantity} in stock`}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <CommissionCell
                          productId={product._id}
                          rules={(commissionRules ?? []).filter(
                            (rule) =>
                              rule.productId?.toString() === product._id.toString(),
                          )}
                        />
                      </td>
                      <td className="px-4 py-3 text-[11px] text-muted-foreground">{product.paymentTerms}</td>
                      <td className="px-4 py-3"><StatusPill status={product.status} styles={productStatusStyles} /></td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1.5">
                          {product.status !== "approved" && (
                            <button
                              onClick={() => updateProduct(product._id, "approved")}
                              className="rounded-md bg-emerald-500/10 px-2 py-1 text-[10px] font-semibold text-emerald-600 hover:bg-emerald-500/15"
                            >
                              Approve
                            </button>
                          )}
                          {product.status !== "rejected" && (
                            <button
                              onClick={() => updateProduct(product._id, "rejected")}
                              className="rounded-md bg-red-500/10 px-2 py-1 text-[10px] font-semibold text-red-600 hover:bg-red-500/15"
                            >
                              Reject
                            </button>
                          )}
                          {product.status === "approved" && (
                            <button
                              onClick={() => updateProduct(product._id, "archived")}
                              className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-[10px] font-medium text-muted-foreground hover:text-foreground"
                            >
                              <Archive className="h-3 w-3" /> Archive
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        </div>
      )}

      {/* Orders */}
      {tab === "orders" && (
        <div className="space-y-3">
          {orders === undefined ? (
            <LoadingRows />
          ) : filteredOrders.length === 0 ? (
            <EmptyState icon={ClipboardList} title="No wholesale orders yet" text="Bookings submitted from the wholesale page land here for review." />
          ) : (
            filteredOrders.map((order) => {
              const isOpen = expanded === order._id;
              return (
                <div key={order._id} className="overflow-hidden rounded-xl border border-border bg-card">
                  <div className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center lg:justify-between">
                    <button onClick={() => setExpanded(isOpen ? null : order._id)} className="flex flex-1 items-start gap-3 text-left">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-500/10 text-sky-600">
                        <ClipboardList className="h-5 w-5" />
                      </span>
                      <span className="min-w-0">
                        <span className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-sm font-semibold text-foreground">{order.reference}</span>
                          <StatusPill status={order.status} styles={orderStatusStyles} />
                        </span>
                        <span className="mt-0.5 block text-[11px] text-muted-foreground">
                          {order.businessName} · {order.clientName} · {order.county} ·{" "}
                          {order.collectionMethod === "pickup" ? "collection" : "delivery"}
                          {order.salesRepName ? ` · rep ${order.salesRepName}` : ""}
                        </span>
                        <span className="mt-1 flex flex-wrap items-center gap-2 text-[10px] text-muted-foreground">
                          <span>{order.items.length} line{order.items.length === 1 ? "" : "s"}</span>
                          <span>·</span>
                          <span className="font-semibold text-foreground">{formatKes(order.estimatedTotal)}</span>
                          <span>·</span>
                          <span>{formatDate(order.createdAt)}</span>
                        </span>
                      </span>
                      <ChevronDown className={`ml-auto h-4 w-4 shrink-0 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
                    </button>

                    <div className="flex shrink-0 items-center gap-2">
                      <select
                        value={order.status}
                        onChange={(event) => updateOrder(order._id, event.target.value as OrderStatus)}
                        className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-[11px] font-medium text-foreground focus:outline-none"
                        aria-label={`Update status for ${order.reference}`}
                      >
                        {(["pending_review", "confirmed", "processing", "fulfilled", "cancelled"] as OrderStatus[]).map((status) => (
                          <option key={status} value={status}>{prettyStatus(status)}</option>
                        ))}
                      </select>
                      <a
                        href={`mailto:${order.email}?subject=${encodeURIComponent(`Wholesale order ${order.reference}`)}`}
                        className="inline-flex items-center gap-1 rounded-lg bg-muted px-2.5 py-1.5 text-[11px] font-medium text-foreground hover:bg-muted/70"
                      >
                        <Mail className="h-3.5 w-3.5" /> Contact
                      </a>
                    </div>
                  </div>

                  {isOpen && (
                    <div className="border-t border-border bg-muted/30 p-4">
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Contact</p>
                          <p className="mt-0.5 text-xs font-medium text-foreground">{order.clientName}</p>
                          <p className="text-[11px] text-muted-foreground">{order.email}</p>
                          <p className="flex items-center gap-1 text-[11px] text-muted-foreground"><Phone className="h-2.5 w-2.5" /> {order.phone}</p>
                        </div>
                        <div>
                          <p className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                            {order.collectionMethod === "pickup" ? <Store className="h-3 w-3" /> : <Truck className="h-3 w-3" />}
                            {order.collectionMethod === "pickup" ? "Collection" : "Delivery"}
                          </p>
                          <p className="mt-0.5 flex items-start gap-1 text-xs text-foreground"><MapPin className="mt-0.5 h-3 w-3 shrink-0" /> {order.deliveryAddress}</p>
                          <p className="text-[11px] text-muted-foreground">{order.county}{order.preferredDate ? ` · preferred ${order.preferredDate}` : ""}</p>
                        </div>
                        <div>
                          <p className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                            <UserRound className="h-3 w-3" /> Collector
                          </p>
                          <p className="mt-0.5 text-xs text-foreground">
                            {order.collectionContactName || "—"}
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            {order.collectionContactPhone || "No collector phone"}
                            {order.collectionIdNumber ? ` · ID ${order.collectionIdNumber}` : ""}
                          </p>
                          {order.collectionNotes && (
                            <p className="mt-0.5 text-[11px] text-muted-foreground">{order.collectionNotes}</p>
                          )}
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Notes</p>
                          <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">{order.notes || "No notes provided."}</p>
                        </div>
                        <div>
                          <p className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                            <Users className="h-3 w-3" /> Sales rep
                          </p>
                          <select
                            value={order.salesRepEmail ?? ""}
                            onChange={(event) => assignRep(order._id, event.target.value)}
                            className="mt-1 w-full rounded-lg border border-border bg-background px-2 py-1.5 text-[11px] font-medium text-foreground focus:outline-none"
                            aria-label={`Sales rep for ${order.reference}`}
                          >
                            <option value="">Unassigned</option>
                            {salesTeam.map((member) => (
                              <option key={member.email} value={member.email ?? ""}>
                                {member.name ?? member.email}
                              </option>
                            ))}
                          </select>
                          {order.internalNotes && (
                            <p className="mt-2 whitespace-pre-line rounded-md bg-muted px-2 py-1.5 text-[10px] text-muted-foreground">
                              {order.internalNotes}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 overflow-hidden rounded-lg border border-border bg-card">
                        <table className="w-full min-w-[520px] text-left">
                          <thead>
                            <tr className="border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground">
                              <th className="px-3 py-2 font-semibold">Product</th>
                              <th className="px-3 py-2 font-semibold">Supplier</th>
                              <th className="px-3 py-2 text-right font-semibold">Qty</th>
                              <th className="px-3 py-2 text-right font-semibold">Unit price</th>
                              <th className="px-3 py-2 text-right font-semibold">Line total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {order.items.map((item, index) => (
                              <tr key={`${order._id}-${index}`} className="border-b border-border last:border-0">
                                <td className="px-3 py-2 text-xs font-medium text-foreground">{item.name}</td>
                                <td className="px-3 py-2 text-[11px] text-muted-foreground">{item.supplierName}</td>
                                <td className="px-3 py-2 text-right text-[11px] text-muted-foreground">{item.quantity} {item.unit}s</td>
                                <td className="px-3 py-2 text-right text-[11px] text-muted-foreground">{formatKes(item.unitPrice)}</td>
                                <td className="px-3 py-2 text-right text-xs font-semibold text-foreground">{formatKes(item.lineTotal)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <CollectionEditor
                        order={order}
                        onSave={async (values) => {
                          try {
                            await setCollectionDetails({
                              orderId: order._id,
                              ...values,
                              actorEmail,
                            });
                            toast.success("Collection details saved.");
                          } catch (error) {
                            toast.error(
                              error instanceof Error ? error.message : "Could not save collection details.",
                            );
                          }
                        }}
                      />

                      <p className="mt-3 text-[10px] text-muted-foreground">
                        Booking only — no payment was processed online. Confirm payment
                        terms directly with the client before dispatch.
                      </p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Enquiries */}
      {tab === "enquiries" && (
        <div className="grid gap-3 lg:grid-cols-2">
          {enquiries === undefined ? (
            <div className="lg:col-span-2"><LoadingRows /></div>
          ) : filteredEnquiries.length === 0 ? (
            <div className="lg:col-span-2">
              <EmptyState icon={MessageSquare} title="No FMCG enquiries" text="Briefs submitted through the FMCG services page appear here." />
            </div>
          ) : (
            filteredEnquiries.map((enquiry) => (
              <article key={enquiry._id} className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{enquiry.businessName}</p>
                    <p className="text-[11px] text-muted-foreground">{enquiry.name} · {enquiry.email}</p>
                    <p className="flex items-center gap-1 text-[11px] text-muted-foreground"><Phone className="h-2.5 w-2.5" /> {enquiry.phone}</p>
                  </div>
                  <StatusPill status={enquiry.status} styles={enquiryStatusStyles} />
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-electric/10 px-2.5 py-0.5 text-[10px] font-semibold text-electric">{enquiry.service}</span>
                  {enquiry.monthlyVolume && (
                    <span className="rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground">{enquiry.monthlyVolume}</span>
                  )}
                  <span className="rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground">{formatDate(enquiry.createdAt)}</span>
                </div>

                <p className="mt-3 rounded-lg bg-muted/40 p-3 text-[11px] leading-relaxed text-muted-foreground">
                  {enquiry.message}
                </p>

                <div className="mt-3 flex items-center justify-between gap-2">
                  <a
                    href={`mailto:${enquiry.email}?subject=${encodeURIComponent(`FMCG enquiry — ${enquiry.service}`)}`}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-navy px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-navy-light"
                  >
                    <Mail className="h-3 w-3" /> Reply
                  </a>
                  <select
                    value={enquiry.status}
                    onChange={(event) => updateEnquiry(enquiry._id, event.target.value as EnquiryStatus)}
                    className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-[11px] font-medium text-foreground focus:outline-none"
                    aria-label={`Update status for ${enquiry.businessName}`}
                  >
                    {(["new", "contacted", "qualified", "closed"] as EnquiryStatus[]).map((status) => (
                      <option key={status} value={status}>{prettyStatus(status)}</option>
                    ))}
                  </select>
                </div>
              </article>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function CollectionEditor({
  order,
  onSave,
}: {
  order: {
    collectionMethod?: "delivery" | "pickup";
    collectionPoint?: string;
    collectionContactName?: string;
    collectionContactPhone?: string;
    collectionIdNumber?: string;
    collectionNotes?: string;
    deliveryAddress: string;
  };
  onSave: (values: {
    collectionMethod: "delivery" | "pickup";
    collectionPoint: string;
    collectionContactName?: string;
    collectionContactPhone?: string;
    collectionIdNumber?: string;
    collectionNotes?: string;
  }) => Promise<void>;
}) {
  const [method, setMethod] = useState<"delivery" | "pickup">(order.collectionMethod ?? "delivery");
  const [point, setPoint] = useState(order.collectionPoint ?? order.deliveryAddress);
  const [contactName, setContactName] = useState(order.collectionContactName ?? "");
  const [contactPhone, setContactPhone] = useState(order.collectionContactPhone ?? "");
  const [idNumber, setIdNumber] = useState(order.collectionIdNumber ?? "");
  const [notes, setNotes] = useState(order.collectionNotes ?? "");
  const [saving, setSaving] = useState(false);

  return (
    <div className="mt-4 rounded-lg border border-border bg-card p-3">
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        Confirm handover
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        <select
          value={method}
          onChange={(event) => setMethod(event.target.value as "delivery" | "pickup")}
          className="rounded-lg border border-border bg-background px-2 py-1.5 text-[11px] text-foreground focus:outline-none"
          aria-label="Collection method"
        >
          <option value="delivery">Delivery</option>
          <option value="pickup">Collection</option>
        </select>
        <input
          value={point}
          onChange={(event) => setPoint(event.target.value)}
          placeholder="Collection point / delivery address"
          className="rounded-lg border border-border bg-background px-2 py-1.5 text-[11px] text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
        />
        <input
          value={contactName}
          onChange={(event) => setContactName(event.target.value)}
          placeholder="Collector name"
          className="rounded-lg border border-border bg-background px-2 py-1.5 text-[11px] text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
        />
        <input
          value={contactPhone}
          onChange={(event) => setContactPhone(event.target.value)}
          placeholder="Collector phone"
          className="rounded-lg border border-border bg-background px-2 py-1.5 text-[11px] text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
        />
        <input
          value={idNumber}
          onChange={(event) => setIdNumber(event.target.value)}
          placeholder="ID / passport number"
          className="rounded-lg border border-border bg-background px-2 py-1.5 text-[11px] text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
        />
        <input
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Vehicle / gate access / timing"
          className="rounded-lg border border-border bg-background px-2 py-1.5 text-[11px] text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
        />
      </div>
      <button
        onClick={async () => {
          if (!point.trim()) {
            toast.error("Enter the collection point or delivery address.");
            return;
          }
          setSaving(true);
          await onSave({
            collectionMethod: method,
            collectionPoint: point,
            collectionContactName: contactName || undefined,
            collectionContactPhone: contactPhone || undefined,
            collectionIdNumber: idNumber || undefined,
            collectionNotes: notes || undefined,
          });
          setSaving(false);
        }}
        disabled={saving}
        className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-navy px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-navy-light disabled:opacity-60"
      >
        {saving ? <Clock className="h-3 w-3 animate-spin" /> : <CheckCircle2 className="h-3 w-3" />}
        Save handover details
      </button>
    </div>
  );
}

function CommissionCell({
  productId,
  rules,
}: {
  productId: string;
  rules: Array<{
    productId: { toString: () => string };
    tiers: Array<{ thresholdQuantity: number; ratePercent: number }>;
  }>;
}) {
  const productRules = rules.filter(
    (rule) => rule.productId.toString() === productId,
  );
  const topRule = productRules[productRules.length - 1];
  const bestRule = productRules
    .filter((rule) => rule.tiers.length > 0)
    .sort((a, b) => {
      const aThreshold = a.tiers[a.tiers.length - 1]?.thresholdQuantity ?? 0;
      const bThreshold = b.tiers[b.tiers.length - 1]?.thresholdQuantity ?? 0;
      return bThreshold - aThreshold;
    })[0];
  const displayRule = bestRule ?? topRule;
  const tier = displayRule?.tiers[displayRule.tiers.length - 1];

  return (
    <div className="flex flex-col gap-1">
      {!tier ? (
        <span className="rounded-full border border-dashed border-muted-foreground/30 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
          No rule set
        </span>
      ) : (
        <>
          <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
            {tier.ratePercent}% at MOQ {tier.thresholdQuantity}+
          </span>
        </>
      )}
    </div>
  );
}

function LoadingRows() {
  return (
    <div className="space-y-2 rounded-xl border border-border bg-card p-4">
      {[0, 1, 2].map((row) => (
        <div key={row} className="h-14 animate-pulse rounded-lg bg-muted" />
      ))}
    </div>
  );
}

function EmptyState({ icon: Icon, title, text }: { icon: LucideIcon; title: string; text: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-card px-6 py-14 text-center">
      <Icon className="mx-auto mb-3 h-7 w-7 text-muted-foreground/40" />
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-muted-foreground">{text}</p>
    </div>
  );
}
