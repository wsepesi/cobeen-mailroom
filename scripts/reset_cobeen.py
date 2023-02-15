from pymongo import MongoClient
import os
from dotenv import load_dotenv
from util import *

def run():
    collection = get_cobeen()
    collection.delete_many({})

if __name__ == "__main__":
    run()



