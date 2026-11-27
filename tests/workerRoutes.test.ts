import { readFileSync, readdirSync } from "node:fs";
import { describe, expect, it } from "vitest";
import worker, { isAppRoute } from "../worker.js";

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

/** Assets stub: a 200 HTML shell, or the given response. */
const env = (response = () => new Response("<!doctype html>", {
  headers: { "content-type": "text/html; charset=utf-8" },
})) => ({ ASSETS: { fetch: async () => response() } });

const HSTS = "max-age=31536000; includeSubDomains";

describe("HTTPS pinning", () => {
  it("sends HSTS on the www -> apex 301, which never reaches the assets layer", async () => {
    const response = await worker.fetch(
      new Request("https://www.yasirzayed.com/pricing?x=1"),
      env(),
    );
    expect(response.status).toBe(301);
    expect(response.headers.get("location")).toBe(
      "https://yasirzayed.com/pricing?x=1",
    );
    expect(response.headers.get("strict-transport-security")).toBe(HSTS);
  });

  it("sends HSTS on an unknown-path 404", async () => {
    const response = await worker.fetch(
      new Request("https://yasirzayed.com/nonexistent-xyz"),
      env(),
    );
    expect(response.status).toBe(404);
    expect(response.headers.get("strict-transport-security")).toBe(HSTS);
  });

  it("sends HSTS on the http -> https 301", async () => {
    const response = await worker.fetch(
      new Request("http://yasirzayed.com/pricing?x=1"),
      env(),
    );
    expect(response.status).toBe(301);
    expect(response.headers.get("location")).toBe(
      "https://yasirzayed.com/pricing?x=1",
    );
    expect(response.headers.get("strict-transport-security")).toBe(HSTS);
  });

  it("sends HSTS on the plain-text 404 for a stale asset URL", async () => {
    const response = await worker.fetch(
      new Request("https://yasirzayed.com/assets/app-123.js"),
      env(),
    );
    expect(response.status).toBe(404);
    expect(response.headers.get("content-type")).toBe(
      "text/plain; charset=utf-8",
    );
    expect(response.headers.get("strict-transport-security")).toBe(HSTS);
  });

  it("leaves the assets layer's response and its own HSTS untouched", async () => {
    const response = await worker.fetch(
      new Request("https://yasirzayed.com/pricing"),
      env(() => new Response("<!doctype html>", {
        headers: {
          "content-type": "text/html; charset=utf-8",
          "strict-transport-security": "max-age=123",
        },
      })),
    );
    // Assets responses keep the `public/_headers` policy; the worker must not
    // overwrite it with its own copy.
    expect(response.headers.get("strict-transport-security")).toBe("max-age=123");
  });

  it("leaves loopback development free of HSTS", async () => {
    const response = await worker.fetch(
      new Request("http://localhost:8787/pricing"),
      env(),
    );
    expect(response.headers.get("strict-transport-security")).toBeNull();
  });
});

/**
 * Real traffic shapes. A browser sends the full `text/html...` list only for a
 * navigation; scripts and other subresources send Accept lists without it.
 */
const NAVIGATION = "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8";
const SCRIPT = "*/*";
const STYLESHEET = "text/css,*/*;q=0.1";

const shell = "<!doctype html><html><body>app shell</body></html>";
const shellResponse = () =>
  new Response(shell, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "strict-transport-security": "max-age=31536000; includeSubDomains",
    },
  });

const request = (path: string, accept?: string) =>
  new Request(`https://yasirzayed.com${path}`, accept ? { headers: { accept } } : undefined);

describe("miss classification", () => {
  it("passes a real asset through untouched", async () => {
    const asset = () =>
      new Response("export default 1;", {
        headers: { "content-type": "text/javascript" },
      });
    const response = await worker.fetch(request("/assets/index-BZ6JZS-v.js", SCRIPT), env(asset));
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("text/javascript");
    expect(await response.text()).toBe("export default 1;");
  });

  it("passes the assets layer's own 404 through untouched", async () => {
    const response = await worker.fetch(
      request("/assets/gone-123.js", SCRIPT),
      env(() => new Response("Not Found", { status: 404, headers: { "content-type": "text/plain" } })),
    );
    expect(response.status).toBe(404);
    expect(response.headers.get("content-type")).toBe("text/plain");
  });

  it("serves a navigation to a real route with the shell and a 200", async () => {
    for (const path of ["/", "/contact", "/tabloid", "/services/ai-automation", "/best/fmcg-sales/mombasa"]) {
      const response = await worker.fetch(request(path, NAVIGATION), env(shellResponse));
      expect(response.status, path).toBe(200);
      expect(await response.text(), path).toBe(shell);
    }
  });

  it("answers an unknown navigation with the shell and a 404", async () => {
    const response = await worker.fetch(request("/nonexistent-xyz", NAVIGATION), env(shellResponse));
    expect(response.status).toBe(404);
    expect(response.headers.get("content-type")).toBe("text/html; charset=utf-8");
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(response.headers.get("x-content-type-options")).toBe("nosniff");
    expect(await response.text()).toBe(shell);
  });

  it("answers an unknown path fetched as data with the shell and a 404", async () => {
    const response = await worker.fetch(request("/api/health", SCRIPT), env(shellResponse));
    expect(response.status).toBe(404);
    expect(response.headers.get("content-type")).toBe("text/html; charset=utf-8");
  });

  it("answers a stale asset URL as a script or stylesheet with a plain-text 404", async () => {
    for (const accept of [SCRIPT, STYLESHEET]) {
      const response = await worker.fetch(request("/assets/index-OLDHASH.js", accept), env(shellResponse));
      expect(response.status, accept).toBe(404);
      expect(response.headers.get("content-type"), accept).toBe("text/plain; charset=utf-8");
      expect(await response.text(), accept).toBe("Not Found");
    }
  });

  it("answers a stale asset URL opened as a navigation with a 404, not the 200 shell", async () => {
    const response = await worker.fetch(request("/assets/index-OLDHASH.js", NAVIGATION), env(shellResponse));
    expect(response.status).toBe(404);
    expect(response.headers.get("content-type")).toBe("text/html; charset=utf-8");
  });

  it("treats a file-shaped path as a file even when it fits a route pattern", async () => {
    const response = await worker.fetch(request("/tabloid/news.js", SCRIPT), env(shellResponse));
    expect(response.status).toBe(404);
    expect(response.headers.get("content-type")).toBe("text/plain; charset=utf-8");
  });

  it("still classifies a trailing-slash stale asset as a file", async () => {
    const response = await worker.fetch(request("/assets/index-OLDHASH.js/", SCRIPT), env(shellResponse));
    expect(response.status).toBe(404);
    expect(response.headers.get("content-type")).toBe("text/plain; charset=utf-8");
  });
});
