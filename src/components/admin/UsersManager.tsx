import { useState } from "react";
import { motion } from "framer-motion";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { Search, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";

type AppRole = "user" | "member" | "editor" | "marketing" | "sales" | "supplier" | "security_manager" | "tabloid_editor" | "admin" | "super_admin";

const ROLE_OPTIONS: AppRole[] = [
  "user",
  "member",
  "editor",
  "marketing",
  "sales",
  "supplier",
  "security_manager",
  "tabloid_editor",
  "admin",
  "super_admin",
];

const roleColors: Record<string, string> = {
  super_admin: "bg-electric/10 text-electric",
  admin: "bg-violet-500/10 text-violet-500",
  editor: "bg-amber-500/10 text-amber-500",
  member: "bg-emerald-500/10 text-emerald-500",
  supplier: "bg-amber-500/10 text-amber-600",
  sales: "bg-sky-500/10 text-sky-600",
  user: "bg-muted text-muted-foreground",
};

export default function UsersManager() {
  const { user } = useAuth();
  const users = useQuery(api.adminRbac.listAppUsers);
  const updateRole = useMutation(api.adminRbac.updateUserRole);
  const [search, setSearch] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);

  const all = users ?? [];
  const filtered = all.filter((u) => {
    const q = search.toLowerCase();
    return (u.name ?? "").toLowerCase().includes(q) || (u.email ?? "").toLowerCase().includes(q);
  });

  const changeRole = async (id: Id<"users">, role: AppRole) => {
    setSavingId(id);
    try {
      await updateRole({ id, role, actorEmail: user?.email ?? "" });
      toast.success("Role updated.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update the role.");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {users === undefined
              ? "Loading accounts…"
              : `${all.length} signed-up account${all.length === 1 ? "" : "s"} · ${all.filter((u) => u.role === "admin" || u.role === "super_admin").length} administrator${all.filter((u) => u.role === "admin" || u.role === "super_admin").length === 1 ? "" : "s"}`}
          </p>
        </div>
      </div>

      <div className="mb-4 flex items-start gap-2 rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
        <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
        <span>
          Accounts are created through the public sign-in page. Assigning a role here controls what that
          account can reach; staff records under Roles &amp; Permissions are the internal directory.
        </span>
      </div>

      <div className="relative max-w-sm mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users..."
          className="w-full pl-9 pr-4 py-2 rounded-lg bg-card border border-border text-sm"
        />
      </div>

      <div className="rounded-xl bg-card border border-border overflow-hidden">
        <div className="grid grid-cols-12 gap-2 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground border-b border-border bg-muted/30">
          <div className="col-span-4">User</div>
          <div className="col-span-4">Email</div>
          <div className="col-span-4 text-right">Role</div>
        </div>
        <div className="divide-y divide-border">
          {filtered.map((u) => (
            <div key={u._id} className="grid grid-cols-12 gap-2 px-4 py-3 items-center hover:bg-muted/30 transition-colors">
              <div className="col-span-4 flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-full bg-electric/10 flex items-center justify-center text-electric text-xs font-bold shrink-0">
                  {(u.name ?? u.email ?? "?").split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{u.name ?? "Unnamed account"}</p>
                  <span className={`inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-medium capitalize ${roleColors[u.role ?? "user"] ?? roleColors.user}`}>
                    {u.role ?? "user"}
                  </span>
                </div>
              </div>
              <div className="col-span-4 min-w-0">
                <span className="text-sm text-foreground truncate block">{u.email ?? "—"}</span>
                {u.isAnonymous && <span className="text-[10px] text-muted-foreground">guest session</span>}
              </div>
              <div className="col-span-4 flex justify-end">
                <select
                  value={u.role ?? "user"}
                  disabled={savingId === u._id}
                  onChange={(e) => void changeRole(u._id, e.target.value as AppRole)}
                  className="px-2 py-1.5 rounded-lg border border-border bg-background text-xs text-foreground disabled:opacity-50"
                >
                  {ROLE_OPTIONS.map((role) => (
                    <option key={role} value={role}>{role.replace("_", " ")}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
          {users !== undefined && filtered.length === 0 && (
            <div className="py-12 text-center text-muted-foreground text-sm">
              {all.length === 0 ? "No accounts have signed up yet." : "No users match your search."}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
