import { NextResponse } from "next/server";

// reg.hyphen-eventskw.com → the sign-up page, everything else untouched
export function middleware(req) {
  const host = (req.headers.get("host") || "").toLowerCase();
  if (host.startsWith("reg.")) {
    const url = req.nextUrl.clone();
    if (url.pathname === "/" ) { url.pathname = "/reg"; return NextResponse.rewrite(url); }
  }
  return NextResponse.next();
}

export const config = { matcher: ["/"] };
