// One place for what each product costs. The bundle is the two cases together.
export const GAMES = ["khalid", "shaleh", "villa", "bundle"];
export const BUNDLE_GAMES = ["khalid", "shaleh"];
export function normGame(g) { return GAMES.includes(g) ? g : "khalid"; }
export function listPriceFor(g) {
  const single = Number(process.env.PRICE_KWD || 4.75);
  const bundle = Number(process.env.BUNDLE_KWD || 7.5);
  return normGame(g) === "bundle" ? bundle : single;
}
