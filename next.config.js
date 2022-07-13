// @ts-check
/** @type {import('next').NextConfig} */

const live = require("./data/live.json");

const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "origin-when-cross-origin",
  },
];

const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/cfp",
        destination: "https://program.europython.eu/europython-2022/cfp",
        permanent: true,
      },
      {
        source: "/sponsor-information",
        destination: "/sponsor/information",
        permanent: true,
      },
      {
        source: "/live",
        destination: `/live/${live.rooms[0].slug}`,
        permanent: false,
      },
    ];
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

module.exports = nextConfig;
