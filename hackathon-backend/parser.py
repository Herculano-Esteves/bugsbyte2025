import pandas as pd
from crud import create_transaction
from models import Transaction
import logging
from sqlmodel import Session, create_engine
from database import sqlite_file_name_transactions

# Set the logging level to ERROR (this will suppress INFO, DEBUG, and other lower severity logs)
logging.getLogger('sqlalchemy.engine').setLevel(logging.ERROR)
logging.getLogger('sqlalchemy').setLevel(logging.ERROR)
logger = logging.getLogger('sqlalchemy.engine')
logger.setLevel(logging.ERROR)
logger.propagate = False

# Path to your CSV file
#CSV_FILE_PATH = "../coelho.csv"
CSV_FILE_PATH = "../dataset/sample_sales_info_encripted.csv"


def import_transactions_from_csv(file_path: str, batch_size: int = 100000):
    df = pd.read_csv(file_path)

    required_columns = {
        "sku","account_no","time_key", "pos_tp_cd", "qty", "net_sls_amt", "gross_sls_amt",
        "direct_dscnt_amt", "trans_direct_dscnt_amt", "prod_dscnt_issued_amt", "trans_dscnt_rat_amt"
    }

    if not required_columns.issubset(df.columns):
        missing = required_columns - set(df.columns)
        raise ValueError(f"CSV file is missing required columns: {missing}")

    with Session(sqlite_file_name_transactions) as session:
        transaction_batch = []
        for index, row in df.iterrows():
            # Create a transaction object
            transaction = Transaction(
                sku=row["sku"],
                account_no=row["account_no"],
                time_key=row["time_key"],
                pos_tp_cd=row["pos_tp_cd"],
                qty=row["qty"],
                net_sls_amt=row["net_sls_amt"],
                gross_sls_amt=row["gross_sls_amt"],
                direct_dscnt_amt=row["direct_dscnt_amt"],
                trans_direct_dscnt_amt=row["trans_direct_dscnt_amt"],
                prod_dscnt_issued_amt=row["prod_dscnt_issued_amt"],
                trans_dscnt_rat_amt=row["trans_dscnt_rat_amt"]
            )

            # Add the transaction to the batch
            transaction_batch.append(transaction)

            # Commit in batches
            if len(transaction_batch) >= batch_size:
                session.add_all(transaction_batch)  # Add all the accumulated transactions
                session.commit()  # Commit all the transactions in the batch
                session.flush()  # Ensure changes are reflected
                transaction_batch = []  # Clear the batch for the next set

        # If there are remaining transactions that didn't fill the last batch, commit them
        if transaction_batch:
            session.add_all(transaction_batch)
            session.commit()

        print(f"Successfully imported {len(df)} transactions.")

if __name__ == "__main__":
    try:
        import_transactions_from_csv(CSV_FILE_PATH)
        print("All transactions imported successfully!")
    except Exception as e:
        print(f"An error occurred: {e}")



def import_products_from_csv(file_path: str, batch_size: int = 1000):
    return