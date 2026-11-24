/**
 * Cloudflare Worker entrypoint for the Yasir Zayed site.
 *
 * The app is a Vite SPA with prerendered HTML, so the worker mostly hands
 * requests to the static-asset binding. `not_found_handling: "single-page-
 * application"` makes unknown paths fall back to index.html for client-side
 * routing — but the assets layer applies that fallback to *every* miss, so a
 * typo like `/nonexistent-xyz` used to come back as `200` + the app shell and
 * read as a soft 404 to crawlers, and a stale hashed asset URL came back as
 * HTML with a 200 ("Expected a JavaScript module script but the server
 * responded with a MIME type of text/html").
 *
 * So the worker classifies each miss itself:
 *   - a file-shaped path (an extension in the last segment) that is not a
 *     navigation gets a plain-text 404;
 *   - a path that matches no route in `src/main.tsx` gets the SPA shell with a
 *     real `404` status, so the browser still renders the app's own NotFound
 *     page while crawlers see the failure. Client-side navigation is unaffected
 *     — in-app links never reach the server.
 *
 * `isAppRoute` mirrors the React Router table in `src/main.tsx`; the route test
 * in `tests/workerRoutes.test.ts` parses that file and fails if the two drift.
 *
 * Plain-HTTP requests are redirected to HTTPS here, so the production domain
 * serves secure traffic even without the zone's "Always Use HTTPS" toggle.
 * Loopback hosts are exempt so `wrangler dev` keeps working over http.
 *
 * `www.` is the same site, so it is folded into the apex host with a 301 to
 * keep a single canonical origin for SEO and cookies.
 */

const APEX_HOST = "yasirzayed.com";
const LOOPBACK_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]", "0.0.0.0"]);
const FILE_EXTENSION = /\.[a-z0-9]{1,10}$/i;

/** Exact paths from the route table, plus the indexable statics around them. */
const STATIC_ROUTES = new Set([
  "/",
  "/about",
  "/auth",
  "/best",
  "/checkout",
  "/contact",
  "/cookies",
  "/dashboard",
  "/demo/corporate",
  "/demo/ecommerce",
  "/demo/webapp",
  "/fmcg",
  "/fmcg/account",
  "/markets",
  "/portal",
  "/pricing",
  "/privacy",
  "/services",
  "/supplier/dashboard",
  "/supplier/register",
  "/tabloid",
  "/tabloid/editorial",
  "/tabloid/forex",
  "/tabloid/markets",
  "/terms",
  "/wholesale",
]);

/** Parameterised routes: `/services/:slug`, `/best/:service/:place`, … */
const ROUTE_PATTERNS = [
  /^\/services\/[^/]+$/,
  /^\/best\/[^/]+\/[^/]+$/,
  /^\/tabloid\/[^/]+$/,
  /^\/admin(?:\/.*)?$/,
];

/** Trailing slashes are dropped so `/services/` is still the services route. */
function normalisePath(pathname) {
  let path = pathname || "/";
  try {
    path = decodeURIComponent(path);
  } catch {
    // Malformed escape sequence: match against the raw path.
  }
  if (path.length > 1) path = path.replace(/\/+$/, "");
  return path || "/";
}

/** True when the path resolves to a page in the SPA route table. */
export function isAppRoute(pathname) {
  const path = normalisePath(pathname);
  if (STATIC_ROUTES.has(path)) return true;
  return ROUTE_PATTERNS.some((pattern) => pattern.test(path));
}

function notFound({ html, statusText } = {}) {
  return new Response(html ?? "Not Found", {
    status: 404,
    statusText: statusText ?? "Not Found",
    headers: html
      ? {
          "Content-Type": "text/html; charset=utf-8",
          // A miss is not worth caching, and must not be revalidated as a hit.
          "Cache-Control": "no-store",
          "X-Content-Type-Options": "nosniff",
        }
      : {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-store",
          "X-Content-Type-Options": "nosniff",
        },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.hostname === `www.${APEX_HOST}`) {
      url.protocol = "https:";
      url.hostname = APEX_HOST;
      return Response.redirect(url.toString(), 301);
    }

    if (url.protocol === "http:" && !LOOPBACK_HOSTS.has(url.hostname)) {
      url.protocol = "https:";
      return Response.redirect(url.toString(), 301);
    }

    const response = await env.ASSETS.fetch(request);

    const servedHtml =
      response.status === 200 &&
      (response.headers.get("content-type") ?? "").includes("text/html");
    if (!servedHtml) return response;

    const looksLikeFile = FILE_EXTENSION.test(normalisePath(url.pathname));
    const wantsHtml = (request.headers.get("accept") ?? "").includes("text/html");

    // A miss on a file-shaped URL is never a navigation: answer in plain text
    // so a stale `/assets/…js` fails loudly instead of parsing as HTML.
    if (looksLikeFile) {
      if (wantsHtml) return response;
      return notFound();
    }

    // The assets layer already returned the shell; only route-matching paths
    // may claim success. Unknown ones keep the shell (so the app renders its
    // own NotFound) but carry a 404 status.
    if (!isAppRoute(url.pathname)) {
      return notFound({ html: await response.text(), statusText: "Not Found" });
    }

    return response;
  },
};
