/**
 * Auth is fully client-side so the app works as a static bundle.
 * The provider lives in `@/lib/auth`; this module keeps the existing import
 * path used across the app.
 */
export { useAuth } from "@/lib/auth";
export type { AuthContextValue, AuthUser } from "@/lib/auth";
