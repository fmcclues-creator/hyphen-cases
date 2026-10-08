import Link from "next/link";

export default function Done({ searchParams }) {
  const code = searchParams?.code || "";
  const test = searchParams?.test === "1";
  const game = process.env.NEXT_PUBLIC_GAME_URL || "/play";
  return (
    <main className="wrap">
      <nav className="nav"><Link href="/" style={{textDecoration:"none"}}><b>HYPHEN</b> CASES</Link></nav>
      <div className="card">
        <h2>تم ✅ هذا رمز فريقكم</h2>
        <p>احفظوه. تحتاجونه أول ما تفتحون اللعبة.</p>
        <div className="code">{code}</div>
        {test && <div className="muted">وضع التجربة: ما انخصم شي.</div>}
        <div style={{ marginTop: 18, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <a className="cta" href={`${game}#code=${code}`}>افتح اللعبة الحين</a>
          <a className="cta lite" href={`https://wa.me/?text=${encodeURIComponent(`رمز فريقنا لقضية خالد: ${code}\n${game}`)}`}>أرسله على واتساب</a>
        </div>
      </div>
    </main>
  );
}
