import type { NextApiRequest, NextApiResponse } from 'next'

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getCollection } from '@/lib/getCollection';

// import xlsx from 'xlsx'

const parse_and_clean_file = (file) => {
    // Parse the file and clean it up
    // Return the cleaned file

    
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    throw new Error("Not implemented yet")
    // const body = req.body
    // // body was sent as FormData, with a property 'file'. read and process accordingly:
    // const file = body.file

    // const fileBuffer = file.data
    



    // const workbook = xlsx.read(fileBuffer, { type: 'buffer' });

    // // Get the first sheet in the workbook
    // const sheetName = workbook.SheetNames[0];
    // const sheet = workbook.Sheets[sheetName];

    // // Convert the sheet data to JSON
    // const data = xlsx.utils.sheet_to_json(sheet);

    // res.status(200).json({ data })

  } catch (e) {
      console.error(e);
      res.status(500)
  }
};

export default handler