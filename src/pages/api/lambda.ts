import type { NextApiRequest, NextApiResponse } from "next";
import { env } from "../../env.mjs";

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json(env);
};

export default handler;
