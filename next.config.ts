import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    devIndicators: false,
    outputFileTracingIncludes: {
        "/[lng]/**": ["./public/locales/**"],
    },
};

export default nextConfig;
