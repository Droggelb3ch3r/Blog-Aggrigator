import {
  type CommandsRegistry,
  runCommand,
  registerCommand,
  middlewareLoggedIn,
} from "./commands/commands";
import { handlerLogin, registerUser, getUsers } from "./commands/users";
import { resetUserDB } from "./commands/resetdb";
import { handlerAgg } from "./commands/aggregate";
import {
  addFeed,
  getFeeds,
  getFeedsCurrUser,
  createFeedFollowRecord,
  getFeedsOfUser,
  deleteFeedFollowByUserIDFeedID,
} from "./commands/feeds";
import { handlerBrowse } from "./commands/browse";

async function main() {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.log("Bitte gebe einen Befehl ein!");
    process.exit(1);
  }

  const cmdName = args[0];
  const cmdArgs = args.slice(1);
  const commandsRegistry: CommandsRegistry = {};

  registerCommand(commandsRegistry, "login", handlerLogin);
  registerCommand(commandsRegistry, "register", registerUser);
  registerCommand(commandsRegistry, "reset", resetUserDB);
  registerCommand(commandsRegistry, "users", getUsers);
  registerCommand(commandsRegistry, "agg", handlerAgg);
  registerCommand(commandsRegistry, "addfeed", middlewareLoggedIn(addFeed));
  registerCommand(commandsRegistry, "feeds", getFeeds);
  registerCommand(
    commandsRegistry,
    "feedsbyuser",
    middlewareLoggedIn(getFeedsCurrUser),
  );
  registerCommand(
    commandsRegistry,
    "follow",
    middlewareLoggedIn(createFeedFollowRecord),
  );
  registerCommand(
    commandsRegistry,
    "following",
    middlewareLoggedIn(getFeedsOfUser),
  );
  registerCommand(
    commandsRegistry,
    "unfollow",
    middlewareLoggedIn(deleteFeedFollowByUserIDFeedID),
  );
  registerCommand(
    commandsRegistry,
    "browse",
    middlewareLoggedIn(handlerBrowse),
  );
  // Register other commands here...

  try {
    await runCommand(commandsRegistry, cmdName, ...cmdArgs);
  } catch (err) {
    if (err instanceof Error) {
      console.error(`Error running command ${cmdName}: ${err.message}`);
    } else {
      console.error(`Error running command ${cmdName}: ${err}`);
    }
    process.exit(1);
  }
  process.exit(0);
}

main();
