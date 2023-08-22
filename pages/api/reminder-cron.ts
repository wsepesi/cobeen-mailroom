import { HALL, REPLY_TO_EMAIL, SERVICE_EMAIL } from '@/lib/CONFIG';
import type { NextApiRequest, NextApiResponse } from 'next'

import { Package } from '@/lib/types';
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getCollectionAsync } from '@/lib/getCollection';
import sendEmailWithContent from '@/lib/sendEmailWithContent';

// const DOMINIC_EMAIL = "Dominic.barry@marquette.edu"
// const BELLA_EMAIL = "Isabella.Buelow@marquette.edu"
// const COBEEN_EMAIL = "cobeenmail@gmail.com"
// const MARQUETTE_EMAIL = "marquettemailer@gmail.com"
// const HALL = 'summer' //'cobeen'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
        // get collection
        const packagesCollection = await getCollectionAsync(`${HALL}_packages`)
        const packages: Package[] = await packagesCollection.find({}).toArray() as Package[]
        const packagesWithDates = packages.map((pkg) => {
            return {
                ...pkg,
                date: pkg._id.getTimestamp()
            }
        })
        const olderThanOneWeek = packagesWithDates.filter((pkg) => {
            const oneWeekAgo = new Date()
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
            return pkg.date < oneWeekAgo
        })

        // for each one of these packages, launch an email
        for (const pkg of olderThanOneWeek) {
            const { First, Email, date } = pkg
            const content = `Hi ${First},\n\nWe noticed that you haven't picked up your package delivered on ${date.toLocaleDateString('en-US')} yet. Please come to the mailroom to pick it up. If you think this is an error, please come talk to the desk -- your package may not have been properly marked as retrieved.\n\nThanks,\nStaff`
            const subject = "Reminder: You have a package waiting for you"

            await sendEmailWithContent(
                Email, 
                content, 
                REPLY_TO_EMAIL, //DOMINIC_EMAIL, 
                SERVICE_EMAIL, //COBEEN_EMAIL, 
                process.env.MARQUETTE_GMAIL_PASS, //process.env.COBEEN_GMAIL_PASS, 
                subject
            )
        }

        res.status(200).json(true)
  } catch (e) {
      console.error(e);
      res.status(500)
  }
};

export default handler