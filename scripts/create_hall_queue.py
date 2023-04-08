import os
from dotenv import load_dotenv
from pymongo import MongoClient
from datetime import datetime
from util import get_collection


def create_hall_queue(hall: str, migration=False, make_db=False) -> bool:
    try:
        if make_db:
            db_name = f'{hall}_queue'

            # Create the db using mongo
            load_dotenv(dotenv_path='../.env.local')
            uri = os.getenv('MONGODB_URI')

            client = MongoClient(uri)
            db = client.Mailroom

            # Create the collection
            db.create_collection(db_name)

        new_collection = get_collection(f'{hall}_queue')

        # create a list containing numbers 1 through 999, inclusive
        q = list(range(1, 1000))

        # retrieve all current packages, if in migration mode
        if migration:
            collection = get_collection('Packages')
            packages = collection.find({})

            # remove all numbers from the queue that are already in packages as package.packageId
            for package in packages:
                q.remove(package['packageId'])

        # print(q)
        # print the setdiff of the new q and the original
        # print(set(range(1, 1000)) - set(q))

        # map each number to a dict with a packageNumber, and a timestamp with the current date
        q = list(map(lambda x: {'packageNumber': x, 'timestamp': datetime.now()}, q))

        # insert the list into the collection
        new_collection.insert_many(q)

        return True
    except Exception as e:
        print(e)
        return False


if __name__ == "__main__":
    create_hall_queue('cobeen', migration=True)