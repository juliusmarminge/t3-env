import { env } from "../../env.mjs";

export const config = {
  runtime: "experimental-edge",
};

const handler = (_req: Request) => {
  return new Response(JSON.stringify(env), { status: 200 });
};

export default handler;
