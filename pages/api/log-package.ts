// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import { ObjectId } from 'mongodb';
import { Package } from "./add-package";
import { getCollection } from "@/lib/getCollection";

type LogPackageNoId = Omit<Package, "_id"> & {
    ingestedTime: Date,
    resolved: boolean
}

type LogPackage = LogPackageNoId & {
    _id: ObjectId
}

const handler = async (req: NextApiRequest, res: NextApiResponse<LogPackage>) => {
  try {
        const pkg = req.body as Package
        const collection = getCollection("PackageLog")

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
export type { LogPackage }