import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function localizedText(
  value: string | { uz?: string; ru?: string; en?: string } | null | undefined,
  lang: string = "uz"
): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value[lang as "uz" | "ru" | "en"] ?? value.uz ?? value.en ?? value.ru ?? "";
}

export function localizedList(
  value: string[] | { uz?: string[]; ru?: string[]; en?: string[] } | undefined,
  lang: string = "uz"
): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return value[lang as "uz" | "ru" | "en"] ?? value.uz ?? value.en ?? value.ru ?? [];
}

export function localizedHref(
  currentLocale: string,
  href: string,
  fallbackLng: string = "en"
): string {
  if (currentLocale === fallbackLng) return href;
  return href === "/" ? `/${currentLocale}` : `/${currentLocale}${href}`;
}

export function metaT(
  t: (key: string) => string,
  key: string,
  fallbackKey: string
): string {
  const value = t(key);
  return value && value !== key ? value : t(fallbackKey);
}