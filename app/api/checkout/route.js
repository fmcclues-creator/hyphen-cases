import { db, issueCodes } from "../../../lib/db";

// POST { phone, email } -> creates an order and either:
//  - PAYMENT_MODE=test: marks paid, issues a code, returns { ok, code }
//  - PAYMENT_MODE=myfatoorah: returns { ok, paymentUrl } to redirect to
export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const phone = String(body.phone || "").replace(/\D/g, "").slice(0, 15);
  const email = String(body.email || "").slice(0, 120);
  if (phone.length < 8) return Response.json({ ok: false, reason: "phone" }, { status: 400 });

  const price = Number(process.env.PRICE_KWD || 6);
  const client = db();
  const { data: order, error } = await client.from("orders")
    .insert({ phone, email, amount_kwd: price, gateway: process.env.PAYMENT_MODE || "test" })
    .select().single();
  if (error) return Response.json({ ok: false, reason: "db" }, { status: 500 });

  if ((process.env.PAYMENT_MODE || "test") === "test") {
    await client.from("orders").update({ status: "paid", gateway_ref: "TEST" }).eq("id", order.id);
    const [code] = await issueCodes({ orderId: order.id });
    return Response.json({ ok: true, code, test: true });
  }

  // MyFatoorah: SendPayment creates an invoice link that supports KNET + cards
  const r = await fetch(`${process.env.MYFATOORAH_BASE}/v2/SendPayment`, {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.MYFATOORAH_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      CustomerName: "HYPHEN Cases",
      NotificationOption: "LNK",
      InvoiceValue: price,
      CurrencyIso: "KWD",
      CustomerMobile: phone,
      CustomerEmail: email || undefined,
      CallBackUrl: `${process.env.SITE_URL}/api/webhook?order=${order.id}&ok=1`,
      ErrorUrl: `${process.env.SITE_URL}/api/webhook?order=${order.id}&ok=0`,
      Language: "ar",
      UserDefinedField: order.id,
    }),
  });
  const j = await r.json().catch(() => null);
  if (!j?.IsSuccess) return Response.json({ ok: false, reason: "gateway" }, { status: 502 });
  await client.from("orders").update({ gateway_ref: String(j.Data.InvoiceId) }).eq("id", order.id);
  return Response.json({ ok: true, paymentUrl: j.Data.InvoiceURL });
}
