import { db } from "../../../../lib/db";
function authed(req){ return (req.headers.get("authorization")||"") === `Bearer ${process.env.ADMIN_PASSWORD}`; }

export async function GET(req) {
  if (!authed(req)) return Response.json({ ok: false }, { status: 401 });
  const { data, error } = await db().from("registrations").select("*").order("created_at", { ascending: false }).limit(500);
  if (error) return Response.json({ ok: false, error: error.message }, { status: 500 });
  return Response.json({ ok: true, rows: data || [] });
}

export async function DELETE(req) {
  if (!authed(req)) return Response.json({ ok: false }, { status: 401 });
  const { id } = await req.json();
  const { error } = await db().from("registrations").delete().eq("id", id);
  return Response.json({ ok: !error });
}
