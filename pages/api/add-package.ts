// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Package, PackageNoIds } from '@/lib/types';
import { getAndIncrementCounter, pollFromQueue } from '@/lib/handleCounter';

import { HALL } from '@/lib/CONFIG';
import { getCollectionAsync } from "@/lib/getCollection";
import sendEmail from "@/lib/sendEmail";

// const HALL = 'summer' //'cobeen'

const handler = async (req: NextApiRequest, res: NextApiResponse<Package>) => {
  try {
        const packageNoIds = req.body as PackageNoIds
        const collection = await getCollectionAsync(`${HALL}_packages`)

        const packageId = await pollFromQueue(HALL) // getAndIncrementCounter()

        const package_data = {
            ...packageNoIds,
            packageId: packageId,
        }

        const inserted_id = (await collection
            .insertOne(package_data)
        ).insertedId

        const inserted_object: Package = {
            _id: inserted_id,
            ...package_data
        }

        await sendEmail(inserted_object)

        res.json(inserted_object)
  } catch (e) {
      console.error(e);
      console.log(e)
      res.status(500)
  }
};

export default handler