import { useState } from "react";
import { Link } from "react-router";
import { useMutation, useQuery } from "convex/react";
import type { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useAuth } from "@/lib/auth";
import { useSEO } from "@/lib/seo";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock,
  FileCheck2,
  FileText,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  Store,
  Upload,
  UserRound,
  XCircle,
} from "lucide-react";
import { FMCG_CATEGORIES, FMCG_CONTACT, FMCG_PAYMENT_TERMS } from "@/data/fmcg";

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 disabled:bg-slate-50 disabled:text-slate-500";

const MAX_FILE_BYTES = 10 * 1024 * 1024;

type DocKey = "directorIds" | "cr12" | "permit" | "storefront";

function SupplierStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "border-amber-200 bg-amber-50 text-amber-800",
    approved: "border-emerald-200 bg-emerald-50 text-emerald-700",
    rejected: "border-red-200 bg-red-50 text-red-700",
    suspended: "border-slate-200 bg-slate-100 text-slate-600",
  };
  const labels: Record<string, string> = {
    pending: "Under review",
    approved: "Approved",
    rejected: "Not approved",
    suspended: "Suspended",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold ${map[status] ?? map.pending}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {labels[status] ?? status}
    </span>
  );
}

function FileField({
  id,
  label,
  hint,
  accept = ".pdf,.jpg,.jpeg,.png",
  multiple = false,
  files,
  onChange,
}: {
  id: string;
  label: string;
  hint: string;
  accept?: string;
  multiple?: boolean;
  files: File[];
  onChange: (files: File[]) => void;
}) {
  const [error, setError] = useState<string | null>(null);

  function handleSelection(selected: FileList | null) {
    if (!selected || selected.length === 0) return;
    const next = Array.from(selected);
    const tooLarge = next.find((file) => file.size > MAX_FILE_BYTES);
    if (tooLarge) {
      setError(`${tooLarge.name} is larger than 10MB. Compress it or upload a smaller scan.`);
      return;
    }
    setError(null);
    onChange(multiple ? [...files, ...next] : [next[0]]);
  }

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </label>
      <label
        htmlFor={id}
        className={`flex cursor-pointer items-start gap-3 rounded-xl border border-dashed px-4 py-4 transition-colors ${
          files.length > 0
            ? "border-emerald-300 bg-emerald-50/50"
            : "border-slate-300 bg-[#fafbfc] hover:border-amber-400 hover:bg-amber-50/30"
        }`}
      >
        <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${files.length > 0 ? "bg-emerald-500/10 text-emerald-600" : "bg-white text-slate-400"}`}>
          {files.length > 0 ? <FileCheck2 className="h-4 w-4" /> : <Upload className="h-4 w-4" />}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-xs font-medium text-navy">
            {files.length > 0
              ? files.map((file) => file.name).join(", ")
              : "Choose file or drag it here"}
          </span>
          <span className="mt-1 block text-[11px] leading-relaxed text-slate-400">{hint}</span>
        </span>
      </label>
      <input
        id={id}
        type="file"
        accept={accept}
        multiple={multiple}
        className="sr-only"
        onChange={(event) => {
          handleSelection(event.target.files);
          event.target.value = "";
        }}
      />
      {error && <p className="mt-1.5 text-[11px] text-destructive">{error}</p>}
    </div>
  );
}

export default function SupplierRegister() {
  const { user } = useAuth();
  const email = user?.email ?? "";

  useSEO({
    title: "Supplier Registration — List Your FMCG Products",
    description:
      "Register your FMCG business with Yasir Zayed. Submit your identity, business registration, director IDs or CR12, county permit and storefront image to list products for wholesale buyers.",
    path: "/supplier/register",
    noindex: true,
  });

  const existing = useQuery(api.fmcg.getSupplierByEmail, email ? { email } : "skip");
  const generateUploadUrl = useMutation(api.fmcg.generateUploadUrl);
  const registerSupplier = useMutation(api.fmcg.registerSupplier);

  const [category, setCategory] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("");
  const [categoryConfirmed, setCategoryConfirmed] = useState(false);
  const [documents, setDocuments] = useState<Record<DocKey, File[]>>({
    directorIds: [],
    cr12: [],
    permit: [],
    storefront: [],
  });
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<{ category: string } | null>(null);

  function setDoc(key: DocKey, files: File[]) {
    setDocuments((current) => ({ ...current, [key]: files }));
  }

  async function uploadFile(file: File): Promise<Id<"_storage">> {
    const uploadUrl = await generateUploadUrl();
    const response = await fetch(uploadUrl, {
      method: "POST",
      headers: { "Content-Type": file.type || "application/octet-stream" },
      body: file,
    });
    if (!response.ok) throw new Error(`Upload failed for ${file.name}. Please try again.`);
    const payload = (await response.json()) as { storageId?: string };
    if (!payload.storageId) throw new Error(`Upload did not return a storage id for ${file.name}.`);
    return payload.storageId as Id<"_storage">;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!email) {
      setError("Your account email is missing. Sign out and sign in again.");
      return;
    }
    if (!category) {
      setError("Select the service category you are registering under.");
      return;
    }
    if (!categoryConfirmed) {
      setError("Confirm that you understand your category cannot be changed after submission.");
      return;
    }
    if (documents.directorIds.length === 0) {
      setError("Attach the director(s) ID copy.");
      return;
    }
    if (documents.cr12.length === 0) {
      setError("Attach the CR12 or business registration certificate.");
      return;
    }
    if (documents.permit.length === 0) {
      setError("Attach the county business permit.");
      return;
    }
    if (documents.storefront.length === 0) {
      setError("Attach a photo of your business storefront.");
      return;
    }

    const form = new FormData(event.currentTarget);
    setSubmitting(true);
    try {
      setStep("Uploading director IDs...");
      const directorIdStorage = await Promise.all(
        documents.directorIds.map((file) => uploadFile(file)),
      );
      setStep("Uploading CR12 / registration...");
      const cr12Storage = await Promise.all(documents.cr12.map((file) => uploadFile(file)));
      setStep("Uploading county permit...");
      const permitStorage = await uploadFile(documents.permit[0]);
      setStep("Uploading storefront image...");
      const storefrontStorage = await uploadFile(documents.storefront[0]);

      setStep("Submitting your application...");
      await registerSupplier({
        fullName: String(form.get("fullName") ?? ""),
        idNumber: String(form.get("idNumber") ?? ""),
        businessName: String(form.get("businessName") ?? ""),
        businessAddress: String(form.get("businessAddress") ?? ""),
        officialEmail: email,
        registrationNumber: String(form.get("registrationNumber") ?? ""),
        countyPermitNumber: String(form.get("countyPermitNumber") ?? ""),
        countyPermitStorageId: permitStorage,
        documentStorageIds: [...directorIdStorage, ...cr12Storage],
        personalPhone: String(form.get("personalPhone") ?? ""),
        companyPhone: String(form.get("companyPhone") ?? ""),
        storefrontStorageId: storefrontStorage,
        category,
        paymentTerms,
      });
      setSubmitted({ category });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit your application. Please try again.");
    } finally {
      setSubmitting(false);
      setStep(null);
    }
  }

  return (
    <div className="min-h-screen bg-[#faf7f0]">
      <Navigation />

      <section className="relative overflow-hidden border-b border-slate-200 bg-white pb-12 pt-32 sm:pt-36">
        <div className="pointer-events-none absolute -right-32 top-10 h-[380px] w-[380px] rounded-full bg-amber-100/60 blur-[130px]" />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <nav className="mb-8 flex items-center gap-2 text-xs text-slate-400" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-slate-700">Home</Link>
            <span>/</span>
            <Link to="/fmcg" className="hover:text-slate-700">FMCG</Link>
            <span>/</span>
            <span className="text-slate-600">Supplier registration</span>
          </nav>

          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-300/60 bg-amber-50 px-3.5 py-1.5">
                <Store className="h-3.5 w-3.5 text-amber-700" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-800">
                  Supplier onboarding
                </span>
              </div>
              <h1 className="font-display text-3xl font-bold leading-tight text-navy sm:text-4xl md:text-5xl">
                Register your business.
                <br />
                <span className="text-amber-600">List your products.</span>
              </h1>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                Join the FMCG supply base. Complete the account and business details
                below, attach the required documents, and choose the category your
                products will be listed under.
              </p>
            </div>
            <div className="shrink-0 rounded-xl border border-slate-200 bg-[#fafbfc] px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Signed in as</p>
              <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-navy">
                <Mail className="h-3.5 w-3.5 text-amber-600" /> {email}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {existing === undefined ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-10">
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin" /> Checking your supplier account...
              </div>
            </div>
          ) : submitted ? (
            <div className="rounded-2xl border border-emerald-200 bg-white p-8 text-center sm:p-12">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
                <CheckCircle2 className="h-8 w-8 text-emerald-600" />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-700">
                Application submitted
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold text-navy sm:text-3xl">
                Your documents are with our team.
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-slate-600">
                We will verify your business registration, documents and storefront,
                then approve your account. Once approved you can list products from
                your supplier dashboard.
              </p>

              <div className="mx-auto mt-6 max-w-md rounded-xl border border-amber-200 bg-amber-50 p-4 text-left">
                <div className="flex items-start gap-2.5">
                  <Lock className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
                  <div>
                    <p className="text-xs font-semibold text-amber-900">
                      {submitted.category} is now your locked category
                    </p>
                    <p className="mt-1 text-[11px] leading-relaxed text-amber-900/70">
                      It cannot be changed after submission. All your products will be
                      listed under this category.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  to="/supplier/dashboard"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-light"
                >
                  Open supplier dashboard <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/fmcg"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-navy hover:border-amber-400"
                >
                  Back to FMCG
                </Link>
              </div>
            </div>
          ) : existing ? (
            <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                      Existing application
                    </p>
                    <h2 className="mt-1 font-display text-2xl font-bold text-navy">
                      {existing.businessName}
                    </h2>
                  </div>
                  <SupplierStatusBadge status={existing.status} />
                </div>

                <dl className="mt-6 grid gap-4 sm:grid-cols-2">
                  {[
                    { label: "Account email", value: existing.officialEmail },
                    { label: "Full name", value: existing.fullName },
                    { label: "Locked category", value: existing.category },
                    { label: "Payment terms", value: existing.paymentTerms },
                    {
                      label: "Submitted",
                      value: new Date(existing.createdAt).toLocaleDateString("en-KE", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }),
                    },
                    { label: "Business location", value: existing.businessAddress },
                  ].map((item) => (
                    <div key={item.label} className="border-t border-slate-100 pt-3">
                      <dt className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        {item.label}
                      </dt>
                      <dd className="mt-1 text-sm font-medium text-navy">{item.value}</dd>
                    </div>
                  ))}
                </dl>

                {existing.status === "pending" && (
                  <div className="mt-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
                    <Clock className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
                    <p className="text-xs leading-relaxed text-amber-900/75">
                      Your application is under review. We verify documents within
                      2–3 business days. You will be able to add products once approved.
                    </p>
                  </div>
                )}
                {existing.status === "approved" && (
                  <div className="mt-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    <p className="text-xs leading-relaxed text-emerald-800">
                      Your supplier account is approved. Head to the dashboard to list
                      products, upload images and set payment terms.
                    </p>
                  </div>
                )}
                {existing.status === "rejected" && (
                  <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                    <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                    <div>
                      <p className="text-xs font-medium leading-relaxed text-red-800">
                        This application was not approved. Contact the FMCG desk to
                        review the decision and resubmit with corrected documents.
                      </p>
                      {existing.reviewNotes && (
                        <p className="mt-2 text-xs font-semibold text-red-900">
                          Reviewer note: {existing.reviewNotes}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div className="mt-7 flex flex-wrap gap-3">
                  <Link
                    to="/supplier/dashboard"
                    className="inline-flex items-center gap-2 rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-light"
                  >
                    Go to dashboard <ArrowRight className="h-4 w-4" />
                  </Link>
                  <a
                    href={`mailto:${FMCG_CONTACT.email}`}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-navy hover:border-amber-400"
                  >
                    Contact the desk
                  </a>
                </div>
              </div>

              <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-amber-600" />
                  <h3 className="font-display text-base font-bold text-navy">Locked category</h3>
                </div>
                <p className="mt-2 text-sm font-semibold text-amber-700">{existing.category}</p>
                <p className="mt-2 text-xs leading-relaxed text-slate-500">
                  This was selected when the account was registered and cannot be
                  changed. If your business genuinely needs to list across categories,
                  contact the desk before adding products.
                </p>

                <div className="mt-5 border-t border-slate-100 pt-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Documents received
                  </p>
                  <ul className="mt-3 space-y-2">
                    <li className="flex items-center gap-2 text-xs text-slate-600">
                      <FileText className="h-3.5 w-3.5 text-emerald-600" />
                      {existing.documentUrls.length} ID / registration document
                      {existing.documentUrls.length === 1 ? "" : "s"}
                    </li>
                    <li className="flex items-center gap-2 text-xs text-slate-600">
                      <FileText className="h-3.5 w-3.5 text-emerald-600" />
                      County permit {existing.countyPermitUrl ? "attached" : "missing"}
                    </li>
                    <li className="flex items-center gap-2 text-xs text-slate-600">
                      <Store className="h-3.5 w-3.5 text-emerald-600" />
                      Storefront {existing.storefrontUrl ? "attached" : "missing"}
                    </li>
                  </ul>
                </div>
              </aside>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1fr,300px] lg:gap-8">
              <div className="space-y-6">
                {/* Account */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
                  <div className="mb-6 flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy text-white">
                      <UserRound className="h-4 w-4" />
                    </span>
                    <div>
                      <h2 className="font-display text-lg font-bold text-navy">Account & identity</h2>
                      <p className="text-xs text-slate-400">Tied to your signed-in account</p>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label htmlFor="officialEmail" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Official email *
                      </label>
                      <div className="relative">
                        <input
                          id="officialEmail"
                          type="email"
                          value={email}
                          readOnly
                          disabled
                          className={`${inputClass} pr-10`}
                        />
                        <Lock className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      </div>
                      <p className="mt-1.5 text-[11px] text-slate-400">
                        Your registered account email. Contact support if it is wrong.
                      </p>
                    </div>
                    <div>
                      <label htmlFor="fullName" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Full name *
                      </label>
                      <input
                        id="fullName"
                        name="fullName"
                        required
                        defaultValue={user?.name ?? ""}
                        className={inputClass}
                        placeholder="As shown on your ID"
                      />
                    </div>
                    <div>
                      <label htmlFor="idNumber" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                        ID number *
                      </label>
                      <input
                        id="idNumber"
                        name="idNumber"
                        required
                        className={inputClass}
                        placeholder="National ID / passport number"
                      />
                    </div>
                  </div>
                </div>

                {/* Business */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
                  <div className="mb-6 flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy text-white">
                      <Building2 className="h-4 w-4" />
                    </span>
                    <div>
                      <h2 className="font-display text-lg font-bold text-navy">Business details</h2>
                      <p className="text-xs text-slate-400">As they appear on your registration documents</p>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label htmlFor="businessName" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Business name *
                      </label>
                      <input id="businessName" name="businessName" required className={inputClass} placeholder="Registered business or trading name" />
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="businessAddress" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Business location address *
                      </label>
                      <textarea
                        id="businessAddress"
                        name="businessAddress"
                        required
                        rows={3}
                        className={`${inputClass} resize-none`}
                        placeholder="Street, building, market, town and county"
                      />
                    </div>
                    <div>
                      <label htmlFor="registrationNumber" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Company / business registration no. *
                      </label>
                      <input id="registrationNumber" name="registrationNumber" required className={inputClass} placeholder="e.g. CPR/2019/123456" />
                    </div>
                    <div>
                      <label htmlFor="countyPermitNumber" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                        County business permit no.
                      </label>
                      <input id="countyPermitNumber" name="countyPermitNumber" className={inputClass} placeholder="Permit / licence number" />
                    </div>
                    <div>
                      <label htmlFor="personalPhone" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Personal contact number *
                      </label>
                      <input id="personalPhone" name="personalPhone" type="tel" required className={inputClass} placeholder="+254 7xx xxx xxx" />
                    </div>
                    <div>
                      <label htmlFor="companyPhone" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Company contact number *
                      </label>
                      <input id="companyPhone" name="companyPhone" type="tel" required className={inputClass} placeholder="+254 7xx xxx xxx" />
                    </div>
                  </div>
                </div>

                {/* Category & terms */}
                <div className="rounded-2xl border border-amber-200 bg-white p-6 sm:p-8">
                  <div className="mb-5 flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400 text-[#1a1305]">
                      <Lock className="h-4 w-4" />
                    </span>
                    <div>
                      <h2 className="font-display text-lg font-bold text-navy">Category & payment terms</h2>
                      <p className="text-xs text-slate-400">Your category is permanent after submission</p>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="category" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Service category *
                      </label>
                      <select
                        id="category"
                        required
                        value={category}
                        onChange={(event) => {
                          setCategory(event.target.value);
                          setCategoryConfirmed(false);
                        }}
                        className={inputClass}
                      >
                        <option value="" disabled>Select your category</option>
                        {FMCG_CATEGORIES.map((item) => (
                          <option key={item} value={item}>{item}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="paymentTerms" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Preferred payment terms *
                      </label>
                      <select
                        id="paymentTerms"
                        required
                        value={paymentTerms}
                        onChange={(event) => setPaymentTerms(event.target.value)}
                        className={inputClass}
                      >
                        <option value="" disabled>Select payment terms</option>
                        {FMCG_PAYMENT_TERMS.map((item) => (
                          <option key={item} value={item}>{item}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
                    <label htmlFor="categoryConfirmed" className="flex cursor-pointer items-start gap-3">
                      <input
                        id="categoryConfirmed"
                        type="checkbox"
                        required
                        checked={categoryConfirmed}
                        onChange={(event) => setCategoryConfirmed(event.target.checked)}
                        className="mt-0.5 h-4 w-4 shrink-0 rounded border-amber-400 accent-amber-600"
                      />
                      <span className="text-[11px] leading-relaxed text-amber-900/80">
                        I understand that the category selected above is{" "}
                        <strong>locked after submission</strong> and cannot be changed.
                        All products I list will be categorised under it.
                      </span>
                    </label>
                  </div>
                </div>

                {/* Documents */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
                  <div className="mb-6 flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy text-white">
                      <FileCheck2 className="h-4 w-4" />
                    </span>
                    <div>
                      <h2 className="font-display text-lg font-bold text-navy">Supporting documents</h2>
                      <p className="text-xs text-slate-400">PDF, JPG or PNG · up to 10MB per file</p>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FileField
                      id="directorIds"
                      label="Directors' ID copies *"
                      hint="Front and back, or a combined scan. Multiple files allowed."
                      multiple
                      files={documents.directorIds}
                      onChange={(files) => setDoc("directorIds", files)}
                    />
                    <FileField
                      id="cr12"
                      label="CR12 / business registration *"
                      hint="CR12 for companies; registration certificate for sole proprietors."
                      files={documents.cr12}
                      onChange={(files) => setDoc("cr12", files)}
                    />
                    <FileField
                      id="permit"
                      label="County business permit *"
                      hint="Current single business permit for your premises."
                      files={documents.permit}
                      onChange={(files) => setDoc("permit", files)}
                    />
                    <FileField
                      id="storefront"
                      label="Business storefront image *"
                      hint="A clear photo showing your shop, depot or warehouse signage."
                      accept=".jpg,.jpeg,.png"
                      files={documents.storefront}
                      onChange={(files) => setDoc("storefront", files)}
                    />
                  </div>
                </div>

                {error && (
                  <p className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                    {error}
                  </p>
                )}

                <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="flex items-center gap-2 text-[11px] text-slate-400">
                    <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />
                    Documents are used only for supplier verification.
                  </p>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-amber-400 to-[#E8C56A] px-6 py-3 text-sm font-semibold text-[#1a1305] transition-all hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                    {submitting ? step ?? "Submitting..." : "Submit supplier application"}
                  </button>
                </div>
              </div>

              <aside className="h-fit space-y-4 lg:sticky lg:top-24">
                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <h3 className="font-display text-base font-bold text-navy">Before you submit</h3>
                  <ul className="mt-3 space-y-2.5">
                    {[
                      "Business registration number matches your certificate",
                      "Director IDs are clear and valid",
                      "County permit is current",
                      "Storefront photo shows the business name",
                      "Category chosen is the one you want permanently",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2 text-[11px] leading-relaxed text-slate-500">
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-amber-700" />
                    <p className="text-xs font-semibold text-amber-900">2–3 business days</p>
                  </div>
                  <p className="mt-2 text-[11px] leading-relaxed text-amber-900/70">
                    Typical verification time. We will contact you on your official
                    email if anything needs clarification.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Need help?</p>
                  <a href={`mailto:${FMCG_CONTACT.email}`} className="mt-2 flex items-center gap-2 text-xs font-medium text-navy hover:text-amber-700">
                    <Mail className="h-3.5 w-3.5" /> {FMCG_CONTACT.email}
                  </a>
                  <a href="tel:+254114712989" className="mt-2 flex items-center gap-2 text-xs font-medium text-navy hover:text-amber-700">
                    <Store className="h-3.5 w-3.5" /> {FMCG_CONTACT.phone}
                  </a>
                </div>
              </aside>
            </form>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
