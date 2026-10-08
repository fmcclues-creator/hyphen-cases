import { db } from "../../../lib/db";

// The game calls this: POST { code, device }
// Returns { ok:true, expires_at } or { ok:false, reason }
export async function POST(req) {
  const cors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
  let body;
  try { body = await req.json(); } catch { return Response.json({ ok: false, reason: "bad_request" }, { status: 400, headers: cors }); }
  const code = String(body.code || "").trim().toUpperCase().replace(/\s+/g, "");
  const device = String(body.device || "").slice(0, 80);
  if (!/^[A-Z]{3}-?\d{4}$/.test(code)) return Response.json({ ok: false, reason: "format" }, { headers: cors });
  const norm = code.includes("-") ? code : code.slice(0, 3) + "-" + code.slice(3);

  const client = db();
  const { data: row } = await client.from("codes").select("*").eq("code", norm).maybeSingle();
  if (!row) return Response.json({ ok: false, reason: "not_found" }, { headers: cors });
  if (new Date(row.expires_at) < new Date()) return Response.json({ ok: false, reason: "expired" }, { headers: cors });

  // Same device re-opening within the window is free; a new device counts as a use.
  const { data: prior } = await client.from("plays").select("id").eq("code", norm).eq("device", device).limit(1);
  if (!prior?.length) {
    if (row.uses >= row.max_uses) return Response.json({ ok: false, reason: "used" }, { headers: cors });
    await client.from("codes").update({ uses: row.uses + 1 }).eq("code", norm);
    await client.from("plays").insert({ code: norm, device });
  }
  return Response.json({ ok: true, expires_at: row.expires_at, game: row.game }, { headers: cors });
}

export async function OPTIONS() {
  return new Response(null, { headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  }});
}
