from sqlmodel import SQLModel, create_engine, Session
from contextlib import contextmanager
import logging

sqlite_file_name_web = "db_web.sqlite"
sqlite_file_name_transactions = "db_transactions.sqlite"
sqlite_file_name_users = "db_users.sqlite"
sqlite_file_name_products = "db_products.sqlite"
engine_transactions = create_engine(f"sqlite:///{sqlite_file_name_transactions}", echo=True)
engine_users = create_engine(f"sqlite:///{sqlite_file_name_users}", echo=True)
engine_web = create_engine(f"sqlite:///{sqlite_file_name_web}", echo=True)
engine_products = create_engine(f"sqlite:///{sqlite_file_name_products}", echo=True)

# Initialize database function
def init_db():
    logging.debug("Initializing database...")
    SQLModel.metadata.create_all(engine_web)  # Creates all tables defined in models
    SQLModel.metadata.create_all(engine_users)  # Creates all tables defined in models
    SQLModel.metadata.create_all(engine_transactions)  # Creates all tables defined in models
    SQLModel.metadata.create_all(engine_products)  # Creates all tables defined in models
    logging.debug("Database initialized.")

# Session function to create database sessions
@contextmanager
def get_web_session():
    with Session(engine_web) as session:
        yield session

@contextmanager
def get_transactions_session():
    with Session(engine_transactions) as session:
        yield session

@contextmanager
def get_users_session():
    with Session(engine_users) as session:
        yield session

@contextmanager
def get_products_session():
    with Session(engine_products) as session:
        yield session

if __name__ == "__main__":
    init_db()  # Ensure the tables are created when the app starts
