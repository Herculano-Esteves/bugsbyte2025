from fastapi import FastAPI, Query
from sqlmodel import SQLModel, Session, create_engine,  desc, select
from crud import *
from models import *
from database import *
from statistics import get_user_statistics
from parser import *
from typing import List, Dict
import os


DB_FILE_PATH = "db_transactions.sqlite"


app = FastAPI()

# Create the database tables when the app starts
SQLModel.metadata.create_all(engine_web)
SQLModel.metadata.create_all(engine_transactions)
SQLModel.metadata.create_all(engine_users)

@app.on_event("startup")
def on_startup():
    init_db()
    #import_transactions_from_csv(CSV_FILE_PATH_TRANS)
    #import_products_from_csv(CSV_FILE_PATH_PRODS)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Hackathon API!"}

@app.post("/users/")
def create_user_route(user: User):
    return create_user(user)

@app.get("/users/")
def read_users_route():
    users = read_users()
    stats = get_user_statistics(users)
    return {"users": users, "statistics": stats}


@app.get("/transactions/")
def read_transactions_route(sku: int = Query(None, description="Product ID to fetch important info")):
    with get_transactions_session() as session:
        if sku is not None:
            # Filter by sku and select specific fields
            statement = select(
                Transaction.time_key,
                Transaction.qty,
                Transaction.net_sls_amt,
                Transaction.gross_sls_amt,
                Transaction.direct_dscnt_amt,
                Transaction.trans_direct_dscnt_amt,
                Transaction.prod_dscnt_issued_amt,
                Transaction.trans_dscnt_rat_amt
            ).where(Transaction.sku == sku).order_by(desc(Transaction.id)) # ns se estas funcoes estao a funcionar
            
            transactions = session.exec(statement).all()
            return {"transactions": transactions}
        else:
            return {"error": "SKU is required"}

@app.post("/transactions/")
def create_transactions_route(transaction: Transaction):
    return create_transaction(transaction)

@app.delete("/transactions/")
def delete_transaction_route(request: TransactionDeleteRequest):
    with get_transactions_session() as session:
        transaction = session.get(Transaction, request.transaction_id)
        if transaction:
            session.delete(transaction)
            session.commit()
            return {"message": "Transaction deleted successfully"}
        else:
            return {"message": "Transaction not found"}
        
@app.post("/products/")
def create_products_route(products: Product):
    return create_product(products)

@app.get("/products/")
def read_products_route(product_name: str = Query(None, description="Product name to fetch sku")):
    with get_products_session() as session:
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

#
# WORK IN PROGESS
#

# post e get dos dados para o AI dos preços
@app.get("/data/")
def read_data_route(sku: int = Query(None, description="Product ID to fetch a specific product")):
    with get_products_session() as session: # TO DO
        if sku:
            statement = select(Product).where(Product.id == sku)
            result = session.exec(statement).scalar_one_or_none()
            if result is None:
                # caso n encontra
                print("Product not found")
            else:
                print("Product found:", result)
        else:
        # se n tem ent mostra os 10 mais recentes
            statement = select(Product).order_by(desc(Product.id)).limit(10)
        
        products = session.exec(statement).all()
        return {"products": products}
    

# post e o get da Query de um produto

@app.get("/query/")
def read_data_route(product_name: str = Query(None, description="Product ID to fetch a specific product")):
    with get_products_session() as session: # TO DO
        if product_name:
            statement = select(Product).where(Product.id == product_name) ## todo

            result = session.exec(statement).scalar_one_or_none()
            if result is None:
                print("Product not found")
            else:
                print("Product found:", result)

            if result is None:
                return {"error": "Product not found"}
        else:
            # se n tem ent mostra os 10 mais recentes
            statement = select(Product).order_by(desc(Product.id)).limit(10)

        products = session.exec(statement).all()
        return {"products": products}