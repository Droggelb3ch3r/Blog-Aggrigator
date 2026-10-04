import { readConfig } from "src/config";
import {
  createFeed,
  getFeedsByUserId,
  getAllFeeds,
  getFeedByURL,
  createFeedFollow,
  getFeedFollowsByUserId,
  deleteFeedFollow,
} from "src/lib/db/queries/feeds";
import { getUserByName, getUserById } from "src/lib/db/queries/users";
import { Feed, User } from "src/lib/db/schema";

// ---------------------------------------------------------

export async function addFeed(
  cmdName: string,
  user: User,
  ...args: string[]
): Promise<void> {
  if (args.length !== 2) {
    throw new Error(`usage: ${cmdName} <feedName> <feedURL>`);
  }

  const feedName = args[0];
  const feedURL = args[1];

  const response = await createFeed(feedName, user.id, feedURL);

  if (!response) {
    throw new Error("Failed to create feed in the database.");
  }

  const feedFollow = await createFeedFollow(response.id, user.id);

  if (!feedFollow) {
    throw new Error("Failed to create feed follow record in the database.");
  }

  console.log(
    `Successfully created feed '${response.name}' with URL '${response.url}' for user '${user.name}'.`,
  );

  printFeed(response, user);
}

// ---------------------------------------------------------

export async function getFeeds(
  comName: string,
  ...args: string[]
): Promise<void> {
  const feeds = await getAllFeeds();

  if (!feeds || feeds.length === 0) {
    throw new Error(`No feeds found in the database.`);
  }

  console.log(`All Feeds:`);
  for (const feed of feeds) {
    const user = await getUserById(feed.userId);
    if (!user) {
      console.error(
        `User with ID ${feed.userId} not found for feed ${feed.name}.`,
      );
      continue;
    }
    printFeed(feed, user);
  }
}

// ---------------------------------------------------------

export async function getFeedsCurrUser(
  comName: string,
  user: User,
  ...args: string[]
): Promise<void> {
  const feeds = await getFeedsByUserId(user.id);

  if (!feeds || feeds.length === 0) {
    throw new Error(`No feeds found for user ${user.name}.`);
  }

  console.log(`Feeds for user ${user.name}:`);
  feeds.forEach((feed) => {
    printFeed(feed, user);
  });
}

// ---------------------------------------------------------

export async function createFeedFollowRecord(
  comName: string,
  user: User,
  ...args: string[]
): Promise<void> {
  if (args.length !== 1) {
    throw new Error(`usage: ${comName} <feedId> <userId>`);
  }

  const url = args[0];

  const feed = await getFeedByURL(url);
  if (!feed) {
    throw new Error(`Feed with URL ${url} not found.`);
  }

  const followRecord = await createFeedFollow(feed.id, user.id);
  if (!followRecord) {
    throw new Error(
      `Failed to create follow record for feed ${feed.name} and user ${user.name}.`,
    );
  }
  console.log(
    `Successfully created follow record for feed ${feed.name} and user ${user.name}.`,
  );
}

// ---------------------------------------------------------

export async function getFeedsOfUser(
  comName: string,
  user: User,
  ...args: string[]
): Promise<void> {
  if (args.length !== 0) {
    throw new Error(`usage: ${comName}`);
  }

  const follows = await getFeedFollowsByUserId(user.id);

  if (!follows || follows.length === 0) {
    console.log(`No follow records found for user ${user.name}.`);
    return;
  }

  console.log(`Feed records for user ${user.name}:`);
  follows.forEach((feed) => {
    console.log(`* ${feed.feedName}`);
  });
}

// ---------------------------------------------------------

export async function deleteFeedFollowByUserIDFeedID(
  comName: string,
  user: User,
  ...args: string[]
): Promise<void> {
  if (args.length !== 1) {
    throw new Error(`usage: ${comName} <feedId> <userId>`);
  }

  const url = args[0];

  const feed = await getFeedByURL(url);
  if (!feed) {
    throw new Error(`Feed with URL ${url} not found.`);
  }

  const followRecord = await deleteFeedFollow(feed.id, user.id);
  if (!followRecord) {
    throw new Error(
      `Failed to delete follow record for feed ${feed.name} and user ${user.name}.`,
    );
  }
  console.log(
    `Successfully deleted follow record for feed ${feed.name} and user ${user.name}.`,
  );
}

// ---------------------------------------------------------

function printFeed(feed: Feed, user: User) {
  console.log(`* Username:          ${user.name}`);
  console.log(`* User ID:           ${user.id}`);
  console.log(`* User Created At:   ${user.createdAt}`);
  console.log(`* User Updated At:   ${user.updatedAt}`);
  console.log(`* Feed Name:         ${feed.name}`);
  console.log(`* Feed ID:           ${feed.id}`);
  console.log(`* Feed URL:          ${feed.url}`);
  console.log(`* Feed UserID:       ${feed.userId}`);
  console.log(`* Feed Created At:   ${feed.createdAt}`);
  console.log(`* Feed Updated At:   ${feed.updatedAt}`);
}
