import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  serverExternalPackages: [
    'firebase-admin', 
    'firebase-admin/app', 
    'firebase-admin/auth', 
    'firebase-admin/firestore',
    'google-auth-library',
    'gtoken',
    'jws',
    'jwa',
    'buffer-equal-constant-time',
    '@google-cloud/firestore', 
    '@google-cloud/storage'
  ],
};

export default nextConfig;
