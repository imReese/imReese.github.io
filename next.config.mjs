import withPWA from 'next-pwa'

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  transpilePackages: ['geist'],
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
  webpack(config) {
    config.module.rules.push({
      test: /\.ya?ml$/,
      type: 'asset/source',
    })

    return config
  },
}

// PWA配置
const pwaConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development', // 开发环境禁用PWA
})

export default pwaConfig(nextConfig)
