const apiUrl = new URL(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // imagens dos produtos são servidas pela fates-v2-api em /public
    remotePatterns: [
      {
        protocol: apiUrl.protocol.replace(':', ''),
        hostname: apiUrl.hostname,
        port: apiUrl.port,
        pathname: '/public/**',
      },
    ],
  },
};

export default nextConfig;