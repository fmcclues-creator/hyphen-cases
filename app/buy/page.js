"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Header, Footer } from "../components/Site";
import { pixelTrack } from "../components/pixelTrack";
import { useLang } from "../components/useLang";
import { L } from "../../lib/i18n";
import { COUNTRIES } from "../../lib/phone";

const fmt = (n) => Number(n).toFixed(3);
const PRODUCTS = {
  ar: [
    { id: "khalid", name: "قضية خالد", sub: "اختفاء · ٥ مشتبهين" },
    { id: "shaleh", name: "قضية الشاليه", sub: "سرقة · ٨ مشتبهين · ألعاب تفاعلية" },
    { id: "bundle", name: "القضيتين", sub: "خالد + الشاليه — كودين، وفّروا ٢ د.ك", best: true },
  ],
  en: [
    { id: "khalid", name: "The Khalid Case", sub: "Disappearance · 5 suspects" },
    { id: "shaleh", name: "The Chalet Case", sub: "Theft · 8 suspects · Interactive" },
    { id: "bundle", name: "Both cases", sub: "Khalid + Chalet — two codes, save KD 2", best: true },
  ],
};
const T = {
  ar: {
    teamCode: "كود فريق", caseAria: "القضية", best: "الأوفر", phone: "رقم الواتساب", country: "الدولة", other: "دولة ثانية", phoneHint: "بنتواصل معاكم على الواتساب إذا احتجتوا مساعدة بالطلب. من برّا الكويت؟ اختاروا الدولة.",
    forMe: "لي", gift: "🎁 هدية",
    pGift: "بنرسل الكود على إيميل اللي تهدونه، باسمكم ومع رسالتكم. ويوصلكم إيصال بنفس الكود — إذا تبون تعطونه بنفسكم.",
    pBundle: "كودين — واحد لكل قضية. كل كود يفتح على ٦ موبايلات، ومن أول ما تبدأون عندكم ٤ أيام تكملونها. الدفع بـ KNET أو بطاقة.",
    pOne: "كود واحد يفتح اللعبة لفريقكم — على ٦ موبايلات، ومن أول ما تبدأون عندكم ٤ أيام تكملونها. الدفع بـ KNET أو بطاقة.",
    giftName: "اسم اللي بتهدونه", giftNamePh: "مثلاً: نوف", giftEmail: "إيميله", giftFrom: "من منو؟", giftFromPh: "اسمكم", giftMsg: "رسالة قصيرة (اختياري)", giftMsgPh: "كل عام وانتي بخير 🎁",
    emailGift: "إيميلكم (للإيصال)", email: "الإيميل", emailHintGift: "بنرسل لكم إيصال بنفس الكود — تأكدوا إنه صحيح.", emailHint: "بنرسل لكم الكود على هالإيميل — تأكدوا إنه صحيح.",
    promo: "كود خصم (إذا عندكم)", apply: "تطبيق", total: "الإجمالي", kd: (v) => `${v} د.ك`,
    wait: "ثواني…", getCode: "احصل على الكود", payGift: "ادفعوا وأرسلوا الهدية", pay: "ادفع وابدأ",
    agree1: "بالشراء توافقون على ", terms: "الشروط والأحكام", agree2: ".", trust1: "الكود يوصلكم على الإيميل خلال دقيقة", trust2: "مساعدة بعد الشراء على الواتساب", trust3: "دفع آمن بـ KNET أو بطاقة",
    promo_expired: "الكود منتهي", promo_used: "الكود خلصت استخداماته", promo_bad: "الكود غير صحيح", promo_fix: "كود الخصم غير صحيح — امسحوه أو صحّحوه", promo_dead: "كود الخصم ما عاد يشتغل",
    discount: (v) => `خصم ${v} د.ك ✓`,
    e_phone: "اكتبوا رقم موبايل صحيح — ومن برّا الكويت اختاروا الدولة", e_email: "اكتبوا إيميلكم صحيح — بنرسل لكم الإيصال عليه", e_gift: "اكتبوا إيميل صحيح للشخص اللي بتهدونه", e_gen: "صار خطأ، جرّبوا مرة ثانية",
  },
  en: {
    teamCode: "team code", caseAria: "Case", best: "Best value", phone: "WhatsApp number", country: "Country", other: "Other country", phoneHint: "We’ll reach you on WhatsApp if you need help with the order. Outside Kuwait? Pick your country.",
    forMe: "For me", gift: "🎁 Gift",
    pGift: "We’ll email the code to the person you’re gifting, in your name and with your message. You get a receipt with the same code — in case you’d rather hand it over yourself.",
    pBundle: "Two codes — one per case. Each code opens on 6 phones, with 4 days to finish from the moment you start. Pay by KNET or card.",
    pOne: "One code opens the game for your team — on 6 phones, with 4 days to finish from the moment you start. Pay by KNET or card.",
    giftName: "Who is it for?", giftNamePh: "e.g. Nouf", giftEmail: "Their email", giftFrom: "From whom?", giftFromPh: "Your name", giftMsg: "A short message (optional)", giftMsgPh: "Happy birthday 🎁",
    emailGift: "Your email (for the receipt)", email: "Email", emailHintGift: "We’ll send you a receipt with the same code — make sure it’s correct.", emailHint: "We’ll send the code to this email — make sure it’s correct.",
    promo: "Promo code (if you have one)", apply: "Apply", total: "Total", kd: (v) => `KD ${v}`,
    wait: "One sec…", getCode: "Get the code", payGift: "Pay & send the gift", pay: "Pay & start",
    agree1: "By purchasing you agree to the ", terms: "Terms & Conditions", agree2: ".", trust1: "Your code arrives by email within a minute", trust2: "After-sale help on WhatsApp", trust3: "Secure payment by KNET or card",
    promo_expired: "This code has expired", promo_used: "This code has been used up", promo_bad: "Invalid code", promo_fix: "Invalid promo code — clear it or fix it", promo_dead: "This promo code no longer works",
    discount: (v) => `KD ${v} off ✓`,
    e_phone: "Enter a valid mobile number — pick the country if you’re outside Kuwait", e_email: "Enter a valid email — the receipt goes there", e_gift: "Enter a valid email for the person you’re gifting", e_gen: "Something went wrong, try again",
  },
};

export default function Buy() {
  const lang = useLang();
  const t = T[lang], l = L(lang), products = PRODUCTS[lang];
  const [gift, setGift] = useState(false);
  const [game, setGame] = useState("khalid");
  const [phone, setPhone] = useState("");
  const [cc, setCc] = useState("965");
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
  const promoErr = (reason) => (reason === "promo_expired" ? t.promo_expired : reason === "promo_used" ? t.promo_used : t.promo_bad);

  // /buy?game=shaleh picks the case; /buy?gift=1 lands with the gift tab on.
  // Read off the URL rather than useSearchParams, which would need a Suspense boundary.
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    if (sp.get("gift")) setGift(true);
    const g = sp.get("game");
    if (products.some((p) => p.id === g)) setGame(g);
  }, []);
  useEffect(() => {
    // Funnel step 1: they reached the checkout form (re-quoted whenever the product changes).
    setQuote(null); setPromoMsg("");
    quoteFor(promo && quote?.discount ? promo : "").then((j) => {
      pixelTrack("InitiateCheckout", { value: Number(j?.price) || 0, currency: "KWD", content_name: products.find((p) => p.id === game)?.name });
    });
  }, [game]);

  // The WhatsApp number is kept as soon as it is typed — a buyer who leaves
  // the page can still be messaged. Later keystrokes only refresh the record.
  useEffect(() => {
    const digits = phone.replace(/[^\d]/g, "");
    if (digits.length < 7) return;
    const tm = setTimeout(() => {
      fetch("/api/lead", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ phone, cc, gift, promo, email }), keepalive: true }).catch(() => {});
    }, 800);
    return () => clearTimeout(tm);
  }, [phone, cc, gift, promo, email]);

  async function quoteFor(code) {
    const r = await fetch("/api/promo", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ promo: code, game }) });
    return r.json().catch(() => ({})).then((j) => { if (j.ok) setQuote(j); return j; });
  }

  async function checkPromo() {
    setPromoMsg("");
    const j = await quoteFor(promo);
    if (!j.ok) { quoteFor(""); return setPromoMsg(promoErr(j.reason)); }
    setQuote(j);
    setPromoMsg(j.discount > 0 ? t.discount(fmt(j.discount)) : "");
  }

  async function go(e) {
    e.preventDefault(); setErr(""); setBusy(true);
    // A typed-but-not-applied promo is applied automatically before checkout.
    let usePromo = quote?.discount ? promo : "";
    if (promo && !quote?.discount) {
      const j = await quoteFor(promo);
      if (j.ok && j.discount > 0) { setQuote(j); setPromoMsg(t.discount(fmt(j.discount))); usePromo = promo; }
      else { setBusy(false); return setErr(j.reason === "promo_expired" ? t.promo_expired : j.reason === "promo_used" ? t.promo_used : t.promo_fix); }
    }
    const r = await fetch("/api/checkout", {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ phone, cc, email, promo: usePromo, gift, giftName, giftEmail, giftFrom, giftMsg, game, lang }),
    });
    const j = await r.json().catch(() => ({}));
    setBusy(false);
    if (!j.ok) return setErr(
      j.reason === "phone" ? t.e_phone
      : j.reason === "email" ? t.e_email
      : j.reason === "gift_email" ? t.e_gift
      : j.reason?.startsWith("promo") ? t.promo_dead
      : t.e_gen);
    if (j.paymentUrl) {
      // Funnel step 2: details accepted, heading to KNET/card payment. Give the
      // pixel a moment to send before the browser leaves the page.
      await Promise.race([
        pixelTrack("AddPaymentInfo", { value: Number(total) || 0, currency: "KWD", content_name: products.find((p) => p.id === game)?.name })
          .then(() => new Promise((res) => setTimeout(res, 400))),
        new Promise((res) => setTimeout(res, 1500)),
      ]);
      window.location.href = j.paymentUrl;
    }
    else window.location.href = l(`/buy/done?code=${j.code}${j.code2 ? "&code2=" + j.code2 : ""}&game=${j.game || game}${j.test ? "&test=1" : ""}${j.gift ? "&gift=1" : ""}`);
  }

  const total = quote ? quote.price : null;

  return (
    <main className="wrap">
      <Header lang={lang} />
      <form className="card" onSubmit={go}>
        <h2>{products.find((p) => p.id === game)?.name} · {t.teamCode}</h2>

        <div className="prods" role="radiogroup" aria-label={t.caseAria}>
          {products.map((p) => (
            <button type="button" key={p.id} role="radio" aria-checked={game === p.id} className={"prod" + (game === p.id ? " on" : "")} onClick={() => setGame(p.id)}>
              {p.best && <i>{t.best}</i>}
              <b>{p.name}</b><span>{p.sub}</span>
            </button>
          ))}
        </div>

        <label>{t.phone}</label>
        <div className="phone-row">
          <select aria-label={t.country} value={cc} onChange={(e) => setCc(e.target.value)}>
            {COUNTRIES.map((c) => <option key={c.cc} value={c.cc}>{c.flag} +{c.cc}</option>)}
            <option value="">🌍 {t.other}</option>
          </select>
          <input inputMode="tel" autoComplete="tel" placeholder={cc === "" ? "+44 ···· ······" : cc === "965" ? "9xxx xxxx" : "5x xxx xxxx"} value={phone} onChange={(e) => setPhone(e.target.value)} required />
        </div>
        <div className="muted" style={{ fontSize: 13, marginTop: -8, marginBottom: 14 }}>{t.phoneHint}</div>

        <div className="tabs2" role="tablist">
          <button type="button" role="tab" aria-selected={!gift} className={gift ? "" : "on"} onClick={() => setGift(false)}>{t.forMe}</button>
          <button type="button" role="tab" aria-selected={gift} className={gift ? "on" : ""} onClick={() => setGift(true)}>{t.gift}</button>
        </div>

        <p>{gift ? t.pGift : game === "bundle" ? t.pBundle : t.pOne}</p>

        {gift && (
          <>
            <label>{t.giftName}</label>
            <input placeholder={t.giftNamePh} value={giftName} onChange={(e) => setGiftName(e.target.value)} />
            <label>{t.giftEmail}</label>
            <input type="email" placeholder="name@example.com" value={giftEmail} onChange={(e) => setGiftEmail(e.target.value)} required />
            <label>{t.giftFrom}</label>
            <input placeholder={t.giftFromPh} value={giftFrom} onChange={(e) => setGiftFrom(e.target.value)} />
            <label>{t.giftMsg}</label>
            <input placeholder={t.giftMsgPh} maxLength={300} value={giftMsg} onChange={(e) => setGiftMsg(e.target.value)} />
            <div className="sep" />
          </>
        )}

        <label>{gift ? t.emailGift : t.email}</label>
        <input type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <div className="muted" style={{ fontSize: 13, marginTop: -4 }}>{gift ? t.emailHintGift : t.emailHint}</div>

        <label>{t.promo}</label>
        <div className="promo">
          <input placeholder="PROMO" value={promo} onChange={(e) => { setPromo(e.target.value.toUpperCase()); setPromoMsg(""); if (quote?.discount) quoteFor(""); }} />
          <button type="button" onClick={checkPromo} disabled={!promo}>{t.apply}</button>
        </div>
        {promoMsg && <div className={quote?.discount ? "ok" : "err"}>{promoMsg}</div>}
        <div className="total"><span>{t.total}</span><span>{quote && quote.discount > 0 && <s>{fmt(quote.listPrice)}</s>}<b>{t.kd(total === null ? "—" : fmt(total))}</b></span></div>
        {err && <div className="err">{err}</div>}
        <div style={{ marginTop: 20 }}>
          <button className="cta" disabled={busy}>
            {busy ? t.wait : total === 0 ? t.getCode : gift ? t.payGift : t.pay}
          </button>
        </div>
        <ul className="trust">
          <li>✉️ {t.trust1}</li>
          <li>💬 {t.trust2}</li>
          <li>🔒 {t.trust3}</li>
        </ul>
        <div className="muted" style={{ marginTop: 12 }}>{t.agree1}<Link href={l("/terms")}>{t.terms}</Link>{t.agree2}</div>
      </form>
      <Footer lang={lang} />
    </main>
  );
}
