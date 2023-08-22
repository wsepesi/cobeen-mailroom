import { LogPackage, Package } from '@/lib/types';
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getCollection, getCollectionAsync } from "@/lib/getCollection";

import { HALL } from '@/lib/CONFIG';

type PackageData = {
    records: LogPackage[]
}

const POST = 'POST'
const GET = 'GET'
// const HALL = 'summer' //'cobeen'
const LOG = `${HALL}_package_log`

const handler = async (req: NextApiRequest, res: NextApiResponse<PackageData>) => {
    const collection = await getCollectionAsync(LOG)
    if (req.method === POST) {
        const ID = req.body as number
        try {
            const data: LogPackage[] = (await collection
                .find({ studentId: ID })
                .toArray()) as LogPackage[];
            res.json({ records: data })
        }
        catch (e) {
            console.error(e);
        }
    } else if (req.method === GET) {
        try {
            const data: LogPackage[] = (await collection
                .find({})
                .toArray()) as LogPackage[];

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