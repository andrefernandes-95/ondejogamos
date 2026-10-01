import { betterAuth } from "better-auth";
import { emailOTP } from "better-auth/plugins";
import nodemailer from "nodemailer";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is required");
}

const globalForPostgres = globalThis as typeof globalThis & {
  postgresPool?: Pool;
};

const pool =
  globalForPostgres.postgresPool ?? new Pool({ connectionString: databaseUrl });

if (process.env.NODE_ENV !== "production") {
  globalForPostgres.postgresPool = pool;
}

const mailer = nodemailer.createTransport({
  host: process.env.SMTP_HOST ?? "127.0.0.1",
  port: Number(process.env.SMTP_PORT ?? 1025),
  secure: false,
});

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET,
  database: pool,
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        const subject =
          type === "sign-in"
            ? "Your Onde Jogamos sign-in code"
            : "Your Onde Jogamos verification code";

        await mailer.sendMail({
          from: process.env.EMAIL_FROM ?? "Onde Jogamos <login@ondejogamos.local>",
          to: email,
          subject,
          text: `Your code is ${otp}. It expires in five minutes.`,
        });
      },
    }),
  ],
});
