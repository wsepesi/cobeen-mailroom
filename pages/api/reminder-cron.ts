import type { NextApiRequest, NextApiResponse } from 'next'

import { MARQUETTE_EMAIL } from '@/lib/CONFIG';
import { Package } from '@/lib/types';
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getCollectionAsync } from '@/lib/getCollection';
import sendEmailWithContent from '@/lib/sendEmailWithContent';

const DOMINIC_EMAIL = "Dominic.barry@marquette.edu"
const COBEEN_EMAIL = "cobeenmail@gmail.com"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
        // get cobeen collection
        const packagesCollection = await getCollectionAsync('Packages')
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
            const content = `Hi ${First},\n\nWe noticed that you haven't picked up your package delivered on ${date.toLocaleDateString('en-US')} yet. Please come to the mailroom to pick it up. If you think this is an error, please come talk to the desk -- your package may not have been properly marked as retrieved.\n\nThanks,\nCobeen Staff`
            const subject = "Reminder: You have a package waiting for you"

            try{
                await sendEmailWithContent(
                    Email, 
                    content, 
                    DOMINIC_EMAIL, 
                    MARQUETTE_EMAIL, 
                    process.env.MARQUETTE_GMAIL_PASS, 
                    subject
                )
            } catch (e) {
                // just handle inline here so we can blast out other emails if one fails for some transient reason
                console.error(e)
            }
        }

        res.status(200).json(true)
  } catch (e) {
      console.error(e);
      res.status(500)
  }
};

export default handler