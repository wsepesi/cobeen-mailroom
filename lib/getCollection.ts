import { Collection, MongoClient } from "mongodb";

import clientPromise from "./mongodb";
import { env } from "process";

export type CollectionReturn = {
    collection: Collection,
    client: MongoClient
}

const getCollection = (collectionName: string): CollectionReturn => {
    const uri: string = env.MONGODB_URI as string;
    const client = new MongoClient(uri)
    return {
        collection: client.db("Mailroom").collection(collectionName),
        client
    }
}

const getCollectionAsync = async (collectionName: string): Promise<Collection> => {
    const client = await clientPromise
    return client.db("Mailroom").collection(collectionName)
}

export {getCollection, getCollectionAsync}