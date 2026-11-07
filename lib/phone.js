// One place that decides what a WhatsApp number looks like. Buyers are mostly in
// Kuwait, but the codes sell across the Gulf and beyond, so anything with a
// country code is welcome. The result is always "+<country><number>".
export const COUNTRIES = [
  { cc: "965", iso: "KW", flag: "🇰🇼", name: "Kuwait", ar: "الكويت", len: [8, 8], cur: null },
  { cc: "966", iso: "SA", flag: "🇸🇦", name: "Saudi Arabia", ar: "السعودية", len: [9, 9], cur: "SAR" },
  { cc: "971", iso: "AE", flag: "🇦🇪", name: "UAE", ar: "الإمارات", len: [9, 9], cur: "AED" },
  { cc: "974", iso: "QA", flag: "🇶🇦", name: "Qatar", ar: "قطر", len: [8, 8], cur: "QAR" },
  { cc: "973", iso: "BH", flag: "🇧🇭", name: "Bahrain", ar: "البحرين", len: [8, 8], cur: "BHD" },
  { cc: "968", iso: "OM", flag: "🇴🇲", name: "Oman", ar: "عُمان", len: [8, 8], cur: "OMR" },
];

// Rough KWD rates for the "≈ in your currency" hint. The card is always charged
// in KWD by Hesabe; the buyer's bank converts, so this is only an estimate.
export const RATES = {
  SAR: { per: 12.2, ar: "ر.س", en: "SAR", dp: 0 },
  AED: { per: 11.95, ar: "د.إ", en: "AED", dp: 0 },
  QAR: { per: 11.85, ar: "ر.ق", en: "QAR", dp: 0 },
  BHD: { per: 1.225, ar: "د.ب", en: "BHD", dp: 2 },
  OMR: { per: 1.25, ar: "ر.ع", en: "OMR", dp: 2 },
  USD: { per: 3.26, ar: "$", en: "USD", dp: 0 },
};
// cc "965" -> null (home currency); "974" -> "QAR"; "" (other country) -> "USD"
export function currencyFor(cc) {
  if (cc === "965") return null;
  const c = COUNTRIES.find((x) => x.cc === cc);
  return c ? c.cur : "USD";
}
export function approx(kwd, cur, lang = "ar") {
  const r = RATES[cur]; if (!r || !(Number(kwd) > 0)) return "";
  const v = (Number(kwd) * r.per).toFixed(r.dp);
  return lang === "ar" ? `≈ ${v} ${r.ar}` : `≈ ${r.en} ${v}`;
}
// Vercel's x-vercel-ip-country -> the dial code to preselect
export function ccForCountry(iso) {
  const c = COUNTRIES.find((x) => x.iso === String(iso || "").toUpperCase());
  return c ? c.cc : null;
}

// normPhone("9442 6426") -> "+96594426426"; normPhone("+971 50 123 4567") -> "+971501234567"
// normPhone("00974...") -> "+974..."; anything that cannot be a phone number -> null
export function normPhone(raw, defaultCc = "965") {
  let s = String(raw || "").trim().replace(/[^\d+]/g, "");
  if (s.startsWith("00")) s = "+" + s.slice(2);
  const intl = s.startsWith("+");
  let d = s.replace(/\D/g, "");
  if (!d) return null;
  if (!intl) {
    const known = COUNTRIES.find((c) => d.startsWith(c.cc) && d.length === c.cc.length + c.len[1]);
    if (known) d = d; // already carries its country code
    else {
      d = d.replace(/^0+/, "");
      const home = COUNTRIES.find((c) => c.cc === defaultCc);
      if (home && d.length >= home.len[0] && d.length <= home.len[1]) d = defaultCc + d;
      else return null;
    }
  }
  if (d.length < 9 || d.length > 15) return null;
  return "+" + d;
}

// Hesabe only understands a local 8-digit Kuwaiti mobile; anything else is left blank there.
export function kuwaitLocal(e164) {
  const m = /^\+965(\d{8})$/.exec(String(e164 || ""));
  return m ? m[1] : "";
}
