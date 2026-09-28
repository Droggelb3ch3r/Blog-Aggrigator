import {
  type CommandsRegistry,
  runCommand,
  registerCommand,
} from "./commands/commands";
import { handlerLogin, registerUser, getUsers } from "./commands/users";
import { resetUserDB } from "./commands/resetdb";

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
