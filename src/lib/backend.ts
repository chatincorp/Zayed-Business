/**
 * Backend configuration.
 *
 * The marketing site, tabloid fallback content and the workspace are built to
 * run from a static bundle, which talks to the Convex production deployment.
 */

/** Production deployment: Convex team `grand-merchant`, project `zayed-business`. */
export const PRODUCTION_CONVEX_URL =
  "https://industrious-goldfinch-255.convex.cloud";

/**
 * This workspace's `.env.local` still pins the retired platform dev deployment.
 * Ignoring it means no build can ship pointing at a dev backend, while a real
 * override set anywhere else still wins.
 */
const RETIRED_DEV_DEPLOYMENT = "dependable-goose-138";

const envUrl = (import.meta.env.VITE_CONVEX_URL as string | undefined)?.trim();

const isRetiredDevDeployment =
  !!envUrl && envUrl.includes(RETIRED_DEV_DEPLOYMENT);

export const CONVEX_URL =
  envUrl && !isRetiredDevDeployment ? envUrl : PRODUCTION_CONVEX_URL;

export const isBackendConfigured = CONVEX_URL.length > 0;
