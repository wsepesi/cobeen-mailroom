import pandas as pd
from util import *

def run():
    collection = get_collection('cobeen')
    collection.delete_many({})

    # read in data from data/cobeen.csv
    # df = pd.read_csv('data/cobeen.csv')
    df = pd.read_excel('data/cobeen.xlsx', dtype=str)

    # clean column names of internal whitespace, eg "First Name" -> "First_Name"
    df.columns = df.columns.str.replace(' ', '_')

    # drop na
    df = df.dropna()

    # load df to collection
    collection.insert_many(df.to_dict('records'))

if __name__ == "__main__":
    run()



