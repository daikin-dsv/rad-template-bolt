import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    experimental: {
        // Enable this once it becomes available in latest version of next
        // Only available in canary as of now
        // cacheComponents: true
    }
};

export default nextConfig;
