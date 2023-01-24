// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import { MongoClient } from "mongodb";
import { env } from "process";

const handler = async (req, res) => {
  try {
      const uri: string = env.MONGODB_URI as string;
      const client = new MongoClient(uri)
      const db = client.db("Mailroom");

      const students = await db
          .collection("cobeen")
          .find({})
          .limit(10)
          .toArray();

      console.log(students)

      res.json(students);
  } catch (e) {
      console.error(e);
  }
};

// type Student = {
//   _id: string,
//   Bed
// }

export default handler

// export default function handler(
//   req: NextApiRequest,
//   res: NextApiResponse<Data>
// ) {
//   res.status(200).json({ name: 'John Doe' })
// }
