/**
 * Cloudflare Worker entrypoint for the Yasir Zayed site.
 *
 * The app is a Vite SPA with prerendered HTML, so the worker only has to hand
 * requests to the static-asset binding. `spa` in the deploy manifest makes
 * unknown paths fall back to index.html for client-side routing.
 */

export default {
  async fetch(request, env) {
    return env.ASSETS.fetch(request);
  },
};
