from fastapi import FastAPI
from sqlmodel import SQLModel
from crud import create_user, read_users
from models import User
from database import engine
from statistics import get_user_statistics

app = FastAPI()

# Create the database tables when the app starts
SQLModel.metadata.create_all(engine)

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