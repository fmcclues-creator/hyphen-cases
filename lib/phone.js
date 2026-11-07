// One place that decides what a WhatsApp number looks like. Buyers are mostly in
// Kuwait, but the codes sell across the Gulf and beyond, so anything with a
// country code is welcome. The result is always "+<country><number>".
export const COUNTRIES = [
  { cc: "965", flag: "🇰🇼", name: "Kuwait", ar: "الكويت", len: [8, 8] },
  { cc: "966", flag: "🇸🇦", name: "Saudi Arabia", ar: "السعودية", len: [9, 9] },
  { cc: "971", flag: "🇦🇪", name: "UAE", ar: "الإمارات", len: [9, 9] },
  { cc: "974", flag: "🇶🇦", name: "Qatar", ar: "قطر", len: [8, 8] },
  { cc: "973", flag: "🇧🇭", name: "Bahrain", ar: "البحرين", len: [8, 8] },
  { cc: "968", flag: "🇴🇲", name: "Oman", ar: "عُمان", len: [8, 8] },
];

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
