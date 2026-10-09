import { db, issueCodes } from "../../../lib/db";
import { consumePromo } from "../../../lib/promo";
import { parseCallback } from "../../../lib/hesabe";

// Payment gateways redirect here after payment. We verify the result
// (never trust the redirect alone), then issue the code and show it.
export async function GET(req) {
  const u = new URL(req.url);
  const orderId = u.searchParams.get("order");
  const site = process.env.SITE_URL || "";
  if (!orderId) return Response.redirect(`${site}/buy?err=1`, 302);

  const client = db();
  const { data: order } = await client.from("orders").select("*").eq("id", orderId).maybeSingle();
  if (!order) return Response.redirect(`${site}/buy?err=1`, 302);

  // Already handled (user refreshed)? Reuse the existing code.
  const { data: existing } = await client.from("codes").select("code").eq("order_id", orderId).limit(1);
  if (existing?.length) return Response.redirect(`${site}/buy/done?code=${existing[0].code}`, 302);

  let paid = false, ref = null;

  if (u.searchParams.get("gw") === "hesabe") {
    const data = u.searchParams.get("data");
    if (data && !u.searchParams.get("fail")) {
      try { const c = parseCallback(data); paid = c.paid; ref = c.ref; } catch (e) { console.error("hesabe callback", e); }
    }
  } else {
    const paymentId = u.searchParams.get("paymentId");
    if (paymentId && process.env.MYFATOORAH_API_KEY) {
      const r = await fetch(`${process.env.MYFATOORAH_BASE}/v2/GetPaymentStatus`, {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.MYFATOORAH_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ Key: paymentId, KeyType: "PaymentId" }),
      });
      const j = await r.json().catch(() => null);
      paid = j?.IsSuccess && j.Data?.InvoiceStatus === "Paid";
      ref = paymentId;
    }
  }

  if (!paid) {
    await client.from("orders").update({ status: "failed" }).eq("id", orderId);
    return Response.redirect(`${site}/buy?err=pay`, 302);
  }
  await client.from("orders").update({ status: "paid", gateway_ref: ref || order.gateway_ref }).eq("id", orderId);
  await consumePromo(order.promo);
  const [code] = await issueCodes({ orderId });
  return Response.redirect(`${site}/buy/done?code=${code}`, 302);
}

// Hesabe may POST the result instead of GET on some setups.
export const POST = GET;
