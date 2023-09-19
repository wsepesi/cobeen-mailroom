from pymongo import MongoClient
from dotenv import load_dotenv
import os

def reduce_to_500(hall: str):
    # get the queue DB for the hall, find all entries with a value of over 500, and remove them
    db_name = f'{hall}_queue'

    # Create the db using mongo
    load_dotenv(dotenv_path='../.env.local')
    uri = os.getenv('MONGODB_URI')

    client = MongoClient(uri)
    db = client.Mailroom

    # get the collection
    collection = db[db_name]

    # find all entries with a value of over 500, and remove them
    res = collection.delete_many({'packageNumber': {'$gt': 500}})
    print(res.deleted_count)

if __name__ == "__main__":
    reduce_to_500('mashuda')