import { env } from "@/data/env/server";
import { Resend } from "resend"

export const resend = new Resend(env.RESEND_API_KEY || "re_dummy_key_for_build");