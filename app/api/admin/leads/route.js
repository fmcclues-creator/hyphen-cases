import { db } from "../../../../lib/db";

function authed(req) {
  const h = req.headers.get("authorization") || "";
  return h === `Bearer ${process.env.ADMIN_PASSWORD}`;
}

// GET: numbers typed into the checkout in the last 30 days, newest first,
// each marked with whether an order from that number was paid.
export async function GET(req) {
  if (!authed(req)) return Response.json({ ok: false }, { status: 401 });
  const since = new Date(Date.now() - 30 * 86400e3).toISOString();
  const client = db();
  const { data: leads } = await client.from("leads").select("*").gte("started_at", since).order("started_at", { ascending: false }).limit(500);
  const { data: orders } = await client.from("orders").select("phone,status,created_at").gte("created_at", since);
  const paid = new Set(), tried = new Set();
  (orders || []).forEach((o) => { const d = String(o.phone || "").replace(/[^\d]/g, "").slice(-8); if (o.status === "paid") paid.add(d); else tried.add(d); });
  const rows = (leads || []).map((l) => ({ ...l, state: paid.has(l.phone) ? "paid" : tried.has(l.phone) ? "pending" : "left" }));
  return Response.json({ ok: true, leads: rows });
}
