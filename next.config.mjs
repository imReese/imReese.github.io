import rehypePrism from '@mapbox/rehype-prism'
import nextMDX from '@next/mdx'
import remarkGfm from 'remark-gfm'
import withPWA from 'next-pwa'

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  transpilePackages: ['geist'],
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx'],
  images: {
    formats: ['image/webp', 'image/avif'], // 现代格式优先
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'favicon.im'
      },
      {
        protocol: 'https',
        hostname: 'www.google.com'
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'pbs.twimg.com', // Twitter图片
      },
      {
        protocol: 'https',
        hostname: 'icons.duckduckgo.com', // 朋友页面图标
      }
    ],
  },
  experimental: {
    optimizeCss: true, // CSS优化
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production', // 生产环境移除console
  },
}

const withMDX = nextMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypePrism],
  },
})

// PWA配置
const pwaConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development', // 开发环境禁用PWA
})

export default pwaConfig(withMDX(nextConfig))
