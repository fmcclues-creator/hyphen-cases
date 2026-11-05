import { NextResponse } from "next/server";

// Two jobs:
//  - reg.hyphen-eventskw.com → the sign-up page
//  - /en and /en/... → the same pages in English. The URL keeps its /en prefix;
//    internally the request is rewritten to the Arabic route with an x-lang
//    header, which the layout and pages read to pick their copy and direction.
export function middleware(req) {
  const url = req.nextUrl.clone();
  const host = (req.headers.get("host") || "").toLowerCase();
  if (host.startsWith("reg.") && url.pathname === "/") { url.pathname = "/reg"; return NextResponse.rewrite(url); }

  if (url.pathname === "/en" || url.pathname.startsWith("/en/")) {
    url.pathname = url.pathname.slice(3) || "/";
    const headers = new Headers(req.headers);
    headers.set("x-lang", "en");
    const res = NextResponse.rewrite(url, { request: { headers } });
    res.headers.set("x-lang", "en");
    return res;
  }
  return NextResponse.next();
}

export const config = { matcher: ["/", "/en", "/en/:path*"] };
