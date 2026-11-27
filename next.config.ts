import type { NextConfig } from "next";

const basePath = "/karphi";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  // Exposed so plain <img> tags can prefix files from /public.
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath
  },
  images: {
    unoptimized: true
  }
};

export default nextConfig;
