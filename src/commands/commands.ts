export type CommandHandler = (
  cmdName: string,
  ...args: string[]
) => Promise<void>;

export type CommandsRegistry = Record<string, CommandHandler>;

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
