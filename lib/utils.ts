import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function localizedText(
  value: string | { uz?: string; ru?: string; en?: string } | undefined,
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