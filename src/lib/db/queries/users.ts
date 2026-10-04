import { eq } from "drizzle-orm";

import { db } from "..";
import { users } from "../schema";

export async function createUser(name: string) {
  const [result] = await db.insert(users).values({ name: name }).returning();
  return result;
} // Die [] Klammern sind wichtig, da wir nur einen User zurückgeben wollen, nicht ein Array.

export async function getUserByName(name: string) {
  const [user] = await db.select().from(users).where(eq(users.name, name));
  return user;
} // Die [] Klammern sind wichtig, da wir nur einen User zurückgeben wollen, nicht ein Array.

export async function getDBUsers() {
  const user = await db.select().from(users);
  return user;
} // Achtung hier werden alle User als Array zurückgegeben, nicht nur ein User.

export async function getUserById(id: string) {
  const [user] = await db.select().from(users).where(eq(users.id, id));
  return user;
} // Die [] Klammern sind wichtig, da wir nur einen User zurückgeben wollen, nicht ein Array.
