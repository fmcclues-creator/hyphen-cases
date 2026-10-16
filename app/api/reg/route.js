import { db } from "../../../lib/db";

export async function POST(req) {
  return Response.json({ ok: false, error: "Sign-ups are closed — sold out." }, { status: 410 });
  let body;
  try { body = await req.json(); } catch { return Response.json({ ok: false, error: "bad_request" }, { status: 400 }); }
  const team = String(body.team || "").trim().slice(0, 40);
  const members = (Array.isArray(body.members) ? body.members : []).map((s) => String(s || "").trim().slice(0, 40)).filter(Boolean).slice(0, 6);
  const phone = String(body.phone || "").replace(/\D/g, "").slice(0, 15);
  if (!team || members.length < 4 || phone.length < 8) return Response.json({ ok: false, error: "Missing details" }, { status: 400 });
  const { error } = await db().from("registrations").insert({ team, members, phone });
  if (error) return Response.json({ ok: false, error: "Could not save, please try again" }, { status: 500 });
  return Response.json({ ok: true });
}
