#!/usr/bin/env node
/**
 * Deploy Convex functions, schema and indexes to one environment.
 *
 *   npm run convex:deploy:preview      # per-branch preview deployment
 *   npm run convex:deploy:production   # the staff deployment
 *
 * The target only picks a key: production uses CONVEX_DEPLOY_KEY_PRODUCTION,
 * preview uses CONVEX_DEPLOY_KEY_PREVIEW. A preview run refuses to start if the
 * key it was given belongs to the production deployment, so a branch can never
 * reshape the schema the staff use.
 *
 * Flags: --build  also build the frontend against the deployment it just
 *                 deployed (VITE_CONVEX_URL is injected by Convex).
 */
import { spawnSync } from "node:child_process";
import {
  DeployConfigError,
  deployArgs,
  deployEnv,
  resolveDeployTarget,
} from "./deployKey.mjs";

function gitBranch() {
  const result = spawnSync("git", ["rev-parse", "--abbrev-ref", "HEAD"], {
    encoding: "utf8",
  });
  return result.status === 0 ? result.stdout.trim() : "";
}

const [environment, ...flags] = process.argv.slice(2);
const build = flags.includes("--build");

try {
  const target = resolveDeployTarget({
    environment,
    keys: process.env,
    branch:
      process.env.CONVEX_PREVIEW_NAME ||
      process.env.GITHUB_HEAD_REF ||
      process.env.GITHUB_REF_NAME ||
      gitBranch(),
  });

  console.log(
    `convex: deploying ${target.environment} → ${target.deployment}` +
      (target.previewName ? ` (preview "${target.previewName}")` : "") +
      ` using ${target.keyVariable}`,
  );

  const result = spawnSync("npx", deployArgs(target, { build }), {
    stdio: "inherit",
    env: deployEnv(target),
  });
  process.exit(result.status ?? 1);
} catch (error) {
  if (error instanceof DeployConfigError) {
    console.error(`convex: ${error.message}`);
    process.exit(1);
  }
  throw error;
}
