from util import get_collection

# Resets Packages collection, without logging failures
def run():
    collection = get_collection('Packages')
    res = collection.delete_many({}).acknowledged

    print(f"Success with deleting packages? {res}")


    count_collection = get_collection('counters')
    obj = {
        "db": "Mailroom",
        "coll": "Packages",
    }

    # update the count to 1 using obj as _id
    res = count_collection.find_one_and_update(
        {"_id" : obj},
        {"$set": {"seq_value": 1}},
        upsert=True
    )

    success = res is not None
    print(f"Success with resetting counter? {success}")




if __name__ == "__main__":
    run()