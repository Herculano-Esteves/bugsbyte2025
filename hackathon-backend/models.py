from sqlmodel import Field, SQLModel, JSON, Column
from pydantic import BaseModel
from typing import Optional, Dict, List

class MessageChat(BaseModel):
    message: str

class IntSent(BaseModel):
    sku: int
    sku2: int
    user_id: int

class IdUser(BaseModel):
    user_id: int

class LoginInfo(BaseModel):
    username: str
    password: str


class SwipeBeguin(BaseModel):
    user_id: int
    
class WebSwipes(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_id: int
    type: bool
    sku: int


class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    account_no: str
    segment_cd_lifestyle: int
    segment_cd_value_cnt: int
    segment_cd_lifestage: int
    segment_cd_pss: int

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
    sales_data: List[Dict[str, int]] = Field(default_factory=list, sa_column=Column(JSON))


class WebProduct(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    sku: int
    name: str
    image_url: str
    price: float
    type_of_package: str
    description: str
    name_url: str

class Product(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    sku: int
    name: str
    category: int
    category_desc: str
    short_desc: str
    sales_data: List[Dict[str, int]] = Field(sa_column=Column(JSON))

