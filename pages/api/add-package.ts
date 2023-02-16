import { MongoClient, ObjectId } from "mongodb";
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import { Student } from "./get-students";
import { getCollection } from "@/lib/getCollection";

type Package = {
    _id: ObjectId,
    First: string,
    Last: string,
    Email: string,
    packageId: number
}

const handler = async (req: NextApiRequest, res: NextApiResponse<Package>) => {
  try {
        const student = req.body as Student
        const collection = getCollection("Packages")

        const package_data = {
            First: student.First_Name,
            Last: student.Last_Name,
            Email: student.Default_Email,
        }

        const inserted_id = (await collection
            .insertOne(package_data)
        ).insertedId

        // get inserted object back using id
        const inserted_object = (await collection
            .findOne({ _id: inserted_id })
        ) as Package

        res.json(inserted_object)
  } catch (e) {
      console.error(e);
  }
};

export default handler
export type { Package }