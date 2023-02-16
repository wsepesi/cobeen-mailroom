import { MongoClient } from "mongodb";
import { env } from "process";

const getCollection = (collectionName: string) => {
    const uri: string = env.MONGODB_URI as string;
    const client = new MongoClient(uri)
    return client.db("Mailroom").collection(collectionName)
}

export {getCollection}