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
  const H = { authorization: `Bearer ${pw}`, "content-type": "application/json" };

  async function load() {
    const r = await fetch("/api/admin/codes", { headers: H }); const j = await r.json();
    if (!j.ok) return setMsg("كلمة السر غلط");
    setCodes(j.codes); setMsg("");
  }
  async function gen() {
    const r = await fetch("/api/admin/codes", { method: "POST", headers: H, body: JSON.stringify({ count, days, maxUses, note }) });
    const j = await r.json(); if (!j.ok) return setMsg("كلمة السر غلط");
    setMade(j.codes); load();
  }

  return (
    <main className="wrap">
      <nav className="nav"><span><b>HYPHEN</b> CASES · الإدارة</span></nav>
      <div className="card">
        <h2>رموز الفعاليات</h2>
        <p>ولّدوا رموزاً للفرق في الفعاليات الحضورية بدون دفع.</p>
        <label>كلمة سر الإدارة</label><input type="password" value={pw} onChange={(e) => setPw(e.target.value)} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          <div><label>العدد</label><input type="number" value={count} onChange={(e) => setCount(e.target.value)} /></div>
          <div><label>صلاحية (أيام)</label><input type="number" value={days} onChange={(e) => setDays(e.target.value)} /></div>
          <div><label>أجهزة لكل رمز</label><input type="number" value={maxUses} onChange={(e) => setMaxUses(e.target.value)} /></div>
        </div>
        <label>ملاحظة (اسم الفعالية)</label><input value={note} onChange={(e) => setNote(e.target.value)} />
        {msg && <div className="err">{msg}</div>}
        <div style={{ marginTop: 18, display: "flex", gap: 10 }}><button className="cta" onClick={gen}>ولّد الرموز</button><button className="cta lite" onClick={load}>عرض الرموز</button></div>
        {made.length > 0 && <pre className="code" style={{ fontSize: 20, textAlign: "left" }}>{made.join("\n")}</pre>}
      </div>
      {codes.length > 0 && (
        <table><thead><tr><th>الرمز</th><th>الاستخدام</th><th>ينتهي</th><th>ملاحظة</th></tr></thead>
          <tbody>{codes.map((c) => <tr key={c.code}><td className="mono">{c.code}</td><td>{c.uses}/{c.max_uses}</td><td>{new Date(c.expires_at).toLocaleDateString("ar-KW")}</td><td>{c.note || (c.order_id ? "شراء" : "")}</td></tr>)}</tbody>
        </table>
      )}
    </main>
  );
}
