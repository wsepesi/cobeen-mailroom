from pymongo import MongoClient
import os
from dotenv import load_dotenv

def get_collection(name: str):
    # connect to mongodb, and get db "Mailroom"
    # get MONGODB_URI from .env.local
    load_dotenv(dotenv_path='../.env.local')
    uri = os.getenv('MONGODB_URI')

    client = MongoClient(uri)
    db = client.Mailroom
    # print(db.list_collection_names())

    # get collection "cobeen" and remove all entries
    collection = db[name]

    return collection
