import Link from "next/link";

export function Header() {
  return (
    <header className="hdr">
      <Link href="/" className="brand" aria-label="HYPHEN Cases">
        <img src="/wordmark.svg" alt="HYPHEN" />
        <span>CASES</span>
      </Link>
      <nav className="menu">
        <Link href="/#cases">القضايا</Link>
        <Link href="/about">عن HYPHEN</Link>
        <Link href="/play">عندي رمز</Link>
        <a href="https://instagram.com/hyphen.events" target="_blank" rel="noreferrer">Instagram</a>
      </nav>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="ftr">
      <div>
        <b>HYPHEN Events</b> · الكويت<br />
        <span className="muted">ألعاب تحقيق جماعية باللهجة الكويتية، تنلعب على التلفزيون.</span>
      </div>
      <div className="links">
        <a href="https://instagram.com/hyphen.events" target="_blank" rel="noreferrer">@hyphen.events</a>
        <Link href="/about">عن HYPHEN</Link>
        <Link href="/terms">الشروط والأحكام</Link>
        <Link href="/play">عندي رمز</Link>
      </div>
      <div className="muted">© {new Date().getFullYear()} HYPHEN Events. منتج رقمي — لا استرجاع بعد الشراء.</div>
    </footer>
  );
}
