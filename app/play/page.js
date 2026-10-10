"use client";
import { useState } from "react";
import Link from "next/link";
import { Header, Footer } from "../components/Site";

// Lets someone who already has a code jump into the game.
export default function Play() {
  const [code, setCode] = useState("");
  const game = "/game";
  return (
    <main className="wrap">
      <Header />
      <div className="card">
        <h2>عندكم رمز؟</h2>
        <p>اكتبوه هنا وبتنتقلون للعبة مباشرة.</p>
        <input placeholder="KHD-7342" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} style={{ direction: "ltr", textAlign: "center", letterSpacing: 3, fontSize: 24 }} />
        <div style={{ marginTop: 18 }}><a className="cta" href={`${game}#code=${code.trim()}`}>افتح اللعبة</a></div>
      </div>
      <Footer />
    </main>
  );
}
