// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import { Package } from '@/lib/types';
import { getCollection } from "@/lib/getCollection";

type Data = {
    records: Package[]
}

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  try {
        const collection = getCollection('Packages')
        const data: Package[] = (await collection
            .find({})
            .toArray()) as Package[];

        const packages = data

        res.json({ records: packages });
  } catch (e) {
      console.error(e);
  }
};

export default handler