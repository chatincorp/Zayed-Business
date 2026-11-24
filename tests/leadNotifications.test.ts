import { describe, expect, it } from "vitest";
import {
  buildLeadNotification,
  leadRecipients,
} from "../src/convex/leadNotifications";

describe("notification recipients", () => {
  it("splits, lowercases and de-duplicates the configured list", () => {
    expect(
      leadRecipients(" Sales@YasirZayed.com, ops@yasirzayed.com;sales@yasirzayed.com "),
    ).toEqual(["sales@yasirzayed.com", "ops@yasirzayed.com"]);
  });

  it("is empty when nothing is configured", () => {
    expect(leadRecipients(undefined)).toEqual([]);
    expect(leadRecipients("")).toEqual([]);
    expect(leadRecipients(" , ; ")).toEqual([]);
  });

  it("drops entries that are not email addresses", () => {
    expect(leadRecipients("sales@yasirzayed.com not-an-address")).toEqual([
      "sales@yasirzayed.com",
    ]);
  });
});

describe("notification body", () => {
  it("puts the kind and subject in the subject line and keeps every detail", () => {
    const { subject, text } = buildLeadNotification(
      "New website enquiry",
      "Wholesale pricing",
      ["Name: Amina", "Email: amina@example.com"],
      "amina@example.com",
    );

    expect(subject).toBe("New website enquiry: Wholesale pricing");
    expect(text).toContain("Name: Amina");
    expect(text).toContain("Reply directly to: amina@example.com");
  });

  it("escapes visitor-supplied values in the HTML body", () => {
    const { html } = buildLeadNotification(
      "New website enquiry",
      "<script>alert(1)</script>",
      ['Message: "> <img src=x onerror=alert(1)>'],
    );

    expect(html).not.toContain("<script>alert(1)</script>");
    expect(html).not.toContain("<img src=x");
    expect(html).toContain("&lt;script&gt;");
  });

  it("truncates an oversized subject", () => {
    const { subject } = buildLeadNotification("New enquiry", "x".repeat(400), []);
    expect(subject.length).toBeLessThanOrEqual(180);
  });
});
