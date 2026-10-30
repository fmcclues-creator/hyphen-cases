"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Header, Footer } from "../components/Site";
import { pixelTrack } from "../components/pixelTrack";

const fmt = (n) => Number(n).toFixed(3);
const PRODUCTS = [
  { id: "khalid", name: "قضية خالد", sub: "اختفاء · ٥ مشتبهين" },
  { id: "shaleh", name: "قضية الشاليه", sub: "سرقة · ٨ مشتبهين · كشّاف على التلفزيون" },
  { id: "bundle", name: "القضيتين", sub: "خالد + الشاليه — كودين، وفّروا ٢ د.ك", best: true },
];

export default function Buy() {
  const [gift, setGift] = useState(false);
  const [game, setGame] = useState("khalid");
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

  // /buy?game=shaleh picks the case; /buy?gift=1 lands with the gift tab on.
  // Read off the URL rather than useSearchParams, which would need a Suspense boundary.
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    if (sp.get("gift")) setGift(true);
    const g = sp.get("game");
    if (PRODUCTS.some((p) => p.id === g)) setGame(g);
  }, []);
  useEffect(() => {
    // Funnel step 1: they reached the checkout form (re-quoted whenever the product changes).
    setQuote(null); setPromoMsg("");
    quoteFor(promo && quote?.discount ? promo : "").then((j) => {
      pixelTrack("InitiateCheckout", { value: Number(j?.price) || 0, currency: "KWD", content_name: PRODUCTS.find((p) => p.id === game)?.name });
    });
  }, [game]);

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
    const r = await fetch("/api/promo", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ promo: code, game }) });
    return r.json().catch(() => ({})).then((j) => { if (j.ok) setQuote(j); return j; });
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
      body: JSON.stringify({ phone, email, promo: usePromo, gift, giftName, giftEmail, giftFrom, giftMsg, game }),
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
        pixelTrack("AddPaymentInfo", { value: Number(total) || 0, currency: "KWD", content_name: PRODUCTS.find((p) => p.id === game)?.name })
          .then(() => new Promise((res) => setTimeout(res, 400))),
        new Promise((res) => setTimeout(res, 1500)),
      ]);
      window.location.href = j.paymentUrl;
    }
    else window.location.href = `/buy/done?code=${j.code}${j.code2 ? "&code2=" + j.code2 : ""}&game=${j.game || game}${j.test ? "&test=1" : ""}${j.gift ? "&gift=1" : ""}`;
  }

  const total = quote ? quote.price : null;

  return (
    <main className="wrap">
      <Header />
      <form className="card" onSubmit={go}>
        <h2>{PRODUCTS.find((p) => p.id === game)?.name} · كود فريق</h2>

        <div className="prods" role="radiogroup" aria-label="القضية">
          {PRODUCTS.map((p) => (
            <button type="button" key={p.id} role="radio" aria-checked={game === p.id} className={"prod" + (game === p.id ? " on" : "")} onClick={() => setGame(p.id)}>
              {p.best && <i>الأوفر</i>}
              <b>{p.name}</b><span>{p.sub}</span>
            </button>
          ))}
        </div>

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
            : game === "bundle"
            ? "كودين — واحد لكل قضية. كل كود يفتح على ٦ موبايلات، وصالح ٧ أيام. الدفع بـ KNET أو بطاقة."
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
