from fastapi import Query, FastAPI
from sqlmodel import select, desc, SQLModel, Session, create_engine
from sqlalchemy.orm import Session
from sqlalchemy.future import select
from crud import *
from models import *
from database import *
from statistics import get_user_statistics
from parser import *
from crud import *


if __name__ == "__main__":
    try:
        import_transactions_from_csv(CSV_FILE_PATH_TRANS)
        print("All transactions imported successfully!")
    except Exception as e:
        print(f"An error occurred: {e}")

# Function to fetch transactions based on SKU
def get_transactions_by_sku(sku: int, session: Session):
    statement = select(
        Transaction.time_key,
        Transaction.qty,
        Transaction.net_sls_amt,
        Transaction.gross_sls_amt,
        Transaction.direct_dscnt_amt,
        Transaction.trans_direct_dscnt_amt,
        Transaction.prod_dscnt_issued_amt,
        Transaction.trans_dscnt_rat_amt
    ).where(Transaction.sku == sku).order_by(desc(Transaction.id))
    
    transactions = session.exec(statement).all()
    return transactions


def get_product_info(product_name: str, session: Session):
    if product_name:  # If product_name is provided
        statement = select(Product.sku, Product.sales_data).where(Product.name == product_name)
        product = session.exec(statement).first()  # Get first match if any
        if product:
            return {"sku": product.sku, "sales_data": product.sales_data}
        else:
            return {"error": "Product not found"}
    else:  # If product_name is None, fetch the 10 most recent products
        statement = select(Product.sku, Product.sales_data).order_by(Product.id.desc()).limit(10)
        products = session.exec(statement).all()
        return {"products": products}

def get_user_info(account_no: str, session: Session):
    statement = select(User.segment_cd_lifestyle, User.segment_cd_pss).where(User.account_no == account_no)
    user = session.exec(statement).first()  # Get first match if any
    if user:
        return {
            "segment_cd_lifestyle": user.segment_cd_lifestyle,
            "segment_cd_pss": user.segment_cd_pss
        }
    else:
        return {"error": "User not found"}


with get_users_session() as session:
    user = "839901347407"
    result = get_user_info(user, session)
    print(result)

# with get_products_session() as session:
#     name = "FEIJAO ENCARNADO CACAROLA 500GR"
#     result = get_product_info(name, session)
#     print(result)

# with get_transactions_session() as session:
#     sku = 7443964  # Example SKU
#     result = get_transactions_by_sku(sku, session)
#     print(result)
