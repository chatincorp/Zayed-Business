/**
 * Currency utilities — accurate USD ⇄ KES conversion for pricing.
 *
 * The rate mirrors the site's own live forex desk (tabloidData.ts USD/KES).
 * Update both places if the business rate changes.
 */

/** Business USD→KES rate (matches Zayed Tabloid live forex data). */
export const USD_TO_KES_RATE = 153.45;

/** Convert USD to KES. */
export function usdToKes(usd: number): number {
  return usd * USD_TO_KES_RATE;
}

/** Convert KES to USD. */
export function kesToUsd(kes: number): number {
  return kes / USD_TO_KES_RATE;
}

/** "$1,499" */
export function formatUsd(usd: number): string {
  return `$${Math.round(usd).toLocaleString("en-US")}`;
}

/** "KES 229,918" */
export function formatKes(kes: number): string {
  return `KES ${Math.round(kes).toLocaleString("en-US")}`;
}

/** "≈ KES 229,918" */
export function formatKesApprox(usd: number): string {
  return `≈ ${formatKes(usdToKes(usd))}`;
}
