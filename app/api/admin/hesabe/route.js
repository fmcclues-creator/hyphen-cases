import { createCheckout } from "../../../../lib/hesabe";
import crypto from "crypto";
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
  } catch (e) { dry = { ok: false, error: String(e.message || e).slice(0, 400), full: String(e.message || e) }; }
  // Try to decrypt the raw reply with a few key interpretations to find the right one.
  let variants = null;
  const m = dry && !dry.ok && /raw=([0-9a-f]+)/.exec(dry.full || "");
  if (dry) delete dry.full;
  if (m) {
    const key = process.env.HESABE_SECRET_KEY || "", iv = process.env.HESABE_IV || "";
    const hex = m[1];
    const tries = {
      "aes256_utf8": [ "aes-256-cbc", Buffer.from(key, "utf8"), Buffer.from(iv, "utf8") ],
      "aes128_first16": [ "aes-128-cbc", Buffer.from(key.slice(0, 16), "utf8"), Buffer.from(iv, "utf8") ],
      "aes256_sha256(key)": [ "aes-256-cbc", crypto.createHash("sha256").update(key).digest(), Buffer.from(iv, "utf8") ],
      "aes256_iv_zero": [ "aes-256-cbc", Buffer.from(key, "utf8"), Buffer.alloc(16, 0) ],
    };
    variants = {};
    for (const [name, [algo, k, v]] of Object.entries(tries)) {
      try { const d = crypto.createDecipheriv(algo, k, v); const t = Buffer.concat([d.update(Buffer.from(hex, "hex")), d.final()]).toString("utf8"); variants[name] = t.slice(0, 120); } catch (e) { variants[name] = "✗ " + String(e.message).slice(0, 40); }
    }
  }
  return Response.json({ ok: true, env, dry, variants });
}
