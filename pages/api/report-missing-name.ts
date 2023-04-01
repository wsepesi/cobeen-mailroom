// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import { reportMissingName } from '@/lib/reportMissingName';

const handler = async (req: NextApiRequest, res: NextApiResponse<boolean>) => {
  try {
        const name = (req.body as string)
        const success = await reportMissingName(name)

        res.status(success ? 200 : 500).json(success)
  } catch (e) {
      console.error(e);
      res.status(500).json(false)
  }
};

export default handler