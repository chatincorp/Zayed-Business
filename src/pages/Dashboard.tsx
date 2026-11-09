import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useSEO } from "@/lib/seo";
import {
  LayoutDashboard,
  LogOut,
  Shield,
  Settings,
  Users,
  FileText,
  ArrowRight,
} from "lucide-react";
import { useNavigate, Link } from "react-router";

export default function Dashboard() {
  useSEO({
    title: "Workspace",
    description:
      "Your Yasir Zayed workspace for services, projects and enquiries.",
    noindex: true,
  });

  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Authenticated workspace
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight">
              Welcome{user?.name ? `, ${user.name}` : ""}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/admin">
              <Button type="button" className="gap-2">
                <LayoutDashboard className="size-4" />
                Open Admin Panel
                <ArrowRight className="size-4" />
              </Button>
            </Link>
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer gap-2 self-start"
              onClick={handleSignOut}
            >
              <LogOut className="size-4" />
              Sign out
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-border/70 shadow-none hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate("/admin")}>
            <CardHeader className="pb-3">
              <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-electric/10 text-electric">
                <LayoutDashboard className="size-5" />
              </div>
              <CardTitle className="text-base">Admin Panel</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Manage website content, pages, services and settings.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/70 shadow-none hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate("/admin#leads")}>
            <CardHeader className="pb-3">
              <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                <Users className="size-5" />
              </div>
              <CardTitle className="text-base">Leads</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                View and manage incoming leads and inquiries.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/70 shadow-none hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate("/admin#services")}>
            <CardHeader className="pb-3">
              <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-violet-500/10 text-violet-500">
                <FileText className="size-5" />
              </div>
              <CardTitle className="text-base">Services</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Manage all service offerings and descriptions.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/70 shadow-none hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate("/admin#security")}>
            <CardHeader className="pb-3">
              <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-500">
                <Shield className="size-5" />
              </div>
              <CardTitle className="text-base">Security</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Manage security solutions and YASIR VERIFY™.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-border/70 shadow-none">
          <CardHeader>
            <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Settings className="size-5" />
            </div>
            <CardTitle>Your dashboard is ready</CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-6 text-muted-foreground">
            Click "Open Admin Panel" to access the full CMS and content management system.
            The admin panel allows you to manage website content, pages, services, leads, SEO, AI tools, security settings and more — all without editing code.
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
