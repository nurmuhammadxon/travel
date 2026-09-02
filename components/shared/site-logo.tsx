import Image from "next/image";
import { siteConfig } from "@/lib/site-config";

interface SiteLogoProps {
    imgClassName?: string;
    textClassName?: string;
    highlightClassName?: string;
    fallback?: React.ReactNode;
}

function SiteLogo({
    imgClassName,
    textClassName = "text-xl font-bold tracking-tight",
    highlightClassName = "text-accent",
    fallback,
}: SiteLogoProps = {}) {
    if (siteConfig.logo.useImage) {
        return (
            <Image
                src={siteConfig.logo.src}
                alt={siteConfig.logo.alt}
                width={140}
                height={40}
                priority
                className={imgClassName}
            />
        );
    }

    if (fallback) {
        return <>{fallback}</>;
    }

    return (
        <span className={textClassName}>
            {siteConfig.logo.name}
            <span className={highlightClassName}>
                {siteConfig.logo.nameHighlight}
            </span>
        </span>
    );
}

export { SiteLogo };