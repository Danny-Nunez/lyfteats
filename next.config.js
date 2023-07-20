/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["mitcapstone.mitcapstone.s3.us-east-2.amazonaws.com", "mitcapstone.s3.us-east-2.amazonaws.com"],
  },
};

module.exports = nextConfig;
