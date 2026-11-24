import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAction, useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { PRIVILEGES } from "@/convex/privileges";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import {
  Plus, Search, Users, Building2, MessageSquare,
  Trash2, Send,
  ArrowUpRight, ChevronDown, ChevronRight,
  Ban, UserCheck, FileText,
} from "lucide-react";

/* ── Types (from Convex schema) ─────────────────────────────── */

type StaffStatus = "active" | "pending" | "suspended";
type StaffDoc = Doc<"staff">;
type DeptDoc = Doc<"departments">;
type SubmissionDoc = Doc<"formSubmissions">;
type ChatDoc = Doc<"chats">;
type ChatMsg = ChatDoc["messages"][number];

/* ── Status color helpers ───────────────────────────────────── */  const roleColors: Record<string, string> = {
  super_admin: "bg-electric/10 text-electric",
  admin: "bg-violet-500/10 text-violet-500",
  manager: "bg-amber-500/10 text-amber-500",
  staff: "bg-muted text-muted-foreground",
};



const statusColors: Record<StaffStatus, string> = {
  active: "bg-emerald-500/10 text-emerald-500",
  pending: "bg-amber-500/10 text-amber-500",
  suspended: "bg-red-500/10 text-red-500",
};

const submissionStatusColors: Record<string, string> = {
  unread: "bg-blue-500/10 text-blue-500",
  replied: "bg-emerald-500/10 text-emerald-500",
  escalated: "bg-amber-500/10 text-amber-500",
};

const chatStatusColors: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-500",
  waiting: "bg-amber-500/10 text-amber-500",
  resolved: "bg-muted text-muted-foreground",
  escalated: "bg-red-500/10 text-red-500",
};

/* ── Main Component ─────────────────────────────────────────── */

type Tab = "staff" | "departments" | "submissions" | "chats";

export default function RBACPanel() {
  const [tab, setTab] = useState<Tab>("staff");

  // Convex queries (reactive)
  const dbDepartments = useQuery(api.adminRbac.listDepartments);
  const dbStaff = useQuery(api.adminRbac.listStaff);
  const dbSubmissions = useQuery(api.adminRbac.listFormSubmissions);
  const dbChats = useQuery(api.adminRbac.listChats);

  // Convex mutations
  const createDepartmentMut = useMutation(api.adminRbac.createDepartment);
  const deleteDepartmentMut = useMutation(api.adminRbac.deleteDepartment);
  const createStaffAccount = useAction(api.adminAccounts.createStaffAccount);
  const updateStaffStatusMut = useMutation(api.adminRbac.updateStaffStatus);
  const deleteStaffMut = useMutation(api.adminRbac.deleteStaff);
  const updateSubmissionStatusMut = useMutation(api.adminRbac.updateSubmissionStatus);
  const escalateChatMut = useMutation(api.adminRbac.escalateChat);
  const addChatMessageMut = useMutation(api.adminRbac.addChatMessage);

  // DB data (empty arrays while loading)
  const departments: DeptDoc[] = dbDepartments ?? [];
  const staffList: StaffDoc[] = dbStaff ?? [];
  const submissions: SubmissionDoc[] = dbSubmissions ?? [];
  const chats: ChatDoc[] = dbChats ?? [];

  const [search, setSearch] = useState("");
  const [showCreateStaff, setShowCreateStaff] = useState(false);
  const [showCreateDept, setShowCreateDept] = useState(false);
  const [expandedChat, setExpandedChat] = useState<Id<"chats"> | null>(null);
  const [expandedSubmission, setExpandedSubmission] = useState<Id<"formSubmissions"> | null>(null);
  const [replyText, setReplyText] = useState("");
  const [chatInput, setChatInput] = useState("");

  // Derived counts
  const departmentStaffCount: Record<string, number> = {};
  for (const dept of departments) {
    if (dept.name) {
      departmentStaffCount[dept.name] = (departmentStaffCount[dept.name] ?? 0) + 1;
    }
  }

  // New staff form
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<"admin" | "staff">("staff");
  const [newPassword, setNewPassword] = useState("");
  const [newPrivileges, setNewPrivileges] = useState<string[]>([]);
  const [createError, setCreateError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const roleOptions = useMemo(
    () =>
      [
        { value: "admin", label: "Admin" },
        { value: "manager", label: "Manager" },
        { value: "staff", label: "Staff" },
      ] as const,
    [],
  );
  void roleOptions;
  const [newDept, setNewDept] = useState("Operations");

  // New department form
  const [newDeptName, setNewDeptName] = useState("");
  const [newDeptHead, setNewDeptHead] = useState("");
  const [newDeptDesc, setNewDeptDesc] = useState("");
  const handleSendChatMessage = async () => {
    if (!expandedChat || !chatInput.trim()) return;
    await addChatMessageMut({ chatId: expandedChat, from: "Admin", text: chatInput });
    setChatInput("");
  };

  const handleEscalateChat = (chat: ChatDoc) => {
    void escalateChatMut({ chatId: chat._id, assignTo: chat.assignedTo });
  };

  const handleReplySubmission = (id: Id<"formSubmissions">) => {
    if (!replyText.trim()) return;
    void updateSubmissionStatusMut({ id, status: "replied" });
    setReplyText("");
  };

  const handleEscalateSubmission = (id: Id<"formSubmissions">) => {
    void updateSubmissionStatusMut({ id, status: "escalated" });
  };

  const handleCreateStaff = async () => {
    setCreateError(null);
    if (!newName.trim() || !newEmail.trim()) {
      setCreateError("Name and email are required.");
      return;
    }
    if (newPassword.length < 8) {
      setCreateError("Set a password of at least 8 characters for this account.");
      return;
    }
    try {
      setCreating(true);
      await createStaffAccount({
        name: newName.trim(),
        email: newEmail.trim(),
        password: newPassword,
        role: newRole,
        privileges: newPrivileges,
        department: newDept,
      });
      setNewName("");
      setNewEmail("");
      setNewPassword("");
      setNewPrivileges([]);
      setShowCreateStaff(false);
    } catch (error) {
      setCreateError(
        error instanceof Error ? error.message : "Could not create that account.",
      );
    } finally {
      setCreating(false);
    }
  };

  const handleCreateDept = async () => {
    if (!newDeptName) return;
    await createDepartmentMut({
      name: newDeptName, head: newDeptHead || "TBD", description: newDeptDesc,
    });
    setNewDeptName(""); setNewDeptHead(""); setNewDeptDesc(""); setShowCreateDept(false);
  };

  const handleToggleStaffStatus = (id: Id<"staff">, status: StaffStatus) => {
    void updateStaffStatusMut({ id, status });
  };

  const handleDeleteStaff = (id: Id<"staff">) => {
    void deleteStaffMut({ id });
  };

  const handleDeleteDept = (id: Id<"departments">) => {
    void deleteDepartmentMut({ id });
  };

  const inputClass = "px-3 py-2 rounded-lg border bg-background text-sm w-full";

  const tabs: { id: Tab; label: string; icon: typeof Users; count: number }[] = [
    { id: "staff", label: "Staff", icon: Users, count: staffList.length },
    { id: "departments", label: "Departments", icon: Building2, count: departments.length },
    { id: "submissions", label: "Form Submissions", icon: FileText, count: submissions.length },
    { id: "chats", label: "Live Chats", icon: MessageSquare, count: chats.length },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Roles &amp; Permissions</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage staff accounts, departments, submissions and live chats</p>
        </div>
      </div>

      <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-1">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${tab === t.id ? "bg-electric text-white" : "bg-card border border-border text-muted-foreground hover:text-foreground"}`}>
            <t.icon className="w-4 h-4" />
            {t.label}
            {t.count > 0 && <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${tab === t.id ? "bg-white/20" : "bg-muted"}`}>{t.count}</span>}
          </button>
        ))}
      </div>

      {/* ── STAFF TAB ── */}
      {tab === "staff" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search staff..." className="w-full pl-9 pr-4 py-2 rounded-lg bg-card border border-border text-sm" />
            </div>
            <button onClick={() => setShowCreateStaff(!showCreateStaff)} className="flex items-center gap-2 px-4 py-2 bg-electric text-white rounded-lg text-sm font-medium hover:bg-electric-dark transition-colors">
              <Plus className="w-4 h-4" /> Add Staff
            </button>
          </div>

          <AnimatePresence>
            {showCreateStaff && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mb-4">
                <div className="p-5 rounded-xl bg-card border border-border space-y-4">
                  <h3 className="font-semibold text-sm">Add New Staff Member</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input placeholder="Full name" value={newName} onChange={(e) => setNewName(e.target.value)} className={inputClass} />
                    <input placeholder="Email" type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className={inputClass} />
                    <select value={newRole} onChange={(e) => setNewRole(e.target.value as typeof newRole)} className={inputClass}>
                      <option value="admin">Admin</option>
                      <option value="staff">Staff</option>
                    </select>
                    <select value={newDept} onChange={(e) => setNewDept(e.target.value)} className={inputClass}>
                      {departments.map((d) => <option key={d._id} value={d.name}>{d.name}</option>)}
                      {departments.length === 0 && <option value="Operations">Operations</option>}
                    </select>
                  </div>
                  <input placeholder="Login password (min 8 characters)" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={inputClass} />
                  <div>
                    <p className="text-xs font-semibold text-foreground mb-2">Admin panel privileges</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-44 overflow-y-auto pr-1">
                      {PRIVILEGES.map((p) => (
                        <label key={p.key} className="flex items-center gap-2 text-[11px] text-muted-foreground">
                          <input
                            type="checkbox"
                            checked={newPrivileges.includes(p.key)}
                            onChange={(e) =>
                              setNewPrivileges((prev) =>
                                e.target.checked
                                  ? [...prev, p.key]
                                  : prev.filter((k) => k !== p.key),
                              )
                            }
                            className="w-3.5 h-3.5 rounded border-border"
                          />
                          {p.label}
                        </label>
                      ))}
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-2">Admins always receive every privilege.</p>
                  </div>
                  {createError && <p className="text-xs text-rose-500">{createError}</p>}
                  <div className="flex gap-2">
                    <button onClick={handleCreateStaff} disabled={creating} className="px-4 py-2 bg-electric text-white rounded-lg text-sm font-medium hover:bg-electric-dark disabled:opacity-60">{creating ? "Creating…" : "Create account"}</button>
                    <button onClick={() => setShowCreateStaff(false)} className="px-4 py-2 border rounded-lg text-sm">Cancel</button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="rounded-xl bg-card border border-border overflow-hidden">
            <div className="grid grid-cols-12 gap-2 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground border-b border-border bg-muted/30">
              <div className="col-span-3">Staff</div>
              <div className="col-span-2">Department</div>
              <div className="col-span-2 text-center">Role</div>
              <div className="col-span-2 text-center">Status</div>
              <div className="col-span-3 text-right">Actions</div>
            </div>
            <div className="divide-y divide-border">
              {staffList.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase())).map((s) => (
                <div key={s._id} className="grid grid-cols-12 gap-2 px-4 py-3 items-center hover:bg-muted/20 transition-colors">
                  <div className="col-span-3 flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-electric/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-electric">{s.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{s.name}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{s.email}</p>
                    </div>
                  </div>
                  <div className="col-span-2 text-xs text-muted-foreground truncate">{s.department}</div>
                  {tab === "staff" && (
                    <div className="col-span-1 text-[10px] text-muted-foreground text-right">
                      {departmentStaffCount[s.department] ?? 0}
                    </div>
                  )}
                  <div className="col-span-2 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-medium capitalize ${roleColors[s.role]}`}>{s.role.replace("_", " ")}</span></div>
                  <div className="col-span-2 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-medium capitalize ${statusColors[s.status]}`}>{s.status}</span></div>
                  <div className="col-span-3 flex items-center justify-end gap-1.5">
                    {s.status !== "active" && (
                      <button onClick={() => handleToggleStaffStatus(s._id, "active")} title="Approve" className="p-1.5 rounded-lg text-emerald-500 hover:bg-emerald-500/10 transition-colors"><UserCheck className="w-3.5 h-3.5" /></button>
                    )}
                    {s.status === "active" && (
                      <button onClick={() => handleToggleStaffStatus(s._id, "suspended")} title="Suspend" className="p-1.5 rounded-lg text-amber-500 hover:bg-amber-500/10 transition-colors"><Ban className="w-3.5 h-3.5" /></button>
                    )}
                    <button onClick={() => handleDeleteStaff(s._id)} title="Delete" className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              ))}
              {staffList.length === 0 && <div className="py-12 text-center text-muted-foreground text-sm">No staff yet. Click &ldquo;Add Staff&rdquo; to create the first account.</div>}
            </div>
          </div>
        </div>
      )}

      {/* ── DEPARTMENTS TAB ── */}
      {tab === "departments" && (
        <div>
          <div className="flex items-center justify-end mb-4">
            <button onClick={() => setShowCreateDept(!showCreateDept)} className="flex items-center gap-2 px-4 py-2 bg-electric text-white rounded-lg text-sm font-medium hover:bg-electric-dark transition-colors">
              <Plus className="w-4 h-4" /> Add Department
            </button>
          </div>

          <AnimatePresence>
            {showCreateDept && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mb-4">
                <div className="p-5 rounded-xl bg-card border border-border space-y-4">
                  <h3 className="font-semibold text-sm">Create Department</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input placeholder="Department name" value={newDeptName} onChange={(e) => setNewDeptName(e.target.value)} className={inputClass} />
                    <input placeholder="Department head" value={newDeptHead} onChange={(e) => setNewDeptHead(e.target.value)} className={inputClass} />
                  </div>
                  <input placeholder="Description" value={newDeptDesc} onChange={(e) => setNewDeptDesc(e.target.value)} className={inputClass} />
                  <div className="flex gap-2">
                    <button onClick={handleCreateDept} className="px-4 py-2 bg-electric text-white rounded-lg text-sm font-medium hover:bg-electric-dark">Create</button>
                    <button onClick={() => setShowCreateDept(false)} className="px-4 py-2 border rounded-lg text-sm">Cancel</button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {departments.map((dept) => (
              <div key={dept._id} className="p-5 rounded-xl bg-card border border-border hover:border-border/80 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-electric/10 flex items-center justify-center"><Building2 className="w-5 h-5 text-electric" /></div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{dept.name}</p>
                    <p className="text-[10px] text-muted-foreground">Head: {dept.head || "TBD"}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mb-3">{dept.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {(departmentStaffCount[dept.name] ?? 0)} staff
                  </span>
                  <button onClick={() => handleDeleteDept(dept._id)} className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
            {departments.length === 0 && <div className="py-12 col-span-full text-center text-muted-foreground text-sm">No departments yet. Click &ldquo;Add Department&rdquo; to create one.</div>}
          </div>
        </div>
      )}

      {/* ── FORM SUBMISSIONS TAB ── */}
      {tab === "submissions" && (
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Client Form Submissions</h3>
          <div className="rounded-xl bg-card border border-border overflow-hidden divide-y divide-border">
            {submissions.map((sub) => (
              <div key={sub._id}>
                <button onClick={() => { setExpandedSubmission(expandedSubmission === sub._id ? null : sub._id); setReplyText(""); }} className="w-full text-left px-5 py-4 hover:bg-muted/20 transition-colors flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {expandedSubmission === sub._id ? <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" /> : <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{sub.subject}</p>
                      <p className="text-xs text-muted-foreground truncate">{sub.name} · {sub.email} · {sub.department}</p>
                    </div>
                  </div>
                  <span className={`flex-shrink-0 px-2 py-0.5 rounded-full text-[10px] font-medium capitalize ${submissionStatusColors[sub.status]}`}>{sub.status}</span>
                </button>
                {expandedSubmission === sub._id && (
                  <div className="px-5 pb-5 border-t border-border/50">
                    <p className="text-sm text-foreground mt-3 mb-4">{sub.message}</p>
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <textarea placeholder="Type your reply..." value={replyText} onChange={(e) => setReplyText(e.target.value)} rows={3} className="w-full px-3 py-2 rounded-lg border bg-background text-sm resize-none" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <button onClick={() => handleReplySubmission(sub._id)} className="flex items-center gap-1.5 px-4 py-2 bg-electric text-white rounded-lg text-xs font-medium hover:bg-electric-dark"><Send className="w-3 h-3" /> Reply</button>
                        <button onClick={() => handleEscalateSubmission(sub._id)} className="flex items-center gap-1.5 px-4 py-2 bg-amber-500/10 text-amber-500 rounded-lg text-xs font-medium hover:bg-amber-500/20"><ArrowUpRight className="w-3 h-3" /> Escalate</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {submissions.length === 0 && <div className="py-12 text-center text-muted-foreground text-sm">No form submissions yet.</div>}
          </div>
        </div>
      )}

      {/* ── LIVE CHATS TAB ── */}
      {tab === "chats" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat list */}
          <div className="lg:col-span-1 space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Active Conversations</h3>
            {chats.map((chat) => (
              <button key={chat._id} onClick={() => setExpandedChat(expandedChat === chat._id ? null : chat._id)} className={`w-full text-left p-4 rounded-xl border transition-all ${expandedChat === chat._id ? "border-electric bg-electric/5" : "bg-card border-border hover:border-border/80"}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-foreground truncate">{chat.client}</span>
                  <span className={`flex-shrink-0 px-2 py-0.5 rounded-full text-[10px] font-medium capitalize ${chatStatusColors[chat.status]}`}>{chat.status}</span>
                </div>
                <p className="text-xs text-muted-foreground truncate">{chat.messages[0]?.text}</p>
                <div className="flex items-center gap-2 mt-2 text-[10px] text-muted-foreground">
                  <span>{chat.department}</span>
                  <span>·</span>
                  <span>{chat.assignedTo}</span>
                </div>
              </button>
            ))}
            {chats.length === 0 && <div className="py-12 text-center text-muted-foreground text-sm">No live chats yet.</div>}
          </div>

          {/* Chat detail */}
          <div className="lg:col-span-2">
            {(() => {
              const chat = chats.find((c) => c._id === expandedChat);
              if (!chat) return (
                <div className="text-center py-20 text-muted-foreground text-sm h-full flex flex-col items-center justify-center">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 text-muted-foreground/20" />
                  Select a conversation to view details.
                </div>
              );
              return (
                <div className="rounded-xl bg-card border border-border overflow-hidden">
                  <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{chat.client}</p>
                      <p className="text-xs text-muted-foreground">{chat.clientEmail} · {chat.department}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={chat.assignedTo}
                        onChange={(e) => void escalateChatMut({ chatId: chat._id, assignTo: e.target.value })}
                        className="px-3 py-1.5 rounded-lg border bg-background text-xs"
                      >
                        <option>{chat.assignedTo}</option>
                        {staffList.filter((s) => s.department === chat.department && s.status === "active").map((s) => <option key={s._id}>{s.name}</option>)}
                      </select>
                      <button onClick={() => handleEscalateChat(chat)} className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 text-amber-500 rounded-lg text-xs font-medium hover:bg-amber-500/20"><ArrowUpRight className="w-3 h-3" /> Escalate</button>
                    </div>
                  </div>
                  <div className="p-5 space-y-4 max-h-[400px] overflow-y-auto">
                    {chat.messages.map((msg: ChatMsg, i: number) => (
                      <div key={i} className={`flex ${msg.from === chat.client ? "justify-start" : "justify-end"}`}>
                        <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${msg.from === chat.client ? "bg-muted text-foreground rounded-bl-sm" : "bg-electric text-white rounded-br-sm"}`}>
                          <p>{msg.text}</p>
                          <p className={`text-[10px] mt-1 ${msg.from === chat.client ? "text-muted-foreground" : "text-white/60"}`}>{msg.from} · {msg.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-5 py-4 border-t border-border flex gap-2">
                    <input placeholder="Type a reply..." value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && void handleSendChatMessage()} className="flex-1 px-4 py-2 rounded-lg border bg-background text-sm" />
                    <button onClick={() => void handleSendChatMessage()} className="px-4 py-2 bg-electric text-white rounded-lg text-sm font-medium hover:bg-electric-dark"><Send className="w-4 h-4" /></button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </motion.div>
  );
}
