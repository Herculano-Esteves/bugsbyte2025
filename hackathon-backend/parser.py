import pandas as pd
from crud import create_transaction
from models import Transaction, Product
import logging
from sqlmodel import Session, create_engine
from database import engine_transactions, engine_products

# Set the logging level to ERROR (this will suppress INFO, DEBUG, and other lower severity logs)
logging.getLogger('sqlalchemy.engine').setLevel(logging.ERROR)
logging.getLogger('sqlalchemy').setLevel(logging.ERROR)
logger = logging.getLogger('sqlalchemy.engine')
logger.setLevel(logging.ERROR)
logger.propagate = False

# Path to your CSV file
#CSV_FILE_PATH = "../coelho.csv"
CSV_FILE_PATH_TRANS = "../dataset/sample_sales_info_encripted.csv"
CSV_FILE_PATH_PRODS = "../dataset/sample_prod_info.csv"


def import_transactions_from_csv(file_path: str, batch_size: int = 100000):
    df = pd.read_csv(file_path)

    required_columns = {
        "sku","account_no","time_key", "pos_tp_cd", "qty", "net_sls_amt", "gross_sls_amt",
        "direct_dscnt_amt", "trans_direct_dscnt_amt", "prod_dscnt_issued_amt", "trans_dscnt_rat_amt"
    }

    if not required_columns.issubset(df.columns):
        missing = required_columns - set(df.columns)
        raise ValueError(f"CSV file is missing required columns: {missing}")

    with Session(engine_transactions) as session:
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
        import_transactions_from_csv(CSV_FILE_PATH_TRANS)
        print("All transactions imported successfully!")
    except Exception as e:
        print(f"An error occurred: {e}")



def import_products_from_csv(file_path: str, batch_size: int = 1000):
    df = pd.read_csv(file_path, sep=";")

    required_columns = {
        "sku", "product_dsc", "cat_cd", "cat_dsc_ext", "product_short_dsc",
        "20220101", "20220104", "20220111", "20220118", "20220125", "20220201", "20220208",
        "20220215", "20220222", "20220301", "20220308", "20220315", "20220322", "20220329",
        "20220405", "20220412", "20220419", "20220426", "20220503", "20220510", "20220517",
        "20220524", "20220531", "20220607", "20220614", "20220621", "20220628", "20220705",
        "20220712", "20220719", "20220726", "20220802", "20220809", "20220816", "20220823",
        "20220830", "20220906", "20220913", "20220920", "20220927", "20221004", "20221011",
        "20221018", "20221025", "20221101", "20221108", "20221115", "20221122", "20221129",
        "20221206", "20221213", "20221220", "20221227", "20230103", "20230110", "20230117",
        "20230124", "20230131", "20230207", "20230214", "20230221", "20230228", "20230307",
        "20230314", "20230321", "20230328", "20230404", "20230411", "20230418", "20230425",
        "20230502", "20230509", "20230516", "20230523", "20230530", "20230606", "20230613",
        "20230620", "20230627", "20230704", "20230711", "20230718", "20230725", "20230801",
        "20230808", "20230815", "20230822", "20230829", "20230905", "20230912", "20230919",
        "20230926", "20231003", "20231010", "20231017", "20231024", "20231031", "20231107",
        "20231114", "20231121", "20231128", "20231205", "20231212", "20231219", "20231226"
    }

    if not required_columns.issubset(df.columns):
        missing = required_columns - set(df.columns)
        raise ValueError(f"CSV file is missing required columns: {missing}")

    date_columns = [col for col in df.columns if col.startswith("20")]

    with Session(engine_products) as session:
        product_batch = []
        for index, row in df.iterrows():
            # Extract sales data as a dictionary
            sales_data = {
                date: float(row[date]) if pd.notna(row[date]) else 0.0
                for date in date_columns
            }

            # Create a product object
            product = Product(
                sku=row["sku"],
                name=row["product_dsc"],
                category=row["cat_cd"],
                category_desc=row["cat_dsc_ext"],
                short_desc=row["product_short_dsc"],
                sales_data=sales_data
            )

            product_batch.append(product)

            if len(product_batch) >= batch_size:
                session.add_all(product_batch)
                session.commit()
                session.flush()
                product_batch = []

        if product_batch:
            session.add_all(product_batch)
            session.commit()

        print(f"Successfully imported {len(df)} products.")