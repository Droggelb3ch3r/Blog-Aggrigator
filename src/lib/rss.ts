import { XMLParser } from "fast-xml-parser";

export type RSSFeed = {
  channel: {
    title: string;
    link: string;
    description: string;
    item: RSSItem[];
  };
};
export type RSSItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};

export async function fetchFeed(feedURL: string): Promise<RSSFeed> {
  if (!feedURL) {
    throw new Error("Feed URL is required");
  }

  const feedData = await fetch(feedURL, {
    method: "GET",
    headers: {
      "User-Agent": "gator",
      accept: "application/rss+xml",
    },
  });
  const feedText = await feedData.text();

  const options = {
    processEntities: false,
  };
  const parser = new XMLParser(options);
  const feedObj = parser.parse(feedText);

  if (!feedObj || !feedObj.rss || !feedObj.rss.channel) {
    throw new Error("Invalid RSS feed format");
  }

  const channel = feedObj.rss.channel;
  if (!channel.title || !channel.link || !channel.description) {
    throw new Error("Missing required channel fields in RSS feed");
  }

  const items: any[] = Array.isArray(channel.item)
    ? channel.item
    : [channel.item]; // Ensure items is always an array

  const rssItems: RSSItem[] = [];

  for (const item of items) {
    if (!item.title || !item.link || !item.description || !item.pubDate) {
      continue;
    }

    rssItems.push({
      title: item.title,
      link: item.link,
      description: item.description,
      pubDate: item.pubDate,
    });
  }

  // Construct the RSSFeed object
  const rssFeed: RSSFeed = {
    channel: {
      title: channel.title,
      link: channel.link,
      description: channel.description,
      item: rssItems,
    },
  };

  return rssFeed;
}
