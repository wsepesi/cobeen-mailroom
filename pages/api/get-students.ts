import { MongoClient, ObjectId } from "mongodb";
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import { HALL } from "@/lib/CONFIG";
import { Student } from "@/lib/types";
import { getCollectionAsync } from "@/lib/getCollection";

type Data = {
    records: Student[]
}

// const HALL = 'summer' //'cobeen'

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  try {
        const collection = await getCollectionAsync(HALL)
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