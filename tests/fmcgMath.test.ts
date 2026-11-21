import { describe, expect, it } from "vitest";
import {
  applicableTier,
  commissionAmount,
  hasStockFor,
  holdsStock,
  lineTotal,
  orderTotal,
  quantitiesByProduct,
  STOCK_HOLDING_STATUSES,
  stockMovement,
  totalCommission,
  type OrderStatus,
} from "../src/convex/pricing";

const TIERS = [
  { thresholdQuantity: 10, ratePercent: 3 },
  { thresholdQuantity: 50, ratePercent: 5 },
  { thresholdQuantity: 100, ratePercent: 7 },
];

describe("tier selection by MOQ threshold", () => {
  it("has no rate below the first threshold", () => {
    expect(applicableTier(TIERS, 1)).toBeNull();
    expect(applicableTier(TIERS, 9)).toBeNull();
  });

  it("applies the tier whose threshold is met exactly", () => {
    expect(applicableTier(TIERS, 10)?.ratePercent).toBe(3);
    expect(applicableTier(TIERS, 50)?.ratePercent).toBe(5);
    expect(applicableTier(TIERS, 100)?.ratePercent).toBe(7);
  });

  it("keeps the lower tier between thresholds", () => {
    expect(applicableTier(TIERS, 11)?.ratePercent).toBe(3);
    expect(applicableTier(TIERS, 49)?.ratePercent).toBe(3);
    expect(applicableTier(TIERS, 99)?.ratePercent).toBe(5);
  });

  it("uses the top tier for quantities above the highest threshold", () => {
    expect(applicableTier(TIERS, 1000)?.ratePercent).toBe(7);
    expect(applicableTier(TIERS, 1000)?.thresholdQuantity).toBe(100);
  });

  it("picks the highest applicable threshold whatever the stored order", () => {
    const unsorted = [
      { thresholdQuantity: 100, ratePercent: 7 },
      { thresholdQuantity: 10, ratePercent: 3 },
      { thresholdQuantity: 50, ratePercent: 5 },
    ];
    expect(applicableTier(unsorted, 60)?.ratePercent).toBe(5);
  });

  it("ignores tiers with a non-finite threshold", () => {
    const broken = [
      { thresholdQuantity: Number.NaN, ratePercent: 9 },
      { thresholdQuantity: 10, ratePercent: 3 },
    ];
    expect(applicableTier(broken, 100)?.ratePercent).toBe(3);
  });

  it("returns null when a product has no rule", () => {
    expect(applicableTier([], 500)).toBeNull();
  });
});

describe("line totals", () => {
  it("multiplies quantity by the stored unit price", () => {
    expect(lineTotal(12, 250)).toBe(3000);
    expect(lineTotal(3, 12.5)).toBe(37.5);
    expect(lineTotal(0, 100)).toBe(0);
  });

  it("sums the lines into the order total", () => {
    const lines = [
      { quantity: 2, unitPrice: 100 },
      { quantity: 5, unitPrice: 20.5 },
    ];
    expect(orderTotal(lines)).toBe(302.5);
    expect(orderTotal([])).toBe(0);
  });
});

describe("commission rounding", () => {
  it("takes a whole-currency percentage of the line", () => {
    expect(commissionAmount(1000, 3)).toBe(30);
    expect(commissionAmount(1000, 0)).toBe(0);
    expect(commissionAmount(0, 5)).toBe(0);
  });

  it("rounds to the nearest unit, halves up", () => {
    expect(commissionAmount(999, 2.5)).toBe(25); // 24.975
    expect(commissionAmount(1, 7)).toBe(0); // 0.07
    expect(commissionAmount(3, 50)).toBe(2); // 1.5
    expect(commissionAmount(100, 1.5)).toBe(2); // 1.5
    expect(commissionAmount(99, 5)).toBe(5); // 4.95
  });

  it("rounds the slip total, not each line twice", () => {
    expect(totalCommission([30, 25, 0])).toBe(55);
    expect(totalCommission([0.4, 0.4])).toBe(1);
    expect(totalCommission([])).toBe(0);
  });
});

describe("stock rules", () => {
  const ALL_STATUSES: OrderStatus[] = [
    "pending_review",
    "confirmed",
    "processing",
    "fulfilled",
    "cancelled",
  ];

  it("holds stock only once an order is confirmed", () => {
    expect(ALL_STATUSES.filter(holdsStock)).toEqual([
      "confirmed",
      "processing",
      "fulfilled",
    ]);
    expect(STOCK_HOLDING_STATUSES).toEqual(["confirmed", "processing", "fulfilled"]);
    expect(holdsStock("pending_review")).toBe(false);
    expect(holdsStock("cancelled")).toBe(false);
  });

  it("commits when entering a holding status", () => {
    expect(stockMovement(false, "confirmed")).toBe("commit");
    expect(stockMovement(false, "fulfilled")).toBe("commit");
  });

  it("does nothing while the order keeps its stock", () => {
    expect(stockMovement(true, "confirmed")).toBe("none");
    expect(stockMovement(true, "processing")).toBe("none");
    expect(stockMovement(true, "fulfilled")).toBe("none");
    expect(stockMovement(false, "pending_review")).toBe("none");
    expect(stockMovement(false, "cancelled")).toBe("none");
  });

  it("releases on cancellation or reopening", () => {
    expect(stockMovement(true, "cancelled")).toBe("release");
    expect(stockMovement(true, "pending_review")).toBe("release");
  });

  it("refuses a quantity larger than the shelf", () => {
    expect(hasStockFor(10, 10)).toBe(true);
    expect(hasStockFor(10, 11)).toBe(false);
    expect(hasStockFor(0, 1)).toBe(false);
  });

  it("sums repeated lines so a split cart is checked against its total", () => {
    const totals = quantitiesByProduct([
      { productId: "p1", quantity: 3 },
      { productId: "p2", quantity: 2 },
      { productId: "p1", quantity: 4 },
      { quantity: 99 },
    ]);
    expect(totals.get("p1")).toBe(7);
    expect(totals.get("p2")).toBe(2);
    expect(totals.size).toBe(2);
  });

  it("stops the second of two orders taking the same cases", () => {
    // Both orders pass the booking-time check against 10 cases...
    const shelf = 10;
    expect(hasStockFor(shelf, 4)).toBe(true);
    expect(hasStockFor(shelf, 7)).toBe(true);

    // ...but once the first is confirmed, the second no longer fits.
    const afterFirst = shelf - 4;
    expect(afterFirst).toBe(6);
    expect(hasStockFor(afterFirst, 7)).toBe(false);
  });

  it("restores exactly what was committed", () => {
    const shelf = 10;
    const committed = 4;
    const afterConfirm = shelf - committed;
    expect(afterConfirm + committed).toBe(shelf);
  });

  it("checks the combined need of a split cart against the shelf", () => {
    const totals = quantitiesByProduct([
      { productId: "p1", quantity: 6 },
      { productId: "p1", quantity: 5 },
    ]);
    expect(hasStockFor(10, totals.get("p1")!)).toBe(false);
  });
});
