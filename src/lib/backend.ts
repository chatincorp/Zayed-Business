/**
 * Backend configuration.
 *
 * The marketing site, tabloid fallback content and the workspace are built to
 * run from a static bundle. When `VITE_CONVEX_URL` is present we upgrade the
 * experience with the live Convex feed; when it is absent the site still
 * renders completely, using the bundled mock data.
 */

const rawUrl = import.meta.env.VITE_CONVEX_URL as string | undefined;

export const CONVEX_URL = rawUrl?.trim() ?? "";

export const isBackendConfigured = CONVEX_URL.length > 0;
