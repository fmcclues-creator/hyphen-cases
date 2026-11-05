"use client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";

// Same page, other language. /buy?game=shaleh ⇄ /en/buy?game=shaleh
function Inner() {
  const p = usePathname() || "/";
  const sp = useSearchParams();
  const en = p === "/en" || p.startsWith("/en/");
  const bare = en ? (p.slice(3) || "/") : p;
  const q = sp?.toString() ? "?" + sp.toString() : "";
  const to = (en ? bare : (bare === "/" ? "/en" : "/en" + bare)) + q;
  return (
    <Link href={to} className="lang" lang={en ? "ar" : "en"} dir={en ? "rtl" : "ltr"} aria-label={en ? "النسخة العربية" : "English version"}>
      🌐 {en ? "العربية" : "English"}
    </Link>
  );
}
export function LangToggle() {
  return <Suspense fallback={null}><Inner /></Suspense>;
}
