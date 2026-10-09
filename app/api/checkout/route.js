import { db, issueCodes } from "../../../lib/db";
import { applyPromo, consumePromo } from "../../../lib/promo";
import { createCheckout } from "../../../lib/hesabe";

// POST { phone, email, promo } -> creates an order and either:
//  - total 0 (promo) or PAYMENT_MODE=test: marks paid, issues a code, returns { ok, code }
//  - PAYMENT_MODE=hesabe: returns { ok, paymentUrl } (KNET + cards)
//  - PAYMENT_MODE=myfatoorah: returns { ok, paymentUrl }
export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const phone = String(body.phone || "").replace(/\D/g, "").slice(0, 15);
  const email = String(body.email || "").slice(0, 120);
  if (phone.length < 8) return Response.json({ ok: false, reason: "phone" }, { status: 400 });

  const listPrice = Number(process.env.PRICE_KWD || 6);
  const pr = await applyPromo(body.promo, listPrice);
  if (!pr.ok) return Response.json({ ok: false, reason: pr.reason }, { status: 400 });
  const price = pr.price;
  const mode = process.env.PAYMENT_MODE || "test";

  const client = db();
  const { data: order, error } = await client.from("orders")
    .insert({ phone, email, amount_kwd: price, gateway: price === 0 ? "promo" : mode, promo: pr.promo, discount_kwd: pr.discount })
    .select().single();
  if (error) return Response.json({ ok: false, reason: "db" }, { status: 500 });

  if (price === 0 || mode === "test") {
    await client.from("orders").update({ status: "paid", gateway_ref: price === 0 ? "PROMO" : "TEST" }).eq("id", order.id);
    await consumePromo(pr.promo);
    const [code] = await issueCodes({ orderId: order.id });
    return Response.json({ ok: true, code, test: mode === "test" && price > 0 });
  }

  const site = process.env.SITE_URL || "";

  if (mode === "hesabe") {
    try {
      const { paymentUrl, token } = await createCheckout({ orderId: order.id, amount: price, phone, email, site });
      await client.from("orders").update({ gateway_ref: token.slice(0, 120) }).eq("id", order.id);
      return Response.json({ ok: true, paymentUrl });
    } catch (e) {
      console.error(e);
      return Response.json({ ok: false, reason: "gateway" }, { status: 502 });
    }
  }

  // MyFatoorah
  const r = await fetch(`${process.env.MYFATOORAH_BASE}/v2/SendPayment`, {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.MYFATOORAH_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      CustomerName: "HYPHEN Cases", NotificationOption: "LNK", InvoiceValue: price, CurrencyIso: "KWD",
      CustomerMobile: phone, CustomerEmail: email || undefined,
      CallBackUrl: `${site}/api/webhook?order=${order.id}&ok=1`, ErrorUrl: `${site}/api/webhook?order=${order.id}&ok=0`,
      Language: "ar", UserDefinedField: order.id,
    }),
  });
  const j = await r.json().catch(() => null);
  if (!j?.IsSuccess) return Response.json({ ok: false, reason: "gateway" }, { status: 502 });
  await client.from("orders").update({ gateway_ref: String(j.Data.InvoiceId) }).eq("id", order.id);
  return Response.json({ ok: true, paymentUrl: j.Data.InvoiceURL });
}
