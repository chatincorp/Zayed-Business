/**
 * Cloudflare Worker entrypoint for the Yasir Zayed site.
 *
 * The app is a Vite SPA with prerendered HTML, so the worker mostly hands
 * requests to the static-asset binding. `not_found_handling: "single-page-
 * application"` makes unknown paths fall back to index.html for client-side
 * routing — but the assets layer applies that fallback to *every* miss,
 * including a stale hashed asset URL. Serving HTML with a 200 for a missing
 * `.js`/`.css` file is what produces "Expected a JavaScript module script but
 * the server responded with a MIME type of text/html" in the browser, and it
 * turns every typo into a soft 404 for crawlers. So a miss that looks like a
 * file request (an extension in the last path segment) and that is not a
 * browser navigation is answered with a real 404 here.
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

    // The assets layer answers any miss with index.html, so a stale hashed asset
    // URL would come back as HTML with a 200. Only navigations may have it.
    const wantsHtml = (request.headers.get("accept") ?? "").includes(
      "text/html",
    );
    if (
      !wantsHtml &&
      FILE_EXTENSION.test(url.pathname) &&
      response.headers.get("content-type")?.includes("text/html")
    ) {
      return new Response("Not Found", {
        status: 404,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-store",
          "X-Content-Type-Options": "nosniff",
        },
      });
    }

    return response;
  },
};
