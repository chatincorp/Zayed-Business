import { describe, expect, it } from "vitest";
import { isHttpsFeed, parseFeed, secureUrl } from "../src/convex/tabloidIngest";

describe("secureUrl", () => {
  it("upgrades a plaintext article link", () => {
    expect(secureUrl("http://www.cnbc.com/2026/11/27/story.html")).toBe(
      "https://www.cnbc.com/2026/11/27/story.html"
    );
  });

  it("keeps the rest of the URL intact", () => {
    expect(secureUrl("http://cdn.example.com:8080/a/b.jpg?w=1200&h=630#top")).toBe(
      "https://cdn.example.com:8080/a/b.jpg?w=1200&h=630#top"
    );
  });

  it("leaves an https URL byte-for-byte alone, including http inside its query", () => {
    const url = "https://example.com/redirect?to=http://example.org/a";
    expect(secureUrl(url)).toBe(url);
  });

  it("only rewrites a leading scheme", () => {
    expect(secureUrl("https://example.com/http://x")).toBe("https://example.com/http://x");
  });

  it("passes through missing or empty values", () => {
    expect(secureUrl(undefined)).toBeUndefined();
    expect(secureUrl("")).toBe("");
  });
});

describe("isHttpsFeed", () => {
  it("accepts the feed URLs the pipeline is allowed to fetch", () => {
    expect(isHttpsFeed("https://feeds.bbci.co.uk/news/business/rss.xml")).toBe(true);
    expect(
      isHttpsFeed("https://news.google.com/rss/search?q=Kenya+business&hl=en-KE&gl=KE&ceid=KE:en")
    ).toBe(true);
  });

  it("rejects plaintext, protocol-relative and non-http schemes", () => {
    expect(isHttpsFeed("http://rss.cnn.com/rss/money_news_international.rss")).toBe(false);
    expect(isHttpsFeed("//feeds.example.com/rss.xml")).toBe(false);
    expect(isHttpsFeed("ftp://feeds.example.com/rss.xml")).toBe(false);
    expect(isHttpsFeed("")).toBe(false);
  });
});

/* Real item shape from feeds.bbci.co.uk (trimmed): CDATA title, https link
 * with a tracking query, and a media:thumbnail whose width makes it the pick. */
const BBC_ITEM = `
  <item>
    <title><![CDATA[Faisal Islam: Why Trump's new tariffs are less of a threat]]></title>
    <description><![CDATA[Other countries have rerouted trade in response.]]></description>
    <link>https://www.bbc.co.uk/news/articles/c6r7g4e3yep1o?at_medium=RSS&amp;at_campaign=rss</link>
    <pubDate>Thu, 26 Nov 2026 19:55:58 GMT</pubDate>
    <media:thumbnail width="240" height="134" url="https://ichef.bbci.co.uk/ace/standard/240/cpsprodpb/a44e/live/be7b3450-e9af-11f1-859a-37130cd3a1d7.jpg"/>
  </item>`;

describe("parseFeed with real feed markup", () => {
  it("reads the link and the largest https image from a BBC item", () => {
    const xml = `<?xml version="1.0"?><rss><channel>${BBC_ITEM}</channel></rss>`;
    const [item] = parseFeed(xml, "https://feeds.bbci.co.uk/news/business/rss.xml");

    expect(item.title).toBe("Faisal Islam: Why Trump's new tariffs are less of a threat");
    expect(item.link).toBe(
      "https://www.bbc.co.uk/news/articles/c6r7g4e3yep1o?at_medium=RSS&at_campaign=rss"
    );
    expect(item.image).toBe(
      "https://ichef.bbci.co.uk/ace/standard/240/cpsprodpb/a44e/live/be7b3450-e9af-11f1-859a-37130cd3a1d7.jpg"
    );
    expect(item.pubDate).toBe(Date.parse("2026-11-26T19:55:58.000Z"));
  });

  it("upgrades a feed that starts emitting plaintext links and images", () => {
    const xml = `<?xml version="1.0"?><rss><channel>${BBC_ITEM
      .replace("https://www.bbc.co.uk", "http://www.bbc.co.uk")
      .replace("https://ichef.bbci.co.uk", "http://ichef.bbci.co.uk")}</channel></rss>`;
    const [item] = parseFeed(xml, "https://feeds.bbci.co.uk/news/business/rss.xml");

    expect(item.link.startsWith("http://")).toBe(true);
    expect(secureUrl(item.link)).toBe(
      "https://www.bbc.co.uk/news/articles/c6r7g4e3yep1o?at_medium=RSS&at_campaign=rss"
    );
    expect(secureUrl(item.image)).toBe(
      "https://ichef.bbci.co.uk/ace/standard/240/cpsprodpb/a44e/live/be7b3450-e9af-11f1-859a-37130cd3a1d7.jpg"
    );
  });
});
