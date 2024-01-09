// GET endpoint that takes in a parameter to select which DB to retrieve packages from, keyed by the hall name
// functionally works like get-packages.ts otherwise

import type { NextApiRequest, NextApiResponse } from 'next'

import { Package } from '@/lib/types';
import { getCollectionAsync } from "@/lib/getCollection";

type PackageData = {
    records: Package[]
}

const POST = 'POST'
const GET = 'GET'

const hall_mapper = {
    "cobeen": "Packages",
    "mashuda": "mashuda_packages",
    "carpenter": "carpenter_packages",
}

const handler = async (req: NextApiRequest, res: NextApiResponse<PackageData>) => {
    const hall = req.query.hall as string
    const collection = await getCollectionAsync(hall_mapper[hall])
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
}

export default handler