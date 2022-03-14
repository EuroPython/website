/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/cfp",
        destination: "https://program.europython.eu/europython-2022/cfp ",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
