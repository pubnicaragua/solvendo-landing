/** @type {import('next').NextConfig} */
const nextConfig = {
  // No specific output, basePath, or assetPrefix needed for Vercel deployment
  // Next.js handles image optimization by default on Vercel
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
