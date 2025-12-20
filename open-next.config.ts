// OpenNext configuration for Cloudflare Pages
import { defineCloudflareConfig } from "@opennextjs/cloudflare/config";

export default defineCloudflareConfig({
  // Use dummy cache for simplicity (no R2 required)
  incrementalCache: "dummy",
});
