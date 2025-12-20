import type { OpenNextConfig } from "open-next/types/open-next";

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
