// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import { ObjectId } from "mongodb";
import { Package } from '@/lib/types';
import { getCollectionAsync } from "@/lib/getCollection";
import { releaseNumber } from '@/lib/handleCounter';

const HALL = 'summer' //'cobeen'

const handler = async (req: NextApiRequest, res: NextApiResponse<boolean>) => {
  try {
        const _id = (req.body as string)
        const collection = await getCollectionAsync(`${HALL}_packages`)

        // delete package and store deleted object

        // console.log(new ObjectId(_id))
        const dbRes = await collection.findOneAndDelete({ _id: new ObjectId(_id) })
        if (dbRes.ok !== 1) {
            throw new Error("Error deleting package")
        }
        const pkg = dbRes.value as Package

        const numberFreedSuccess = await releaseNumber(pkg, HALL)

        if (!numberFreedSuccess) {
            throw new Error("Error freeing number")
        }
        
        // console.log('deleted')
        
        res.json(numberFreedSuccess)
  } catch (e) {
      console.error(e);
  }
};

export default handler