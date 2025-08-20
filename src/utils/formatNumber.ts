import currency from "currency.js";

export function formatIdr(price: number) {
  return currency(price || 0, { symbol: "Rp ", separator: "." })
    .format()
    .replace(/\.00$/, "");
}

export function formatNumber(num: number) {
  return currency(num || 0, { separator: ".", symbol: "" })
    .format()
    .replace(/\.00$/, "");
}
