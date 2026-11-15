import { pool } from "@/app/lib/db";
import { drainPortraitCleanup } from "@/app/services/portrait-cleanup";

drainPortraitCleanup(100).catch((error) => {
  console.error(error);
  process.exitCode = 1;
}).finally(() => pool.end());
