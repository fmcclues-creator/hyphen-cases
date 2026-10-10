import { db } from "../../../../lib/db";

function authed(req) {
  const h = req.headers.get("authorization") || "";
  return h === `Bearer ${process.env.ADMIN_PASSWORD}`;
}

// GET: last 300 orders joined with the code issued for each.
export async function GET(req) {
  if (!authed(req)) return Response.json({ ok: false }, { status: 401 });
  const { data: orders } = await db().from("orders").select("*").order("created_at", { ascending: false }).limit(300);
  const ids = (orders || []).map((o) => o.id);
  const { data: codes } = ids.length ? await db().from("codes").select("code,order_id,uses,max_uses,expires_at").in("order_id", ids) : { data: [] };
  const byOrder = {};
  (codes || []).forEach((c) => { byOrder[c.order_id] = c; });
  const rows = (orders || []).map((o) => ({ ...o, code: byOrder[o.id] || null }));
  const paid = rows.filter((r) => r.status === "paid");
  const revenue = paid.reduce((s, r) => s + Number(r.amount_kwd || 0), 0);
  return Response.json({ ok: true, orders: rows, stats: { paid: paid.length, revenue, pending: rows.length - paid.length } });
}
