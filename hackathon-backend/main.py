from fastapi import FastAPI
from sqlmodel import SQLModel, Session, create_engine,  desc, select
from crud import *
from models import *
from database import *
from statistics import get_user_statistics
from parser import *
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
    if not os.path.exists(CSV_FILE_PATH):  # Ensure the CSV file exists before importing
        raise Exception(f"CSV file not found at {CSV_FILE_PATH}")
    #import_transactions_from_csv(CSV_FILE_PATH)

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
def read_transactions_route():
    with get_transactions_session() as session:
        statement = select(Transaction).order_by(desc(Transaction.id)).limit(5)
        transactions = session.exec(statement).all()
        return {"transactions": transactions}

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