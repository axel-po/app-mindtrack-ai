#!/usr/bin/env node

import initDotEnv from "./env";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import pg from "pg";
import { sql } from "drizzle-orm";
initDotEnv();

const runMigrate = async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined");
  }
  const client = new pg.Client({
    connectionString: process.env.DATABASE_URL,
  });

  await client.connect();
  const db = drizzle(client);

  console.log("⏳ Running migrations...");

  const start = Date.now();

  await db.execute(sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
  await migrate(db, { migrationsFolder: "./drizzle/migrations" });

  const end = Date.now();

  console.log("✅ Migrations completed in", end - start, "ms");

  process.exit(0);
};

(async () => {
  try {
    await runMigrate();
  } catch (error) {
    console.error("❌ Migration failed");
    console.error(error);
    process.exit(1);
  }
})();
