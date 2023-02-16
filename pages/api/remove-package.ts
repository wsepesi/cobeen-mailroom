// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import { ObjectId } from "mongodb";
import { getCollection } from "@/lib/getCollection";

const handler = async (req: NextApiRequest, res: NextApiResponse<boolean>) => {
  try {
        const _id = (req.body as string)
        const collection = getCollection("Packages")

        // delete package and store deleted object

        console.log(new ObjectId(_id))
        const dbRes = await collection.deleteOne({ _id: new ObjectId(_id) })
        
        console.log('deleted')
        
        res.json(dbRes.acknowledged)
  } catch (e) {
      console.error(e);
  }
};

export default handler