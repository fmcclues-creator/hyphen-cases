"use client";
import { useState } from "react";
import { Header, Footer } from "../components/Site";
import { useLang } from "../components/useLang";
import { gamePath } from "../../lib/i18n";

function deviceId() {
  try { let d = localStorage.getItem("hyphen_dev"); if (!d) { d = crypto.randomUUID(); localStorage.setItem("hyphen_dev", d); } return d; } catch { return "nodevice"; }
}

// Lets someone who already has a code jump into the right game.
export default function Play() {
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const lang = useLang(), en = lang === "en";
  const T = en
    ? { not_found: "Invalid code", expired: "This code has expired", used: "This code is in use on another device", late: "This team started more than 3 hours ago — you can’t join from a new device now", devices: "This code is already open on the maximum number of devices", format: "Enter the code like KHD-7342", err: "Something went wrong, try again", net: "We couldn’t verify. Check your internet", h: "Have a code?", p: "Type it here and you’ll go straight into the game.", go: "Open the game" }
    : { not_found: "الكود غير صحيح", expired: "انتهت صلاحية الكود", used: "هالكود مستخدم على جهاز ثاني", late: "هالفريق بدأ من أكثر من ٣ ساعات — ما ينفع تنضمّون من جهاز جديد الحين", devices: "هالكود مفتوح على الحد الأقصى من الأجهزة", format: "اكتبوا الكود مثل KHD-7342", err: "صار خطأ، جرّبوا مرة ثانية", net: "ما قدرنا نتحقق. تأكدوا من الإنترنت", h: "عندكم كود؟", p: "اكتبوه هنا وبتنتقلون للعبة مباشرة.", go: "افتح اللعبة" };
  async function go(e) {
    e.preventDefault(); setErr(""); const c = code.trim().toUpperCase(); if (!c) return; setBusy(true);
    try {
      const r = await fetch("/api/verify", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ code: c, device: deviceId() }) });
      const j = await r.json();
      if (!j.ok) {
        setBusy(false);
        const N = en ? { khalid: "The Khalid Case", shaleh: "The Chalet Case" } : { khalid: "قضية خالد", shaleh: "قضية الشاليه" };
        if (j.reason === "finished") {
          const sib = j.sibling && j.sibling.unused ? (en
            ? ` Your bundle has a second code for ${N[j.sibling.game] || "the other case"} that hasn’t been opened yet — check your purchase email from HYPHEN Cases, both codes are in it.`
            : ` باقتكم فيها كود ثاني لـ${N[j.sibling.game] || "القضية الثانية"} ليلحين ما انفتح — شوفوا إيميل الشراء من HYPHEN Cases، فيه الكودين.`) : "";
          return setErr((en ? "This code is used up — the case was already solved with it." : "هالكود خلص — القضية انحلّت فيه.") + sib);
        }
        return setErr(T[j.reason] || T.err);
      }
      try { localStorage.setItem("hyphen_lang", lang); } catch {}
      window.location.href = `${gamePath(j.game, lang)}#code=${c}`;
    } catch { setBusy(false); setErr(T.net); }
  }
  return (
    <main className="wrap">
      <Header lang={lang} />
      <form className="card" onSubmit={go}>
        <h2>{T.h}</h2>
        <p>{T.p}</p>
        <input placeholder="KHD-7342" value={code} onChange={(e) => { setCode(e.target.value.toUpperCase()); setErr(""); }} style={{ direction: "ltr", textAlign: "center", letterSpacing: 3, fontSize: 24 }} autoCapitalize="characters" autoComplete="off" />
        {err && <p style={{ color: "var(--red2)", marginTop: 10 }}>{err}</p>}
        <div style={{ marginTop: 18 }}><button className="cta" type="submit" disabled={busy || !code.trim()}>{T.go}</button></div>
      </form>
      <Footer lang={lang} />
    </main>
  );
}
