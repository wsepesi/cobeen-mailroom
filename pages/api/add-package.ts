// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Package, PackageNoIds } from '@/lib/types';
import { getAndIncrementCounter, pollFromQueue } from '@/lib/handleCounter';

import { getCollectionAsync } from "@/lib/getCollection";
import sendEmail from "@/lib/sendEmail";

const HALL = 'cobeen'

var PACKAGE_GLOBAL: Package

const handler = async (req: NextApiRequest, res: NextApiResponse<Package>) => {
  try {
        const packageNoIds = req.body as PackageNoIds
        const collection = await getCollectionAsync("Packages")

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

        PACKAGE_GLOBAL = inserted_object

        const id = setTimeout(() => {
          res.status(500).json(PACKAGE_GLOBAL)
        }, 7000)

        await sendEmail(inserted_object)
        clearTimeout(id)

        res.json(inserted_object)
  } catch (e) {
      console.error(e);
      console.log(e)
      if (PACKAGE_GLOBAL) {
        res.status(500).json(PACKAGE_GLOBAL)
      } else {
        res.status(501)
      }
  }
};

export default handler