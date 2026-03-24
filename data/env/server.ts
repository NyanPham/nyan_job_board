import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";
import dns from "node:dns";
dns.lookup("db.jwyqsrdjaiilpvpbvnlu.supabase.co", { all: true }, console.log);


export const env = createEnv({
  server: {
    DB_HOST: z.string().min(1),
    DB_PASSWORD: z.string().min(1),
    DB_USER: z.string().min(1),
    DB_PORT: z.string().min(1),
    DB_NAME: z.string().min(1),
    CLERK_SECRET_KEY: z.string().min(1),
    CLERK_WEBHOOK_SECRET: z.string().min(1),
    UPLOADTHING_TOKEN: z.string().min(1),
    GEMINI_API_KEY: z.string().min(1),
    RESEND_API_KEY: z.string().min(1),
    SERVER_URL: z.string().min(1),
    DATABASE_URL: z.string().min(1),
  },
  createFinalSchema: (env) => {
    return z.object(env).transform((val) => {
      const {
        DB_HOST,
        DB_NAME,
        DB_PASSWORD,
        DB_PORT,
        DB_USER,
        DATABASE_URL,
        ...rest
      } = val;

      if (
        `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}` !=
        DATABASE_URL
      ) {
        throw new Error("NOT MATCH VARIABLES");
      }

      return {
        ...rest,
        DATABASE_URL,
      };
    });
  },
  emptyStringAsUndefined: true,
  experimental__runtimeEnv: process.env,
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
