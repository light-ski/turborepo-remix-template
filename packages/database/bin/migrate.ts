import { migrate } from "drizzle-orm/postgres-js/migrator";

import { db } from "../src";

await migrate(db, { migrationsFolder: "drizzle" });
