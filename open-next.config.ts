import type { OpenNextConfig } from "@opennextjs/cloudflare";

const config: OpenNextConfig = {
  default: {
    override: {
      wrapper: "cloudflare-node",
      converter: "edge",
      // Incrementally increase memory if hitting limits
      // incrementalCache: "dummy",
      // tagCache: "dummy",
      // queue: "dummy",
    },
  },

  middleware: {
    external: true,
  },
};

export default config;
