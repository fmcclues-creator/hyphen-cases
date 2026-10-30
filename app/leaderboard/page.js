import Link from "next/link";
import { Header, Footer } from "../components/Site";
import { db } from "../../lib/db";

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
const AR = (n) => String(n).replace(/[0-9]/g, (d) => "٠١٢٣٤٥٦٧٨٩"[d]);
const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
const day = (iso) => new Date(iso).toLocaleDateString("ar-KW", { day: "numeric", month: "long", timeZone: "Asia/Kuwait" });
const MEDAL = ["🥇", "🥈", "🥉"];

export default async function Leaderboard({ searchParams }) {
  const sp = await searchParams;
  const game = GAMES.find((g) => g.id === sp?.game)?.id || "shaleh";
  let rows = [];
  try {
    const { data } = await db().from("leaderboard").select("team,total,wrong,hints,created_at")
      .eq("game", game).order("total", { ascending: true }).order("created_at", { ascending: true }).limit(50);
    rows = data || [];
  } catch {}
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
          <table>
            <thead><tr><th>#</th><th>الفريق</th><th>الوقت</th><th>تلميحات</th><th>اتهام غلط</th><th>التاريخ</th></tr></thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} style={i < 3 ? { fontWeight: 700 } : undefined}>
                  <td>{MEDAL[i] || AR(i + 1)}</td>
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
        <p style={{ marginTop: 26 }}><Link className="cta" href="/buy">تبون اسمكم هنا؟ ابدأوا التحقيق</Link></p>
      </article>
      <Footer />
    </main>
  );
}
