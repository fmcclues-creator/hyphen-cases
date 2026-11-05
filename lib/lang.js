import { headers } from "next/headers";

// Which language a server component is rendering for: the middleware marks
// /en/... requests with x-lang. Client components read the URL instead (useLang).
export function getLang() {
  try { return headers().get("x-lang") === "en" ? "en" : "ar"; } catch { return "ar"; }
}
