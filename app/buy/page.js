"use client";
import { useState } from "react";
import Link from "next/link";

export default function Buy() {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function go(e) {
    e.preventDefault(); setErr(""); setBusy(true);
    const r = await fetch("/api/checkout", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ phone, email }) });
    const j = await r.json().catch(() => ({}));
    setBusy(false);
    if (!j.ok) return setErr(j.reason === "phone" ? "اكتبوا رقم موبايل صحيح" : "صار خطأ، جرّبوا مرة ثانية");
    if (j.paymentUrl) window.location.href = j.paymentUrl;
    else window.location.href = `/buy/done?code=${j.code}${j.test ? "&test=1" : ""}`;
  }

  return (
    <main className="wrap">
      <nav className="nav"><Link href="/" style={{textDecoration:"none"}}><b>HYPHEN</b> CASES</Link></nav>
      <form className="card" onSubmit={go}>
        <h2>قضية خالد · رمز فريق</h2>
        <p>رمز واحد يفتح اللعبة على جهاز واحد لمدة ٧ أيام. الدفع بـ KNET أو بطاقة.</p>
        <label>رقم الموبايل (نرسل لكم الرمز عليه)</label>
        <input inputMode="tel" placeholder="965XXXXXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        <label>الإيميل (اختياري)</label>
        <input type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        {err && <div className="err">{err}</div>}
        <div style={{ marginTop: 20 }}><button className="cta" disabled={busy}>{busy ? "ثواني…" : "ادفع وابدأ"}</button></div>
      </form>
    </main>
  );
}
