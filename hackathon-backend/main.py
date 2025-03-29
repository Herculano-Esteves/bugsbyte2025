from fastapi import FastAPI
from sqlmodel import SQLModel  # Import SQLModel here
from crud import create_user, read_users
from models import User
from database import engine  # Import engine from database.py
from statistics import get_user_statistics

app = FastAPI()

# Create the database tables when the app starts
SQLModel.metadata.create_all(engine)

@app.post("/users/")
def create_user_route(user: User):
    return create_user(user)

@app.get("/users/")
def read_users_route():
    users = read_users()
    stats = get_user_statistics(users)
    return {"users": users, "statistics": stats}