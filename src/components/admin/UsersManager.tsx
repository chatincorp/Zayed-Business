import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, MoreVertical } from "lucide-react";

interface AppUser {
  id: string;
  name: string;
  email: string;
  role: "super_admin" | "admin" | "editor" | "author" | "viewer";
  status: "active" | "invited" | "disabled";
  lastActive: string;
}

const roleColors: Record<string, string> = {
  super_admin: "bg-electric/10 text-electric",
  admin: "bg-violet-500/10 text-violet-500",
  editor: "bg-amber-500/10 text-amber-500",
  author: "bg-emerald-500/10 text-emerald-500",
  viewer: "bg-muted text-muted-foreground",
};

const mockUsers: AppUser[] = [
  { id: "1", name: "Yasir Zayed", email: "yasir@yasirzayed.com", role: "super_admin", status: "active", lastActive: "2026-09-01T10:00:00Z" },
  { id: "2", name: "Content Desk", email: "content@yasirzayed.com", role: "editor", status: "active", lastActive: "2026-08-31T14:30:00Z" },
  { id: "3", name: "Finance Desk", email: "finance@yasirzayed.com", role: "editor", status: "active", lastActive: "2026-08-30T09:15:00Z" },
  { id: "4", name: "Tech Desk", email: "tech@yasirzayed.com", role: "author", status: "active", lastActive: "2026-08-29T16:45:00Z" },
  { id: "5", name: "Guest Writer", email: "guest@example.com", role: "viewer", status: "invited", lastActive: "Never" },
];

export default function UsersManager() {
  const [users] = useState(mockUsers);
  const [search, setSearch] = useState("");
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"admin" | "editor" | "author" | "viewer">("editor");

  const filtered = users.filter((u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground text-sm mt-1">{users.length} users · {users.filter((u) => u.status === "active").length} active</p>
        </div>
        <button onClick={() => setShowInvite(!showInvite)} className="flex items-center gap-2 px-4 py-2 bg-electric text-white rounded-lg text-sm font-medium hover:bg-electric-dark transition-colors">
          <Plus className="w-4 h-4" /> Invite User
        </button>
      </div>

      {showInvite && (
        <div className="p-5 rounded-xl bg-card border border-border mb-6 space-y-4">
          <h3 className="font-semibold text-sm">Invite New User</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <input type="email" placeholder="Email address" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} className="flex-1 px-3 py-2 rounded-lg border bg-background text-sm" />
            <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value as typeof inviteRole)} className="px-3 py-2 rounded-lg border bg-background text-sm">
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
              <option value="author">Author</option>
              <option value="viewer">Viewer</option>
            </select>
            <button className="px-4 py-2 bg-electric text-white rounded-lg text-sm font-medium hover:bg-electric-dark">Send Invite</button>
          </div>
        </div>
      )}

      <div className="relative max-w-sm mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users..." className="w-full pl-9 pr-4 py-2 rounded-lg bg-card border border-border text-sm" />
      </div>

      <div className="rounded-xl bg-card border border-border overflow-hidden">
        <div className="grid grid-cols-12 gap-2 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground border-b border-border bg-muted/30">
          <div className="col-span-3">User</div>
          <div className="col-span-3">Email</div>
          <div className="col-span-2 text-center">Role</div>
          <div className="col-span-2 text-center">Status</div>
          <div className="col-span-1">Last Active</div>
          <div className="col-span-1 text-right"></div>
        </div>
        <div className="divide-y divide-border">
          {filtered.map((u) => (
            <div key={u.id} className="grid grid-cols-12 gap-2 px-4 py-3 items-center hover:bg-muted/30 transition-colors">
              <div className="col-span-3 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-electric/10 flex items-center justify-center text-electric text-xs font-bold">
                  {u.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <span className="text-sm font-medium text-foreground">{u.name}</span>
              </div>
              <div className="col-span-3"><span className="text-sm text-foreground">{u.email}</span></div>
              <div className="col-span-2 flex justify-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-medium capitalize ${roleColors[u.role]}`}>{u.role.replace("_", " ")}</span></div>
              <div className="col-span-2 flex justify-center">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${u.status === "active" ? "bg-emerald-500/10 text-emerald-500" : u.status === "invited" ? "bg-amber-500/10 text-amber-500" : "bg-red-500/10 text-red-500"}`}>{u.status}</span>
              </div>
              <div className="col-span-1"><span className="text-[10px] text-muted-foreground">{u.lastActive === "Never" ? "Never" : new Date(u.lastActive).toLocaleDateString()}</span></div>
              <div className="col-span-1 flex justify-end"><button className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"><MoreVertical className="w-3.5 h-3.5" /></button></div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
