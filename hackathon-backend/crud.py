from sqlmodel import Session
from models import User, Transaction
from database import *
from sqlmodel import Field, Session, SQLModel, create_engine, select



def create_user(user: User):
    with get_users_session() as session:
        session.add(user)
        session.commit()
        session.refresh(user)
        return user

def read_users():
    with get_users_session() as session:
        users = session.exec(select(User)).all()
        return users

def create_transaction(transaction: Transaction):
    with get_transactions_session() as session:
        session.add(transaction)
        session.commit()
        session.refresh(transaction)
        return transaction

def read_transactions():
    with get_transactions_session() as session:
        transactions = session.exec(select(Transaction)).all()
        return transactions
