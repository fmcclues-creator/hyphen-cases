import Link from "next/link";
import { db } from "../../lib/db";
import { L, GAME_NAMES } from "../../lib/i18n";

export const AR = (n) => String(n).replace(/[0-9]/g, (d) => "٠١٢٣٤٥٦٧٨٩"[d]);
export const num = (n, lang) => (lang === "en" ? String(n) : AR(n));
export const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
export const MEDAL = ["🥇", "🥈", "🥉"];

export async function topRows(game, n = 50) {
  try {
    const { data } = await db().from("leaderboard").select("team,total,wrong,hints,created_at")
      .eq("game", game).order("total", { ascending: true }).order("created_at", { ascending: true }).limit(n);
    return data || [];
  } catch { return []; }
}

// the top three on a podium: 2nd on the right, 1st in the middle (tallest), 3rd on the left
const STEP = [
  { h: 150, bg: "linear-gradient(180deg,#f3c84b,#b8891a)", ink: "#2a1f05", label: "١" },
  { h: 112, bg: "linear-gradient(180deg,#d8dde6,#8f97a6)", ink: "#1b1f27", label: "٢" },
  { h: 88, bg: "linear-gradient(180deg,#d9a06a,#8c5a2b)", ink: "#2a1708", label: "٣" },
];
export function Podium({ rows, lang = "ar" }) {
  const wrongW = lang === "en" ? "wrong accusations" : "اتهام غلط";
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
            <div style={{ fontSize: 12.5, color: "var(--muted)" }}>{wrongW} {num(r.wrong, lang)}</div>
            <div style={{ width: "100%", height: st.h, background: st.bg, color: st.ink, borderRadius: "12px 12px 0 0", display: "grid", placeItems: "center", fontSize: 44, fontWeight: 900, boxShadow: "0 -6px 24px rgba(0,0,0,.35) inset" }}>{lang === "en" ? i + 1 : st.label}</div>
          </div>
        );
      })}
    </div>
  );
}


// the homepage block: one podium per case, side by side, and a link to the full board
export async function HomeBoard({ lang = "ar" }) {
  const l = L(lang), en = lang === "en";
  const cases = [{ game: "khalid", name: GAME_NAMES[lang].khalid }, { game: "shaleh", name: GAME_NAMES[lang].shaleh }];
  const boards = await Promise.all(cases.map(async (c) => ({ ...c, rows: await topRows(c.game, 3) })));
  return (
    <section className="cases" id="board">
      <h2>{en ? "🏆 Leaderboard" : "🏆 لوحة المتصدرين"}</h2>
      <p className="muted" style={{ margin: "0 0 4px" }}>{en ? "The three fastest teams on each case — the full board shows the top 15. Times include penalties." : "أسرع ٣ فرق بكل قضية — اللوحة الكاملة تعرض أسرع ١٥. الوقت يشمل الإضافات."}</p>
      <div className="boards">
        {boards.map((b) => (
          <div key={b.game} className="board">
            <h3>{b.name}</h3>
            {b.rows.length === 0
              ? <p className="muted">{en ? "Nobody on the board yet — the first team to solve it goes here." : "اللوحة فاضية بعد — أول فريق يحلّها يحطّ اسمه هنا."}</p>
              : <Podium rows={b.rows} lang={lang} />}
          </div>
        ))}
      </div>
      <p style={{ marginTop: 18 }}><Link className="cta lite" href={l("/leaderboard")} style={{ fontSize: 16, padding: "10px 18px" }}>{en ? "Full board →" : "اللوحة كاملة ←"}</Link></p>
    </section>
  );
}
