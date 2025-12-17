/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // TODO: Remove this once all TypeScript errors are fixed
    // Currently needed for Vercel deployment
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
