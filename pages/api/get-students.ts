import { MongoClient, ObjectId } from "mongodb";
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import { Student } from "@/lib/types";
import { getCollection } from "@/lib/getCollection";

type Data = {
    records: Student[]
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