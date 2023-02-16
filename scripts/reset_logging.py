from util import get_collection

# Resets Packages collection, without logging failures
def run():
    collection = get_collection('PackageLog')
    res = collection.delete_many({}).acknowledged

    print(f"Success? {res}")

if __name__ == "__main__":
    run()