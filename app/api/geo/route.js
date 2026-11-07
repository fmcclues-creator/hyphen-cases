// Tells the buy page which country the visitor is in (from Vercel's edge
// header) so it can preselect the dial code and show an approximate price.
export const dynamic = "force-dynamic";
export async function GET(req) {
  const country = req.headers.get("x-vercel-ip-country") || "";
  return Response.json({ country }, { headers: { "cache-control": "private, no-store" } });
}
