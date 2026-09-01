import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

/* ── Mock Data ──────────────────────────────────────────────── */

const mockDepartments: Department[] = [
  { id: "1", name: "Business Development", head: "Yasir Zayed", staffCount: 3, description: "Growth strategy, partnerships, and market expansion" },
  { id: "2", name: "Technology", head: "Tech Desk", staffCount: 4, description: "Web development, AI, automation, and infrastructure" },
  { id: "3", name: "Security", head: "Security Desk", staffCount: 2, description: "CCTV, access control, cybersecurity, and YASIR VERIFY" },
  { id: "4", name: "Marketing", head: "Marketing Lead", staffCount: 2, description: "Digital marketing, content, SEO, and campaigns" },
  { id: "5", name: "Client Services", head: "Client Success", staffCount: 3, description: "Client onboarding, support, and relationship management" },
  { id: "6", name: "Finance", head: "Finance Lead", staffCount: 1, description: "Invoicing, payments, budgets, and financial reporting" },
];

const mockStaff: Staff[] = [
  { id: "1", name: "Yasir Zayed", email: "yasir@yasirzayed.com", role: "super_admin", department: "Business Development", status: "active", responsibilities: ["Company strategy", "Client relationships", "Final approvals", "Business growth"], joinedAt: "2024-01-15" },
  { id: "2", name: "Content Desk", email: "content@yasirzayed.com", role: "admin", department: "Marketing", status: "active", responsibilities: ["Article writing", "SEO content", "Social media", "Brand voice"], joinedAt: "2025-03-01" },
  { id: "3", name: "Tech Lead", email: "tech@yasirzayed.com", role: "admin", department: "Technology", status: "active", responsibilities: ["Web development", "AI integration", "System architecture", "Code review"], joinedAt: "2025-01-10" },
  { id: "4", name: "Security Ops", email: "security@yasirzayed.com", role: "manager", department: "Security", status: "active", responsibilities: ["CCTV installation", "Access control", "Security audits", "Incident response"], joinedAt: "2025-06-15" },
  { id: "5", name: "Client Success", email: "clients@yasirzayed.com", role: "manager", department: "Client Services", status: "active", responsibilities: ["Client onboarding", "Support tickets", "Satisfaction tracking", "Retention"], joinedAt: "2025-04-20" },
  { id: "6", name: "Marketing Exec", email: "marketing@yasirzayed.com", role: "staff", department: "Marketing", status: "active", responsibilities: ["Campaign execution", "Social media posts", "Email newsletters"], joinedAt: "2025-08-01" },
  { id: "7", name: "Junior Dev", email: "dev@yasirzayed.com", role: "staff", department: "Technology", status: "pending", responsibilities: ["Frontend development", "Bug fixes", "Testing"], joinedAt: "2026-08-28" },
  { id: "8", name: "Contractor", email: "contractor@example.com", role: "staff", department: "Technology", status: "suspended", responsibilities: ["WordPress development"], joinedAt: "2026-06-01" },
];

const mockSubmissions: FormSubmission[] = [
  { id: "1", name: "James Mwangi", email: "james@techcorp.co.ke", subject: "AI Chatbot Integration", message: "We need an AI chatbot for our e-commerce platform. Can you handle product recommendations and order tracking?", department: "Technology", status: "unread", createdAt: "2026-09-01T10:30:00Z" },
  { id: "2", name: "Sarah Williams", email: "sarah@greenfield.com", subject: "Website Redesign", message: "Our corporate site needs a complete overhaul. We want something modern with a client portal.", department: "Technology", status: "replied", createdAt: "2026-08-31T14:20:00Z" },
  { id: "3", name: "Ahmed Hassan", email: "ahmed@albaraka.ae", subject: "Security Assessment", message: "We need a comprehensive security assessment for our new office building in Dubai.", department: "Security", status: "escalated", createdAt: "2026-08-30T09:15:00Z" },
  { id: "4", name: "Priya Patel", email: "priya@innovate.in", subject: "Partnership Inquiry", message: "Interested in a technology partnership for the Indian market. Can we schedule a call?", department: "Business Development", status: "unread", createdAt: "2026-08-29T16:45:00Z" },
];

const mockChats: ChatMessage[] = [
  {
    id: "1", client: "James Mwangi", clientEmail: "james@techcorp.co.ke",
    message: "Hi, I need help with setting up the AI chatbot on our site",
    department: "Technology", assignedTo: "Tech Lead", status: "active",
    createdAt: "2026-09-01T10:30:00Z",
    messages: [
      { from: "James Mwangi", text: "Hi, I need help with setting up the AI chatbot on our site", time: "10:30" },
      { from: "Tech Lead", text: "Hello James! I'd be happy to help. What platform is your website built on?", time: "10:32" },
      { from: "James Mwangi", text: "It's a custom React app with a Node.js backend", time: "10:33" },
      { from: "Tech Lead", text: "Perfect, we can integrate our AI chatbot solution directly. Let me send you a scope document.", time: "10:35" },
    ],
  },
  {
    id: "2", client: "Sarah Williams", clientEmail: "sarah@greenfield.com",
    message: "When can we expect the first design mockups?",
    department: "Technology", assignedTo: "Junior Dev", status: "waiting",
    createdAt: "2026-08-31T14:20:00Z",
    messages: [
      { from: "Sarah Williams", text: "When can we expect the first design mockups?", time: "14:20" },
      { from: "Junior Dev", text: "Hi Sarah, the design team is working on them. Expected by Friday.", time: "14:25" },
      { from: "Sarah Williams", text: "Can we get an interim preview sooner?", time: "14:30" },
    ],
  },
  {
    id: "3", client: "Ahmed Hassan", clientEmail: "ahmed@albaraka.ae",
    message: "We need the security audit report urgently",
    department: "Security", assignedTo: "Security Ops", status: "escalated",
    createdAt: "2026-08-30T09:15:00Z",
    messages: [
      { from: "Ahmed Hassan", text: "We need the security audit report urgently", time: "09:15" },
      { from: "Security Ops", text: "Ahmed, the audit is 80% complete. I'll have the preliminary report by tomorrow.", time: "09:20" },
      { from: "Ahmed Hassan", text: "Our board meeting is on Wednesday. Can you expedite?", time: "09:22" },
      { from: "Security Ops", text: "I'll escalate this to our management. We'll prioritize your report.", time: "09:25" },
    ],
  },
];

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
  const [departments, setDepartments] = useState(mockDepartments);
  const [staff, setStaff] = useState(mockStaff);
  const [submissions] = useState(mockSubmissions);
  const [chats] = useState(mockChats);
  const [search, setSearch] = useState("");
  const [showCreateStaff, setShowCreateStaff] = useState(false);
  const [showCreateDept, setShowCreateDept] = useState(false);
  const [expandedChat, setExpandedChat] = useState<string | null>(null);
  const [expandedSubmission, setExpandedSubmission] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");


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
    { id: "staff", label: "Staff", icon: Users, count: staff.length },
    { id: "departments", label: "Departments", icon: Building2, count: departments.length },
    { id: "submissions", label: "Form Submissions", icon: FileText, count: submissions.filter((s) => s.status === "unread").length },
    { id: "chats", label: "Live Chats", icon: MessageSquare, count: chats.filter((c) => c.status === "active").length },
  ];

  const handleCreateStaff = () => {
    if (!newName.trim() || !newEmail.trim()) return;
    setStaff((prev) => [...prev, {
      id: Date.now().toString(), name: newName, email: newEmail, role: newRole,
      department: newDept, status: "pending" as StaffStatus,
      responsibilities: newResponsibilities.split(",").map((r) => r.trim()).filter(Boolean),
      joinedAt: new Date().toISOString().split("T")[0],
    }]);
    setNewName(""); setNewEmail(""); setNewResponsibilities(""); setShowCreateStaff(false);
  };

  const handleCreateDept = () => {
    if (!newDeptName.trim()) return;
    setDepartments((prev) => [...prev, {
      id: Date.now().toString(), name: newDeptName, head: newDeptHead || "TBD",
      staffCount: 0, description: newDeptDesc,
    }]);
    setNewDeptName(""); setNewDeptHead(""); setNewDeptDesc(""); setShowCreateDept(false);
  };

  const toggleStaffStatus = (id: string, status: StaffStatus) => {
    setStaff((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
  };

  const deleteStaff = (id: string) => {
    setStaff((prev) => prev.filter((s) => s.id !== id));
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
                      <option value="manager">Manager</option>
                      <option value="staff">Staff</option>
                    </select>
                    <select value={newDept} onChange={(e) => setNewDept(e.target.value)} className={inputClass}>
                      {departments.map((d) => <option key={d.id} value={d.name}>{d.name}</option>)}
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
              {staff.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase())).map((s) => (
                <div key={s.id} className="grid grid-cols-12 gap-2 px-4 py-3 items-center hover:bg-muted/30 transition-colors">
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
                    <button onClick={() => toggleStaffStatus(s.id, "active")} className="p-1.5 rounded-lg text-muted-foreground hover:text-emerald-500 hover:bg-emerald-500/10 transition-colors" title="Approve"><UserCheck className="w-3.5 h-3.5" /></button>
                    <button onClick={() => toggleStaffStatus(s.id, "suspended")} className="p-1.5 rounded-lg text-muted-foreground hover:text-amber-500 hover:bg-amber-500/10 transition-colors" title="Suspend"><Ban className="w-3.5 h-3.5" /></button>
                    <button onClick={() => deleteStaff(s.id)} className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
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
              <div key={dept.id} className="p-5 rounded-xl bg-card border border-border hover:border-border/80 transition-all">
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
                  <button onClick={() => { setDepartments((prev) => prev.filter((d) => d.id !== dept.id)); }} className="text-xs text-destructive hover:underline">Delete</button>
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
                <div key={sub.id}>
                  <div className="px-5 py-4 cursor-pointer hover:bg-muted/30 transition-colors" onClick={() => setExpandedSubmission(expandedSubmission === sub.id ? null : sub.id)}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        {expandedSubmission === sub.id ? <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />}
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
                  {expandedSubmission === sub.id && (
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
              <button key={chat.id} onClick={() => setExpandedChat(expandedChat === chat.id ? null : chat.id)} className={`w-full text-left p-4 rounded-xl border transition-all ${expandedChat === chat.id ? "border-electric bg-electric/5" : "bg-card border-border hover:border-border/80"}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-foreground truncate">{chat.client}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium capitalize ${chatStatusColors[chat.status]}`}>{chat.status}</span>
                </div>
                <p className="text-xs text-muted-foreground truncate">{chat.message}</p>
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
              const chat = chats.find((c) => c.id === expandedChat);
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
                        {staff.filter((s) => s.department === chat.department && s.status === "active").map((s) => <option key={s.id}>{s.name}</option>)}
                      </select>
                      <button className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 text-amber-500 rounded-lg text-xs font-medium hover:bg-amber-500/20"><ArrowUpRight className="w-3 h-3" /> Escalate</button>
                    </div>
                  </div>
                  <div className="p-5 space-y-4 max-h-[400px] overflow-y-auto">
                    {chat.messages.map((msg, i) => (
                      <div key={i} className={`flex ${msg.from === chat.client ? "justify-start" : "justify-end"}`}>
                        <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${msg.from === chat.client ? "bg-muted text-foreground rounded-bl-sm" : "bg-electric text-white rounded-br-sm"}`}>
                          <p>{msg.text}</p>
                          <p className={`text-[10px] mt-1 ${msg.from === chat.client ? "text-muted-foreground" : "text-white/60"}`}>{msg.from} · {msg.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-5 py-4 border-t border-border flex gap-2">
                    <input placeholder="Type a reply..." className="flex-1 px-4 py-2 rounded-lg border bg-background text-sm" />
                    <button className="px-4 py-2 bg-electric text-white rounded-lg text-sm font-medium hover:bg-electric-dark"><Send className="w-4 h-4" /></button>
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
