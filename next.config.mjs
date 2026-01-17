/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  turbopack: {
    root: 'c:\\Users\\97250\\Desktop\\booking engine\\v0-bookinengine',
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn-images.innstant-servers.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.vercel.app',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.example.com',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig
