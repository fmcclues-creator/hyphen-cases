import { createCheckout } from "../../../../lib/hesabe";
function authed(req){ return (req.headers.get("authorization")||"") === `Bearer ${process.env.ADMIN_PASSWORD}`; }
// GET -> diagnostics for the Hesabe setup (no secrets returned, only lengths and a dry-run result)
export async function GET(req) {
  if (!authed(req)) return Response.json({ ok: false }, { status: 401 });
  const env = {
    PAYMENT_MODE: process.env.PAYMENT_MODE || "(missing → test)",
    HESABE_BASE: process.env.HESABE_BASE || "(missing → https://api.hesabe.com)",
    SITE_URL: process.env.SITE_URL || "(missing)",
    merchant_len: (process.env.HESABE_MERCHANT_CODE || "").trim().length,
    access_len: (process.env.HESABE_ACCESS_CODE || "").trim().length,
    secret_len: (process.env.HESABE_SECRET_KEY || "").length,
    iv_len: (process.env.HESABE_IV || "").length,
    secret_has_ws: /\s/.test(process.env.HESABE_SECRET_KEY || ""),
    iv_has_ws: /\s/.test(process.env.HESABE_IV || ""),
  };
  let dry = null;
  try {
    const r = await createCheckout({ orderId: "diag-" + Date.now(), amount: 1, phone: "99999999", email: "", site: process.env.SITE_URL || "https://cases.hyphen-eventskw.com" });
    dry = { ok: true, paymentUrl: r.paymentUrl.slice(0, 80) + "…" };
  } catch (e) { dry = { ok: false, error: String(e.message || e).slice(0, 400) }; }
  return Response.json({ ok: true, env, dry });
}
