"use client";
import { useState } from "react";

export default function Admin() {
  const [pw, setPw] = useState("");
  const [count, setCount] = useState(10);
  const [days, setDays] = useState(30);
  const [maxUses, setMaxUses] = useState(1);
  const [note, setNote] = useState("");
  const [codes, setCodes] = useState([]);
  const [made, setMade] = useState([]);
  const [msg, setMsg] = useState("");
  const [authed, setAuthed] = useState(false);
  const [resetCode, setResetCode] = useState("");
  const [promos, setPromos] = useState([]);
  const [pf, setPf] = useState({ code: "", percent: 20, amount: 0, maxUses: 100, days: 30, note: "" });
  const H = { authorization: `Bearer ${pw}`, "content-type": "application/json" };

  async function load() {
    const r = await fetch("/api/admin/codes", { headers: H }); const j = await r.json();
    if (!j.ok) { setAuthed(false); return setMsg("كلمة السر غلط"); }
    setAuthed(true); setCodes(j.codes); setMsg("");
    const p = await fetch("/api/admin/promos", { headers: H }).then((x) => x.json());
    if (p.ok) setPromos(p.promos);
  }
  async function gen() {
    const r = await fetch("/api/admin/codes", { method: "POST", headers: H, body: JSON.stringify({ count, days, maxUses, note }) });
    const j = await r.json(); if (!j.ok) return setMsg("كلمة السر غلط");
    setMade(j.codes); load();
  }
  async function reset(code) {
    const c = (code || resetCode).trim().toUpperCase(); if (!c) return;
    const r = await fetch("/api/admin/reset", { method: "POST", headers: H, body: JSON.stringify({ code: c }) });
    const j = await r.json(); setMsg(j.ok ? `تم تصفير ${c} — يقدر يفتح من جهاز جديد` : "ما نفع"); load();
  }
  async function addPromo() {
    const r = await fetch("/api/admin/promos", { method: "POST", headers: H, body: JSON.stringify(pf) });
    const j = await r.json(); setMsg(j.ok ? `تم إنشاء الكود ${pf.code.toUpperCase()}` : "تأكدوا من الكود (٣ أحرف أو أكثر)"); load();
  }
  async function togglePromo(p) {
    await fetch("/api/admin/promos", { method: "PATCH", headers: H, body: JSON.stringify({ code: p.code, active: !p.active }) }); load();
  }

  return (
    <main className="wrap">
      <nav className="nav"><span><b>HYPHEN</b> CASES · الإدارة</span></nav>
      <div className="card">
        <label>كلمة سر الإدارة</label><input type="password" value={pw} onChange={(e) => setPw(e.target.value)} onKeyDown={(e) => e.key === "Enter" && load()} />
        <div style={{ marginTop: 12 }}><button className="cta lite" onClick={load}>دخول / تحديث</button></div>
        {msg && <div className={authed ? "ok" : "err"} style={{ marginTop: 10 }}>{msg}</div>}
      </div>

      {authed && <>
      <div className="card">
        <h2>رموز الفعاليات</h2>
        <p>ولّدوا رموزاً للفرق في الفعاليات الحضورية بدون دفع.</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          <div><label>العدد</label><input type="number" value={count} onChange={(e) => setCount(e.target.value)} /></div>
          <div><label>صلاحية (أيام)</label><input type="number" value={days} onChange={(e) => setDays(e.target.value)} /></div>
          <div><label>أجهزة لكل رمز</label><input type="number" value={maxUses} onChange={(e) => setMaxUses(e.target.value)} /></div>
        </div>
        <label>ملاحظة (اسم الفعالية)</label><input value={note} onChange={(e) => setNote(e.target.value)} />
        <div style={{ marginTop: 18 }}><button className="cta" onClick={gen}>ولّد الرموز</button></div>
        {made.length > 0 && <pre className="code" style={{ fontSize: 20, textAlign: "left" }}>{made.join("\n")}</pre>}
      </div>

      <div className="card">
        <h2>تصفير جهاز</h2>
        <p>إذا مشتري غيّر موبايله أو مسح بياناته، صفّروا رمزه عشان يفتح من جهاز جديد.</p>
        <div className="promo"><input placeholder="KHD-7342" value={resetCode} onChange={(e) => setResetCode(e.target.value.toUpperCase())} /><button type="button" onClick={() => reset()}>صفّر</button></div>
      </div>

      <div className="card">
        <h2>أكواد الخصم</h2>
        <p>نسبة مئوية، أو مبلغ ثابت بالدينار (يُستخدم إذا النسبة = ٠). كود بخصم ١٠٠٪ يعطي رمزاً مجانياً بدون دفع.</p>
        <label>الكود</label><input placeholder="RAMADAN" value={pf.code} onChange={(e) => setPf({ ...pf, code: e.target.value.toUpperCase() })} style={{ direction: "ltr", textAlign: "left" }} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10 }}>
          <div><label>نسبة ٪</label><input type="number" value={pf.percent} onChange={(e) => setPf({ ...pf, percent: e.target.value })} /></div>
          <div><label>مبلغ د.ك</label><input type="number" step="0.250" value={pf.amount} onChange={(e) => setPf({ ...pf, amount: e.target.value })} /></div>
          <div><label>أقصى استخدام</label><input type="number" value={pf.maxUses} onChange={(e) => setPf({ ...pf, maxUses: e.target.value })} /></div>
          <div><label>صلاحية (أيام)</label><input type="number" value={pf.days} onChange={(e) => setPf({ ...pf, days: e.target.value })} /></div>
        </div>
        <label>ملاحظة</label><input value={pf.note} onChange={(e) => setPf({ ...pf, note: e.target.value })} />
        <div style={{ marginTop: 18 }}><button className="cta" onClick={addPromo}>أنشئ الكود</button></div>
        {promos.length > 0 && (
          <table style={{ marginTop: 16 }}><thead><tr><th>الكود</th><th>الخصم</th><th>الاستخدام</th><th>ينتهي</th><th>الحالة</th></tr></thead>
            <tbody>{promos.map((p) => <tr key={p.code}><td className="mono">{p.code}</td><td>{p.percent > 0 ? `${p.percent}٪` : `${Number(p.amount_kwd).toFixed(3)} د.ك`}</td><td>{p.uses}/{p.max_uses}</td><td>{p.expires_at ? new Date(p.expires_at).toLocaleDateString("ar-KW") : "—"}</td><td><button className="btn-sm" onClick={() => togglePromo(p)}>{p.active ? "إيقاف" : "تفعيل"}</button></td></tr>)}</tbody>
          </table>
        )}
      </div>

      {codes.length > 0 && (
        <div className="card" style={{ maxWidth: 960 }}>
          <h2>آخر الرموز</h2>
          <table><thead><tr><th>الرمز</th><th>الاستخدام</th><th>ينتهي</th><th>ملاحظة</th><th></th></tr></thead>
            <tbody>{codes.map((c) => <tr key={c.code}><td className="mono">{c.code}</td><td>{c.uses}/{c.max_uses}</td><td>{new Date(c.expires_at).toLocaleDateString("ar-KW")}</td><td>{c.note || (c.order_id ? "شراء" : "")}</td><td>{c.uses > 0 && <button className="btn-sm" onClick={() => reset(c.code)}>صفّر</button>}</td></tr>)}</tbody>
          </table>
        </div>
      )}
      </>}
    </main>
  );
}
