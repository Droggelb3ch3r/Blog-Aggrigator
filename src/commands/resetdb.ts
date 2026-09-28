import { resetDB } from "../lib/db/queries/reset";

export async function resetUserDB(
  cmdName: string,
  ...args: string[]
): Promise<void> {
  const result = await resetDB();

  if (result === undefined || result === null) {
    throw new Error(
      "No users were deleted. The database may already be empty.",
    );
  }

  console.log("User database reset successfully!");
  console.log("debug:", result);
}
