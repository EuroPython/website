// @ts-check

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

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  //  output: "export",
  trailingSlash: true,

  experimental: {
    outputFileTracingIncludes: {
      "/": ["./social-cards/**/*"],
    },
  },

  async redirects() {
    return [
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

  images: {
    // when using static export
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pretalx.com",
        port: "",
        pathname: "/media/**",
      },
    ],
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
