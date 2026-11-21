/**
 * Admin panel privileges.
 *
 * Shared by the server (authorization checks) and the admin UI (checkbox
 * assignment + sidebar filtering). Keep the keys identical to the sidebar
 * section ids in `src/pages/Admin.tsx`.
 *
 * This module must stay free of server-only imports so the browser can use it.
 */

export const PRIVILEGES = [
  { key: "dashboard", label: "Dashboard" },
  { key: "services", label: "Services" },
  { key: "leads", label: "Leads" },
  { key: "testimonials", label: "Testimonials & Ratings" },
  { key: "faq", label: "FAQs" },
  { key: "analytics", label: "Analytics" },
  { key: "checkout", label: "Plans & Checkout" },
  { key: "pages", label: "Pages" },
  { key: "navigation", label: "Navigation" },
  { key: "landing-pages", label: "Landing Pages" },
  { key: "site-sections", label: "Site Sections" },
  { key: "security", label: "Security Services" },
  { key: "technology", label: "Technology Services" },
  { key: "ai", label: "AI Services" },
  { key: "projects", label: "Projects" },
  { key: "fmcg-suppliers", label: "FMCG Suppliers" },
  { key: "fmcg-products", label: "FMCG Products" },
  { key: "fmcg-orders", label: "FMCG Orders" },
  { key: "fmcg-enquiries", label: "FMCG Enquiries" },
  { key: "campaigns", label: "Campaigns" },
  { key: "ctas", label: "CTAs" },
  { key: "email-templates", label: "Email Templates" },
  { key: "forms", label: "Contact Forms" },
  { key: "tabloid", label: "Zayed Tabloid" },
  { key: "media", label: "Media Library" },
  { key: "seo-dashboard", label: "SEO" },
  { key: "global-settings", label: "Global Settings" },
  { key: "audit-logs", label: "Audit Logs" },
  { key: "system-health", label: "System Health" },
  { key: "integrations", label: "Integrations" },
  { key: "users", label: "Client Accounts" },
  { key: "staff", label: "Staff Accounts" },
  { key: "roles", label: "Roles & Permissions" },
  { key: "homepage", label: "Homepage Sections" },
  { key: "industries", label: "Industries & Sectors" },
  { key: "countries", label: "Target Countries" },
  { key: "partners", label: "Partners" },
  { key: "blog", label: "Blog / Insights" },
  { key: "blocks", label: "Reusable Blocks" },
  { key: "ai-assistant", label: "AI Assistant" },
  { key: "ai-settings", label: "AI Settings" },
  { key: "page-seo", label: "Page SEO" },
  { key: "keywords", label: "Keywords" },
  { key: "regional-seo", label: "Regional SEO" },
  { key: "technical-seo", label: "Technical SEO" },
  { key: "yasir-verify", label: "YASIR VERIFY" },
  { key: "security-logs", label: "Security Logs" },
  { key: "rate-limiting", label: "Rate Limiting" },
  { key: "blocked", label: "Blocked Activity" },
  { key: "email-config", label: "Email Configuration" },
] as const;

export type PrivilegeKey = (typeof PRIVILEGES)[number]["key"];

export const ALL_PRIVILEGES: string[] = PRIVILEGES.map((p) => p.key);

/** Roles that always see every admin panel section. */
export const ROOT_ROLES = ["admin", "super_admin"] as const;

/** Roles that may open the panel at all (subject to their privileges). */
export const PANEL_ROLES = [
  "admin",
  "super_admin",
  "staff",
  "manager",
  "editor",
  "marketing",
  "sales",
  "security_manager",
  "tabloid_editor",
] as const;

export function roleCanUsePanel(role: string | undefined | null): boolean {
  return !!role && (PANEL_ROLES as readonly string[]).includes(role);
}

export function roleIsRoot(role: string | undefined | null): boolean {
  return !!role && (ROOT_ROLES as readonly string[]).includes(role);
}
