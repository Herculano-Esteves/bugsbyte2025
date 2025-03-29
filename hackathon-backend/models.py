from sqlmodel import Field, SQLModel
from pydantic import BaseModel

class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    email: str

class Transaction(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
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