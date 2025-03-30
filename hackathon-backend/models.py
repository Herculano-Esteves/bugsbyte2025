from sqlmodel import Field, SQLModel, JSON, Column
from pydantic import BaseModel
from typing import Optional, Dict, List


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
    image_url: str
    price: float
    type_of_package: str
    description: str
    name_url: str

class Product(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    sku: int
    name: str  # Mapped from product_dsc
    category: int  # Mapped from cat_cd
    category_desc: str  # Mapped from cat_dsc_ext
    short_desc: str  # Mapped from product_short_dsc
    sales_data: List[Dict[str, float]] = Field(sa_column=Column(JSON))  # Store dates and values as JSON

