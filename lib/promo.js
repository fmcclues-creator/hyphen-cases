import { db } from "./db";

// Returns { ok, promo, price, discount } for a promo code against the list price.
export async function applyPromo(codeRaw, listPrice) {
  const code = String(codeRaw || "").trim().toUpperCase();
  if (!code) return { ok: true, promo: null, price: listPrice, discount: 0 };
  const { data: p } = await db().from("promos").select("*").eq("code", code).maybeSingle();
  if (!p || !p.active) return { ok: false, reason: "promo_invalid" };
  if (p.expires_at && new Date(p.expires_at) < new Date()) return { ok: false, reason: "promo_expired" };
  if (p.uses >= p.max_uses) return { ok: false, reason: "promo_used" };
  let discount = p.percent > 0 ? Math.round(listPrice * p.percent) / 100 : Number(p.amount_kwd);
  discount = Math.min(listPrice, Math.max(0, discount));
  const price = Math.round((listPrice - discount) * 1000) / 1000;
  return { ok: true, promo: p.code, price, discount };
}

export async function consumePromo(code) {
  if (!code) return;
  const client = db();
  const { data: p } = await client.from("promos").select("uses").eq("code", code).maybeSingle();
  if (p) await client.from("promos").update({ uses: p.uses + 1 }).eq("code", code);
}
