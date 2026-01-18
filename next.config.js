/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
      // Keep old S3 domains for backward compatibility with existing data
      {
        protocol: "https",
        hostname: "*.s3.*.amazonaws.com",
      },
    ],
  },
  webpack: (config, { isServer }) => {
    // Fix for remarkable/linkify directory import issue with Next.js 14
    // This is a known issue with next-swagger-doc dependency
    config.resolve.extensionAlias = {
      ".js": [".js", ".ts", ".tsx"],
    };

    return config;
  },
};

module.exports = nextConfig;
