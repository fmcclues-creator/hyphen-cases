import Link from "next/link";
import { Header, Footer } from "../components/Site";
import { Podium, topRows, num, fmt } from "../components/Board";
import { L, GAME_NAMES } from "../../lib/i18n";
import { getLang } from "../../lib/lang";

export const dynamic = "force-dynamic";
export function generateMetadata() {
  return getLang() === "en"
    ? { title: "Leaderboard — HYPHEN Cases", description: "The fastest teams to solve HYPHEN Cases. Add your name once you crack the case.", alternates: { canonical: "/en/leaderboard" } }
    : { title: "لوحة المتصدرين — HYPHEN Cases", description: "أسرع الفرق اللي حلّت قضايا HYPHEN. حطّوا اسمكم عقب ما تحلّون القضية.", alternates: { canonical: "/leaderboard" } };
}

const T = {
  ar: { h: "🏆 لوحة المتصدرين", p: "أسرع الفرق اللي حلّت القضية. الوقت يشمل الإضافات (التلميحات والاتهامات الغلط).", empty: "ما فيه أحد على اللوحة بعد — كونوا أول فريق.", start: "ابدأوا التحقيق", cols: ["#", "الفريق", "الوقت", "تلميحات", "اتهام غلط", "التاريخ"], cta: "تبون اسمكم هنا؟ ابدأوا التحقيق", locale: "ar-KW" },
  en: { h: "🏆 Leaderboard", p: "The fastest teams to solve the case. Times include penalties (hints and wrong accusations).", empty: "Nobody on the board yet — be the first team.", start: "Start investigating", cols: ["#", "Team", "Time", "Hints", "Wrong", "Date"], cta: "Want your name here? Start investigating", locale: "en-GB" },
};

export default async function Leaderboard({ searchParams }) {
  const lang = getLang(), t = T[lang], l = L(lang);
  const GAMES = ["khalid", "shaleh", "villa"].map((id) => ({ id, name: GAME_NAMES[lang][id] }));
  const day = (iso) => new Date(iso).toLocaleDateString(t.locale, { day: "numeric", month: "long", timeZone: "Asia/Kuwait" });
  const sp = await searchParams;
  const game = GAMES.find((g) => g.id === sp?.game)?.id || "shaleh";
  const rows = await topRows(game);
  return (
    <main className="wrap">
      <Header lang={lang} />
      <article className="prose" style={{ maxWidth: 760 }}>
        <h1>{t.h}</h1>
        <p>{t.p}</p>
        <nav className="cta-row" style={{ margin: "14px 0 22px" }}>
          {GAMES.map((g) => (
            <Link key={g.id} href={l(`/leaderboard?game=${g.id}`)} className={"cta" + (g.id === game ? "" : " lite")} style={{ fontSize: 16, padding: "10px 18px" }}>{g.name}</Link>
          ))}
        </nav>
        {rows.length === 0 ? (
          <p className="muted">{t.empty} <Link href={l("/buy")}>{t.start}</Link></p>
        ) : (
          <>
            <Podium rows={rows.slice(0, 3)} lang={lang} />
            {rows.length > 3 && (
              <table style={{ marginTop: 28 }}>
                <thead><tr>{t.cols.map((c) => <th key={c}>{c}</th>)}</tr></thead>
                <tbody>
                  {rows.slice(3).map((r, i) => (
                    <tr key={i}>
                      <td>{num(i + 4, lang)}</td>
                      <td>{r.team}</td>
                      <td className="mono">{fmt(r.total)}</td>
                      <td>{num(r.hints, lang)}</td>
                      <td>{num(r.wrong, lang)}</td>
                      <td className="muted">{day(r.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}
        <p style={{ marginTop: 26 }}><Link className="cta" href={l("/buy")}>{t.cta}</Link></p>
      </article>
      <Footer lang={lang} />
    </main>
  );
}
