// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import { ObjectId } from "mongodb";
import { Student } from "./get-students";
import { getCollection } from "@/lib/getCollection";
import sendEmail from "@/lib/sendEmail";

type Package = {
    _id: ObjectId,
    First: string,
    Last: string,
    Email: string,
    packageId: number,
    // provider: string
}

type InputPackage = {
    First: string,
    Last: string,
    Email: string,
    Provider: string
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

        // wait 1s for the package to be created and counter to be incremented
        await new Promise(resolve => setTimeout(resolve, 1000))

        // get inserted object back using id
        const inserted_object = (await collection
            .findOne({ _id: inserted_id })
        ) as Package

        sendEmail(inserted_object)

        res.json(inserted_object)
  } catch (e) {
      console.error(e);
  }
};

export default handler
export type { Package }