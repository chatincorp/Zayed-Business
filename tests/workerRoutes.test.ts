import { readFileSync, readdirSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { isAppRoute } from "../worker.js";

const mainSource = readFileSync(new URL("../src/main.tsx", import.meta.url), "utf8");

/** `path="/services/:slug"` → `["/services/:slug"]`; `*` is the NotFound route. */
const declaredRoutes = [
  ...mainSource.matchAll(/<Route\s+path="([^"]+)"/g),
]
  .map((match) => match[1])
  .filter((route) => route !== "*");

/** Every literal or templated in-app link across the app, e.g. `to="/pricing"`. */
const srcDir = new URL("../src", import.meta.url);
const srcFiles = readdirSync(srcDir, { recursive: true, encoding: "utf8" })
  .filter((file) => file.endsWith(".tsx") || file.endsWith(".ts"))
  .filter((file) => !file.includes("_generated"));

const linkTargets = srcFiles.flatMap((file) => {
  const source = readFileSync(new URL(file, `${srcDir.href}/`), "utf8");
  return [
    ...source.matchAll(/(?:to|href)="([^"#][^"]*)"/g),
    ...source.matchAll(/(?:to|href)=\{\s*`([^`]+)`\s*\}/g),
  ]
    .map((match) => match[1].replace(/\$\{[^}]*\}/g, "sample").split(/[?#]/)[0])
    .filter((target) => target.startsWith("/"))
    .map((target) => target.replace(/\/+$/, "") || "/");
});

/** Turn a React Router path into a concrete URL. */
const concrete = (route: string) =>
  route
    .replace(/\*$/, "anything")
    .replace(/:[A-Za-z0-9_]+/g, "sample")
    .replace(/\/+$/, "") || "/";

describe("route table mirror", () => {
  it("finds the app's routes and links in main.tsx", () => {
    expect(declaredRoutes.length).toBeGreaterThan(20);
    expect(linkTargets.length).toBeGreaterThan(10);
  });

  it("accepts every route declared in src/main.tsx", () => {
    const missing = declaredRoutes.filter(
      (route) => !isAppRoute(concrete(route)),
    );
    expect(missing).toEqual([]);
  });

  it("accepts every literal in-app link target", () => {
    const missing = linkTargets.filter((target) => !isAppRoute(target));
    expect(missing).toEqual([]);
  });

  it("accepts the prerendered local-SEO pages", () => {
    expect(isAppRoute("/best/fmcg-sales/mombasa")).toBe(true);
    expect(isAppRoute("/best/fmcg-sales/mombasa/")).toBe(true);
  });
});

describe("unknown paths", () => {
  it("rejects paths with no route", () => {
    for (const path of [
      "/nonexistent-xyz",
      "/api/health",
      "/services/extra/deep",
      "/tabloid/a/b",
      "/best/one",
      "/wholesale/checkout",
      "/supplier",
    ]) {
      expect(isAppRoute(path), path).toBe(false);
    }
  });

  it("normalises trailing slashes and encoded paths", () => {
    expect(isAppRoute("/pricing/")).toBe(true);
    expect(isAppRoute("/privacy//")).toBe(true);
    expect(isAppRoute("/%70ricing")).toBe(true);
    expect(isAppRoute("")).toBe(true);
  });

  it("keeps admin sub-pages and article deep links working", () => {
    expect(isAppRoute("/admin/users")).toBe(true);
    expect(isAppRoute("/admin")).toBe(true);
    expect(isAppRoute("/tabloid/some-article-slug")).toBe(true);
    expect(isAppRoute("/services/ai-automation")).toBe(true);
  });
});
