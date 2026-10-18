import { db } from "../../../lib/db";

// Shared team progress for one access code, so several phones can play the same case together.
// GET  ?code=KHD-7342&game=khalid           -> { ok, state, v }
// POST { code, game, device, state }         -> merges the client's progress into the stored one, returns merged { ok, state, v }
// If the game_state table doesn't exist yet the API answers ok:false and the game keeps working on one device.

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Cache-Control": "no-store",
};

// Progress keys per game: booleans OR together, counters take the max.
const KEYS = {
  khalid: { bools: ["unlocked", "notes", "notes2", "hidden", "merged", "gaveUp"], maxes: ["pen", "wrong", "faisal", "done", "total"] },
  shaleh: { bools: ["unlocked", "torch1", "voice", "call", "timeline", "seenStorage", "corridor", "contract", "door"], maxes: ["pen", "wrong", "fahad", "done", "total"] },
  villa:  { bools: ["unlocked", "memo", "corner", "cam", "call", "run", "blow", "room", "album"], maxes: ["pen", "wrong", "yaser", "done", "total"] },
};
const keysFor = (game) => KEYS[game] || KEYS.khalid;

function normCode(raw) {
  const code = String(raw || "").trim().toUpperCase().replace(/\s+/g, "");
  if (!/^[A-Z]{3}-?\d{4}$/.test(code)) return null;
  return code.includes("-") ? code : code.slice(0, 3) + "-" + code.slice(3);
}

// Progress only ever moves forward: booleans OR, counters max, timestamps min (earliest wins).
function merge(a = {}, b = {}, game = "khalid") {
  const { bools: BOOLS, maxes: MAXES } = keysFor(game);
  const out = { ...a };
  for (const k of BOOLS) out[k] = !!(a[k] || b[k]);
  for (const k of MAXES) out[k] = Math.max(Number(a[k]) || 0, Number(b[k]) || 0);
  const sa = Number(a.start) || 0, sb = Number(b.start) || 0;
  out.start = sa && sb ? Math.min(sa, sb) : sa || sb;
  out.hints = {};
  for (const k of new Set([...Object.keys(a.hints || {}), ...Object.keys(b.hints || {})]))
    out.hints[k] = Math.max(Number(a.hints?.[k]) || 0, Number(b.hints?.[k]) || 0);
  out.stageAt = {};
  for (const k of new Set([...Object.keys(a.stageAt || {}), ...Object.keys(b.stageAt || {})])) {
    const x = Number(a.stageAt?.[k]) || 0, y = Number(b.stageAt?.[k]) || 0;
    out.stageAt[k] = x && y ? Math.min(x, y) : x || y;
  }
  return out;
}

function clean(s, game = "khalid") {
  // keep only the keys we sync; drop anything else a client might send
  const { bools: BOOLS, maxes: MAXES } = keysFor(game);
  if (!s || typeof s !== "object") return {};
  const o = {};
  for (const k of [...BOOLS, ...MAXES, "start"]) if (k in s) o[k] = s[k];
  if (s.hints && typeof s.hints === "object") o.hints = s.hints;
  if (s.stageAt && typeof s.stageAt === "object") o.stageAt = s.stageAt;
  return o;
}

export async function GET(req) {
  const u = new URL(req.url);
  const code = normCode(u.searchParams.get("code"));
  const game = String(u.searchParams.get("game") || "khalid").slice(0, 20);
  if (!code) return Response.json({ ok: false, reason: "format" }, { headers: cors });
  try {
    const { data, error } = await db().from("game_state").select("state,v").eq("code", code).eq("game", game).maybeSingle();
    if (error) return Response.json({ ok: false, reason: "no_table" }, { headers: cors });
    return Response.json({ ok: true, state: data?.state || null, v: data?.v || 0 }, { headers: cors });
  } catch { return Response.json({ ok: false, reason: "error" }, { headers: cors }); }
}

export async function POST(req) {
  let body;
  try { body = await req.json(); } catch { return Response.json({ ok: false, reason: "bad_request" }, { status: 400, headers: cors }); }
  const code = normCode(body.code);
  const game = String(body.game || "khalid").slice(0, 20);
  const device = String(body.device || "").slice(0, 80);
  if (!code) return Response.json({ ok: false, reason: "format" }, { headers: cors });
  const incoming = clean(body.state, game);
  const client = db();
  try {
    // the code must be real and this device must have claimed it
    const { data: play } = await client.from("plays").select("id").eq("code", code).eq("device", device).limit(1);
    if (!play?.length) return Response.json({ ok: false, reason: "not_allowed" }, { headers: cors });
    const { data: cur, error } = await client.from("game_state").select("state,v").eq("code", code).eq("game", game).maybeSingle();
    if (error) return Response.json({ ok: false, reason: "no_table" }, { headers: cors });
    if (body.reset === true) {
      await client.from("game_state").delete().eq("code", code).eq("game", game);
      return Response.json({ ok: true, state: null, v: 0 }, { headers: cors });
    }
    const merged = merge(cur?.state || {}, incoming, game);
    const v = (cur?.v || 0) + 1;
    const { error: e2 } = await client.from("game_state").upsert({ code, game, state: merged, v, updated_at: new Date().toISOString() }, { onConflict: "code,game" });
    if (e2) return Response.json({ ok: false, reason: "write" }, { headers: cors });
    return Response.json({ ok: true, state: merged, v }, { headers: cors });
  } catch { return Response.json({ ok: false, reason: "error" }, { headers: cors }); }
}

export async function OPTIONS() { return new Response(null, { headers: cors }); }
