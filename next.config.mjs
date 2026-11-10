/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Add remote hosts here when project screenshots are served from a CDN.
    remotePatterns: [],
  },
};

export default nextConfig;
