import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Plus, Search, Users, Building2, MessageSquare,
  Trash2, Send,
  ArrowUpRight, ChevronDown, ChevronRight,
  Ban, UserCheck, FileText,
} from "lucide-react";

/* ── Types ──────────────────────────────────────────────────── */

type StaffStatus = "active" | "pending" | "suspended";

interface Department {
  id: string;
  name: string;
  head: string;
  staffCount: number;
  description: string;
}

interface Staff {
  id: string;
  name: string;
  email: string;
  role: "super_admin" | "admin" | "manager" | "staff";
  department: string;
  status: StaffStatus;
  responsibilities: string[];
  joinedAt: string;
}

interface FormSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  department: string;
  status: "unread" | "replied" | "escalated";
  createdAt: string;
}

interface ChatMessage {
  id: string;
  client: string;
  clientEmail: string;
  message: string;
  department: string;
  assignedTo: string;
  status: "active" | "waiting" | "resolved" | "escalated";
  createdAt: string;
  messages: { from: string; text: string; time: string }[];
}

/* ── Helper ─────────────────────────────────────────────────── */

const roleColors: Record<string, string> = {
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
  // Convex queries
  const dbDepartments = useQuery(api.adminRbac.listDepartments);
  const dbStaff = useQuery(api.adminRbac.listStaff);
  const dbSubmissions = useQuery(api.adminRbac.listFormSubmissions);
  const dbChats = useQuery(api.adminRbac.listChats);

  // Convex mutations
  const createDepartmentMut = useMutation(api.adminRbac.createDepartment);
  const deleteDepartmentMut = useMutation(api.adminRbac.deleteDepartment);
  const createStaffMut = useMutation(api.adminRbac.createStaff);
  const updateStaffStatusMut = useMutation(api.adminRbac.updateStaffStatus);
  const deleteStaffMut = useMutation(api.adminRbac.deleteStaff);
  const updateSubmissionStatusMut = useMutation(api.adminRbac.updateSubmissionStatus);
  const escalateChatMut = useMutation(api.adminRbac.escalateChat);
  const updateChatStatusMut = useMutation(api.adminRbac.updateChatStatus);
  const addChatMessageMut = useMutation(api.adminRbac.addChatMessage);

  // Use DB data
  const departments = dbDepartments ?? [];
  const staffList = dbStaff ?? [];
  const submissions = dbSubmissions ?? [];
  const chats = dbChats ?? [];
  const [search, setSearch] = useState("");
  const [showCreateStaff, setShowCreateStaff] = useState(false);
  const [showCreateDept, setShowCreateDept] = useState(false);
  const [expandedChat, setExpandedChat] = useState<string | null>(null);
  const [expandedSubmission, setExpandedSubmission] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [chatInput, setChatInput] = useState("");

  const handleSendChatMessage = async () => {
    if (!expandedChat || !chatInput.trim()) return;
    await addChatMessageMut({ chatId: expandedChat, from: "Admin", text: chatInput });
    setChatInput("");
  };

  const handleEscalateChat = async (assignTo: string) => {
    if (!expandedChat) return;
    await escalateChatMut({ chatId: expandedChat, assignTo });
  };

  const handleReplySubmission = async () => {
    if (!expandedSubmission || !replyText.trim()) return;
    await updateSubmissionStatusMut({ id: expandedSubmission, status: "replied" });
    setReplyText("");
  };

  const handleEscalateSubmission = async () => {
    if (!expandedSubmission) return;
    await updateSubmissionStatusMut({ id: expandedSubmission, status: "escalated" });
  };


  // New staff form
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<"admin" | "manager" | "staff">("staff");
  const [newDept, setNewDept] = useState("Technology");
  const [newResponsibilities, setNewResponsibilities] = useState("");

  // New department form
  const [newDeptName, setNewDeptName] = useState("");
  const [newDeptHead, setNewDeptHead] = useState("");
  const [newDeptDesc, setNewDeptDesc] = useState("");

  const tabs: { id: Tab; label: string; icon: typeof Users; count: number }[] = [
    { id: "staff", label: "Staff", icon: Users, count: staffList.length },
    { id: "departments", label: "Departments", icon: Building2, count: departments.length },
    { id: "submissions", label: "Form Submissions", icon: FileText, count: submissions.filter((s) => s.status === "unread").length },
    { id: "chats", label: "Live Chats", icon: MessageSquare, count: chats.filter((c) => c.status === "active").length },
  ];

  const handleCreateStaff = async () => {
    if (!newName.trim() || !newEmail.trim()) return;
    await createStaffMut({
      name: newName, email: newEmail, role: newRole,
      department: newDept,
      responsibilities: newResponsibilities.split(",").map((r) => r.trim()).filter(Boolean),
      joinedAt: new Date().toISOString().split("T")[0],
    });
    setNewName(""); setNewEmail(""); setNewResponsibilities(""); setShowCreateStaff(false);
  };

  const handleCreateDept = async () => {
    if (!newDeptName.trim()) return;
    await createDepartmentMut({
      name: newDeptName, head: newDeptHead || "TBD", description: newDeptDesc,
    });
    setNewDeptName(""); setNewDeptHead(""); setNewDeptDesc(""); setShowCreateDept(false);
  };

  const handleToggleStaffStatus = async (id: string, status: StaffStatus) => {
    await updateStaffStatusMut({ id, status });
  };

  const handleDeleteStaff = async (id: string) => {
    await deleteStaffMut({ id });
  };

  const handleDeleteDept = async (id: string) => {
    await deleteDepartmentMut({ id });
  };

  const inputClass = "px-3 py-2 rounded-lg border bg-background text-sm w-full";

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">RBAC Accounts</h1>
        <p className="text-muted-foreground text-sm mt-1">Staff management, departments, form submissions, and live chat.</p>
      </div>

      {/* Tabs */}
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
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search staffList..." className="w-full pl-9 pr-4 py-2 rounded-lg bg-card border border-border text-sm" />
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
                      <option value="manager">Manager</option>
                      <option value="staff">Staff</option>
                    </select>
                    <select value={newDept} onChange={(e) => setNewDept(e.target.value)} className={inputClass}>
                      {departments.map((d) => <option key={d._id} value={d.name}>{d.name}</option>)}
                    </select>
                  </div>
                  <input placeholder="Responsibilities (comma separated)" value={newResponsibilities} onChange={(e) => setNewResponsibilities(e.target.value)} className={inputClass} />
                  <div className="flex gap-2">
                    <button onClick={handleCreateStaff} className="px-4 py-2 bg-electric text-white rounded-lg text-sm font-medium hover:bg-electric-dark">Create</button>
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
                <div key={s._id} className="grid grid-cols-12 gap-2 px-4 py-3 items-center hover:bg-muted/30 transition-colors">
                  <div className="col-span-3 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-electric/10 flex items-center justify-center text-electric text-xs font-bold shrink-0">{s.name.split(" ").map((n) => n[0]).join("")}</div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{s.name}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{s.email}</p>
                    </div>
                  </div>
                  <div className="col-span-2"><span className="text-xs text-foreground">{s.department}</span></div>
                  <div className="col-span-2 flex justify-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-medium capitalize ${roleColors[s.role]}`}>{s.role.replace("_", " ")}</span></div>
                  <div className="col-span-2 flex justify-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-medium capitalize ${statusColors[s.status]}`}>{s.status}</span></div>
                  <div className="col-span-3 flex items-center justify-end gap-1">
                    <button onClick={() => handleToggleStaffStatus(s._id, "active")} className="p-1.5 rounded-lg text-muted-foreground hover:text-emerald-500 hover:bg-emerald-500/10 transition-colors" title="Approve"><UserCheck className="w-3.5 h-3.5" /></button>
                    <button onClick={() => handleToggleStaffStatus(s._id, "suspended")} className="p-1.5 rounded-lg text-muted-foreground hover:text-amber-500 hover:bg-amber-500/10 transition-colors" title="Suspend"><Ban className="w-3.5 h-3.5" /></button>
                    <button onClick={() => handleDeleteStaff(s._id)} className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── DEPARTMENTS TAB ── */}
      {tab === "departments" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-muted-foreground">{departments.length} departments</span>
            <button onClick={() => setShowCreateDept(!showCreateDept)} className="flex items-center gap-2 px-4 py-2 bg-electric text-white rounded-lg text-sm font-medium hover:bg-electric-dark transition-colors">
              <Plus className="w-4 h-4" /> New Department
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
                    <p className="text-[10px] text-muted-foreground">Head: {dept.head}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mb-3">{dept.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{dept.staffCount} staff</span>
                  <button onClick={() => handleDeleteDept(dept._id)} className="text-xs text-destructive hover:underline">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── FORM SUBMISSIONS TAB ── */}
      {tab === "submissions" && (
        <div>
          <div className="rounded-xl bg-card border border-border overflow-hidden">
            <div className="divide-y divide-border">
              {submissions.map((sub) => (
                <div key={sub._id}>
                  <div className="px-5 py-4 cursor-pointer hover:bg-muted/30 transition-colors" onClick={() => setExpandedSubmission(expandedSubmission === sub._id ? null : sub._id)}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        {expandedSubmission === sub._id ? <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />}
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground">{sub.subject}</p>
                          <p className="text-[10px] text-muted-foreground">{sub.name} · {sub.email} · {sub.department}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium capitalize ${submissionStatusColors[sub.status]}`}>{sub.status}</span>
                        <span className="text-[10px] text-muted-foreground">{new Date(sub.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  {expandedSubmission === sub._id && (
                    <div className="px-5 pb-5 border-t border-border/50">
                      <p className="text-sm text-foreground mt-3 mb-4">{sub.message}</p>
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <textarea placeholder="Type your reply..." value={replyText} onChange={(e) => setReplyText(e.target.value)} rows={3} className="w-full px-3 py-2 rounded-lg border bg-background text-sm resize-none" />
                        </div>
                        <div className="flex flex-col gap-2">
                          <button className="flex items-center gap-1.5 px-4 py-2 bg-electric text-white rounded-lg text-xs font-medium hover:bg-electric-dark"><Send className="w-3 h-3" /> Reply</button>
                          <button className="flex items-center gap-1.5 px-4 py-2 bg-amber-500/10 text-amber-500 rounded-lg text-xs font-medium hover:bg-amber-500/20"><ArrowUpRight className="w-3 h-3" /> Escalate</button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
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
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium capitalize ${chatStatusColors[chat.status]}`}>{chat.status}</span>
                </div>
                <p className="text-xs text-muted-foreground truncate">{chat.messages[0]?.text}</p>
                <div className="flex items-center gap-2 mt-2 text-[10px] text-muted-foreground">
                  <span>{chat.department}</span>
                  <span>·</span>
                  <span>{chat.assignedTo}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Chat detail */}
          <div className="lg:col-span-2">
            {expandedChat ? (() => {
              const chat = chats.find((c) => c._id === expandedChat);
              if (!chat) return <div className="text-center py-20 text-muted-foreground text-sm">Select a chat.</div>;
              return (
                <div className="rounded-xl bg-card border border-border overflow-hidden">
                  <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{chat.client}</p>
                      <p className="text-[10px] text-muted-foreground">{chat.clientEmail} · {chat.department}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <select className="px-3 py-1.5 rounded-lg border bg-background text-xs">
                        <option>{chat.assignedTo}</option>
                        {staffList.filter((s) => s.department === chat.department && s.status === "active").map((s) => <option key={s._id}>{s.name}</option>)}
                      </select>
                      <button className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 text-amber-500 rounded-lg text-xs font-medium hover:bg-amber-500/20"><ArrowUpRight className="w-3 h-3" /> Escalate</button>
                    </div>
                  </div>
                  <div className="p-5 space-y-4 max-h-[400px] overflow-y-auto">
                    {chat.messages.map((msg: any, i: number) => (
                      <div key={i} className={`flex ${msg.from === chat.client ? "justify-start" : "justify-end"}`}>
                        <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${msg.from === chat.client ? "bg-muted text-foreground rounded-bl-sm" : "bg-electric text-white rounded-br-sm"}`}>
                          <p>{msg.text}</p>
                          <p className={`text-[10px] mt-1 ${msg.from === chat.client ? "text-muted-foreground" : "text-white/60"}`}>{msg.from} · {msg.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-5 py-4 border-t border-border flex gap-2">
                    <input placeholder="Type a reply..." value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSendChatMessage()} className="flex-1 px-4 py-2 rounded-lg border bg-background text-sm" />
                    <button onClick={handleSendChatMessage} className="px-4 py-2 bg-electric text-white rounded-lg text-sm font-medium hover:bg-electric-dark"><Send className="w-4 h-4" /></button>
                  </div>
                </div>
              );
            })() : (
              <div className="text-center py-20 text-muted-foreground text-sm">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 text-muted-foreground/20" />
                Select a conversation to view details.
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}
