import { Header, Footer } from "../../components/Site";
import PixelPurchase from "../../components/PixelPurchase";
import { listPriceFor } from "../../../lib/pricing";
import { GAME_NAMES, gamePath } from "../../../lib/i18n";
import { getLang } from "../../../lib/lang";

const T = {
  ar: {
    hGift: "تم الدفع ✅ وصلت الهدية", hTwo: "تم الدفع ✅ القضيتين صارت لكم", hOne: "تم الدفع ✅ القضية صارت لكم",
    pGift: "أرسلنا الكود على إيميله باسمكم، ووصلكم إيصال بنفس الكود.", pOne: "افتحوا اللعبة على الموبايل، وشغّلوها على التلفزيون.",
    start: (n) => `ابدأوا ${n} الحين`, other: "🌐 English version", keepGift: "نفس الكود — إذا تبون تعطونه بنفسكم:", keep: "الكود — احفظوه إذا بتفتحون اللعبة من جهاز ثاني أو يوم ثاني:",
    note: "كل كود لفريق واحد — يفتح على ٦ موبايلات، ومن أول ما تبدأون عندكم ٤ أيام تكملونها. بالعربي أو بالإنجليزي — تختارون أول ما تفتحون اللعبة.",
    test: "وضع التجربة: ما انخصم شي.", waGift: "أرسلوا الكود على واتساب", waTwo: "أرسلوا الأكواد على واتساب", waOne: "أرسل الكود على واتساب",
    waTextGift: (items) => `عطيتك ${items.map((i) => i.name).join(" و")} 🎁\n` + items.map((i) => `${i.name}: ${i.code}\n${i.link}`).join("\n"),
    waText: (items) => items.map((i) => `كود فريقنا لـ${i.name}: ${i.code}\n${i.link}`).join("\n"),
  },
  en: {
    hGift: "Paid ✅ The gift is on its way", hTwo: "Paid ✅ Both cases are yours", hOne: "Paid ✅ The case is yours",
    pGift: "We emailed the code to them in your name, and sent you a receipt with the same code.", pOne: "Open the game on a phone and put it on the TV.",
    start: (n) => `Start ${n} now`, other: "🌐 النسخة العربية · Arabic version", keepGift: "The same code — in case you’d rather hand it over yourself:", keep: "Your code — keep it if you’ll open the game from another device or on another day:",
    note: "Each code is for one team — it opens on 6 phones, with 4 days to finish from the moment you start. Arabic or English — you choose when you open the game.",
    test: "Test mode: nothing was charged.", waGift: "Send the code on WhatsApp", waTwo: "Send the codes on WhatsApp", waOne: "Send the code on WhatsApp",
    waTextGift: (items) => `I got you ${items.map((i) => i.name).join(" and ")} 🎁\n` + items.map((i) => `${i.name}: ${i.code}\n${i.link}`).join("\n"),
    waText: (items) => items.map((i) => `Our team code for ${i.name}: ${i.code}\n${i.link}`).join("\n"),
  },
};

export default function Done({ searchParams }) {
  const lang = getLang(), t = T[lang], other = lang === "en" ? "ar" : "en";
  const code = searchParams?.code || "";
  const code2 = searchParams?.code2 || "";
  const game = searchParams?.game || "khalid";
  const test = searchParams?.test === "1";
  const gift = searchParams?.gift === "1";
  const paid = listPriceFor(game);
  const site = "https://cases.hyphen-eventskw.com";
  const mk = (g, c) => ({ id: g, name: GAME_NAMES[lang][g] || GAME_NAMES[lang].khalid, code: c, path: gamePath(g, lang), link: `${site}${gamePath(g, lang)}#code=${c}` });
  // one card per code: the bundle shows two
  const items = game === "bundle" ? [mk("khalid", code), mk("shaleh", code2)] : [mk(["khalid", "shaleh", "villa"].includes(game) ? game : "khalid", code)];
  const wa = `https://wa.me/?text=${encodeURIComponent(gift ? t.waTextGift(items) : t.waText(items))}`;
  return (
    <main className="wrap">
      {!test && <PixelPurchase code={code} value={paid} currency="KWD" />}
      <Header lang={lang} />
      <div className="card">
        <h2>{gift ? t.hGift : items.length > 1 ? t.hTwo : t.hOne}</h2>
        <p>{gift ? t.pGift : t.pOne}</p>
        {items.map((it) => (
          <div key={it.code} style={{ marginTop: 22, paddingTop: 18, borderTop: "1px solid rgba(255,255,255,.08)" }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>{it.name}</div>
            {!gift && (
              <a className="cta" href={`${it.path}#code=${it.code}`} style={{ display: "block", textAlign: "center", fontSize: 20, padding: "16px 24px" }}>{t.start(it.name)}</a>
            )}
            {!gift && ["khalid", "shaleh"].includes(it.id) && <div className="muted" style={{ marginTop: 8, fontSize: 13 }}><a href={`${gamePath(it.id, other)}#code=${it.code}`}>{t.other}</a></div>}
            <div className="muted" style={{ margin: "12px 0 6px" }}>{gift ? t.keepGift : t.keep}</div>
            <div className="code" style={{ fontSize: 28 }}>{it.code}</div>
          </div>
        ))}
        <div className="muted" style={{ marginTop: 10, fontSize: 13 }}>{t.note}</div>
        {test && <div className="muted">{t.test}</div>}
        <div style={{ marginTop: 14 }}>
          <a className="cta lite" href={wa}>{gift ? t.waGift : items.length > 1 ? t.waTwo : t.waOne}</a>
        </div>
      </div>
      <Footer lang={lang} />
    </main>
  );
}
