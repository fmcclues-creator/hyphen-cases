"use client";
import { useState } from "react";

export default function Admin() {
  const [pw, setPw] = useState("");
  const [count, setCount] = useState(10);
  const [days, setDays] = useState(30);
  const [maxUses, setMaxUses] = useState(1);
  const [note, setNote] = useState("");
  const [game, setGame] = useState("khalid");
  const [codes, setCodes] = useState([]);
  const [made, setMade] = useState([]);
  const [msg, setMsg] = useState("");
  const [authed, setAuthed] = useState(false);
  const [resetCode, setResetCode] = useState("");
  const [promos, setPromos] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [regs, setRegs] = useState([]);
  const [pf, setPf] = useState({ code: "", percent: 20, amount: 0, maxUses: 100, days: 30, note: "" });
  const H = { authorization: `Bearer ${pw}`, "content-type": "application/json" };

  async function load() {
    const r = await fetch("/api/admin/codes", { headers: H }); const j = await r.json();
    if (!j.ok) { setAuthed(false); return setMsg("كلمة السر غلط"); }
    setAuthed(true); setCodes(j.codes); setMsg("");
    try { const rr = await fetch("/api/admin/reg", { headers: H }); const rj = await rr.json(); if (rj.ok) setRegs(rj.rows); } catch {}
    const p = await fetch("/api/admin/promos", { headers: H }).then((x) => x.json());
    if (p.ok) setPromos(p.promos);
    const o = await fetch("/api/admin/orders", { headers: H }).then((x) => x.json());
    if (o.ok) { setOrders(o.orders); setStats(o.stats); }
  }
  async function gen() {
    const r = await fetch("/api/admin/codes", { method: "POST", headers: H, body: JSON.stringify({ count, days, maxUses, note, game }) });
    const j = await r.json(); if (!j.ok) return setMsg("كلمة السر غلط");
    setMade(j.codes); load();
  }
  async function promoPatch(code, body) {
    await fetch("/api/admin/promos", { method: "PATCH", headers: H, body: JSON.stringify({ code, ...body }) }); load();
  }
  async function hesabeCheck() {
    const r = await fetch("/api/admin/hesabe", { headers: H }); const j = await r.json();
    alert(JSON.stringify(j, null, 2));
  }
  async function cleanup() {
    if (!confirm("حذف كل الطلبات التجريبية (TEST) والرموز اللي طلعت منها؟")) return;
    const r = await fetch("/api/admin/cleanup", { method: "POST", headers: H }); const j = await r.json();
    alert(j.ok ? `تم حذف ${j.orders} طلب و ${j.codes} رمز تجريبي` : "صار خطأ"); load();
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

  async function delReg(id) { if (!confirm("حذف هذا التسجيل؟")) return; await fetch("/api/admin/reg", { method: "DELETE", headers: H, body: JSON.stringify({ id }) }); setRegs((r) => r.filter((x) => x.id !== id)); }
  function exportRegs() {
    const esc = (v) => '"' + String(v ?? "").replace(/"/g, '""') + '"';
    const lines = [["التاريخ", "الفريق", "قائد الفريق", "الأعضاء", "العدد"].map(esc).join(",")];
    regs.forEach((r) => lines.push([new Date(r.created_at).toLocaleString("en-GB"), r.team, r.phone, (r.members || []).join(" | "), (r.members || []).length].map(esc).join(",")));
    const blob = new Blob(["\ufeff" + lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "registrations.csv"; a.click();
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
      <div className="card" style={{ maxWidth: 1100 }}>
        <h2>الطلبات</h2><button className="btn-sm" onClick={cleanup}>🧹 حذف الطلبات التجريبية</button> <button className="btn-sm" onClick={hesabeCheck}>🩺 فحص بوابة الدفع</button>
        {stats && <p>مدفوع: <b>{stats.paid}</b> · الإيراد: <b>{stats.revenue.toFixed(3)} د.ك</b> · غير مكتمل: {stats.pending}</p>}
        {orders.length === 0 ? <p className="muted">ما فيه طلبات بعد.</p> : (
          <table><thead><tr><th>التاريخ</th><th>الموبايل</th><th>الإيميل</th><th>المبلغ</th><th>كود خصم</th><th>الدفع</th><th>الحالة</th><th>الرمز</th><th>الاستخدام</th></tr></thead>
            <tbody>{orders.map((o) => <tr key={o.id}>
              <td style={{ whiteSpace: "nowrap" }}>{new Date(o.created_at).toLocaleString("ar-KW", { dateStyle: "short", timeStyle: "short" })}</td>
              <td className="mono">{o.phone || "—"}</td><td className="mono" style={{ fontSize: 12 }}>{o.email || "—"}</td>
              <td>{Number(o.amount_kwd).toFixed(3)}</td><td className="mono">{o.promo ? `${o.promo} (−${Number(o.discount_kwd).toFixed(3)})` : "—"}</td>
              <td>{o.gateway}</td><td>{o.status === "paid" ? "✅ مدفوع" : o.status === "failed" ? "❌ فشل" : "⏳ معلّق"}</td>
              <td className="mono">{o.code ? o.code.code : "—"}</td><td>{o.code ? `${o.code.uses}/${o.code.max_uses}` : "—"}</td>
            </tr>)}</tbody>
          </table>
        )}
      </div>
      <div className="card" style={{ maxWidth: 1100 }}>
        <h2>تسجيل الفرق (reg.hyphen-eventskw.com)</h2>
        <p>{regs.length} فريق مسجّل. <button className="btn-sm" onClick={exportRegs} disabled={!regs.length}>⬇️ تصدير Excel/CSV</button></p>
        {regs.length === 0 ? <p className="muted">ما فيه تسجيلات بعد.</p> : (
          <table><thead><tr><th>التاريخ</th><th>الفريق</th><th>قائد الفريق</th><th>الأعضاء</th><th></th></tr></thead>
            <tbody>{regs.map((r) => <tr key={r.id}>
              <td style={{ whiteSpace: "nowrap" }}>{new Date(r.created_at).toLocaleString("ar-KW", { dateStyle: "short", timeStyle: "short" })}</td>
              <td><b>{r.team}</b></td>
              <td className="mono"><a href={`https://wa.me/965${r.phone}`} target="_blank" rel="noreferrer">{r.phone}</a></td>
              <td style={{ fontSize: 13 }}>{(r.members || []).join("، ")} <span className="muted">({(r.members || []).length})</span></td>
              <td><button className="btn-sm" onClick={() => delReg(r.id)}>🗑</button></td>
            </tr>)}</tbody>
          </table>
        )}
      </div>
      <div className="card">
        <h2>رموز الفعاليات</h2>
        <p>ولّدوا رموزاً للفرق في الفعاليات الحضورية بدون دفع.</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          <div><label>العدد</label><input type="number" value={count} onChange={(e) => setCount(e.target.value)} /></div>
          <div><label>صلاحية (أيام)</label><input type="number" value={days} onChange={(e) => setDays(e.target.value)} /></div>
          <div><label>أجهزة لكل رمز</label><input type="number" value={maxUses} onChange={(e) => setMaxUses(e.target.value)} /></div>
          <div><label>القضية</label><select value={game} onChange={(e) => setGame(e.target.value)}><option value="khalid">قضية خالد</option><option value="shaleh">قضية الشاليه</option><option value="villa">قضية الفيلا</option></select></div>
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
            <tbody>{promos.map((p) => <tr key={p.code}><td className="mono">{p.code}</td><td>{p.percent > 0 ? `${p.percent}٪` : `${Number(p.amount_kwd).toFixed(3)} د.ك`}</td><td>{p.uses}/{p.max_uses}</td><td>{p.expires_at ? new Date(p.expires_at).toLocaleDateString("ar-KW") : "—"}</td><td style={{ whiteSpace: "nowrap" }}><button className="btn-sm" onClick={() => togglePromo(p)}>{p.active ? "إيقاف" : "تفعيل"}</button> <button className="btn-sm" onClick={() => promoPatch(p.code, { resetUses: true })}>صفّر الاستخدام</button> <button className="btn-sm" onClick={() => promoPatch(p.code, { extendDays: 30 })}>+٣٠ يوم</button></td></tr>)}</tbody>
          </table>
        )}
      </div>

      {codes.length > 0 && (
        <div className="card" style={{ maxWidth: 960 }}>
          <h2>آخر الرموز</h2>
          <table><thead><tr><th>الرمز</th><th>القضية</th><th>الاستخدام</th><th>ينتهي</th><th>ملاحظة</th><th></th></tr></thead>
            <tbody>{codes.map((c) => <tr key={c.code}><td className="mono">{c.code}</td><td>{c.game === "shaleh" ? "الشاليه" : c.game === "villa" ? "الفيلا" : "خالد"}</td><td>{c.uses}/{c.max_uses}</td><td>{new Date(c.expires_at).toLocaleDateString("ar-KW")}</td><td>{c.note || (c.order_id ? "شراء" : "")}</td><td>{c.uses > 0 && <button className="btn-sm" onClick={() => reset(c.code)}>صفّر</button>}</td></tr>)}</tbody>
          </table>
        </div>
      )}
      </>}
    </main>
  );
}
