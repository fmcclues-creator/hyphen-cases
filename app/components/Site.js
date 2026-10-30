import Link from "next/link";

export const WA_NUMBER = "96594426426";
export const WA_HREF =
  `https://wa.me/${WA_NUMBER}?text=` + encodeURIComponent("هلا، عندي سؤال عن قضايا HYPHEN 👋");

export function WaMark({ size = 26 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" fill="currentColor">
      <path d="M.06 24l1.69-6.16a11.87 11.87 0 01-1.6-5.95C.16 5.33 5.5 0 12.06 0a11.8 11.8 0 018.4 3.49 11.8 11.8 0 013.48 8.41c0 6.56-5.34 11.9-11.9 11.9h-.01a11.9 11.9 0 01-5.69-1.45L.06 24zm6.6-3.8l.36.22a9.87 9.87 0 005.03 1.38h.01c5.45 0 9.89-4.44 9.9-9.9a9.83 9.83 0 00-2.9-7A9.78 9.78 0 0012.07 2c-5.46 0-9.9 4.44-9.9 9.9a9.85 9.85 0 001.51 5.26l.24.38-1 3.65 3.75-.98zm11-5.57c-.08-.12-.27-.2-.57-.35-.3-.15-1.76-.86-2.03-.96-.27-.1-.47-.15-.67.15s-.77.96-.94 1.16c-.17.2-.35.22-.64.07a8.1 8.1 0 01-2.39-1.47 8.96 8.96 0 01-1.65-2.06c-.17-.3-.02-.45.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.42.25-.7.25-1.29.18-1.41z" />
    </svg>
  );
}

export function Header() {
  return (
    <header className="hdr">
      <Link href="/" className="brand" aria-label="HYPHEN Cases">
        <img src="/wordmark.svg?v=2" alt="HYPHEN" />
        <span>CASES</span>
      </Link>
      <nav className="menu">
        <Link href="/#cases">القضايا</Link>
        <Link href="/leaderboard">المتصدرين</Link>
        <Link href="/about">عن HYPHEN</Link>
        <Link href="/play">عندي كود</Link>
        <a href="https://instagram.com/hyphen.cases" target="_blank" rel="noreferrer">Instagram</a>
        <a className="wa-chip" href={WA_HREF} target="_blank" rel="noreferrer">
          <WaMark size={18} /> واتساب
        </a>
      </nav>
    </header>
  );
}

/**
 * A way to ask a question without leaving the page — the one thing a hesitating
 * buyer wants and a form can't give them. Pinned, so it is there at the moment
 * the doubt arrives rather than only at the bottom.
 */
export function WhatsAppButton() {
  return (
    <a className="wabtn" href={WA_HREF} target="_blank" rel="noreferrer" aria-label="راسلونا على واتساب">
      <WaMark size={34} />
      <span>عندكم سؤال؟</span>
    </a>
  );
}

export function Footer() {
  return (
    <footer className="ftr">
      <div>
        <b>HYPHEN Events</b> · الكويت<br />
        <span className="muted">ألعاب تحقيق جماعية، تنلعب على التلفزيون.</span>
      </div>
      <div className="links">
        <a href="https://instagram.com/hyphen.cases" target="_blank" rel="noreferrer">@hyphen.cases</a>
        <a href="https://instagram.com/hyphen.events" target="_blank" rel="noreferrer">@hyphen.events</a>
        <Link href="/about">عن HYPHEN</Link>
        <Link href="/terms">الشروط والأحكام</Link>
        <Link href="/play">عندي كود</Link>
      </div>
      <a className="wa-wide" href={WA_HREF} target="_blank" rel="noreferrer">
        <WaMark size={24} /> عندكم سؤال؟ تواصلوا معانا الحين <b dir="ltr">+965 9442 6426</b>
      </a>
      <div className="muted">© {new Date().getFullYear()} HYPHEN Events. منتج رقمي — لا استرجاع بعد الشراء.</div>
    </footer>
  );
}
