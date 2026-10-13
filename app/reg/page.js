"use client";
import { useState } from "react";

const MIN = 4, MAX = 6;

export default function Reg() {
  const [team, setTeam] = useState("");
  const [names, setNames] = useState(["", "", "", ""]);
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [done, setDone] = useState(null);

  const setName = (i, v) => setNames((n) => n.map((x, k) => (k === i ? v : x)));
  const add = () => names.length < MAX && setNames((n) => [...n, ""]);
  const remove = (i) => names.length > MIN && setNames((n) => n.filter((_, k) => k !== i));

  async function submit(e) {
    e.preventDefault();
    setErr("");
    const members = names.map((s) => s.trim()).filter(Boolean);
    const ph = phone.replace(/\D/g, "");
    if (!team.trim()) return setErr("Please enter a team name.");
    if (members.length < MIN) return setErr(`At least ${MIN} names are required.`);
    if (ph.length < 8) return setErr("Team leader number doesn't look right.");
    setBusy(true);
    try {
      const r = await fetch("/api/reg", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ team: team.trim(), members, phone: ph }) });
      const j = await r.json();
      if (!j.ok) throw new Error(j.error || "Sign-up failed, please try again.");
      setDone({ team: team.trim(), members });
    } catch (ex) { setErr(ex.message); } finally { setBusy(false); }
  }

  return (
    <main className="reg" dir="ltr">
      <div className="reg-logo"><img src="/wordmark.svg" alt="HYPHEN" /><span>CASES</span></div>
      {!done && (
        <section className="reg-intro">
          <div className="reg-kicker">Live event</div>
          <h1 className="reg-title">THE MYSTERY ROUTE</h1>
          <p className="reg-when">Saturday at Ktech</p>
          <div className="reg-facts"><span>⏱ One hour</span><span>👥 4–6 players</span></div>
          <p className="reg-wait">We can't wait to see you 🔍</p>
        </section>
      )}
      {done ? (
        <section className="reg-card">
          <div className="reg-ok">✓</div>
          <h2>You're in</h2>
          <p className="muted">Team <b style={{ color: "#fff" }}>{done.team}</b> · {done.members.length} members. We'll contact the team leader with the details.</p>
          <p className="reg-wait">See you on the route 🔍</p>
        </section>
      ) : (
        <form className="reg-card" onSubmit={submit}>
          <h2>Sign up</h2>
          <label htmlFor="team">Team name</label>
          <input id="team" value={team} onChange={(e) => setTeam(e.target.value)} maxLength={40} autoComplete="off" />

          <label>Members' names <span className="muted">({MIN}–{MAX})</span></label>
          <div className="reg-names">
            {names.map((v, i) => (
              <div className="reg-row" key={i}>
                <span className="reg-n">{i + 1}</span>
                <input value={v} onChange={(e) => setName(i, e.target.value)} maxLength={40} autoComplete="off" aria-label={`Name ${i + 1}`} />
                {names.length > MIN && <button type="button" className="reg-x" onClick={() => remove(i)} aria-label="Remove">×</button>}
              </div>
            ))}
          </div>
          {names.length < MAX && <button type="button" className="reg-add" onClick={add}>+ Add member</button>}

          <label htmlFor="phone">Team leader number</label>
          <input id="phone" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="9XXXXXXX" autoComplete="tel" />

          {err && <div className="err">{err}</div>}
          <button className="cta reg-submit" disabled={busy}>{busy ? "…" : "Sign up"}</button>
        </form>
      )}
    </main>
  );
}
