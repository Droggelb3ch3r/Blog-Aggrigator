import { setUser, readConfig } from "../config";
import { createUser, getUserByName, getDBUsers } from "../lib/db/queries/users";

// ---------------------------------------------------

export async function handlerLogin(
  cmdName: string,
  ...args: string[]
): Promise<void> {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <name>`);
  }

  const userName = args[0];

  const dbuser = await getUserByName(userName);

  if (!dbuser) {
    throw new Error(`User ${userName} does not exist!`);
  } // Kontrolle ob User exists, wenn nicht, dann sicherer Error

  setUser(userName);
  console.log("User switched successfully!");
}

// -----------------------------------------------------

export async function registerUser(
  cmdName: string,
  ...args: string[]
): Promise<void> {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <name>`);
  }

  const userName = args[0];
  const dbuser = await getUserByName(userName);

  if (dbuser) {
    throw new Error(`User ${userName} already exists!`);
  } // Kontrolle ob User exists, wenn ja, dann sicherer Error

  const result = await createUser(userName); // create user in the database

  setUser(userName); // set current user in config
  console.log("User imported successfully!");
  console.log("debug:", result);
}

// -----------------------------------------------------

export async function getUsers(
  cmdName: string,
  ...args: string[]
): Promise<void> {
  const users = await getDBUsers();

  if (users.length === 0) {
    throw new Error("No users found in the database!");
  }

  for (const user of users) {
    if (user.name === readConfig().currentUserName) {
      console.log(`* ${user.name} (current)`);
    } else {
      console.log(`* ${user.name}`);
    }
  }
}
