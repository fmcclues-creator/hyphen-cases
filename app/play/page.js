"use client";
import { useState } from "react";
import { Header, Footer } from "../components/Site";

const GAMES = { khalid: "/game", shaleh: "/shaleh", villa: "/villa" };
function deviceId() {
  try { let d = localStorage.getItem("hyphen_dev"); if (!d) { d = crypto.randomUUID(); localStorage.setItem("hyphen_dev", d); } return d; } catch { return "nodevice"; }
}

// Lets someone who already has a code jump into the right game.
export default function Play() {
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  async function go(e) {
    e.preventDefault(); setErr(""); const c = code.trim().toUpperCase(); if (!c) return; setBusy(true);
    try {
      const r = await fetch("/api/verify", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ code: c, device: deviceId() }) });
      const j = await r.json();
      if (!j.ok) { setBusy(false); return setErr({ not_found: "الكود غير صحيح", expired: "انتهت صلاحية الكود", used: "هالكود مستخدم على جهاز ثاني", format: "اكتبوا الكود مثل KHD-7342" }[j.reason] || "صار خطأ، جرّبوا مرة ثانية"); }
      const path = GAMES[j.game] || "/game";
      window.location.href = `${path}#code=${c}`;
    } catch { setBusy(false); setErr("ما قدرنا نتحقق. تأكدوا من الإنترنت"); }
  }
  return (
    <main className="wrap">
      <Header />
      <form className="card" onSubmit={go}>
        <h2>عندكم كود؟</h2>
        <p>اكتبوه هنا وبتنتقلون للعبة مباشرة.</p>
        <input placeholder="KHD-7342" value={code} onChange={(e) => { setCode(e.target.value.toUpperCase()); setErr(""); }} style={{ direction: "ltr", textAlign: "center", letterSpacing: 3, fontSize: 24 }} autoCapitalize="characters" autoComplete="off" />
        {err && <p style={{ color: "var(--red2)", marginTop: 10 }}>{err}</p>}
        <div style={{ marginTop: 18 }}><button className="cta" type="submit" disabled={busy || !code.trim()}>افتح اللعبة</button></div>
      </form>
      <Footer />
    </main>
  );
}
