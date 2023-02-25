// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Package, PackageNoIds } from '@/lib/types';

import { getAndIncrementCounter } from '@/lib/handleCounter';
import { getCollection } from "@/lib/getCollection";
import sendEmail from "@/lib/sendEmail";

const handler = async (req: NextApiRequest, res: NextApiResponse<Package>) => {
  try {
        const packageNoIds = req.body as PackageNoIds
        const collection = getCollection("Packages")

        const packageId = await getAndIncrementCounter()

        const package_data = {
            ...packageNoIds,
            packageId: packageId,
        }

        const inserted_id = (await collection
            .insertOne(package_data)
        ).insertedId

        // get inserted object back using id
        const inserted_object: Package = {
            _id: inserted_id,
            ...package_data
        }

        sendEmail(inserted_object)

        res.json(inserted_object)
  } catch (e) {
      console.error(e);
  }
};

export default handler