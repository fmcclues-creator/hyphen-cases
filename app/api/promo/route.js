import { applyPromo } from "../../../lib/promo";
// POST { promo } -> { ok, price, discount, listPrice }
export async function POST(req) {
  const b = await req.json().catch(() => ({}));
  const listPrice = Number(process.env.PRICE_KWD || 6);
  const r = await applyPromo(b.promo, listPrice);
  if (!r.ok) return Response.json({ ok: false, reason: r.reason }, { status: 400 });
  return Response.json({ ok: true, price: r.price, discount: r.discount, listPrice });
}
