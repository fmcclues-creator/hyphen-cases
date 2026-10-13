import crypto from "crypto";

// Hesabe checkout (v2). Payload is AES-256-CBC encrypted with the merchant's
// secret key + IV and sent as hex; responses come back the same way.
// Env: HESABE_BASE (https://api.hesabe.com or https://sandbox.hesabe.com),
//      HESABE_MERCHANT_CODE, HESABE_ACCESS_CODE, HESABE_SECRET_KEY (32 chars), HESABE_IV (16 chars)

function keys() {
  const key = process.env.HESABE_SECRET_KEY || "";
  const iv = process.env.HESABE_IV || "";
  if (key.length !== 32 || iv.length !== 16) throw new Error("HESABE_SECRET_KEY must be 32 chars and HESABE_IV 16 chars");
  return { key: Buffer.from(key, "utf8"), iv: Buffer.from(iv, "utf8") };
}

// Hesabe pads to 32-byte blocks (PKCS5-style with block size 32) and disables OpenSSL's own padding.
function pad32(buf) { const n = 32 - (buf.length % 32); return Buffer.concat([buf, Buffer.alloc(n, n)]); }
function unpad32(buf) { if (!buf.length) return buf; const n = buf[buf.length - 1]; if (n < 1 || n > 32 || n > buf.length) return buf; return buf.subarray(0, buf.length - n); }

export function encrypt(obj) {
  const { key, iv } = keys();
  const c = crypto.createCipheriv("aes-256-cbc", key, iv);
  c.setAutoPadding(false);
  const data = pad32(Buffer.from(typeof obj === "string" ? obj : JSON.stringify(obj), "utf8"));
  return Buffer.concat([c.update(data), c.final()]).toString("hex");
}

export function decryptText(hex) {
  const { key, iv } = keys();
  const d = crypto.createDecipheriv("aes-256-cbc", key, iv);
  d.setAutoPadding(false);
  return unpad32(Buffer.concat([d.update(Buffer.from(hex, "hex")), d.final()])).toString("utf8");
}

export function decrypt(hex) {
  return JSON.parse(decryptText(hex));
}

// Creates a Hesabe checkout and returns the URL to send the customer to.
export async function createCheckout({ orderId, amount, phone, email, site }) {
  const base = process.env.HESABE_BASE || "https://api.hesabe.com";
  const payload = {
    merchantCode: process.env.HESABE_MERCHANT_CODE,
    amount: Number(amount).toFixed(3),
    paymentType: "0",                 // 0 = let the customer choose (KNET / cards)
    responseUrl: `${site}/api/webhook?gw=hesabe&order=${orderId}`,
    failureUrl: `${site}/api/webhook?gw=hesabe&order=${orderId}&fail=1`,
    version: "2.0",
    orderReferenceNumber: orderId,
    variable1: "khalid",
    name: "HYPHEN Cases",
    mobile_number: phone || "",
    email: email || "",
  };
  const r = await fetch(`${base}/checkout`, {
    method: "POST",
    headers: { accessCode: process.env.HESABE_ACCESS_CODE, Accept: "application/json", "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ data: encrypt(payload) }),
  });
  const body = await r.text();
  let res, dec = null, decErr = null;
  try { dec = decryptText(body.trim()); res = JSON.parse(dec); } catch (e) { decErr = String(e.message || e); try { res = JSON.parse(body); } catch { res = null; } }
  if (!res?.status || !res?.response?.data) {
    const info = `http=${r.status} ct=${r.headers.get("content-type")} len=${body.length} decErr=${decErr} dec=${(dec || "").slice(0, 160)} raw=${body.trim()}`;
    throw new Error("hesabe_checkout_failed: " + (res?.message ? res.message + " | " : "") + info);
  }
  return { paymentUrl: `${base}/payment?data=${res.response.data}`, token: res.response.data };
}

// Parses the encrypted `data` Hesabe appends to the response URL.
export function parseCallback(dataHex) {
  const res = decrypt(dataHex);
  const d = res?.response || res;
  const code = String(d?.resultCode || d?.ResultCode || "").toUpperCase();
  return { paid: res?.status === true && code === "CAPTURED", ref: d?.paymentToken || d?.paymentId || null, raw: res };
}
