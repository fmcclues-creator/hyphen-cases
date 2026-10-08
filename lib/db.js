import { createClient } from "@supabase/supabase-js";

export function db() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase env vars missing");
  return createClient(url, key, { auth: { persistSession: false } });
}

// Readable code: 3 letters + 4 digits, no ambiguous chars (e.g. KHD-7342)
export function makeCode() {
  const L = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const bytes = crypto.getRandomValues(new Uint8Array(7));
  const letters = [0, 1, 2].map((i) => L[bytes[i] % L.length]).join("");
  const digits = [3, 4, 5, 6].map((i) => String(bytes[i] % 10)).join("");
  return `${letters}-${digits}`;
}

export async function issueCodes({ orderId = null, count = 1, days = 7, maxUses = 1, note = null, game = "khalid" }) {
  const client = db();
  const expires_at = new Date(Date.now() + days * 86400e3).toISOString();
  const rows = Array.from({ length: count }, () => ({
    code: makeCode(), order_id: orderId, game, expires_at, max_uses: maxUses, uses: 0, note,
  }));
  const { data, error } = await client.from("codes").insert(rows).select("code");
  if (error) throw error;
  return data.map((r) => r.code);
}
