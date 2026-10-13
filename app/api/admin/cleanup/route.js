import { db } from "../../../../lib/db";
function authed(req){ return (req.headers.get("authorization")||"") === `Bearer ${process.env.ADMIN_PASSWORD}`; }
// POST -> deletes TEST orders (created while PAYMENT_MODE=test) and the codes issued for them.
export async function POST(req) {
  if (!authed(req)) return Response.json({ ok: false }, { status: 401 });
  const client = db();
  const { data: orders } = await client.from("orders").select("id").eq("gateway_ref", "TEST");
  const ids = (orders || []).map((o) => o.id);
  let codes = 0;
  if (ids.length) {
    const { data: cs } = await client.from("codes").select("code").in("order_id", ids);
    const list = (cs || []).map((c) => c.code);
    if (list.length) { await client.from("plays").delete().in("code", list); await client.from("codes").delete().in("code", list); }
    codes = list.length;
    await client.from("orders").delete().in("id", ids);
  }
  return Response.json({ ok: true, orders: ids.length, codes });
}
