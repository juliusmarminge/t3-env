// @ts-check
import { z } from "zod";

/**
 * Specify your server-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 */
export const server = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]),
  NEXTAUTH_SECRET: z.string(),
});

/**
 * Specify your client-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 * To expose them to the client, prefix them with `NEXT_PUBLIC_`.
 */
export const client = z.object({
  NEXT_PUBLIC_CLIENTVAR: z.string(),
});

/**
 * You can't destruct `process.env` as a regular object in the Next.js
 * edge runtimes (e.g. middlewares) so we need to destruct manually.
 */
export const processEnv = {
  NODE_ENV: process.env.NODE_ENV,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,

  NEXT_PUBLIC_CLIENTVAR: process.env.NEXT_PUBLIC_CLIENTVAR,
};

// Don't touch the part below
// --------------------------

export const formatErrors = (
  /** @type {z.ZodFormattedError<Map<string,string>,string>} */
  errors
) =>
  Object.entries(errors)
    .map(([name, value]) => {
      if (value && "_errors" in value)
        return `${name}: ${value._errors.join(", ")}\n`;
    })
    .filter(Boolean);

const serverEnv = server.safeParse(processEnv);
if (serverEnv.success === false && typeof window === "undefined") {
  // Only throw if we're in the server-side
  console.error(
    "❌ Invalid environment variables:\n",
    ...formatErrors(serverEnv.error.format())
  );
  throw new Error("Invalid environment variables");
}

const clientEnv = client.safeParse(processEnv);
if (clientEnv.success === false) {
  console.error(
    "❌ Invalid environment variables:\n",
    ...formatErrors(clientEnv.error.format())
  );
  throw new Error("Invalid environment variables");
}

export const env = {
  ...clientEnv.data,
  ...(serverEnv.success ? serverEnv.data : {}),
};
