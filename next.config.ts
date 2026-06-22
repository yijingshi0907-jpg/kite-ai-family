import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["sour-animals-help.loca.lt"],
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
