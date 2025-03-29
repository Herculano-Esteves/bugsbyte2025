from sqlmodel import Field, SQLModel
from pydantic import BaseModel

class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    email: str

class Transaction(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    sku: int
    account_no: str
    time_key: int
    pos_tp_cd: str
    qty: float
    net_sls_amt: float
    gross_sls_amt: float
    direct_dscnt_amt: float
    trans_direct_dscnt_amt: float
    prod_dscnt_issued_amt: float
    trans_dscnt_rat_amt: float

class TransactionDeleteRequest(BaseModel):
    transaction_id: int

class WebUser(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    token: str
    genere: str
    age: int

class WebSwipes(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_id: int
    timestamp: int
    type: bool
    sku: int

class WebProduct(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    sku: int
    name: str
    category: int
    image_url: str
    price: float
    type_of_package: str
    description: str
    name_url: str