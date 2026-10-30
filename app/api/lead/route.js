import { db } from "../../../lib/db";

// The WhatsApp number is kept the moment it is typed, before the rest of the
// form and before payment, so a buyer who leaves can still be helped.
// POST { phone, gift?, promo?, email? } -> { ok }
// The first write sets started_at; later writes only refresh the details.

const cors = { "Cache-Control": "no-store" };

function normPhone(raw) {
  let d = String(raw || "").replace(/[^\d]/g, "");
  if (d.startsWith("00")) d = d.slice(2);
  if (d.startsWith("965") && d.length === 11) d = d.slice(3);
  return /^\d{8}$/.test(d) ? d : null;
}

export async function POST(req) {
  let b; try { b = await req.json(); } catch { return Response.json({ ok: false }, { status: 400, headers: cors }); }
  const phone = normPhone(b.phone);
  if (!phone) return Response.json({ ok: false, reason: "phone" }, { headers: cors });
  const row = {
    phone,
    updated_at: new Date().toISOString(),
    gift: !!b.gift,
    promo: String(b.promo || "").trim().toUpperCase().slice(0, 32) || null,
    email: String(b.email || "").trim().slice(0, 120) || null,
    ua: String(req.headers.get("user-agent") || "").slice(0, 200),
  };
  try {
    const client = db();
    const { data: had } = await client.from("leads").select("id").eq("phone", phone).maybeSingle();
    if (had) await client.from("leads").update(row).eq("phone", phone);
    else await client.from("leads").insert(row);
  } catch { return Response.json({ ok: false, reason: "db" }, { headers: cors }); }
  return Response.json({ ok: true }, { headers: cors });
}
