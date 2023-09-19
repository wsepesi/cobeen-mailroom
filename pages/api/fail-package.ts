import { NextApiRequest } from "next"
import { Package } from "@/lib/types"
import { getCollectionAsync } from "@/lib/getCollection"

const handler = async (req: NextApiRequest, res) => {
    // log package to the "failed_packages" collection

    const pkg = req.body as Package

    console.log(pkg)

    const collection = await getCollectionAsync("failed_packages")

    const inserted_id = (await collection
        .insertOne(pkg)
    ).insertedId

    res.status(200).json({ success: true })
}

export default handler;