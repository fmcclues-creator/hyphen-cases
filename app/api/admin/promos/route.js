import { db } from "../../../../lib/db";
function authed(req){ return (req.headers.get("authorization")||"") === `Bearer ${process.env.ADMIN_PASSWORD}`; }
export async function GET(req) {
  if (!authed(req)) return Response.json({ ok: false }, { status: 401 });
  const { data } = await db().from("promos").select("*").order("created_at", { ascending: false }).limit(100);
  return Response.json({ ok: true, promos: data || [] });
}
// POST { code, percent, amount, maxUses, days, note }
export async function POST(req) {
  if (!authed(req)) return Response.json({ ok: false }, { status: 401 });
  const b = await req.json().catch(() => ({}));
  const code = String(b.code || "").trim().toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 20);
  if (code.length < 3) return Response.json({ ok: false, reason: "code" }, { status: 400 });
  const row = {
    code, percent: Math.min(100, Math.max(0, Number(b.percent) || 0)), amount_kwd: Math.max(0, Number(b.amount) || 0),
    max_uses: Math.max(1, Number(b.maxUses) || 100), expires_at: b.days ? new Date(Date.now() + Number(b.days) * 86400e3).toISOString() : null,
    note: String(b.note || "").slice(0, 80) || null, active: true,
  };
  const { error } = await db().from("promos").upsert(row);
  if (error) return Response.json({ ok: false, reason: "db" }, { status: 500 });
  return Response.json({ ok: true });
}
// PATCH { code, active }
export async function PATCH(req) {
  if (!authed(req)) return Response.json({ ok: false }, { status: 401 });
  const b = await req.json().catch(() => ({}));
  await db().from("promos").update({ active: !!b.active }).eq("code", String(b.code || ""));
  return Response.json({ ok: true });
}
