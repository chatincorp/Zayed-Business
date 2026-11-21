import { useMemo, useState } from "react";
import { Link } from "react-router";
import { useMutation, useQuery } from "convex/react";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useAuth } from "@/lib/auth";
import { useSEO } from "@/lib/seo";
import { formatKes } from "@/data/fmcg";
import {
  BadgeCheck,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Clock,
  Download,
  Loader2,
  Mail,
  MapPin,
  MessageSquarePlus,
  Package,
  Phone,
  Search,
  ShieldCheck,
  ShoppingCart,
  Store,
  Truck,
  UserRound,
  Users,
} from "lucide-react";

type Order = Doc<"wholesaleOrders">;
type OrderStatus = Order["status"];
type View = "admin" | "sales" | "customer";
type CommissionSlipRow = Doc<"commissionSlips">;

const STATUS_FLOW: OrderStatus[] = [
  "pending_review",
  "confirmed",
  "processing",
  "fulfilled",
  "cancelled",
];

const statusStyles: Record<string, string> = {
  pending_review: "border-amber-300 bg-amber-50 text-amber-800",
  confirmed: "border-sky-300 bg-sky-50 text-sky-800",
  processing: "border-violet-300 bg-violet-50 text-violet-800",
  fulfilled: "border-emerald-300 bg-emerald-50 text-emerald-800",
  cancelled: "border-red-200 bg-red-50 text-red-700",
};

function prettyStatus(status: string) {
  return status.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatDate(value?: number) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function isOpen(order: Order) {
  return order.status === "pending_review" || order.status === "confirmed" || order.status === "processing";
}

export default function OrderPortal() {
  const { user } = useAuth();
  const email = user?.email ?? "";

  useSEO({
    title: "Order Portal — Bookings, Collections & Despatch",
    description:
      "Track wholesale order bookings, collection details and despatch status from one dashboard for customers, sales reps and the order desk.",
    path: "/portal",
    noindex: true,
  });

  const access = useQuery(api.fmcg.portalAccess, email ? { email } : "skip");
  const view: View = access?.view ?? "customer";

  // All three queries are declared unconditionally; only the relevant one runs.
  const adminOrders = useQuery(api.fmcg.adminListOrders, view === "admin" ? {} : "skip");
  const repDesk = useQuery(
    api.fmcg.salesRepOrders,
    view === "sales" && email ? { email } : "skip",
  );
  const myOrders = useQuery(api.fmcg.customerOrders, email ? { email } : "skip");
  const team = useQuery(api.adminRbac.listAppUsers, view === "admin" ? {} : "skip");

  const setOrderStatus = useMutation(api.fmcg.setOrderStatus);
  const assignSalesRep = useMutation(api.fmcg.assignSalesRep);
  const claimOrder = useMutation(api.fmcg.claimOrder);
  const addOrderNote = useMutation(api.fmcg.addOrderNote);
  const generateCommissionSlip = useMutation(api.fmcg.generateCommissionSlipForOrder);
  const recordCommissionPaid = useMutation(api.fmcg.recordCommissionPaid);
  const downloadCommissionSlip = useMutation(api.fmcg.downloadCommissionSlip);
  const repSlips = useQuery(
    api.fmcg.listSalesRepSlips,
    view === "sales" && email ? { email } : "skip",
  );
  const adminSlips = useQuery(
    api.fmcg.listAllCommissionSlips,
    view === "admin" && email ? { email } : "skip",
  );
  const [tab, setTab] = useState<"bookings" | "queue" | "commissions">("bookings");
  const [statusFilter, setStatusFilter] = useState<"all" | OrderStatus>("all");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const sourceOrders = useMemo<Order[]>(() => {
    if (view === "admin") return adminOrders ?? [];
    if (view === "sales") return repDesk?.mine ?? [];
    return myOrders ?? [];
  }, [view, adminOrders, repDesk, myOrders]);

  const queue: Order[] = view === "sales" ? (repDesk?.unassigned ?? []) : [];

  const stats = useMemo(() => {
    const active = sourceOrders.filter(isOpen);
    return {
      total: sourceOrders.length,
      active: active.length,
      awaiting: sourceOrders.filter((order) => order.status === "pending_review").length,
      fulfilled: sourceOrders.filter((order) => order.status === "fulfilled").length,
      value: sourceOrders
        .filter((order) => order.status !== "cancelled")
        .reduce((sum, order) => sum + order.estimatedTotal, 0),
    };
  }, [sourceOrders]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return sourceOrders.filter((order) => {
      if (statusFilter !== "all" && order.status !== statusFilter) return false;
      if (!query) return true;
      return [
        order.reference,
        order.businessName,
        order.clientName,
        order.email,
        order.county,
        order.salesRepName ?? "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
  }, [sourceOrders, search, statusFilter]);

  const loading =
    access === undefined ||
    (view === "admin" && adminOrders === undefined) ||
    (view === "sales" && repDesk === undefined) ||
    (view === "customer" && myOrders === undefined);

  const salesTeam = (team ?? []).filter(
    (member) => member.role === "sales" || member.role === "admin" || member.role === "super_admin",
  );

  const unpaidSlips = (repSlips ?? []).filter((slip) => slip.status !== "paid");
  const pendingCommissionValue = unpaidSlips.reduce(
    (sum, slip) => sum + slip.totalCommission,
    0,
  );

  async function changeStatus(order: Order, status: OrderStatus) {
    setBusyId(order._id);
    try {
      await setOrderStatus({
        id: order._id,
        status,
        author: user?.name ?? user?.email ?? "Order desk",
        actorEmail: email,
      });
      toast.success(`${order.reference} → ${prettyStatus(status)}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update the order.");
    } finally {
      setBusyId(null);
    }
  }

  async function assign(order: Order, value: string) {
    const member = salesTeam.find((item) => item.email === value);
    setBusyId(order._id);
    try {
      await assignSalesRep({
        orderId: order._id,
        repEmail: member?.email ?? undefined,
        repName: member?.name ?? undefined,
        actorEmail: email,
      });
      toast.success(member?.email ? `Assigned to ${member.name ?? member.email}.` : "Sales rep removed.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not assign the order.");
    } finally {
      setBusyId(null);
    }
  }

  async function claim(order: Order) {
    setBusyId(order._id);
    try {
      await claimOrder({
        orderId: order._id,
        repEmail: email,
        repName: user?.name ?? email,
      });
      toast.success(`${order.reference} is now yours.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not claim the order.");
    } finally {
      setBusyId(null);
    }
  }

  async function postNote(order: Order) {
    if (!noteDraft.trim()) return;
    setBusyId(order._id);
    try {
      await addOrderNote({
        orderId: order._id,
        note: noteDraft,
        author: user?.name ?? user?.email ?? "Order desk",
        actorEmail: email,
      });
      setNoteDraft("");
      toast.success("Update added to the order timeline.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not add the update.");
    } finally {
      setBusyId(null);
    }
  }

  const viewCopy: Record<View, { title: string; blurb: string; icon: typeof ShieldCheck }> = {
    admin: {
      title: "Order desk",
      blurb: "Every booking, the collections desk and sales-rep ownership in one place.",
      icon: ShieldCheck,
    },
    sales: {
      title: "Sales rep desk",
      blurb: "Your booked accounts, the shared queue and what is waiting on the order desk.",
      icon: Users,
    },
    customer: {
      title: "Your bookings",
      blurb: "Track every wholesale booking, its collection details and despatch progress.",
      icon: ShoppingCart,
    },
  };
  const copy = viewCopy[view];
  const ViewIcon = copy.icon;

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
            <Link to="/wholesale" className="hover:text-white/70">Wholesale</Link>
            <span>/</span>
            <span className="text-white/60">Order portal</span>
          </nav>

          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-300/25 bg-amber-300/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-200">
                <ViewIcon className="h-3 w-3" />
                {copy.title}
              </span>
              <h1 className="font-display text-3xl font-bold text-white sm:text-4xl md:text-5xl">
                {user?.name ? `Hello, ${user.name.split(" ")[0]}.` : "Order portal"}
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/45">{copy.blurb}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                to="/wholesale"
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-400 to-[#E8C56A] px-4 py-2.5 text-xs font-semibold text-[#1a1305] transition-all hover:brightness-105"
              >
                <ShoppingCart className="h-3.5 w-3.5" />
                New booking
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-4 py-2.5 text-xs font-medium text-white/70 transition-colors hover:border-white/30 hover:text-white"
              >
                Workspace
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Stats */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { label: "Bookings", value: stats.total, icon: ClipboardList, tone: "text-navy bg-white" },
              { label: "Active", value: stats.active, icon: Clock, tone: "text-violet-700 bg-violet-50" },
              { label: "Awaiting review", value: stats.awaiting, icon: Package, tone: "text-amber-700 bg-amber-50" },
              { label: "Fulfilled", value: stats.fulfilled, icon: CheckCircle2, tone: "text-emerald-700 bg-emerald-50" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl border border-slate-100 ${stat.tone}`}>
                  <stat.icon className="h-4 w-4" />
                </div>
                <p className="font-display text-2xl font-bold text-navy">{stat.value}</p>
                <p className="text-[11px] font-medium text-slate-500">{stat.label}</p>
              </div>
            ))}
            <div className="rounded-2xl border border-slate-800 bg-navy p-5 text-white">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-amber-300">
                <BadgeCheck className="h-4 w-4" />
              </div>
              <p className="font-display text-2xl font-bold">{formatKes(stats.value)}</p>
              <p className="text-[11px] font-medium text-white/50">Booked value</p>
            </div>
          </div>

          {/* Toolbar */}
          <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search reference, business, county or rep"
                className="w-full rounded-lg border border-slate-200 bg-[#fafbfc] py-2.5 pl-9 pr-3 text-sm text-navy placeholder:text-slate-400 focus:border-amber-400 focus:outline-none"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as "all" | OrderStatus)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs font-medium text-navy focus:border-amber-400 focus:outline-none"
              aria-label="Filter by status"
            >
              <option value="all">All statuses</option>
              {STATUS_FLOW.map((status) => (
                <option key={status} value={status}>{prettyStatus(status)}</option>
              ))}
            </select>
            {view === "sales" && (
              <div className="flex rounded-lg border border-slate-200 bg-[#fafbfc] p-1">
                <button
                  onClick={() => setTab("bookings")}
                  className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${tab === "bookings" ? "bg-navy text-white" : "text-slate-500 hover:text-navy"}`}
                >
                  My accounts
                </button>
                <button
                  onClick={() => setTab("queue")}
                  className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${tab === "queue" ? "bg-navy text-white" : "text-slate-500 hover:text-navy"}`}
                >
                  Queue {queue.length > 0 && <span className="ml-1 text-amber-600">{queue.length}</span>}
                </button>
                <button
                  onClick={() => setTab("commissions")}
                  className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${tab === "commissions" ? "bg-navy text-white" : "text-slate-500 hover:text-navy"}`}
                >
                  Commissions {pendingCommissionValue > 0 && (
                    <span className="ml-1 rounded-full bg-amber-300/20 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">
                      {formatKes(pendingCommissionValue)}
                    </span>
                  )}
                </button>
              </div>
            )}
            {view === "admin" && (
              <div className="flex rounded-lg border border-slate-200 bg-[#fafbfc] p-1">
                <button
                  onClick={() => setTab("bookings")}
                  className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${tab === "bookings" ? "bg-navy text-white" : "text-slate-500 hover:text-navy"}`}
                >
                  Orders
                </button>
                <button
                  onClick={() => setTab("commissions")}
                  className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${tab === "commissions" ? "bg-navy text-white" : "text-slate-500 hover:text-navy"}`}
                >
                  Commissions
                </button>
              </div>
            )}
          </div>

          {/* List */}
          <div className="mt-6">
            {(view === "sales" || view === "admin") && tab === "commissions" ? (
              <CommissionPanel
                slips={view === "admin" ? adminSlips ?? [] : repSlips ?? []}
                view={view}
                onMarkPaid={(slipId) => {
                  recordCommissionPaid({
                    slipId: slipId as unknown as Id<"commissionSlips">,
                    actorEmail: email,
                  }).then(() => {
                    toast.success("Commission marked paid.");
                  }).catch((error) => {
                    toast.error(
                      error instanceof Error ? error.message : "Could not mark the commission paid.",
                    );
                  });
                }}
                onDownload={async (slip) => {
                  try {
                    const result = await downloadCommissionSlip({
                      slipId: slip._id as unknown as Id<"commissionSlips">,
                      actorEmail: email,
                    });
                    const row = result.slip;
                    const label = row.referenceSlug.replace(/_/g, " ").toUpperCase();
                    const lines = row.lines
                      .map(
                        (line) =>
                          `  - ${line.name} x${line.quantity} ${line.unit} @ ${row.currency} ${line.unitPrice.toLocaleString("en-KE")} -> ${line.applicableRatePercent}% = ${row.currency} ${line.commissionAmount.toLocaleString("en-KE")}`,
                      )
                      .join("\n");
                    const body = [
                      "COMMISSION SLIP",
                      `Reference: ${label}`,
                      `Sales rep: ${row.salesRepName ?? row.salesRepEmail}`,
                      `Status: ${row.status.toUpperCase()}`,
                      `Issued: ${new Date(row.createdAt).toLocaleString("en-KE")}`,
                      row.paidAt ? `Paid: ${new Date(row.paidAt).toLocaleString("en-KE")}` : "",
                      "",
                      `Order total: ${row.currency} ${row.orderTotal.toLocaleString("en-KE")}`,
                      `Commission: ${row.currency} ${row.totalCommission.toLocaleString("en-KE")}`,
                      "",
                      "Lines:",
                      lines || "  (no commissionable lines)",
                    ]
                      .filter(Boolean)
                      .join("\n");
                    const blob = new Blob([body], { type: "text/plain;charset=utf-8" });
                    const url = URL.createObjectURL(blob);
                    const anchor = document.createElement("a");
                    anchor.href = url;
                    anchor.download = `${row.referenceSlug || "commission-slip"}.txt`;
                    document.body.appendChild(anchor);
                    anchor.click();
                    anchor.remove();
                    URL.revokeObjectURL(url);
                    toast.success("Commission slip downloaded.");
                  } catch (error) {
                    toast.error(
                      error instanceof Error ? error.message : "Could not download the commission slip.",
                    );
                  }
                }}
              />
            ) : (
              <>
              {loading ? (
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-500">
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading bookings…
                </div>
              ) : view === "sales" && tab === "queue" ? (
                <OrderList
                  orders={queue}
                  empty="The shared queue is clear — every booking has an owner."
                  view={view}
                  expanded={expanded}
                  setExpanded={setExpanded}
                  busyId={busyId}
                  salesTeam={salesTeam}
                  noteDraft={noteDraft}
                  setNoteDraft={setNoteDraft}
                  onStatus={changeStatus}
                  onAssign={assign}
                  onClaim={claim}
                  onNote={postNote}
                  onGenerateCommission={(orderId, status) => {
                    if (status !== "confirmed" && status !== "processing" && status !== "fulfilled") {
                      toast.error("Confirm the order before generating its commission slip.");
                      return;
                    }
                    generateCommissionSlip({
                      orderId: orderId as unknown as Id<"wholesaleOrders">,
                      triggeredByStatus: status,
                      actorEmail: email,
                    })
                      .then(() => toast.success("Commission slip generated."))
                      .catch((error) => {
                        toast.error(
                          error instanceof Error ? error.message : "Could not generate the commission slip.",
                        );
                      });
                  }}
                  emptyAction={<p className="text-xs text-slate-400">New bookings appear here until a rep takes them.</p>}
                />
              ) : (
                <OrderList
                  orders={filtered}
                  empty={
                    view === "customer"
                      ? "No bookings yet. Build a basket on the wholesale page and the order desk will confirm it."
                      : "No orders match this filter."
                  }
                  view={view}
                  expanded={expanded}
                  setExpanded={setExpanded}
                  busyId={busyId}
                  salesTeam={salesTeam}
                  noteDraft={noteDraft}
                  setNoteDraft={setNoteDraft}
                  onStatus={changeStatus}
                  onAssign={assign}
                  onClaim={claim}
                  onNote={postNote}
                  onGenerateCommission={(orderId, status) => {
                    if (status !== "confirmed" && status !== "processing" && status !== "fulfilled") {
                      toast.error("Confirm the order before generating its commission slip.");
                      return;
                    }
                    generateCommissionSlip({
                      orderId: orderId as unknown as Id<"wholesaleOrders">,
                      triggeredByStatus: status,
                      actorEmail: email,
                    })
                      .then(() => toast.success("Commission slip generated."))
                      .catch((error) => {
                        toast.error(
                          error instanceof Error ? error.message : "Could not generate the commission slip.",
                        );
                      });
                  }}
                  emptyAction={
                    view === "customer" ? (
                      <Link
                        to="/wholesale"
                        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-navy px-4 py-2 text-xs font-semibold text-white hover:bg-navy-light"
                      >
                        <ShoppingCart className="h-3.5 w-3.5" /> Start a booking
                      </Link>
                    ) : undefined
                  }
                />
              )}
              </>
            )}
          </div>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 text-xs leading-relaxed text-slate-500">
            <p className="flex items-center gap-2 font-semibold text-navy">
              <ShieldCheck className="h-4 w-4 text-amber-600" /> How the desk works
            </p>
            <p className="mt-2">
              A booking is a request, not a payment. The desk confirms stock, price,
              payment terms and either the delivery window or the collection point and
              collector, then moves the order through confirmed, processing and
              fulfilled. Every change is written to the order timeline.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function CommissionPanel({
  slips,
  view,
  onMarkPaid,
  onDownload,
}: {
  slips: CommissionSlipRow[];
  view: View;
  onMarkPaid: (slipId: string) => void;
  onDownload: (slip: CommissionSlipRow) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-navy">Your commission slips</p>
          <p className="mt-0.5 text-[11px] text-slate-500">
            Slips are generated from confirmed or processing orders and marked paid when
            the order is fulfilled and payment is received. Download your own slips here.
          </p>
        </div>
        <p className="rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-700">
          {slips.length} slip{slips.length === 1 ? "" : "s"} · {formatKes(
            slips.reduce((sum, slip) => sum + slip.totalCommission, 0),
          )}
        </p>
      </div>

      {slips.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
          <ClipboardList className="mx-auto mb-3 h-8 w-8 text-slate-300" />
          <p className="text-sm font-semibold text-navy">No commission slips yet</p>
          <p className="mt-1 text-xs text-slate-500">
            Assign yourself to a confirmed or processing order and the desk can generate
            a slip from it.
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {slips.map((slip) => (
            <div key={slip._id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="flex items-start justify-between gap-2 p-3">
                <div>
                  <p className="text-xs font-semibold text-navy">{slip.referenceSlug.replace(/_/g, " ").toUpperCase()}</p>
                  <p className="mt-0.5 text-[11px] text-slate-500">{slip.salesRepName ?? slip.referenceSlug}</p>
                </div>
                <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${
                  slip.status === "paid"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                    : slip.status === "issued"
                      ? "bg-sky-50 text-sky-700 border-sky-300"
                      : "bg-amber-50 text-amber-700 border-amber-300"
                }`}>
                  {slip.status === "paid" ? "Paid" : slip.status === "issued" ? "Issued" : "Pending"}
                </span>
              </div>
              <div className="border-t border-slate-100 p-3">
                <p className="text-[11px] text-slate-500">Order total</p>
                <p className="mt-0.5 text-sm font-semibold text-navy">{formatKes(slip.orderTotal)}</p>
                <p className="mt-2 text-[11px] text-slate-500">Commission earned</p>
                <p className="mt-0.5 text-base font-display font-bold text-amber-700">
                  {formatKes(slip.totalCommission)}
                </p>
                <p className="mt-2 text-[11px] text-slate-500">Issued</p>
                <p className="mt-0.5 text-[11px] text-slate-500">{formatDate(slip.createdAt)}</p>
              </div>
              <div className="border-t border-slate-100 bg-slate-50 p-3">
                <div className="flex flex-wrap gap-1.5">
                  {slip.status !== "paid" && view === "admin" && (
                    <button
                      onClick={() => onMarkPaid(slip._id)}
                      className="rounded-md bg-emerald-500/10 px-2 py-1 text-[10px] font-semibold text-emerald-700 hover:bg-emerald-500/15"
                    >
                      Mark paid
                    </button>
                  )}
                  <button
                    onClick={() => onDownload(slip)}
                    className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[10px] font-medium text-slate-600 hover:border-amber-400 disabled:opacity-50"
                  >
                    <Download className="h-3 w-3" /> Download
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function OrderList({
  orders,
  empty,
  view,
  expanded,
  setExpanded,
  busyId,
  salesTeam,
  noteDraft,
  setNoteDraft,
  onStatus,
  onAssign,
  onClaim,
  onNote,
  onGenerateCommission,
  emptyAction,
}: {
  orders: Order[];
  empty: string;
  view: View;
  expanded: string | null;
  setExpanded: (value: string | null) => void;
  busyId: string | null;
  salesTeam: Array<{ email: string | null; name: string | null }>;
  noteDraft: string;
  setNoteDraft: (value: string) => void;
  onStatus: (order: Order, status: OrderStatus) => void;
  onAssign: (order: Order, value: string) => void;
  onClaim: (order: Order) => void;
  onNote: (order: Order) => void;
  onGenerateCommission?: (orderId: string, status: OrderStatus) => void;
  emptyAction?: React.ReactNode;
}) {
  if (orders.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
        <ClipboardList className="mx-auto mb-3 h-8 w-8 text-slate-300" />
        <p className="text-sm font-semibold text-navy">{empty}</p>
        {emptyAction}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => {
        const isOpenCard = expanded === order._id;
        const isBusy = busyId === order._id;
        return (
          <article key={order._id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <button
              onClick={() => setExpanded(isOpenCard ? null : order._id)}
              className="flex w-full items-start gap-4 p-4 text-left sm:items-center"
            >
              <span className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700 sm:flex">
                <ClipboardList className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-sm font-semibold text-navy">{order.reference}</span>
                  <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${statusStyles[order.status] ?? statusStyles.pending_review}`}>
                    {prettyStatus(order.status)}
                  </span>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[10px] font-medium text-slate-600">
                    {order.collectionMethod === "pickup" ? "Collection" : "Delivery"}
                  </span>
                  {order.salesRepName && view === "admin" && (
                    <span className="rounded-full bg-violet-50 px-2.5 py-0.5 text-[10px] font-medium text-violet-700">
                      {order.salesRepName}
                    </span>
                  )}
                </span>
                <span className="mt-1 block truncate text-xs text-slate-500">
                  {order.businessName} · {order.clientName} · {order.county} · {order.items.length} line
                  {order.items.length === 1 ? "" : "s"}
                </span>
              </span>
              <span className="shrink-0 text-right">
                <span className="block font-display text-sm font-bold text-navy">{formatKes(order.estimatedTotal)}</span>
                <span className="block text-[10px] text-slate-400">{formatDate(order.createdAt)}</span>
              </span>
              <ChevronDown className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${isOpenCard ? "rotate-180" : ""}`} />
            </button>

            {isOpenCard && (
              <div className="border-t border-slate-100 bg-[#fcfbf8] p-4 sm:p-5">
                <div className="grid gap-5 lg:grid-cols-[1.25fr,1fr]">
                  <div>
                    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-400">
                            <th className="px-3 py-2 font-semibold">Product</th>
                            <th className="px-3 py-2 text-right font-semibold">Qty</th>
                            <th className="px-3 py-2 text-right font-semibold">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.items.map((item, index) => (
                            <tr key={`${order._id}-item-${index}`} className="border-b border-slate-50 last:border-0">
                              <td className="px-3 py-2">
                                <p className="text-xs font-medium text-navy">{item.name}</p>
                                <p className="text-[10px] text-slate-400">
                                  {item.supplierName} · {formatKes(item.unitPrice)}/{item.unit}
                                </p>
                              </td>
                              <td className="px-3 py-2 text-right text-[11px] text-slate-600">
                                {item.quantity} {item.unit}s
                              </td>
                              <td className="px-3 py-2 text-right text-xs font-semibold text-navy">
                                {formatKes(item.lineTotal)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-xl border border-slate-200 bg-white p-3.5">
                        <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          {order.collectionMethod === "pickup" ? <Store className="h-3 w-3" /> : <Truck className="h-3 w-3" />}
                          {order.collectionMethod === "pickup" ? "Collection" : "Delivery"}
                        </p>
                        <p className="mt-1 flex items-start gap-1 text-xs font-medium text-navy">
                          <MapPin className="mt-0.5 h-3 w-3 shrink-0 text-amber-600" />
                          {order.collectionMethod === "pickup"
                            ? order.collectionPoint || "Collection point to be confirmed"
                            : order.deliveryAddress}
                        </p>
                        <p className="mt-1 text-[11px] text-slate-500">
                          {order.county}
                          {order.preferredDate ? ` · preferred ${order.preferredDate}` : ""}
                        </p>
                      </div>

                      <div className="rounded-xl border border-slate-200 bg-white p-3.5">
                        <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          <UserRound className="h-3 w-3" /> Contact
                        </p>
                        <p className="mt-1 text-xs font-medium text-navy">{order.clientName}</p>
                        <a href={`mailto:${order.email}`} className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-500 hover:text-amber-700">
                          <Mail className="h-2.5 w-2.5" /> {order.email}
                        </a>
                        <a href={`tel:${order.phone}`} className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-500 hover:text-amber-700">
                          <Phone className="h-2.5 w-2.5" /> {order.phone}
                        </a>
                      </div>
                    </div>

                    {(order.collectionContactName || order.collectionIdNumber || order.collectionNotes) && (
                      <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50/60 p-3.5">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                          Collecting on behalf of {order.businessName}
                        </p>
                        <p className="mt-1 text-xs text-amber-900">
                          {order.collectionContactName || "Name to be confirmed"}
                          {order.collectionContactPhone ? ` · ${order.collectionContactPhone}` : ""}
                          {order.collectionIdNumber ? ` · ID ${order.collectionIdNumber}` : ""}
                        </p>
                        {order.collectionNotes && (
                          <p className="mt-1 text-[11px] text-amber-900/70">{order.collectionNotes}</p>
                        )}
                      </div>
                    )}

                    {order.notes && (
                      <p className="mt-3 rounded-xl bg-white p-3 text-[11px] leading-relaxed text-slate-500">
                        <span className="font-semibold text-navy">Buyer note: </span>
                        {order.notes}
                      </p>
                    )}
                  </div>

                  <div>
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Timeline</p>
                    <ol className="space-y-2.5 border-l border-slate-200 pl-4">
                      {(order.timeline ?? []).length === 0 ? (
                        <li className="text-[11px] text-slate-400">No updates recorded yet.</li>
                      ) : (
                        [...(order.timeline ?? [])].reverse().map((entry, index) => (
                          <li key={`${order._id}-tl-${index}`} className="relative">
                            <span className="absolute -left-[21px] top-1 h-2 w-2 rounded-full border-2 border-white bg-amber-400" />
                            <p className="text-[11px] font-semibold text-navy">{prettyStatus(entry.status)}</p>
                            {entry.note && <p className="text-[11px] leading-relaxed text-slate-500">{entry.note}</p>}
                            <p className="text-[10px] text-slate-400">
                              {entry.author} · {formatDate(entry.createdAt)}
                            </p>
                          </li>
                        ))
                      )}
                    </ol>

                    {view !== "customer" && (
                      <div className="mt-4 space-y-3">
                        <label className="block">
                          <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Status
                          </span>
                          <select
                            value={order.status}
                            disabled={isBusy}
                            onChange={(event) => onStatus(order, event.target.value as OrderStatus)}
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-navy focus:border-amber-400 focus:outline-none disabled:opacity-60"
                          >
                            {STATUS_FLOW.map((status) => (
                              <option key={status} value={status}>{prettyStatus(status)}</option>
                            ))}
                          </select>
                        </label>

                        {view === "admin" && (
                          <label className="block">
                            <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              Sales rep
                            </span>
                            <select
                              value={order.salesRepEmail ?? ""}
                              disabled={isBusy}
                              onChange={(event) => onAssign(order, event.target.value)}
                              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-navy focus:border-amber-400 focus:outline-none disabled:opacity-60"
                            >
                              <option value="">Unassigned</option>
                              {salesTeam.map((member) => (
                                <option key={member.email} value={member.email ?? ""}>
                                  {member.name ?? member.email}
                                </option>
                              ))}
                            </select>
                          </label>
                        )}
                      </div>
                    )}

                    {view === "sales" && !order.salesRepEmail && (
                      <button
                        onClick={() => onClaim(order)}
                        disabled={isBusy}
                        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-navy px-3 py-2 text-xs font-semibold text-white hover:bg-navy-light disabled:opacity-60"
                      >
                        {isBusy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Users className="h-3.5 w-3.5" />}
                        Take this order
                      </button>
                    )}

                    {view !== "customer" && (
                      <div className="mt-4">
                        <label className="mb-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          <MessageSquarePlus className="h-3 w-3" /> Add an update
                        </label>
                        <textarea
                          value={noteDraft}
                          onChange={(event) => setNoteDraft(event.target.value)}
                          rows={2}
                          placeholder="Called the buyer, stock confirmed…"
                          className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-navy placeholder:text-slate-400 focus:border-amber-400 focus:outline-none"
                        />
                        <button
                          onClick={() => onNote(order)}
                          disabled={isBusy || !noteDraft.trim()}
                          className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-navy hover:border-amber-400 disabled:opacity-50"
                        >
                          Save update
                        </button>
                      </div>
                    )}

                    {view !== "customer" && onGenerateCommission && (
                      <CommissionCard
                        onGenerate={() => onGenerateCommission(order._id, order.status)}
                        disabled={isBusy}
                      />
                    )}

                    {view === "customer" && (
                      <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3.5">
                        <p className="text-[11px] font-semibold text-navy">Need a change?</p>
                        <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
                          Reply on the booking email or call the desk with your reference and
                          we will update the order and the timeline.
                        </p>
                        <a
                          href={`mailto:fmcg@yasirzayed.com?subject=${encodeURIComponent(`Order ${order.reference}`)}`}
                          className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-semibold text-amber-700 hover:underline"
                        >
                          <Mail className="h-3 w-3" /> fmcg@yasirzayed.com
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}

function CommissionCard({
  onGenerate,
  disabled,
}: {
  onGenerate: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white p-4">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
        Commission
      </p>
      <p className="mt-1 text-[11px] text-slate-500">
        This order earns the sales rep commission set on each product, applied only when
        the booked quantity meets the product's MOQ threshold. Generate the slip from this
        order once it reaches confirmed or processing; manage and download slips from the
        commissions tab.
      </p>
      <div className="mt-3">
        <button
          onClick={onGenerate}
          disabled={disabled}
          className="rounded-md bg-sky-500/10 px-3 py-1.5 text-[11px] font-semibold text-sky-700 hover:bg-sky-500/15 disabled:opacity-50"
        >
          Generate commission slip
        </button>
      </div>
    </div>
  );
}
