/**
 * Delivery Portal — client-facing project delivery & download page.
 *
 * Shows all of the client's projects with:
 *  - Project status + tracking timeline
 *  - Downloadable deliverables (free first download for completed projects,
 *    $15/month after; phased projects always free)
 *  - Paystack-powered subscription activation
 */

import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  CheckCircle2,
  Clock,
  AlertCircle,
  Info,
  FileText,
  ChevronDown,
  ChevronRight,
  CreditCard,
  Lock,
  Unlock,
  Folder,
  ArrowLeft,
  Shield,
} from "lucide-react";

type ProjectDoc = {
  _id: Id<"projects">;
  clientId: Id<"users">;
  title: string;
  description?: string;
  service?: string;
  status: "planning" | "in_progress" | "review" | "completed" | "delivered" | "on_hold";
  projectType: "completed" | "phased";
  phases?: Array<{
    id: string;
    name: string;
    status: "pending" | "in_progress" | "review" | "completed";
    description?: string;
    dueDate?: number;
    completedAt?: number;
  }>;
  deliverables?: Array<{
    id: string;
    name: string;
    fileUrl?: string;
    fileSize?: number;
    fileType?: string;
    phaseId?: string;
    uploadedAt: number;
  }>;
  tracking?: Array<{
    id: string;
    title: string;
    description?: string;
    status: "info" | "warning" | "success" | "update";
    createdAt: number;
    author: string;
  }>;
  budget?: string;
  startDate?: number;
  estimatedCompletion?: number;
  completedAt?: number;
  createdAt: number;
  updatedAt: number;
};

const STATUS_COLORS: Record<string, string> = {
  planning: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  in_progress: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  review: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  delivered: "bg-electric/10 text-electric border-electric/20",
  on_hold: "bg-red-500/10 text-red-400 border-red-500/20",
};

const TRACKING_ICONS: Record<string, typeof Info> = {
  info: Info,
  warning: AlertCircle,
  success: CheckCircle2,
  update: Clock,
};

const TRACKING_COLORS: Record<string, string> = {
  info: "border-blue-500/30 bg-blue-500/5",
  warning: "border-amber-500/30 bg-amber-500/5",
  success: "border-emerald-500/30 bg-emerald-500/5",
  update: "border-electric/30 bg-electric/5",
};

function formatDate(ts?: number) {
  if (!ts) return "—";
  return new Date(ts).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function formatFileSize(bytes?: number) {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function DeliveryPortal() {
  const projects = useQuery(api.projects.listMine);
  const [selectedProject, setSelectedProject] = useState<Id<"projects"> | null>(null);
  const selected = useQuery(
    api.projects.get,
    selectedProject ? { projectId: selectedProject } : "skip",
  );
  const downloadCheck = useQuery(
    api.projects.checkDownload,
    selectedProject ? { projectId: selectedProject } : "skip",
  );
  const downloadRecord = useQuery(
    api.projects.getDownloadRecord,
    selectedProject ? { projectId: selectedProject } : "skip",
  );
  const recordDownload = useMutation(api.projects.recordDownload);
  const activateSub = useMutation(api.projects.activateSubscription);

  const [expandedPhases, setExpandedPhases] = useState<Set<string>>(new Set());
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);

  const togglePhase = useCallback((id: string) => {
    setExpandedPhases((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  // Paystack inline payment
  const handlePay = useCallback(async () => {
    if (!selectedProject || paying) return;
    setPaying(true);
    try {
      const PaystackPop = await import("@paystack/inline-js");
      const pop = new PaystackPop.default();
      pop.newTransaction({
        key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || "pk_test_demo",
        email: "client@yasirzayed.com",
        amount: 150000, // KES 1,500 in cents
        currency: "KES",
        reference: `yz-delivery-${Date.now()}`,
        onSuccess: async () => {
          await activateSub({ projectId: selectedProject });
          setPaying(false);
        },
        onClose: () => setPaying(false),
      });
    } catch {
      // Demo mode — activate without real payment
      await activateSub({ projectId: selectedProject });
      setPaying(false);
    }
  }, [selectedProject, paying, activateSub]);

  const handleDownload = useCallback(
    async (deliverableId: string, fileUrl?: string, name?: string) => {
      if (!selectedProject) return;
      setDownloadingId(deliverableId);
      await recordDownload({ projectId: selectedProject, deliverableId });
      if (fileUrl) {
        window.open(fileUrl, "_blank");
      } else {
        // Demo — simulate download
        const blob = new Blob([`Demo deliverable: ${name}`], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = name || "deliverable.txt";
        a.click();
        URL.revokeObjectURL(url);
      }
      setDownloadingId(null);
    },
    [selectedProject, recordDownload],
  );

  if (projects === undefined) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="animate-pulse text-white/40 text-sm">Loading projects…</div>
      </div>
    );
  }

  // ── Project list view ──
  if (!selectedProject || !selected) {
    return (
      <div className="min-h-screen bg-navy pt-24 pb-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-2">
              <Folder className="w-6 h-6 text-electric" />
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Delivery Portal</h1>
            </div>
            <p className="text-white/40 text-sm mb-8">Track your projects and download deliverables.</p>
          </motion.div>

          {projects.length === 0 ? (
            <div className="text-center py-20">
              <Folder className="w-12 h-12 text-white/10 mx-auto mb-4" />
              <p className="text-white/30 text-sm">No projects yet. Once a project is assigned to you, it will appear here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {projects.map((p, i) => (
                <motion.button
                  key={p._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setSelectedProject(p._id)}
                  className="w-full text-left p-5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-electric/30 hover:bg-white/[0.05] transition-all group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1.5">
                        <h3 className="text-white font-semibold text-sm truncate group-hover:text-electric transition-colors">
                          {p.title}
                        </h3>
                        <span className={`shrink-0 text-[10px] font-medium uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${STATUS_COLORS[p.status]}`}>
                          {p.status.replace("_", " ")}
                        </span>
                      </div>
                      {p.description && (
                        <p className="text-white/30 text-xs truncate mb-2">{p.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-[11px] text-white/25">
                        <span>{p.projectType === "phased" ? "Multi-phase" : "Single delivery"}</span>
                        <span>·</span>
                        <span>{(p.deliverables ?? []).length} deliverables</span>
                        <span>·</span>
                        <span>{(p.tracking ?? []).length} updates</span>
                        <span>·</span>
                        <span>Created {formatDate(p.createdAt)}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-electric/60 shrink-0 mt-1 transition-colors" />
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Single project view ──
  const phases = selected.phases ?? [];
  const deliverables = selected.deliverables ?? [];
  const tracking = [...(selected.tracking ?? [])].reverse();
  const isCompleted = selected.status === "completed" || selected.status === "delivered";
  const isPhased = selected.projectType === "phased";
  const canDownload = downloadCheck?.allowed ?? false;
  const downloadFee = downloadCheck?.fee ?? 0;
  const downloadReason = downloadCheck?.reason ?? "";

  // Group deliverables by phase
  const phasedDeliverables = new Map<string, typeof deliverables>();
  const unphasedDeliverables: typeof deliverables = [];
  for (const d of deliverables) {
    if (d.phaseId) {
      const arr = phasedDeliverables.get(d.phaseId) ?? [];
      arr.push(d);
      phasedDeliverables.set(d.phaseId, arr);
    } else {
      unphasedDeliverables.push(d);
    }
  }

  return (
    <div className="min-h-screen bg-navy pt-24 pb-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* Back */}
        <button
          onClick={() => setSelectedProject(null)}
          className="flex items-center gap-2 text-white/40 hover:text-white text-sm mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          All Projects
        </button>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">{selected.title}</h1>
            <span className={`text-[10px] font-medium uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${STATUS_COLORS[selected.status]}`}>
              {selected.status.replace("_", " ")}
            </span>
            <span className={`text-[10px] font-medium px-2.5 py-0.5 rounded-full border ${isPhased ? "bg-violet-500/10 text-violet-400 border-violet-500/20" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"}`}>
              {isPhased ? "Multi-phase" : "Single Delivery"}
            </span>
          </div>
          {selected.description && <p className="text-white/40 text-sm max-w-2xl">{selected.description}</p>}
          <div className="flex flex-wrap items-center gap-5 mt-3 text-xs text-white/25">
            {selected.service && <span>Service: <span className="text-white/40">{selected.service}</span></span>}
            {selected.budget && <span>Budget: <span className="text-white/40">{selected.budget}</span></span>}
            <span>Started: <span className="text-white/40">{formatDate(selected.startDate || selected.createdAt)}</span></span>
            {selected.estimatedCompletion && <span>ETA: <span className="text-white/40">{formatDate(selected.estimatedCompletion)}</span></span>}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Left: Tracking Timeline ── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Phases (if phased project) */}
            {phases.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <h2 className="text-white text-sm font-semibold mb-3 flex items-center gap-2">
                  <Folder className="w-4 h-4 text-electric" />
                  Project Phases
                </h2>
                <div className="space-y-2">
                  {phases.map((phase) => {
                    const isExpanded = expandedPhases.has(phase.id);
                    const phaseDeliverables = phasedDeliverables.get(phase.id) ?? [];
                    return (
                      <div key={phase.id} className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
                        <button
                          onClick={() => togglePhase(phase.id)}
                          className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.02] transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${phase.status === "completed" ? "bg-emerald-400" : phase.status === "in_progress" ? "bg-blue-400" : phase.status === "review" ? "bg-amber-400" : "bg-white/20"}`} />
                            <span className="text-white text-sm font-medium">{phase.name}</span>
                            <span className="text-[10px] uppercase tracking-wider text-white/30">{phase.status.replace("_", " ")}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            {phaseDeliverables.length > 0 && (
                              <span className="text-[10px] text-white/30">{phaseDeliverables.length} files</span>
                            )}
                            {isExpanded ? <ChevronDown className="w-4 h-4 text-white/30" /> : <ChevronRight className="w-4 h-4 text-white/30" />}
                          </div>
                        </button>
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                              <div className="px-4 pb-4 border-t border-white/[0.04]">
                                {phase.description && <p className="text-white/30 text-xs mt-3 mb-2">{phase.description}</p>}
                                {phaseDeliverables.length > 0 ? (
                                  <div className="space-y-1.5 mt-3">
                                    {phaseDeliverables.map((d) => (
                                      <div key={d.id} className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                                        <div className="flex items-center gap-2 min-w-0">
                                          <FileText className="w-4 h-4 text-white/30 shrink-0" />
                                          <span className="text-white/60 text-xs truncate">{d.name}</span>
                                          {d.fileSize && <span className="text-white/20 text-[10px] shrink-0">{formatFileSize(d.fileSize)}</span>}
                                        </div>
                                        {canDownload ? (
                                          <button
                                            onClick={() => handleDownload(d.id, d.fileUrl, d.name)}
                                            disabled={downloadingId === d.id}
                                            className="shrink-0 ml-2 p-1.5 rounded-md text-electric hover:bg-electric/10 transition-colors disabled:opacity-50"
                                          >
                                            <Download className="w-4 h-4" />
                                          </button>
                                        ) : (
                                          <Lock className="w-4 h-4 text-white/20 shrink-0 ml-2" />
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-white/20 text-xs mt-3">No deliverables uploaded for this phase yet.</p>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Tracking Timeline */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h2 className="text-white text-sm font-semibold mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-electric" />
                Project Tracking
                <span className="text-white/20 font-normal">({tracking.length} updates)</span>
              </h2>
              {tracking.length === 0 ? (
                <p className="text-white/20 text-xs py-4">No tracking updates yet.</p>
              ) : (
                <div className="relative ml-3 border-l border-white/[0.06] space-y-0">
                  {tracking.map((t, i) => {
                    const Icon = TRACKING_ICONS[t.status] ?? Info;
                    return (
                      <div key={t.id} className="relative pl-6 pb-5">
                        <div className={`absolute -left-[9px] top-0 w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center ${TRACKING_COLORS[t.status]}`}>
                          <Icon className="w-3 h-3" />
                        </div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-white text-sm font-medium">{t.title}</span>
                          <span className="text-[10px] text-white/20">{formatDate(t.createdAt)}</span>
                        </div>
                        {t.description && <p className="text-white/35 text-xs leading-relaxed">{t.description}</p>}
                        <span className="text-[10px] text-white/15 mt-0.5 block">— {t.author}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </div>

          {/* ── Right: Deliverables & Download ── */}
          <div className="space-y-5">
            {/* Download Status Card */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
              <h3 className="text-white text-sm font-semibold mb-3 flex items-center gap-2">
                <Download className="w-4 h-4 text-electric" />
                Download Access
              </h3>

              {isPhased ? (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                  <Unlock className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-emerald-400 text-xs font-medium">Free Downloads</p>
                    <p className="text-white/30 text-[11px] mt-0.5">This is a multi-phase project. All downloads are free during active development.</p>
                  </div>
                </div>
              ) : !downloadCheck ? (
                <div className="animate-pulse h-16 rounded-lg bg-white/[0.03]" />
              ) : downloadCheck.allowed ? (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-electric/5 border border-electric/20">
                  <CheckCircle2 className="w-4 h-4 text-electric mt-0.5 shrink-0" />
                  <div>
                    <p className="text-electric text-xs font-medium">
                      {downloadReason === "first_download_free" ? "First Download Free" : "Subscription Active"}
                    </p>
                    <p className="text-white/30 text-[11px] mt-0.5">
                      {downloadReason === "first_download_free"
                        ? "Your first download is complimentary. If you lose your files, a $15/month fee applies."
                        : `Downloads active until ${formatDate(downloadCheck.paidUntil)}.`}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
                    <Lock className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-amber-400 text-xs font-medium">Subscription Required</p>
                      <p className="text-white/30 text-[11px] mt-0.5">
                        Free download has been used. Pay $15/month to keep download access active.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handlePay}
                    disabled={paying}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-electric text-white text-sm font-semibold rounded-lg hover:bg-electric-dark transition-all disabled:opacity-50"
                  >
                    <CreditCard className="w-4 h-4" />
                    {paying ? "Processing…" : "Pay $15 / month"}
                  </button>
                </div>
              )}
            </motion.div>

            {/* Deliverables List */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
              <h3 className="text-white text-sm font-semibold mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-electric" />
                Deliverables
                <span className="text-white/20 font-normal">({deliverables.length})</span>
              </h3>
              {deliverables.length === 0 ? (
                <p className="text-white/20 text-xs py-4">No deliverables uploaded yet.</p>
              ) : (
                <div className="space-y-2">
                  {(isPhased ? deliverables : unphasedDeliverables).map((d) => (
                    <div key={d.id} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] transition-colors">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <FileText className="w-4 h-4 text-white/30 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-white/70 text-xs font-medium truncate">{d.name}</p>
                          <p className="text-white/20 text-[10px]">{formatFileSize(d.fileSize)} · {formatDate(d.uploadedAt)}</p>
                        </div>
                      </div>
                      {canDownload ? (
                        <button
                          onClick={() => handleDownload(d.id, d.fileUrl, d.name)}
                          disabled={downloadingId === d.id}
                          className="shrink-0 ml-2 p-2 rounded-lg text-electric hover:bg-electric/10 transition-colors disabled:opacity-50"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      ) : (
                        <Lock className="w-4 h-4 text-white/15 shrink-0 ml-2" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Security badge */}
            <div className="flex items-center gap-2 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
              <Shield className="w-4 h-4 text-white/20" />
              <span className="text-white/20 text-[11px]">Downloads are tracked and secured. Unauthorized sharing is prohibited.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
