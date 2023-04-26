import { Counter, Package } from "./types"

import { ObjectId } from "mongodb"
import { getCollectionAsync } from "./getCollection"

const COUNTERS_COLLECTION = 'counters'

type QueueItem = {
    _id: ObjectId,
    packageNumber: number,
    timestamp: Date,
}

const releaseNumber = async (pkg: Package, hall: string): Promise<boolean> => {
    const hallCounter = await getCollectionAsync(`${hall}_queue`)
    const { packageId } = pkg
    const res = await hallCounter.insertOne({ packageNumber: packageId, timestamp: new Date() })
    return res.acknowledged
}


const pollFromQueue = async (hall: string): Promise<number> => {
    const hallCounter = await getCollectionAsync(`${hall}_queue`)
    const polled = (await hallCounter.findOneAndDelete({}, { sort: { timestamp: 1 } }))
    if (polled.value === null) {
        throw new Error("No items in queue, every package number is taken. If this is a mistake, alert the facilities manager") //TODO: send email here?
    }
    const { packageNumber } = polled.value as QueueItem
    return packageNumber
}


// USAGE PATTERN: get, use, increment
const getAndIncrementCounter = async (): Promise<number> => {
    const counters = await getCollectionAsync(COUNTERS_COLLECTION)

    // get the counter (by getting all the elements, which there are one of)
    const counter = (await counters.find().toArray())[0] as Counter
    
    if (counter === undefined) {
        throw new Error("No counter found")
    }

    const val = counter.seq_value

    // increment the counter in the db, unless it will roll over to 1000, then set back to 1
    await counters.updateOne(
        { _id: counter._id },
        { $set: { seq_value: (val + 1) % 999 } }
    )

    return val
}

export { getAndIncrementCounter, pollFromQueue, releaseNumber }