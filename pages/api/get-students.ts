import { MongoClient, ObjectId } from "mongodb";
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import { env } from "process";

type Data = {
    students: Student[]
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
        const uri: string = env.MONGODB_URI as string;
        const client = new MongoClient(uri)
        const db = client.db("Mailroom");

        const data: Student[] = (await db
            .collection("cobeen")
            .find({})
            .toArray()) as Student[];

        const students = data
        // const students: Student[] = data.filter((student) => student.Age !== null); // TODO: do this better

        res.json({ students });
  } catch (e) {
      console.error(e);
  }
};

export default handler
export type { Student }