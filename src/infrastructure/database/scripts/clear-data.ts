#!/usr/bin/env node
import db from "../client";
import { habits } from "../../../data/models/habits-model";
import { entries } from "../../../data/models/entries-model";
import { entryHabits } from "../../../data/models/entryHabits-model";
import initDotEnv from "./env";

initDotEnv();

async function clearData() {
  try {
    console.log("🧹 Starting data cleanup...");
    console.log("ℹ️  Users will be preserved");

    const start = Date.now();

    // Delete entry_habit relations first (foreign key constraints)
    console.log("🔗 Deleting entry-habit relations...");
    await db.delete(entryHabits);
    console.log(`  ✅ Deleted entry-habit relations`);

    // Delete journal entries
    console.log("📔 Deleting journal entries...");
    await db.delete(entries);
    console.log(`  ✅ Deleted journal entries`);

    // Delete habits
    console.log("🏃 Deleting habits...");
    await db.delete(habits);
    console.log(`  ✅ Deleted habits`);

    const end = Date.now();

    console.log("🎉 Data cleanup completed successfully!");
    console.log(`⏱️  Completed in ${end - start}ms`);
    console.log(`📊 Summary:`);
    console.log(`  - Entry-habit relations: deleted`);
    console.log(`  - Journal entries: deleted`);
    console.log(`  - Habits: deleted`);
    console.log(`  - Users: preserved ✅`);
  } catch (error) {
    console.error("❌ Error during data cleanup:", error);
    throw error;
  }
}

// Run the cleanup function
clearData()
  .then(() => {
    console.log("✅ Data cleanup process completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Data cleanup failed:", error);
    process.exit(1);
  });
