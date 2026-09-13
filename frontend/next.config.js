/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["three"],
  async redirects() {
    return [
      {
        source: "/dashboard",
        destination: "/?tab=command",
        permanent: false
      },
      {
        source: "/queue",
        destination: "/?tab=queue",
        permanent: false
      },
      {
        source: "/beds",
        destination: "/?tab=beds",
        permanent: false
      },
      {
        source: "/patients",
        destination: "/?tab=patients",
        permanent: false
      },
      {
        source: "/appointments",
        destination: "/?tab=appointments",
        permanent: false
      },
      {
        source: "/analytics",
        destination: "/?tab=analytics",
        permanent: false
      },
      {
        source: "/login",
        destination: "/?tab=login",
        permanent: false
      }
    ];
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:5000/api/:path*"
      }
    ];
  }
};

module.exports = nextConfig;