import { MongoClient, ObjectId } from "mongodb";
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import { getCollection } from "@/lib/getCollection";

type Data = {
    records: Student[]
}

type Student = {
    _id: ObjectId,
    Age: number,
    Bed_Space: string,
    Rm_Type_Desc: string,
    Last_Name: string,
    First_Name: string,
    University_ID: number,
    Default_Email: string,
}

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  try {
        const collection = getCollection('cobeen')
        const data: Student[] = (await collection
            .find({})
            .toArray()) as Student[];

        const students = data

        res.json({ records: students });
  } catch (e) {
      console.error(e);
  }
};

export default handler
export type { Student }