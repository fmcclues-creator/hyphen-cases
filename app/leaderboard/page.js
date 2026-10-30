import Link from "next/link";
import { Header, Footer } from "../components/Site";
import { Podium, topRows, AR, fmt } from "../components/Board";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "لوحة المتصدرين — HYPHEN Cases",
  description: "أسرع الفرق اللي حلّت قضايا HYPHEN. حطّوا اسمكم عقب ما تحلّون القضية.",
  alternates: { canonical: "/leaderboard" },
};

const GAMES = [
  { id: "khalid", name: "قضية خالد" },
  { id: "shaleh", name: "قضية الشاليه" },
  { id: "villa", name: "قضية الفيلا" },
];
const day = (iso) => new Date(iso).toLocaleDateString("ar-KW", { day: "numeric", month: "long", timeZone: "Asia/Kuwait" });

export default async function Leaderboard({ searchParams }) {
  const sp = await searchParams;
  const game = GAMES.find((g) => g.id === sp?.game)?.id || "shaleh";
  const rows = await topRows(game);
  return (
    <main className="wrap">
      <Header />
      <article className="prose" style={{ maxWidth: 760 }}>
        <h1>🏆 لوحة المتصدرين</h1>
        <p>أسرع الفرق اللي حلّت القضية. الوقت يشمل الإضافات (التلميحات والاتهامات الغلط).</p>
        <nav className="cta-row" style={{ margin: "14px 0 22px" }}>
          {GAMES.map((g) => (
            <Link key={g.id} href={`/leaderboard?game=${g.id}`} className={"cta" + (g.id === game ? "" : " lite")} style={{ fontSize: 16, padding: "10px 18px" }}>{g.name}</Link>
          ))}
        </nav>
        {rows.length === 0 ? (
          <p className="muted">ما فيه أحد على اللوحة بعد — كونوا أول فريق. <Link href="/buy">ابدأوا التحقيق</Link></p>
        ) : (
          <>
            <Podium rows={rows.slice(0, 3)} />
            {rows.length > 3 && (
              <table style={{ marginTop: 28 }}>
                <thead><tr><th>#</th><th>الفريق</th><th>الوقت</th><th>تلميحات</th><th>اتهام غلط</th><th>التاريخ</th></tr></thead>
                <tbody>
                  {rows.slice(3).map((r, i) => (
                    <tr key={i}>
                      <td>{AR(i + 4)}</td>
                      <td>{r.team}</td>
                      <td className="mono">{fmt(r.total)}</td>
                      <td>{AR(r.hints)}</td>
                      <td>{AR(r.wrong)}</td>
                      <td className="muted">{day(r.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}
        <p style={{ marginTop: 26 }}><Link className="cta" href="/buy">تبون اسمكم هنا؟ ابدأوا التحقيق</Link></p>
      </article>
      <Footer />
    </main>
  );
}
