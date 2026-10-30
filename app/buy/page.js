"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Header, Footer } from "../components/Site";
import { pixelTrack } from "../components/pixelTrack";

const fmt = (n) => Number(n).toFixed(3);

export default function Buy() {
  const [gift, setGift] = useState(false);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [giftName, setGiftName] = useState("");
  const [giftEmail, setGiftEmail] = useState("");
  const [giftFrom, setGiftFrom] = useState("");
  const [giftMsg, setGiftMsg] = useState("");
  const [promo, setPromo] = useState("");
  const [quote, setQuote] = useState(null); // { price, discount, listPrice }
  const [promoMsg, setPromoMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    // Funnel step 1: they tapped «ابدأوا التحقيق» and reached the checkout form.
    quoteFor("").then((j) => {
      pixelTrack("InitiateCheckout", { value: Number(j?.price) || 0, currency: "KWD", content_name: "قضية خالد" });
    });
  }, []);
  // /buy?gift=1 — the landing page's gift button lands here with the tab already on.
  // Read off the URL rather than useSearchParams, which would need a Suspense boundary.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("gift")) setGift(true);
  }, []);

  // The WhatsApp number is kept as soon as it is typed — a buyer who leaves
  // the page can still be messaged. Later keystrokes only refresh the record.
  useEffect(() => {
    const digits = phone.replace(/[^\d]/g, "");
    if (digits.length < 8) return;
    const t = setTimeout(() => {
      fetch("/api/lead", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ phone, gift, promo, email }), keepalive: true }).catch(() => {});
    }, 800);
    return () => clearTimeout(t);
  }, [phone, gift, promo, email]);

  async function quoteFor(code) {
    const r = await fetch("/api/promo", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ promo: code }) });
    return r.json().catch(() => ({})).then((j) => { if (j.ok && !code) setQuote(j); return j; });
  }

  async function checkPromo() {
    setPromoMsg("");
    const j = await quoteFor(promo);
    if (!j.ok) { quoteFor(""); return setPromoMsg(j.reason === "promo_expired" ? "الكود منتهي" : j.reason === "promo_used" ? "الكود خلصت استخداماته" : "الكود غير صحيح"); }
    setQuote(j);
    setPromoMsg(j.discount > 0 ? `خصم ${fmt(j.discount)} د.ك ✓` : "");
  }

  async function go(e) {
    e.preventDefault(); setErr(""); setBusy(true);
    // A typed-but-not-applied promo is applied automatically before checkout.
    let usePromo = quote?.discount ? promo : "";
    if (promo && !quote?.discount) {
      const j = await quoteFor(promo);
      if (j.ok && j.discount > 0) { setQuote(j); setPromoMsg(`خصم ${fmt(j.discount)} د.ك ✓`); usePromo = promo; }
      else { setBusy(false); return setErr(j.reason === "promo_expired" ? "الكود منتهي" : j.reason === "promo_used" ? "الكود خلصت استخداماته" : "كود الخصم غير صحيح — امسحوه أو صحّحوه"); }
    }
    const r = await fetch("/api/checkout", {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ phone, email, promo: usePromo, gift, giftName, giftEmail, giftFrom, giftMsg }),
    });
    const j = await r.json().catch(() => ({}));
    setBusy(false);
    if (!j.ok) return setErr(
      j.reason === "phone" ? "اكتبوا رقم موبايل صحيح"
      : j.reason === "email" ? "اكتبوا إيميلكم صحيح — بنرسل لكم الإيصال عليه"
      : j.reason === "gift_email" ? "اكتبوا إيميل صحيح للشخص اللي بتهدونه"
      : j.reason?.startsWith("promo") ? "كود الخصم ما عاد يشتغل"
      : "صار خطأ، جرّبوا مرة ثانية");
    if (j.paymentUrl) {
      // Funnel step 2: details accepted, heading to KNET/card payment. Give the
      // pixel a moment to send before the browser leaves the page.
      await Promise.race([
        pixelTrack("AddPaymentInfo", { value: Number(total) || 0, currency: "KWD", content_name: "قضية خالد" })
          .then(() => new Promise((res) => setTimeout(res, 400))),
        new Promise((res) => setTimeout(res, 1500)),
      ]);
      window.location.href = j.paymentUrl;
    }
    else window.location.href = `/buy/done?code=${j.code}${j.test ? "&test=1" : ""}${j.gift ? "&gift=1" : ""}`;
  }

  const total = quote ? quote.price : null;

  return (
    <main className="wrap">
      <Header />
      <form className="card" onSubmit={go}>
        <h2>قضية خالد · كود فريق</h2>

        <label>رقم الواتساب</label>
        <input inputMode="tel" autoComplete="tel" placeholder="9xxx xxxx" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        <div className="muted" style={{ fontSize: 13, marginTop: -4, marginBottom: 14 }}>بنتواصل معاكم على الواتساب إذا احتجتوا مساعدة بالطلب.</div>

        <div className="tabs2" role="tablist">
          <button type="button" role="tab" aria-selected={!gift} className={gift ? "" : "on"} onClick={() => setGift(false)}>لي</button>
          <button type="button" role="tab" aria-selected={gift} className={gift ? "on" : ""} onClick={() => setGift(true)}>🎁 هدية</button>
        </div>

        <p>
          {gift
            ? "بنرسل الكود على إيميل اللي تهدونه، باسمكم ومع رسالتكم. ويوصلكم إيصال بنفس الكود — إذا تبون تعطونه بنفسكم."
            : "كود واحد يفتح اللعبة لفريقكم — على ٦ موبايلات، وصالح ٧ أيام. الدفع بـ KNET أو بطاقة."}
        </p>

        {gift && (
          <>
            <label>اسم اللي بتهدونه</label>
            <input placeholder="مثلاً: نوف" value={giftName} onChange={(e) => setGiftName(e.target.value)} />
            <label>إيميله</label>
            <input type="email" placeholder="name@example.com" value={giftEmail} onChange={(e) => setGiftEmail(e.target.value)} required />
            <label>من منو؟</label>
            <input placeholder="اسمكم" value={giftFrom} onChange={(e) => setGiftFrom(e.target.value)} />
            <label>رسالة قصيرة (اختياري)</label>
            <input placeholder="كل عام وانتي بخير 🎁" maxLength={300} value={giftMsg} onChange={(e) => setGiftMsg(e.target.value)} />
            <div className="sep" />
          </>
        )}

        <label>{gift ? "إيميلكم (للإيصال)" : "الإيميل"}</label>
        <input type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <div className="muted" style={{ fontSize: 13, marginTop: -4 }}>
          {gift ? "بنرسل لكم إيصال بنفس الكود — تأكدوا إنه صحيح." : "بنرسل لكم الكود على هالإيميل — تأكدوا إنه صحيح."}
        </div>

        <label>كود خصم (إذا عندكم)</label>
        <div className="promo">
          <input placeholder="PROMO" value={promo} onChange={(e) => { setPromo(e.target.value.toUpperCase()); setPromoMsg(""); if (quote?.discount) quoteFor(""); }} />
          <button type="button" onClick={checkPromo} disabled={!promo}>تطبيق</button>
        </div>
        {promoMsg && <div className={quote?.discount ? "ok" : "err"}>{promoMsg}</div>}
        <div className="total"><span>الإجمالي</span><span>{quote && quote.discount > 0 && <s>{fmt(quote.listPrice)}</s>}<b>{total === null ? "—" : fmt(total)} د.ك</b></span></div>
        {err && <div className="err">{err}</div>}
        <div style={{ marginTop: 20 }}>
          <button className="cta" disabled={busy}>
            {busy ? "ثواني…" : total === 0 ? "احصل على الكود" : gift ? "ادفعوا وأرسلوا الهدية" : "ادفع وابدأ"}
          </button>
        </div>
        <div className="muted" style={{ marginTop: 12 }}>بالشراء توافقون على <Link href="/terms">الشروط والأحكام</Link> — منتج رقمي، لا استرجاع.</div>
      </form>
      <Footer />
    </main>
  );
}
