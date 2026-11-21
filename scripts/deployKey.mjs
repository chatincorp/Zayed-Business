/**
 * Deploy-key routing for Convex.
 *
 * Production and preview deployments each get their own deploy key. A preview
 * key makes `npx convex deploy` target a per-branch preview deployment; a
 * production key targets the deployment the staff actually use, schema and all.
 *
 * This module only decides *which* key a target may run with, and never prints
 * or returns the secret part. Keeping the rules here means they can be tested
 * without a Convex account.
 */

export const KEY_ENV_VARS = {
  preview: "CONVEX_DEPLOY_KEY_PREVIEW",
  production: "CONVEX_DEPLOY_KEY_PRODUCTION",
};

/** The `type` a key must carry to be allowed to touch the staff deployment. */
const PRODUCTION_KEY_TYPE = "prod";

export class DeployConfigError extends Error {}

/**
 * A Convex deploy key looks like `<type>:<deployment>|<secret>`, e.g.
 * `prod:industrious-goldfinch-255|<secret>`. Only the public half is read.
 */
export function parseDeployKey(key) {
  const [reference, secret] = String(key ?? "").split("|");
  if (!reference || !secret) return null;
  const separator = reference.indexOf(":");
  if (separator < 1) return null;
  const type = reference.slice(0, separator);
  const deployment = reference.slice(separator + 1);
  if (!deployment) return null;
  return { type, deployment };
}

/** Branch name → Convex preview deployment name. */
export function previewNameFrom(branch) {
  return String(branch ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^[-.]+|[-.]+$/g, "")
    .slice(0, 48);
}

/**
 * Decide which key (and preview name) a deploy target may use.
 *
 * Throws `DeployConfigError` rather than returning a bad target: a branch that
 * asks for "preview" while holding the production key must stop, not deploy.
 */
export function resolveDeployTarget({ environment, keys = {}, branch }) {
  if (!Object.prototype.hasOwnProperty.call(KEY_ENV_VARS, String(environment))) {
    throw new DeployConfigError(
      `Unknown target "${environment}". Use "preview" or "production".`,
    );
  }

  const keyVar = KEY_ENV_VARS[environment];
  const key = keys[keyVar];
  if (!key) {
    throw new DeployConfigError(
      `${keyVar} is not set. Add the ${environment} deploy key to the environment before deploying.`,
    );
  }

  const parsed = parseDeployKey(key);
  if (!parsed) {
    throw new DeployConfigError(
      `${keyVar} is not a Convex deploy key (expected "<type>:<deployment>|<secret>").`,
    );
  }

  const isProductionKey = parsed.type === PRODUCTION_KEY_TYPE;

  if (environment === "production" && !isProductionKey) {
    throw new DeployConfigError(
      `${keyVar} is a "${parsed.type}" key, so it cannot deploy production. Use the production deploy key.`,
    );
  }

  if (environment === "preview" && isProductionKey) {
    throw new DeployConfigError(
      `${keyVar} is the production key for "${parsed.deployment}" — refusing to push a branch schema to the staff database. Use a preview deploy key.`,
    );
  }

  let previewName = null;
  if (environment === "preview") {
    previewName = previewNameFrom(branch);
    if (!previewName) {
      throw new DeployConfigError(
        "A preview deploy needs a branch name (pass CONVEX_PREVIEW_NAME or run inside a Git checkout).",
      );
    }
  }

  return {
    environment,
    key,
    keyVariable: keyVar,
    type: parsed.type,
    deployment: parsed.deployment,
    previewName,
  };
}

/** Arguments for `npx convex deploy` for a resolved target. */
export function deployArgs(target, { build = false } = {}) {
  const args = ["convex", "deploy"];
  if (target.previewName) args.push("--preview-name", target.previewName);
  if (build) {
    args.push(
      "--cmd",
      "npm run build:cloudflare",
      "--cmd-url-env-var-name",
      "VITE_CONVEX_URL",
    );
  }
  return args;
}

/**
 * Environment for the deploy process: the chosen key replaces whatever
 * `CONVEX_DEPLOY_KEY` the shell had, and `CONVEX_DEPLOYMENT` is removed so a
 * local `.env.local` selection cannot redirect the deploy to another
 * deployment.
 */
export function deployEnv(target, baseEnv = {}) {
  const env = { ...baseEnv, CONVEX_DEPLOY_KEY: target.key };
  delete env.CONVEX_DEPLOYMENT;
  return env;
}
