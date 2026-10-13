"use client";
import { useState } from "react";

const MIN = 4, MAX = 6;

export default function Reg() {
  const [team, setTeam] = useState("");
  const [names, setNames] = useState(["", "", "", ""]);
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
      <div className="reg-logo"><img src="/wordmark.svg" alt="HYPHEN" /><span>CASES</span></div>
      {!done && (
        <section className="reg-intro">
          <div className="reg-kicker">فعالية حضورية · Live event</div>
          <h1>قضية <span>خالد</span></h1>
          <p>اختفى صاحب مجموعة مطاعم قبل أكبر صفقة في حياته بساعات. موبايله بين يديكم، مقفل. عندكم ساعة وحدة، وخمسة مشتبهين… ومنو الجاني؟ أنتم تقرّرون.</p>
          <p>لعبة تحقيق جماعية باللهجة الكويتية: تفتحون موبايله، تقرون رسايله، تسمعون مكالماته، وتربطون الأدلة قبل ما يخلص الوقت. سجّلوا فريقكم من ٤ إلى ٦ أشخاص، وبنتواصل مع قائد الفريق بالتفاصيل.</p>
          <div className="reg-facts"><span>⏱ ساعة واحدة</span><span>👥 ٤–٦ لاعبين</span><span>🇰🇼 باللهجة الكويتية</span></div>
          <p className="reg-wait">ما نقدر نصبر لين نشوفكم 🔍</p>
        </section>
      )}
      {done ? (
        <section className="reg-card">
          <div className="reg-ok">✓</div>
          <h2>تم التسجيل</h2>
          <p className="muted">فريق <b style={{ color: "#fff" }}>{done.team}</b> · {done.members.length} أعضاء. بنتواصل مع قائد الفريق بالتفاصيل.</p>
          <p className="reg-wait">نشوفكم بالتحقيق 🔍</p>
        </section>
      ) : (
        <form className="reg-card" onSubmit={submit}>
          <h2>Sign up · سجّلوا فريقكم</h2>
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
