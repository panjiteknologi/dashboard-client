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

export const formatIDRFraction = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
