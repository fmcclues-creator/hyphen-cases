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

// the top three on a podium: 2nd on the right, 1st in the middle (tallest), 3rd on the left
const STEP = [
  { h: 150, bg: "linear-gradient(180deg,#f3c84b,#b8891a)", ink: "#2a1f05", label: "١" },
  { h: 112, bg: "linear-gradient(180deg,#d8dde6,#8f97a6)", ink: "#1b1f27", label: "٢" },
  { h: 88, bg: "linear-gradient(180deg,#d9a06a,#8c5a2b)", ink: "#2a1708", label: "٣" },
];
function Podium({ rows }) {
  const order = [1, 0, 2].filter((i) => rows[i]);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 10, margin: "26px 0 6px" }}>
      {order.map((i) => {
        const r = rows[i], st = STEP[i];
        return (
          <div key={i} style={{ flex: 1, maxWidth: 220, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <div style={{ fontSize: i === 0 ? 40 : 30, lineHeight: 1 }}>{MEDAL[i]}</div>
            <div style={{ fontWeight: 800, fontSize: i === 0 ? 20 : 17, textAlign: "center", wordBreak: "break-word" }}>{r.team}</div>
            <div className="mono" style={{ fontSize: 15, color: "var(--muted)" }}>{fmt(r.total)}</div>
            <div style={{ fontSize: 12.5, color: "var(--muted)" }}>تلميحات {AR(r.hints)} · غلط {AR(r.wrong)}</div>
            <div style={{ width: "100%", height: st.h, background: st.bg, color: st.ink, borderRadius: "12px 12px 0 0", display: "grid", placeItems: "center", fontSize: 44, fontWeight: 900, boxShadow: "0 -6px 24px rgba(0,0,0,.35) inset" }}>{st.label}</div>
          </div>
        );
      })}
    </div>
  );
}

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
