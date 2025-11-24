import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '100mb', // Увеличиваем до 100 MB
      allowedOrigins: ['localhost:3000'],
    },
  },
  // Увеличиваем таймаут для больших файлов
  serverExternalPackages: [],
}

export default nextConfig