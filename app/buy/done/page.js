import Link from "next/link";
import { Header, Footer } from "../../components/Site";
import PixelPurchase from "../../components/PixelPurchase";
import { listPriceFor } from "../../../lib/pricing";

const GAMES = { khalid: { name: "قضية خالد", path: "/game" }, shaleh: { name: "قضية الشاليه", path: "/shaleh" }, villa: { name: "قضية الفيلا", path: "/villa" } };

export default function Done({ searchParams }) {
  const code = searchParams?.code || "";
  const code2 = searchParams?.code2 || "";
  const game = searchParams?.game || "khalid";
  const test = searchParams?.test === "1";
  const gift = searchParams?.gift === "1";
  const paid = listPriceFor(game);
  // one card per code: the bundle shows two
  const items = game === "bundle"
    ? [{ ...GAMES.khalid, code }, { ...GAMES.shaleh, code: code2 }]
    : [{ ...(GAMES[game] || GAMES.khalid), code }];
  const site = "https://cases.hyphen-eventskw.com";
  const waText = gift
    ? `عطيتك ${items.map((i) => i.name).join(" و")} 🎁\n` + items.map((i) => `${i.name}: ${i.code}\n${site}${i.path}#code=${i.code}`).join("\n")
    : items.map((i) => `كود فريقنا لـ${i.name}: ${i.code}\n${site}${i.path}#code=${i.code}`).join("\n");
  const wa = `https://wa.me/?text=${encodeURIComponent(waText)}`;
  return (
    <main className="wrap">
      {!test && <PixelPurchase code={code} value={paid} currency="KWD" />}
      <Header />
      <div className="card">
        <h2>{gift ? "تم الدفع ✅ وصلت الهدية" : items.length > 1 ? "تم الدفع ✅ القضيتين صارت لكم" : "تم الدفع ✅ القضية صارت لكم"}</h2>
        <p>
          {gift
            ? "أرسلنا الكود على إيميله باسمكم، ووصلكم إيصال بنفس الكود."
            : "افتحوا اللعبة على الموبايل، وشغّلوها على التلفزيون."}
        </p>
        {items.map((it) => (
          <div key={it.code} style={{ marginTop: 22, paddingTop: 18, borderTop: "1px solid rgba(255,255,255,.08)" }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>{it.name}</div>
            {!gift && (
              <a className="cta" href={`${it.path}#code=${it.code}`} style={{ display: "block", textAlign: "center", fontSize: 20, padding: "16px 24px" }}>ابدأوا {it.name} الحين</a>
            )}
            <div className="muted" style={{ margin: "12px 0 6px" }}>
              {gift ? "نفس الكود — إذا تبون تعطونه بنفسكم:" : "الكود — احفظوه إذا بتفتحون اللعبة من جهاز ثاني أو يوم ثاني:"}
            </div>
            <div className="code" style={{ fontSize: 28 }}>{it.code}</div>
          </div>
        ))}
        <div className="muted" style={{ marginTop: 10, fontSize: 13 }}>كل كود لفريق واحد — يفتح على ٦ موبايلات، وصالح ٧ أيام.</div>
        {test && <div className="muted">وضع التجربة: ما انخصم شي.</div>}
        <div style={{ marginTop: 14 }}>
          <a className="cta lite" href={wa}>{gift ? "أرسلوا الكود على واتساب" : items.length > 1 ? "أرسلوا الأكواد على واتساب" : "أرسل الكود على واتساب"}</a>
        </div>
      </div>
      <Footer />
    </main>
  );
}
