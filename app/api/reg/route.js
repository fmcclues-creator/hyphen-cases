import { db } from "../../../lib/db";

export async function POST(req) {
  let body;
  try { body = await req.json(); } catch { return Response.json({ ok: false, error: "bad_request" }, { status: 400 }); }
  const team = String(body.team || "").trim().slice(0, 40);
  const members = (Array.isArray(body.members) ? body.members : []).map((s) => String(s || "").trim().slice(0, 40)).filter(Boolean).slice(0, 6);
  const phone = String(body.phone || "").replace(/\D/g, "").slice(0, 15);
  if (!team || members.length < 3 || phone.length < 8) return Response.json({ ok: false, error: "البيانات ناقصة" }, { status: 400 });
  const { error } = await db().from("registrations").insert({ team, members, phone });
  if (error) return Response.json({ ok: false, error: "تعذّر الحفظ، حاولوا مرة ثانية" }, { status: 500 });
  return Response.json({ ok: true });
}
