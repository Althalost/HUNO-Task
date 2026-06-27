import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["ointment-pager-deluxe.ngrok-free.dev"],
  typescript: {
    ignoreBuildErrors: true,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [{ key: "Access-Control-Allow-Origin", value: "*" }],
      },
    ];
  },
};

export default nextConfig;
