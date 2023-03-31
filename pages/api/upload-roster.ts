import type { NextApiRequest, NextApiResponse } from 'next'

import { SafeRoster } from '@/lib/types';
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getCollection } from '@/lib/getCollection';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // get roster from the body.roster field
    const roster = req.body.roster as SafeRoster[]

    // get the collection
    const collection = getCollection('cobeen')

    // replace the current roster with the new roster by destroying all old records in the collection and inserting the new records
    await collection.deleteMany({})
    await collection.insertMany(roster)

    res.status(200).json({ message: 'Roster uploaded successfully' })
  } catch (e) {
      console.error(e);
      res.status(500)
  }
};

export default handler