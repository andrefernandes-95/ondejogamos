import { pool } from "@/app/lib/db";
import { betterAuth } from "better-auth";

export const auth = betterAuth({
  database: pool,
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 10,
  },
});

export default auth;
