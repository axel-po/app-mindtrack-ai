import * as dotenv from "dotenv";

import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

export default db;
