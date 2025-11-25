import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/karphi",
  images: {
    unoptimized: true
  }
};

export default nextConfig;
