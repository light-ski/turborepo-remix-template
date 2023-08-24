import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

export * from "./schema";

// import { users } from './schema'

const connectionString = process.env.DATABASE_URL as string;
const client = postgres(connectionString);
export const db = drizzle(client);

// const allUsers = await db.select().from(users);
