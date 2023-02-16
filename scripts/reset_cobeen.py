from util import get_collection

def run():
    collection = get_collection('cobeen')
    collection.delete_many({})

if __name__ == "__main__":
    run()



