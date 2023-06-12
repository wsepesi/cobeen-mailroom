// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import { Package } from '@/lib/types';
import { getCollectionAsync } from "@/lib/getCollection";

type PackageData = {
    records: Package[]
}

const POST = 'POST'
const GET = 'GET'
const HALL = 'summer' //'cobeen

const handler = async (req: NextApiRequest, res: NextApiResponse<PackageData>) => {
    const collection = await getCollectionAsync(`${HALL}_packages`)
    if (req.method === POST) {
        const ID = req.body as number
        try {
            
            const data: Package[] = (await collection
                .find({ studentId: ID })
                .toArray()) as Package[];
            res.json({ records: data })
        }
        catch (e) {
            console.error(e);
        }
    } else if (req.method === GET) {
        try {
            const data: Package[] = (await collection
                .find({})
                .toArray()) as Package[];

            res.json({ records: data });
        } catch (e) {
            console.error(e);
        }
    }
    else {
        res.status(405)
    }
};

export default handler
export type { PackageData }