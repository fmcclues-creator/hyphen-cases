// Pure helpers, safe in client components. Server components get the current
// language from lib/lang.js (getLang), client components from useLang().

// Prefix an internal path for the current language: L("en")("/buy") → "/en/buy".
export const L = (lang) => (path) => {
  if (lang !== "en") return path;
  if (path === "/") return "/en";
  if (path.startsWith("/#")) return "/en" + path.slice(1);
  return "/en" + path;
};

export const GAME_NAMES = {
  ar: { khalid: "قضية خالد", shaleh: "قضية الشاليه", villa: "قضية الفيلا", bundle: "القضيتين" },
  en: { khalid: "The Khalid Case", shaleh: "The Chalet Case", villa: "The Villa Case", bundle: "Both cases" },
};
export const GAME_PATHS = { khalid: "/game", shaleh: "/shaleh", villa: "/villa" };
// where a game lives for a given language (the English editions sit in en/ under each game)
export const gamePath = (game, lang) => (GAME_PATHS[game] || "/game") + (lang === "en" && ["khalid", "shaleh"].includes(game) ? "/en/" : "");

export const dirOf = (lang) => (lang === "en" ? "ltr" : "rtl");
export const otherLang = (lang) => (lang === "en" ? "ar" : "en");
