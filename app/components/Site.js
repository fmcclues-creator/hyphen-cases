import Link from "next/link";
import { L } from "../../lib/i18n";
import { LangToggle } from "./LangToggle";

export const WA_NUMBER = "96594426426";
export const WA_HREF =
  `https://wa.me/${WA_NUMBER}?text=` + encodeURIComponent("هلا، عندي سؤال عن قضايا HYPHEN 👋");
export const WA_HREF_EN =
  `https://wa.me/${WA_NUMBER}?text=` + encodeURIComponent("Hi, I have a question about HYPHEN Cases 👋");
export const waHref = (lang) => (lang === "en" ? WA_HREF_EN : WA_HREF);

const T = {
  ar: {
    cases: "القضايا", board: "المتصدرين", about: "عن HYPHEN", play: "عندي كود", wa: "واتساب",
    waBtn: "عندكم سؤال؟", waAria: "راسلونا على واتساب",
    ftrCountry: "الكويت", ftrLine: "ألعاب تحقيق جماعية، تنلعب على التلفزيون.",
    terms: "الشروط والأحكام", waWide: "عندكم سؤال؟ تواصلوا معانا الحين",
    copy: "منتج رقمي — لا استرجاع بعد الشراء.",
  },
  en: {
    cases: "Cases", board: "Leaderboard", about: "About HYPHEN", play: "I have a code", wa: "WhatsApp",
    waBtn: "Questions?", waAria: "Message us on WhatsApp",
    ftrCountry: "Kuwait", ftrLine: "Co-op detective games, played on the TV.",
    terms: "Terms & Conditions", waWide: "Questions? Talk to us now",
    copy: "Digital product — no refunds after purchase.",
  },
};

export function WaMark({ size = 26 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" fill="currentColor">
      <path d="M.06 24l1.69-6.16a11.87 11.87 0 01-1.6-5.95C.16 5.33 5.5 0 12.06 0a11.8 11.8 0 018.4 3.49 11.8 11.8 0 013.48 8.41c0 6.56-5.34 11.9-11.9 11.9h-.01a11.9 11.9 0 01-5.69-1.45L.06 24zm6.6-3.8l.36.22a9.87 9.87 0 005.03 1.38h.01c5.45 0 9.89-4.44 9.9-9.89a9.83 9.83 0 00-2.9-7 9.82 9.82 0 00-6.99-2.9C6.6 2.01 2.16 6.45 2.16 11.9c0 1.87.52 3.69 1.51 5.27l.23.37-1 3.65 3.76-.99zm11.39-7.4c-.07-.12-.27-.2-.57-.35-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.21-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41z" />
    </svg>
  );
}

export function Header({ lang = "ar" }) {
  const t = T[lang], l = L(lang);
  return (
    <header className="hdr">
      <Link href={l("/")} className="brand" aria-label="HYPHEN Cases">
        <img src="/wordmark.svg?v=2" alt="HYPHEN" />
        <span>CASES</span>
      </Link>
      <nav className="menu">
        <Link href={l("/#cases")}>{t.cases}</Link>
        <Link href={l("/leaderboard")}>{t.board}</Link>
        <Link href={l("/about")}>{t.about}</Link>
        <Link href={l("/play")}>{t.play}</Link>
        <a href="https://instagram.com/hyphen.cases" target="_blank" rel="noreferrer">Instagram</a>
        <a className="wa-chip" href={waHref(lang)} target="_blank" rel="noreferrer">
          <WaMark size={18} /> {t.wa}
        </a>
      </nav>
      <LangToggle />
    </header>
  );
}

/**
 * A way to ask a question without leaving the page — the one thing a hesitating
 * buyer wants and a form can't give them. Pinned, so it is there at the moment
 * the doubt arrives rather than only at the bottom.
 */
export function WhatsAppButton({ lang = "ar" }) {
  const t = T[lang];
  return (
    <a className="wabtn" href={waHref(lang)} target="_blank" rel="noreferrer" aria-label={t.waAria}>
      <WaMark size={34} />
      <span>{t.waBtn}</span>
    </a>
  );
}

export function Footer({ lang = "ar" }) {
  const t = T[lang], l = L(lang);
  return (
    <footer className="ftr">
      <div>
        <b>HYPHEN Events</b> · {t.ftrCountry}<br />
        <span className="muted">{t.ftrLine}</span>
      </div>
      <div className="links">
        <a href="https://instagram.com/hyphen.cases" target="_blank" rel="noreferrer">@hyphen.cases</a>
        <a href="https://instagram.com/hyphen.events" target="_blank" rel="noreferrer">@hyphen.events</a>
        <Link href={l("/about")}>{t.about}</Link>
        <Link href={l("/terms")}>{t.terms}</Link>
        <Link href={l("/play")}>{t.play}</Link>
      </div>
      <a className="wa-wide" href={waHref(lang)} target="_blank" rel="noreferrer">
        <WaMark size={24} /> {t.waWide} <b dir="ltr">+965 9442 6426</b>
      </a>
      <div className="muted">© {new Date().getFullYear()} HYPHEN Events. {t.copy}</div>
    </footer>
  );
}
