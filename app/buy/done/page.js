import Link from "next/link";
import { Header, Footer } from "../../components/Site";
import PixelPurchase from "../../components/PixelPurchase";

export default function Done({ searchParams }) {
  const code = searchParams?.code || "";
  const test = searchParams?.test === "1";
  const gift = searchParams?.gift === "1";
  const paid = Number(process.env.PRICE_KWD || 4.75);
  const game = "/game";
  const play = `${game}#code=${code}`;
  const wa = `https://wa.me/?text=${encodeURIComponent(
    gift ? `عطيتك قضية خالد 🎁 كودك: ${code}\nhttps://cases.hyphen-eventskw.com${play}`
         : `كود فريقنا لقضية خالد: ${code}\n${play}`)}`;
  return (
    <main className="wrap">
      {!test && <PixelPurchase code={code} value={paid} currency="KWD" />}
      <Header />
      <div className="card">
        <h2>{gift ? "تم الدفع ✅ وصلت الهدية" : "تم الدفع ✅ القضية صارت لكم"}</h2>
        <p>
          {gift
            ? "أرسلنا الكود على إيميله باسمكم، ووصلكم إيصال بنفس الكود."
            : "افتحوا اللعبة على الموبايل، وشغّلوها على التلفزيون."}
        </p>
        {!gift && (
          <div style={{ marginTop: 18 }}>
            <a className="cta" href={play} style={{ display: "block", textAlign: "center", fontSize: 22, padding: "18px 24px" }}>ابدأ اللعبة الحين</a>
          </div>
        )}
        <div style={{ marginTop: gift ? 8 : 26, paddingTop: 18, borderTop: "1px solid rgba(255,255,255,.08)" }}>
          <div className="muted" style={{ marginBottom: 8 }}>
            {gift ? "نفس الكود — إذا تبون تعطونه بنفسكم:" : "كودكم — احفظوه إذا بتفتحون اللعبة من جهاز ثاني أو يوم ثاني:"}
          </div>
          <div className="code" style={{ fontSize: 28 }}>{code}</div>
          <div className="muted" style={{ marginTop: 8, fontSize: 13 }}>كود واحد لفريق واحد — يفتح على ٦ موبايلات، وصالح ٧ أيام.</div>
          {test && <div className="muted">وضع التجربة: ما انخصم شي.</div>}
          <div style={{ marginTop: 14 }}>
            <a className="cta lite" href={wa}>{gift ? "أرسلوا الكود على واتساب" : "أرسل الكود على واتساب"}</a>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
