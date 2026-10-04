import { readConfig } from "../config";
import { getUserByName } from "../lib/db/queries/users";
import { User } from "../lib/db/schema";

export type CommandHandler = (
  cmdName: string,
  ...args: string[]
) => Promise<void>;

export type UserCommandHandler = (
  cmdName: string,
  user: User,
  ...args: string[]
) => Promise<void>;

export type CommandsRegistry = Record<string, CommandHandler>;

export type middlewareLoggedIn = (
  handler: UserCommandHandler,
) => CommandHandler;

export async function registerCommand(
  registry: CommandsRegistry,
  cmdName: string,
  handler: CommandHandler,
) {
  registry[cmdName] = handler;
}

export async function runCommand(
  registry: CommandsRegistry,
  cmdName: string,
  ...args: string[]
): Promise<void> {
  // zieht Kommandoliste
  const handler = registry[cmdName];

  // prüft, ob handler vorhanden ist
  if (!handler) {
    throw new Error(`Unknown command: ${cmdName}`);
  }
  // wenn liste vorhanden, wird handler ausgeführt
  await handler(cmdName, ...args);
}

export function middlewareLoggedIn(
  handler: UserCommandHandler,
): CommandHandler {
  const commandHandler = async (cmdName: string, ...args: string[]) => {
    const currUser = readConfig().currentUserName;
    if (!currUser) {
      throw new Error("No user is currently logged in. Please log in first.");
    }

    const user = await getUserByName(currUser);
    if (!user) {
      throw new Error(
        `User ${currUser} not found in the database, please register first.`,
      );
    }

    await handler(cmdName, user, ...args);
  };
  return commandHandler;
}
