import { db } from "../../../lib/db";

// The board a team can put its name on once the case is solved.
// GET  ?game=shaleh[&code=XXX-0000]   -> { ok, rows:[{rank,team,total,wrong,hints,when}], me:{rank,...}|null }
// POST { code, game, team }           -> { ok, rank, total } — the time comes from the stored
//                                        game state, never from the client, so nobody can type a score.

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Cache-Control": "no-store",
};
const GAMES = new Set(["khalid", "shaleh", "villa"]);
const TOP = 50;

function normCode(raw) {
  const code = String(raw || "").trim().toUpperCase().replace(/\s+/g, "");
  if (!/^[A-Z]{3}-?\d{4}$/.test(code)) return null;
  return code.includes("-") ? code : code.slice(0, 3) + "-" + code.slice(3);
}
// a team name is a name: one line, no markup, nothing that reads as a number
function cleanTeam(raw) {
  return String(raw || "").replace(/[<>\u0000-\u001f]/g, "").replace(/\s+/g, " ").trim().slice(0, 32);
}
const row = (r, i) => ({ rank: i + 1, team: r.team, total: r.total, wrong: r.wrong, hints: r.hints, when: r.created_at });

export async function GET(req) {
  const u = new URL(req.url);
  const game = u.searchParams.get("game") || "khalid";
  if (!GAMES.has(game)) return Response.json({ ok: false, reason: "game" }, { headers: cors });
  const code = normCode(u.searchParams.get("code"));
  const client = db();
  const { data, error } = await client.from("leaderboard").select("code,team,total,wrong,hints,created_at")
    .eq("game", game).order("total", { ascending: true }).order("created_at", { ascending: true }).limit(TOP);
  if (error) return Response.json({ ok: false, reason: "db" }, { headers: cors });
  const rows = (data || []).map(row);
  let me = null;
  if (code) {
    const i = (data || []).findIndex((r) => r.code === code);
    if (i >= 0) me = rows[i];
    else {
      const { data: mine } = await client.from("leaderboard").select("code,team,total,wrong,hints,created_at").eq("game", game).eq("code", code).maybeSingle();
      if (mine) {
        const { count } = await client.from("leaderboard").select("id", { count: "exact", head: true }).eq("game", game).lt("total", mine.total);
        me = row(mine, Number(count) || 0);
      }
    }
  }
  return Response.json({ ok: true, rows, me }, { headers: cors });
}

export async function POST(req) {
  let body;
  try { body = await req.json(); } catch { return Response.json({ ok: false, reason: "bad_request" }, { status: 400, headers: cors }); }
  const code = normCode(body.code);
  const game = String(body.game || "");
  const team = cleanTeam(body.team);
  if (!code) return Response.json({ ok: false, reason: "format" }, { headers: cors });
  if (!GAMES.has(game)) return Response.json({ ok: false, reason: "game" }, { headers: cors });
  if (team.length < 2) return Response.json({ ok: false, reason: "name" }, { headers: cors });

  const client = db();
  const { data: c } = await client.from("codes").select("code,game").eq("code", code).maybeSingle();
  if (!c) return Response.json({ ok: false, reason: "not_found" }, { headers: cors });
  if (c.game && c.game !== game) return Response.json({ ok: false, reason: "wrong_game" }, { headers: cors });
  // only a solved case has a time worth ranking
  const { data: gs } = await client.from("game_state").select("state").eq("code", code).eq("game", game).maybeSingle();
  const st = gs?.state || {};
  if (!(Number(st.done) > 0) || st.gaveUp) return Response.json({ ok: false, reason: "unfinished" }, { headers: cors });
  // الشاليه and الفيلا store the final time in `total`; خالد keeps it in `done` (seconds, penalties included)
  const secs = Math.round(Number(st.total) || (game === "khalid" ? Number(st.done) : 0) || 0);
  if (secs < 60) return Response.json({ ok: false, reason: "no_time" }, { headers: cors });
  const total = secs;
  const hints = Object.values(st.hints || {}).reduce((a, b) => a + (Number(b) || 0), 0);
  const entry = { code, game, team, total, wrong: Number(st.wrong) || 0, hints };
  const { error } = await client.from("leaderboard").upsert(entry, { onConflict: "code,game" });
  if (error) return Response.json({ ok: false, reason: "db" }, { headers: cors });
  const { count } = await client.from("leaderboard").select("id", { count: "exact", head: true }).eq("game", game).lt("total", total);
  return Response.json({ ok: true, rank: (Number(count) || 0) + 1, total, team }, { headers: cors });
}

export async function OPTIONS() {
  return new Response(null, { headers: cors });
}
