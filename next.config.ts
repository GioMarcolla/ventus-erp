import type { NextConfig } from 'next';

const projectRoot = process.cwd();

const nextConfig: NextConfig = {
    cacheComponents: true,

    outputFileTracingRoot: projectRoot,

    turbopack: {
        root: projectRoot,
    },

    logging: {
        fetches: {
            fullUrl: true,
        },
    },
};

export default nextConfig;
