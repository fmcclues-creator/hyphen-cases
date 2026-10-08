"use client";
import { useState } from "react";
import Link from "next/link";

// Lets someone who already has a code jump into the game.
export default function Play() {
  const [code, setCode] = useState("");
  const game = process.env.NEXT_PUBLIC_GAME_URL || "/";
  return (
    <main className="wrap">
      <nav className="nav"><Link href="/" style={{textDecoration:"none"}}><b>HYPHEN</b> CASES</Link></nav>
      <div className="card">
        <h2>عندكم رمز؟</h2>
        <p>اكتبوه هنا وبتنتقلون للعبة مباشرة.</p>
        <input placeholder="KHD-7342" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} style={{ direction: "ltr", textAlign: "center", letterSpacing: 3, fontSize: 24 }} />
        <div style={{ marginTop: 18 }}><a className="cta" href={`${game}#code=${code.trim()}`}>افتح اللعبة</a></div>
      </div>
    </main>
  );
}
