import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  allowedDevOrigins: ["ointment-pager-deluxe.ngrok-free.dev"],

  typescript: {
    ignoreBuildErrors: false,
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",

            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,POST,OPTIONS,PUT,DELETE",
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
