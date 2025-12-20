import type { OpenNextConfig } from "@opennextjs/cloudflare";

const config: OpenNextConfig = {
  default: {
    override: {
      wrapper: "cloudflare",
      converter: "edge",
    },
  },
  middleware: {
    external: true,
  },
};

export default config;
