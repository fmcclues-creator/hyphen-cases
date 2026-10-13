"use client";
import { useState } from "react";

const MIN = 3, MAX = 6;

export default function Reg() {
  const [team, setTeam] = useState("");
  const [names, setNames] = useState(["", "", ""]);
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [done, setDone] = useState(null);

  const setName = (i, v) => setNames((n) => n.map((x, k) => (k === i ? v : x)));
  const add = () => names.length < MAX && setNames((n) => [...n, ""]);
  const remove = (i) => names.length > MIN && setNames((n) => n.filter((_, k) => k !== i));

  async function submit(e) {
    e.preventDefault();
    setErr("");
    const members = names.map((s) => s.trim()).filter(Boolean);
    const ph = phone.replace(/\D/g, "");
    if (!team.trim()) return setErr("اكتبوا اسم الفريق.");
    if (members.length < MIN) return setErr(`لازم ${MIN} أسماء على الأقل.`);
    if (ph.length < 8) return setErr("رقم قائد الفريق مو صحيح.");
    setBusy(true);
    try {
      const r = await fetch("/api/reg", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ team: team.trim(), members, phone: ph }) });
      const j = await r.json();
      if (!j.ok) throw new Error(j.error || "فشل التسجيل");
      setDone({ team: team.trim(), members });
    } catch (ex) { setErr(ex.message); } finally { setBusy(false); }
  }

  return (
    <main className="reg">
      <div className="reg-logo"><img src="/wordmark.svg" alt="HYPHEN" /></div>
      {done ? (
        <section className="reg-card">
          <div className="reg-ok">✓</div>
          <h1>تم التسجيل</h1>
          <p className="muted">فريق <b style={{ color: "#fff" }}>{done.team}</b> · {done.members.length} أعضاء. بنتواصل مع قائد الفريق.</p>
        </section>
      ) : (
        <form className="reg-card" onSubmit={submit}>
          <h1>Sign up · سجّلوا فريقكم</h1>
          <label htmlFor="team">اسم الفريق · Team name</label>
          <input id="team" value={team} onChange={(e) => setTeam(e.target.value)} maxLength={40} autoComplete="off" />

          <label>أسماء الأعضاء · Names <span className="muted">({MIN}–{MAX})</span></label>
          <div className="reg-names">
            {names.map((v, i) => (
              <div className="reg-row" key={i}>
                <span className="reg-n">{i + 1}</span>
                <input value={v} onChange={(e) => setName(i, e.target.value)} maxLength={40} autoComplete="off" aria-label={`الاسم ${i + 1}`} />
                {names.length > MIN && <button type="button" className="reg-x" onClick={() => remove(i)} aria-label="حذف">×</button>}
              </div>
            ))}
          </div>
          {names.length < MAX && <button type="button" className="reg-add" onClick={add}>+ إضافة عضو</button>}

          <label htmlFor="phone">رقم قائد الفريق · Team leader number</label>
          <input id="phone" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="9XXXXXXX" autoComplete="tel" />

          {err && <div className="err">{err}</div>}
          <button className="cta reg-submit" disabled={busy}>{busy ? "…" : "سجّل · Sign up"}</button>
        </form>
      )}
    </main>
  );
}
