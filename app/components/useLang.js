"use client";
import { usePathname } from "next/navigation";

// Client-side twin of getLang(): the URL carries the language.
export function useLang() {
  const p = usePathname() || "/";
  return p === "/en" || p.startsWith("/en/") ? "en" : "ar";
}
