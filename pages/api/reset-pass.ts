import { NextApiRequest, NextApiResponse } from 'next';

import bcrypt from 'bcrypt'
import { setPassInDb } from '@/lib/passDbUtils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const key = req.body.key as string
        const pass = req.body.password as string

        const saltRounds = 10;
        const hashed = await bcrypt.hash(pass, saltRounds)
        
        
        const response = await setPassInDb(key, hashed)
        if (response) {
            res.status(200).json({ result: true })
        }
        else {
            res.status(501).json({ result: false })
        }
    } catch (e) {
        res.status(500).json({ data: e })
    }
}