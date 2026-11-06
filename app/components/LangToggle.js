"use client";
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
    // a plain link on purpose: /en is rewritten to the same route as /, so a client-side
    // navigation would reuse the page already in memory and nothing would change
    <a href={to} className="lang" lang={en ? "ar" : "en"} dir={en ? "rtl" : "ltr"} aria-label={en ? "النسخة العربية" : "English version"}>
      🌐 {en ? "العربية" : "English"}
    </a>
  );
}
export function LangToggle() {
  return <Suspense fallback={null}><Inner /></Suspense>;
}
