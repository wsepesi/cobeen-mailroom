import os
from dotenv import load_dotenv
from pymongo import MongoClient
from util import get_collection
from create_hall_queue import create_hall_queue

HALL = "carpenter"

def create_passwords_for_hall(HALL: str):
     # set default passwords
    pass_db = get_collection('passwords')
    defaults = pass_db.find_one({'key': 'default'})

    pass_db.insert_one({
        'key': f'{HALL}-home',
        'password': defaults['pass']
    })

    pass_db.insert_one({
        'key': f'{HALL}-admin',
        'password': defaults['pass']
    })

def create_dbs_for_hall(HALL: str):
    try:
        # connect to mongo
        load_dotenv(dotenv_path='../.env.local')
        uri = os.getenv('MONGODB_URI')
        client = MongoClient(uri)
        db = client.Mailroom

        # create the following dbs
        dbs_to_create = [
            HALL,
            f'{HALL}_packages',
            f'{HALL}_package_log',
            f'{HALL}_queue',
        ]

        for db_name in dbs_to_create:
            db.create_collection(db_name)

        # fill the queue
        create_hall_queue(HALL)

        # create passwords
        create_passwords_for_hall(HALL)
       

    except Exception as e:
        print(e)
        return False
    
    return True

if __name__ == "__main__":
    create_dbs_for_hall(HALL)