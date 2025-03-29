from sqlmodel import Session
from models import User
from database import get_session
from sqlmodel import Field, Session, SQLModel, create_engine, select



def create_user(user: User):
    with get_session() as session:
        session.add(user)
        session.commit()
        session.refresh(user)
        return user

def read_users():
    with get_session() as session:
        users = session.exec(select(User)).all()
        return users
