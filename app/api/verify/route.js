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
  const game = String(body.game || "").slice(0, 20);
  if (!/^[A-Z]{3}-?\d{4}$/.test(code)) return Response.json({ ok: false, reason: "format" }, { headers: cors });
  const norm = code.includes("-") ? code : code.slice(0, 3) + "-" + code.slice(3);

  const client = db();
  const { data: row } = await client.from("codes").select("*").eq("code", norm).maybeSingle();
  if (!row) return Response.json({ ok: false, reason: "not_found" }, { headers: cors });
  if (new Date(row.expires_at) < new Date()) return Response.json({ ok: false, reason: "expired" }, { headers: cors });
  if (game && row.game && row.game !== game) return Response.json({ ok: false, reason: "wrong_game" }, { headers: cors });

  // One code = one team. The team can open it on up to DEVICES phones (they share progress);
  // `uses` counts activated teams against max_uses, not phones.
  // Six is what the game promises a team. We allow a few more before refusing,
  // because a phone that reopens the link from WhatsApp can still arrive as a
  // stranger, and locking a paying team out is worse than an extra slot.
  const DEVICES = 10;
  const { data: plays } = await client.from("plays").select("device").eq("code", norm);
  const devices = [...new Set((plays || []).map((p) => p.device))];
  if (!devices.includes(device)) {
    if (devices.length === 0 && row.uses >= row.max_uses) return Response.json({ ok: false, reason: "used" }, { headers: cors });
    // once the team has solved the case the code is spent: no new phones can join
    const { data: gs } = await client.from("game_state").select("state").eq("code", norm).eq("game", row.game || "khalid").maybeSingle();
    if (gs?.state && Number(gs.state.done) > 0) return Response.json({ ok: false, reason: "finished" }, { headers: cors });
    // and new phones can only join during the first JOIN_HOURS after the team pressed start.
    // codes.join_until overrides that deadline for one team — used to give a team longer
    // without touching the progress they already have.
    const JOIN_HOURS = 3;
    const startedAt = Number(gs?.state?.start) || 0;
    const joinUntil = row.join_until ? new Date(row.join_until).getTime()
      : (startedAt ? startedAt + JOIN_HOURS * 3600e3 : 0);
    if (joinUntil && Date.now() > joinUntil) return Response.json({ ok: false, reason: "late" }, { headers: cors });
    if (devices.length >= DEVICES) return Response.json({ ok: false, reason: "devices" }, { headers: cors });
    if (devices.length === 0) await client.from("codes").update({ uses: row.uses + 1 }).eq("code", norm);
    await client.from("plays").insert({ code: norm, device });
  }
  return Response.json({ ok: true, expires_at: row.expires_at, game: row.game, devices: Math.max(1, devices.length + (devices.includes(device) ? 0 : 1)), max_devices: DEVICES }, { headers: cors });
}

export async function OPTIONS() {
  return new Response(null, { headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  }});
}
