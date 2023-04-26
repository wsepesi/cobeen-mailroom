import { KeyPair } from "./types"
import { getCollectionAsync } from "./getCollection"

const PASS_DB = "passwords"

const getHashedPassFromDb = async (key: string): Promise<string> => {
    try {
        const collection = await getCollectionAsync(PASS_DB)

        // get pass from db using the key
        const res = await collection.findOne({ key: key }) as KeyPair

        return res.pass
    } catch (e) {
        throw new Error("Error getting hashed pass from db")
    }
}

const setPassInDb = async (key: string, pass: string): Promise<boolean> => {
    // try {
        const collection = await getCollectionAsync(PASS_DB)

        // update if key is in DB, else insert
        const res = await collection.updateOne({ key: key }, { $set: { pass: pass } }, { upsert: true })
        return res.acknowledged
    // } 
    // catch (e) {
    //     throw new Error("Error setting pass in db")
    // }
}

export { getHashedPassFromDb, setPassInDb }