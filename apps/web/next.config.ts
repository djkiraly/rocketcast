import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typedRoutes: false,
  // @rocketcast/config ships brand.ts as TypeScript source (no build step), so Next must
  // transpile it like app code. CLAUDE.md: the product name lives only in that file.
  transpilePackages: ["@rocketcast/config"],
};

export default nextConfig;
