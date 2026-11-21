/**
 * Order and commission maths.
 *
 * Pure functions only — the mutations in `fmcg.ts` do the database reads and
 * writes, and every number they store comes from here. Nothing in this module
 * touches the database or the server runtime, so the rules can be exercised
 * directly.
 */

export interface CommissionTier {
  thresholdQuantity: number;
  ratePercent: number;
}

export type OrderStatus =
  | "pending_review"
  | "confirmed"
  | "processing"
  | "fulfilled"
  | "cancelled";

/** Statuses that hold stock. Every other status lets it go. */
export const STOCK_HOLDING_STATUSES: readonly OrderStatus[] = [
  "confirmed",
  "processing",
  "fulfilled",
];

/** True when an order in this status should have its quantities off the shelf. */
export function holdsStock(status: OrderStatus | string): boolean {
  return (STOCK_HOLDING_STATUSES as readonly string[]).includes(status);
}

export type StockMovement = "commit" | "release" | "none";

/**
 * What a status change does to stock, given whether the order currently holds
 * any. Moving into a holding status commits, moving out of one releases, and a
 * change within the same side does nothing — so confirmed → processing cannot
 * deduct twice.
 */
export function stockMovement(
  heldNow: boolean,
  nextStatus: OrderStatus | string,
): StockMovement {
  const nextHolds = holdsStock(nextStatus);
  if (nextHolds && !heldNow) return "commit";
  if (!nextHolds && heldNow) return "release";
  return "none";
}

/** How much of each listing an order needs, summed across its lines. */
export function quantitiesByProduct(
  items: ReadonlyArray<{ productId?: string; quantity: number }>,
): Map<string, number> {
  const totals = new Map<string, number>();
  for (const item of items) {
    if (!item.productId) continue;
    totals.set(item.productId, (totals.get(item.productId) ?? 0) + item.quantity);
  }
  return totals;
}

/** True when the shelf can cover `quantity`. */
export function hasStockFor(stockQuantity: number, quantity: number): boolean {
  return stockQuantity >= quantity;
}

/**
 * The tier whose threshold is the largest value still at or below the booked
 * quantity — the rate that applies to that whole line.
 */
export function applicableTier(
  tiers: ReadonlyArray<CommissionTier>,
  quantity: number,
): CommissionTier | null {
  if (!tiers || tiers.length === 0) return null;
  let best: CommissionTier | null = null;
  for (const tier of tiers) {
    if (Number.isFinite(tier.thresholdQuantity) && quantity >= tier.thresholdQuantity) {
      if (!best || tier.thresholdQuantity > best.thresholdQuantity) {
        best = tier;
      }
    }
  }
  return best;
}

/** Line value: ordered quantity times the stored unit price. */
export function lineTotal(quantity: number, unitPrice: number): number {
  return quantity * unitPrice;
}

/** Sum of the order's line totals. */
export function orderTotal(
  lines: ReadonlyArray<{ quantity: number; unitPrice: number }>,
): number {
  return lines.reduce(
    (sum, line) => sum + lineTotal(line.quantity, line.unitPrice),
    0,
  );
}

/** Whole-currency commission for one line, rounded to the nearest unit. */
export function commissionAmount(lineValue: number, ratePercent: number): number {
  return Math.round((lineValue * ratePercent) / 100);
}

/** Whole-currency commission for a slip: the rounded sum of its lines. */
export function totalCommission(amounts: ReadonlyArray<number>): number {
  return Math.round(amounts.reduce((sum, amount) => sum + amount, 0));
}
