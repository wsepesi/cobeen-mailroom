import pandas as pd
from util import *

def run():
    collection = get_cobeen()

    # read in data from data/cobeen.csv
    df = pd.read_csv('data/cobeen.csv')

    # clean column names of internal whitespace, eg "First Name" -> "First_Name"
    df.columns = df.columns.str.replace(' ', '_')

    # drop na
    df = df.dropna()

    # load df to collection
    collection.insert_many(df.to_dict('records'))

if __name__ == "__main__":
    run()



