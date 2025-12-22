/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "files.edgestore.dev", // Replace with your actual image provider domain
      },
    ],
  },
  // Increase body size limit for file uploads
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

module.exports = nextConfig;
