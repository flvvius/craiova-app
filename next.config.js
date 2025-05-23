/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
    typescript: {
        // Disable type checking since eslint handles this
        ignoreBuildErrors: true,
    },
    eslint: {
        // Warning: This allows production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: true,
    },
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: '09dk42z8cc.ufs.sh',
            port: '',
            pathname: '/**',
          },
          {
            protocol: 'https',
            hostname: 'via.placeholder.com',
            port: '',
            pathname: '/**',
          },
          {
            protocol: 'https',
            hostname: 'utfs.io',
            port: '',
            pathname: '/**',
          },
          {
            protocol: 'https',
            hostname: 'images.unsplash.com',
            port: '',
            pathname: '/**',
          },
          {
            protocol: 'https',
            hostname: 'img.clerk.com',
            port: '',
            pathname: '/**',
          },
          {
            protocol: 'https',
            hostname: 'images.clerk.dev',
            port: '',
            pathname: '/**',
          },
        ],
      },
};

export default config;
