from fastapi import FastAPI
from sqlmodel import Field, Session, SQLModel, create_engine, select
from pydantic import BaseModel


app = FastAPI()

# Database setup
sqlite_file_name = "db.sqlite"
engine = create_engine(f"sqlite:///{sqlite_file_name}", echo=True)

# Model
class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    email: str

# Create DB
@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)

# Routes
@app.post("/users/")
def create_user(user: User):
    with Session(engine) as session:
        db_user = User(name=user.name, email=user.email)
        session.add(db_user)
        session.commit()
        session.refresh(db_user)
        return db_user


@app.get("/users/")
def read_users():
    with Session(engine) as session:
        users = session.exec(select(User)).all()
        return users