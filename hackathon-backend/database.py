from sqlmodel import SQLModel, create_engine, Session
from contextlib import contextmanager

sqlite_file_name_web = "db_web.sqlite"
sqlite_file_name_transactions = "db_transactions.sqlite"
sqlite_file_name_users = "db_users.sqlite"
engine_transactions = create_engine(f"sqlite:///{sqlite_file_name_transactions}", echo=True)
engine_users = create_engine(f"sqlite:///{sqlite_file_name_users}", echo=True)
engine_web = create_engine(f"sqlite:///{sqlite_file_name_web}", echo=True)

# Initialize database function
def init_db():
    SQLModel.metadata.create_all(engine_web)  # Creates all tables defined in models

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

if __name__ == "__main__":
    init_db()  # Ensure the tables are created when the app starts
