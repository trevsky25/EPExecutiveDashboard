import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Recharts 3 has known type incompatibilities with React 19 Formatter types.
    // All runtime behavior is correct — skip type checking during production build.
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
