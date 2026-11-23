/**
 * Cloudflare Worker entrypoint for the Yasir Zayed site.
 *
 * The app is a Vite SPA with prerendered HTML, so the worker only has to hand
 * requests to the static-asset binding. `spa` in the deploy manifest makes
 * unknown paths fall back to index.html for client-side routing.
 *
 * Plain-HTTP requests are redirected to HTTPS here, so the production domain
 * serves secure traffic even without the zone's "Always Use HTTPS" toggle.
 * Loopback hosts are exempt so `wrangler dev` keeps working over http.
 */

const LOOPBACK_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]", "0.0.0.0"]);

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.protocol === "http:" && !LOOPBACK_HOSTS.has(url.hostname)) {
      url.protocol = "https:";
      return Response.redirect(url.toString(), 301);
    }

    return env.ASSETS.fetch(request);
  },
};
