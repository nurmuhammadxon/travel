import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    devIndicators: false,
    outputFileTracingIncludes: {
        "/**": ["./public/locales/**"],
    },
};

export default nextConfig;