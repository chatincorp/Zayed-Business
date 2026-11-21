import { describe, expect, it } from "vitest";
import {
  DeployConfigError,
  deployArgs,
  deployEnv,
  parseDeployKey,
  previewNameFrom,
  resolveDeployTarget,
} from "../scripts/deployKey.mjs";

const SECRET = "s3cr3t-value";
const PROD_KEY = `prod:industrious-goldfinch-255|${SECRET}`;
const PREVIEW_KEY = `preview:zayed-preview-branch|${SECRET}`;

function expectConfigError(fn: () => unknown, message: RegExp) {
  try {
    fn();
  } catch (error) {
    expect(error).toBeInstanceOf(DeployConfigError);
    expect((error as Error).message).toMatch(message);
    return;
  }
  throw new Error("expected a DeployConfigError");
}

describe("deploy key parsing", () => {
  it("reads the deployment type and name", () => {
    expect(parseDeployKey(PROD_KEY)).toEqual({
      type: "prod",
      deployment: "industrious-goldfinch-255",
    });
    expect(parseDeployKey(PREVIEW_KEY)?.type).toBe("preview");
  });

  it("rejects anything that is not a deploy key", () => {
    expect(parseDeployKey("")).toBeNull();
    expect(parseDeployKey("prod:name-without-secret")).toBeNull();
    expect(parseDeployKey("no-colon|secret")).toBeNull();
    expect(parseDeployKey("prod:|secret")).toBeNull();
    expect(parseDeployKey(undefined)).toBeNull();
  });
});

describe("preview deployment names", () => {
  it("turns a branch name into a deployment name", () => {
    expect(previewNameFrom("feature/Foo Bar#1")).toBe("feature-foo-bar-1");
    expect(previewNameFrom("  Freebuff/60df22  ")).toBe("freebuff-60df22");
  });

  it("trims separators and caps the length", () => {
    expect(previewNameFrom("--lead--")).toBe("lead");
    expect(previewNameFrom("a".repeat(120))).toHaveLength(48);
    expect(previewNameFrom("")).toBe("");
  });
});

describe("picking a deployment", () => {
  it("sends production to the production key's deployment", () => {
    const target = resolveDeployTarget({
      environment: "production",
      keys: { CONVEX_DEPLOY_KEY_PRODUCTION: PROD_KEY },
    });
    expect(target.deployment).toBe("industrious-goldfinch-255");
    expect(target.previewName).toBeNull();
  });

  it("keeps a preview deploy on a preview deployment for the branch", () => {
    const target = resolveDeployTarget({
      environment: "preview",
      keys: { CONVEX_DEPLOY_KEY_PREVIEW: PREVIEW_KEY },
      branch: "freebuff/60df22c101d210ae107e988f",
    });
    expect(target.deployment).toBe("zayed-preview-branch");
    expect(target.previewName).toBe("freebuff-60df22c101d210ae107e988f");
  });

  it("refuses to deploy a branch with the production key", () => {
    expectConfigError(
      () =>
        resolveDeployTarget({
          environment: "preview",
          keys: { CONVEX_DEPLOY_KEY_PREVIEW: PROD_KEY },
          branch: "some-branch",
        }),
      /refusing to push a branch schema to the staff database/,
    );
  });

  it("refuses production when handed a preview key", () => {
    expectConfigError(
      () =>
        resolveDeployTarget({
          environment: "production",
          keys: { CONVEX_DEPLOY_KEY_PRODUCTION: PREVIEW_KEY },
        }),
      /cannot deploy production/,
    );
  });

  it("does not read the key meant for the other environment", () => {
    // A preview key in the production slot does not borrow the preview slot.
    expectConfigError(
      () =>
        resolveDeployTarget({
          environment: "production",
          keys: { CONVEX_DEPLOY_KEY_PREVIEW: PREVIEW_KEY },
        }),
      /CONVEX_DEPLOY_KEY_PRODUCTION is not set/,
    );
  });

  it("names the missing variable", () => {
    expectConfigError(
      () => resolveDeployTarget({ environment: "preview", keys: {}, branch: "b" }),
      /CONVEX_DEPLOY_KEY_PREVIEW is not set/,
    );
    expectConfigError(
      () => resolveDeployTarget({ environment: "production", keys: {} }),
      /CONVEX_DEPLOY_KEY_PRODUCTION is not set/,
    );
  });

  it("rejects an unknown target", () => {
    expectConfigError(
      () => resolveDeployTarget({ environment: "staging", keys: {} }),
      /Unknown target "staging"/,
    );
  });

  it("needs a branch name for a preview deployment", () => {
    expectConfigError(
      () =>
        resolveDeployTarget({
          environment: "preview",
          keys: { CONVEX_DEPLOY_KEY_PREVIEW: PREVIEW_KEY },
          branch: "",
        }),
      /needs a branch name/,
    );
  });

  it("keeps the secret out of error messages", () => {
    try {
      resolveDeployTarget({
        environment: "preview",
        keys: { CONVEX_DEPLOY_KEY_PREVIEW: PROD_KEY },
        branch: "b",
      });
      throw new Error("expected a refusal");
    } catch (error) {
      expect((error as Error).message).not.toContain(SECRET);
    }
  });
});

describe("deploy process wiring", () => {
  const target = resolveDeployTarget({
    environment: "preview",
    keys: { CONVEX_DEPLOY_KEY_PREVIEW: PREVIEW_KEY },
    branch: "feature/login",
  });

  it("passes the preview name to convex deploy", () => {
    expect(deployArgs(target)).toEqual([
      "convex",
      "deploy",
      "--preview-name",
      "feature-login",
    ]);
  });

  it("does not pass a preview name to production", () => {
    const prod = resolveDeployTarget({
      environment: "production",
      keys: { CONVEX_DEPLOY_KEY_PRODUCTION: PROD_KEY },
    });
    expect(deployArgs(prod)).toEqual(["convex", "deploy"]);
  });

  it("runs with the chosen key and no ambient deployment selector", () => {
    const env = deployEnv(target, {
      CONVEX_DEPLOY_KEY: PROD_KEY,
      CONVEX_DEPLOYMENT: "prod:industrious-goldfinch-255",
      PATH: "/bin",
    });
    expect(env.CONVEX_DEPLOY_KEY).toBe(PREVIEW_KEY);
    expect(env).not.toHaveProperty("CONVEX_DEPLOYMENT");
    expect(env.PATH).toBe("/bin");
  });
});
