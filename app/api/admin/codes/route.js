import { db, issueCodes } from "../../../../lib/db";

function authed(req) {
  const h = req.headers.get("authorization") || "";
  return h === `Bearer ${process.env.ADMIN_PASSWORD}`;
}

// GET: list recent codes.  POST { count, days, maxUses, note }: generate event codes.
export async function GET(req) {
  if (!authed(req)) return Response.json({ ok: false }, { status: 401 });
  const { data } = await db().from("codes").select("*").order("created_at", { ascending: false }).limit(200);
  return Response.json({ ok: true, codes: data || [] });
}

export async function POST(req) {
  if (!authed(req)) return Response.json({ ok: false }, { status: 401 });
  const b = await req.json().catch(() => ({}));
  const count = Math.min(100, Math.max(1, Number(b.count) || 1));
  const days = Math.min(365, Math.max(1, Number(b.days) || 7));
  const maxUses = Math.min(50, Math.max(1, Number(b.maxUses) || 1));
  const codes = await issueCodes({ count, days, maxUses, note: String(b.note || "").slice(0, 80) || null });
  return Response.json({ ok: true, codes });
}
