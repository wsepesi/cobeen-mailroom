import { Counter } from "./types"
import { getCollection } from "./getCollection"

const COUNTERS_COLLECTION = 'counters'

// USAGE PATTERN: get, use, increment
const getAndIncrementCounter = async () => {
    const counters = getCollection(COUNTERS_COLLECTION)

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

export { getAndIncrementCounter }