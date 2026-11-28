import { describe, expect, it } from "vitest";
import {
  freshPublishTime,
  MAX_ITEM_AGE_MS,
  parseFeed,
} from "../src/convex/tabloidIngest";

const NOW = Date.parse("2026-11-28T12:00:00.000Z");
const hoursAgo = (h: number) => NOW - h * 60 * 60 * 1000;

describe("ingest freshness cutoff", () => {
  it("keeps a recent item under its own publish date", () => {
    const pubDate = hoursAgo(2);
    expect(freshPublishTime(pubDate, NOW)).toBe(pubDate);
  });

  it("keeps an item published today with the real timestamp, not a re-dated one", () => {
    const pubDate = hoursAgo(30);
    const publishedAt = freshPublishTime(pubDate, NOW);
    expect(publishedAt).toBe(pubDate);
    // The old clamp rewrote anything older than 48h to now - 48h, which is
    // what published archived stories as if they were current.
    expect(publishedAt).not.toBe(hoursAgo(48));
  });

  it("skips an item from a stale feed instead of publishing it as current", () => {
    expect(freshPublishTime(hoursAgo(24 * 10), NOW)).toBeNull();
    expect(freshPublishTime(hoursAgo(24 * 30), NOW)).toBeNull();
  });

  it("treats the cutoff itself as fresh and one second past it as stale", () => {
    expect(freshPublishTime(NOW - MAX_ITEM_AGE_MS, NOW)).toBe(NOW - MAX_ITEM_AGE_MS);
    expect(freshPublishTime(NOW - MAX_ITEM_AGE_MS - 1000, NOW)).toBeNull();
  });

  it("uses a cutoff measured in days, not hours", () => {
    expect(MAX_ITEM_AGE_MS).toBe(3 * 24 * 60 * 60 * 1000);
  });

  it("pulls a future-dated item back to now so it cannot outrank real stories", () => {
    expect(freshPublishTime(NOW + 6 * 60 * 60 * 1000, NOW)).toBe(NOW);
  });

  it("rejects a non-finite date rather than inventing one", () => {
    expect(freshPublishTime(Number.NaN, NOW)).toBeNull();
    expect(freshPublishTime(Number.POSITIVE_INFINITY, NOW)).toBeNull();
  });
});

const feedWith = (dateTag: string) => `<?xml version="1.0"?>
<rss version="2.0"><channel><title>Feed</title>
  <item>
    <title>Archive story resurfaced by a stale feed</title>
    <link>https://example.com/archive-story?a=1&amp;b=2</link>
    <description>An old story the feed republished.</description>
    ${dateTag}
  </item>
</channel></rss>`;

describe("parseFeed publish dates", () => {
  it("keeps the publisher's own timestamp", () => {
    const xml = feedWith(`<pubDate>Sat, 28 Nov 2026 09:00:00 GMT</pubDate>`);
    const [item] = parseFeed(xml, "https://example.com/rss");
    expect(item.pubDate).toBe(Date.parse("2026-11-28T09:00:00.000Z"));
  });

  it("reports an undated item as NaN so it is dropped, not dated as now", () => {
    const xml = feedWith("");
    const [item] = parseFeed(xml, "https://example.com/rss");
    expect(Number.isFinite(item.pubDate)).toBe(false);
    expect(freshPublishTime(item.pubDate, NOW)).toBeNull();
  });

  it("reports an unparseable date as NaN instead of the fetch time", () => {
    const xml = feedWith(`<pubDate>sometime last week</pubDate>`);
    const [item] = parseFeed(xml, "https://example.com/rss");
    expect(Number.isFinite(item.pubDate)).toBe(false);
    expect(freshPublishTime(item.pubDate, NOW)).toBeNull();
  });

  it("drops a genuinely old dated item without re-dating it", () => {
    const xml = feedWith(`<pubDate>Tue, 03 Nov 2026 09:00:00 GMT</pubDate>`);
    const [item] = parseFeed(xml, "https://example.com/rss");
    expect(freshPublishTime(item.pubDate, NOW)).toBeNull();
  });
});
