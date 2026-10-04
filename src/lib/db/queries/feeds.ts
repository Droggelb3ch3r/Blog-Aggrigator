import { eq, and, sql } from "drizzle-orm";

import { db } from "..";
import { feeds, feedFollows, users } from "../schema";

export async function createFeed(name: string, userId: string, url: string) {
  const [result] = await db
    .insert(feeds)
    .values({ name: name, userId: userId, url: url })
    .returning();
  return result;
} // Die [] Klammern sind wichtig, da wir nur einen Feed zurückgeben wollen, nicht ein Array.

export async function getFeedsByUserId(userId: string) {
  const userFeeds = await db
    .select()
    .from(feeds)
    .where(eq(feeds.userId, userId));
  return userFeeds;
}

export async function getAllFeeds() {
  const allFeeds = await db.select().from(feeds);
  return allFeeds;
}

export async function getFeedByURL(url: string) {
  const [feed] = await db.select().from(feeds).where(eq(feeds.url, url));
  return feed;
}

export async function createFeedFollow(feedId: string, userId: string) {
  const [insert] = await db

    .insert(feedFollows)
    .values({ feedId: feedId, userId: userId })
    .returning();
  // erst insert danach select, kann man nicht in einem machen
  const [result] = await db
    .select({
      id: feedFollows.id,
      createdAt: feedFollows.createdAt,
      updatedAt: feedFollows.updatedAt,
      feedId: feedFollows.feedId,
      userId: feedFollows.userId,
      userName: users.name,
      feedName: feeds.name,
    })
    .from(feedFollows)
    .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
    .innerJoin(users, eq(feedFollows.userId, users.id))
    .where(eq(feedFollows.id, insert.id));

  return result;
}

export async function getFeedFollowsByUserId(userId: string) {
  const result = await db
    .select({
      id: feedFollows.id,
      createdAt: feedFollows.createdAt,
      updatedAt: feedFollows.updatedAt,
      feedId: feedFollows.feedId,
      userId: feedFollows.userId,
      userName: users.name,
      feedName: feeds.name,
      feedURL: feeds.url,
      feedCreatedAt: feeds.createdAt,
      feedUpdatedAt: feeds.updatedAt,
    })
    .from(feedFollows)
    .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
    .innerJoin(users, eq(feedFollows.userId, users.id))
    .where(eq(feedFollows.userId, userId));
  return result;
}

export async function deleteFeedFollow(feedId: string, userId: string) {
  const [result] = await db
    .delete(feedFollows)
    .where(and(eq(feedFollows.feedId, feedId), eq(feedFollows.userId, userId)))
    .returning();
  return result;
}

export async function markFeedFetched(feedId: string) {
  const [result] = await db
    .update(feeds)
    .set({ lastFetchedAt: new Date() })
    .where(eq(feeds.id, feedId))
    .returning();
  return result;
}

export async function getNextFeedToFetch() {
  const [result] = await db
    .select()
    .from(feeds)
    .orderBy(sql`${feeds.lastFetchedAt} asc nulls first`)
    .limit(1);
  return result;
}
