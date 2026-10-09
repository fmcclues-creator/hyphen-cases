import { db } from "../../../../lib/db";
function authed(req){ return (req.headers.get("authorization")||"") === `Bearer ${process.env.ADMIN_PASSWORD}`; }
// POST { code } -> frees the code so a new device can claim it
export async function POST(req) {
  if (!authed(req)) return Response.json({ ok: false }, { status: 401 });
  const b = await req.json().catch(() => ({}));
  const code = String(b.code || "").trim().toUpperCase();
  const client = db();
  await client.from("plays").delete().eq("code", code);
  const { error } = await client.from("codes").update({ uses: 0 }).eq("code", code);
  return Response.json({ ok: !error });
}
