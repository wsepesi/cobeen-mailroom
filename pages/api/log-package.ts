import { LogPackage, Package } from '@/lib/types';
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import { ObjectId } from 'mongodb';
import { getCollectionAsync } from "@/lib/getCollection";

const HALL = 'summer' //'cobeen'

const handler = async (req: NextApiRequest, res: NextApiResponse<LogPackage>) => {
  try {
        const pkg = req.body as Package
        const collection = await getCollectionAsync(`${HALL}_package_log`)

        // seperate objectid so we generate a new timestamp of retrieval
        const { _id, ...log } = pkg

        // get ingested time from ObjectId
        const ingestedTime = new ObjectId(_id).getTimestamp()

        const logNoId = {
            ...log,
            ingestedTime,
            resolved: true // TODO: refactor if this method is used more generally for resets
        }

        // insert package and get the object
        const inserted_id = (await collection
            .insertOne(logNoId)
        ).insertedId

        const inserted_object = {
            ...logNoId,
            _id: inserted_id
        }

        res.json(inserted_object)
  } catch (e) {
      console.error(e);
  }
};

export default handler