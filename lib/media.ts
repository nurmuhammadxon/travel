const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
const API_ORIGIN = API_URL.replace(/\/api\/v1\/?$/, "");

export function getMediaUrl(path?: string | null): string | null {
    if (!path) return null;
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    return `${API_ORIGIN}${path.startsWith("/") ? "" : "/"}${path}`;
}