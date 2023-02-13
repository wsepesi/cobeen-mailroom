import { MongoClient, ObjectId } from "mongodb";
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import { env } from "process";

type Data = {
    students: Student[]
}

type Student = {
    _id: ObjectId,
    Age?: number
}
// type Student = {
//   _id: ObjectId,
//   Bed
// }

// // _id
// : 
// ObjectId('63cdb19e82731e2a1859c959')
// Bed Space
// : 
// "CO-0206c"
// Rm Type Desc
// : 
// "CO4 Quad"
// Last Name
// : 
// "Hicks"
// First Name
// : 
// "Calvin"
// University ID
// : 
// 6238280
// Default Email
// : 
// "calvin.hicks@marquette.edu"
// Age
// : 
// 18

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  try {
        const uri: string = env.MONGODB_URI as string;
        const client = new MongoClient(uri)
        const db = client.db("Mailroom");

        const data: Student[] = await db
            .collection("cobeen")
            .find({})
            .toArray()

        const students: Student[] = data.filter((student) => student.Age !== null); // TODO: do this better

        res.json({ students });
  } catch (e) {
      console.error(e);
  }
};

export default handler
export type { Student }