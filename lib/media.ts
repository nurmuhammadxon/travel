const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
const API_ORIGIN = API_URL.replace(/\/api\/v1\/?$/, "");

export function getMediaUrl(path?: string): string {
    if (!path) return "/images/tour-placeholder.jpg";
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    return `${API_ORIGIN}${path.startsWith("/") ? "" : "/"}${path}`;
}