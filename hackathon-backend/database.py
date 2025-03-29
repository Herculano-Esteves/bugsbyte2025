from sqlmodel import create_engine, Session
from models import User

sqlite_file_name = "db.sqlite"
engine = create_engine(f"sqlite:///{sqlite_file_name}", echo=True)

# Session function to create database sessions
def get_session():
    return Session(engine)
