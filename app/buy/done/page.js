import Link from "next/link";

export default function Done({ searchParams }) {
  const code = searchParams?.code || "";
  const test = searchParams?.test === "1";
  const game = process.env.NEXT_PUBLIC_GAME_URL || "/play";
  const play = `${game}#code=${code}`;
  const wa = `https://wa.me/?text=${encodeURIComponent(`رمز فريقنا لقضية خالد: ${code}\n${play}`)}`;
  return (
    <main className="wrap">
      <nav className="nav"><Link href="/" style={{textDecoration:"none"}}><b>HYPHEN</b> CASES</Link></nav>
      <div className="card">
        <h2>تم الدفع ✅ القضية صارت لكم</h2>
        <p>افتحوا اللعبة على الموبايل، وشغّلوها على التلفزيون.</p>
        <div style={{ marginTop: 18 }}>
          <a className="cta" href={play} style={{ display: "block", textAlign: "center", fontSize: 22, padding: "18px 24px" }}>ابدأ اللعبة الحين</a>
        </div>
        <div style={{ marginTop: 26, paddingTop: 18, borderTop: "1px solid rgba(255,255,255,.08)" }}>
          <div className="muted" style={{ marginBottom: 8 }}>رمزكم — احفظوه إذا بتفتحون اللعبة من جهاز ثاني أو يوم ثاني:</div>
          <div className="code" style={{ fontSize: 28 }}>{code}</div>
          <div className="muted" style={{ marginTop: 8, fontSize: 13 }}>الرمز يشتغل على جهاز واحد بس.</div>
          {test && <div className="muted">وضع التجربة: ما انخصم شي.</div>}
          <div style={{ marginTop: 14 }}>
            <a className="cta lite" href={wa}>أرسل الرمز على واتساب</a>
          </div>
        </div>
      </div>
    </main>
  );
}
