import { pool } from "@/app/lib/db";
import { betterAuth } from "better-auth";

export const auth = betterAuth({
  database: pool,
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 10,
  },
  trustedOrigins: ["https://ondejogamos.com", "https://www.ondejogamos.com"],
});

export default auth;
