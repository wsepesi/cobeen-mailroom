import { NextApiRequest, NextApiResponse } from 'next';

import bcrypt from 'bcrypt'
import { getHashedPassFromDb } from '@/lib/passDbUtils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const key = req.body.params.key as string
        const hash_pass = await getHashedPassFromDb(key)
        const pass = req.body.params.password as string
        bcrypt.compare(pass, hash_pass, function(err, result) {
            if (err) {
                res.status(500).json({ data: err })
            }
            res.status(200).json({ result })
        });
    }
    catch {
        res.status(500).json({ data: "Error" })
    }
}