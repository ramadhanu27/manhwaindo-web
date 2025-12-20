// Cloudflare Pages Function - catch-all route
export async function onRequest(context) {
  // Import the OpenNext worker
  const worker = await import("../.open-next/worker.js");

  // Forward the request to the OpenNext worker
  return worker.default.fetch(context.request, context.env, context);
}
