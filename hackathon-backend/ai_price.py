from fastapi import Query, FastAPI
from sqlmodel import select, desc, SQLModel, Session, create_engine
from sqlalchemy.orm import Session
from sqlalchemy.future import select
from crud import *
from models import *
from database import *
from statistics import get_user_statistics
from parser import *
from crud import *
import pandas as pd
import numpy as np
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error
import json  


if __name__ == "__main__":
    try:
        import_transactions_from_csv(CSV_FILE_PATH_TRANS)
        print("All transactions imported successfully!")
    except Exception as e:
        print(f"An error occurred: {e}")

# Function to fetch transactions based on SKU

def get_transactions_by_sku(sku: int, session: Session):
    statement = select(
        Transaction.account_no,
        Transaction.time_key,
        Transaction.qty,
        Transaction.net_sls_amt,
        Transaction.gross_sls_amt,
        Transaction.direct_dscnt_amt,
        Transaction.trans_direct_dscnt_amt,
        Transaction.prod_dscnt_issued_amt,
        Transaction.trans_dscnt_rat_amt
    ).where(Transaction.sku == sku).order_by(desc(Transaction.id))

    transactions = session.exec(statement).all()

    # Convert transactions to a list of dictionaries
    transactions_dict = [
        {
            "sku": sku,
            "account_no": transaction.account_no,
            "time_key": transaction.time_key,
            "qty": transaction.qty,
            "net_sls_amt": transaction.net_sls_amt,
            "gross_sls_amt": transaction.gross_sls_amt,
            "direct_dscnt_amt": transaction.direct_dscnt_amt,
            "trans_direct_dscnt_amt": transaction.trans_direct_dscnt_amt,
            "prod_dscnt_issued_amt": transaction.prod_dscnt_issued_amt,
            "trans_dscnt_rat_amt": transaction.trans_dscnt_rat_amt
        }
        for transaction in transactions
    ]
    
    return transactions_dict


def get_product_info(product_name: str, session: Session):
    if product_name:  # If product_name is provided
        statement = select(Product.sku, Product.sales_data).where(Product.name == product_name)
        product = session.exec(statement).first()  # Get first match if any
        if product:
            return {"sku": product.sku, "sales_data": product.sales_data}
        else:
            return {"error": "Product not found"}
    else:  # If product_name is None, fetch the 10 most recent products
        statement = select(Product.sku, Product.sales_data).order_by(Product.id.desc()).limit(10)
        products = session.exec(statement).all()
        return {"products": products}

def get_user_info(account_no_in: str, session: Session):
    statement = select(User.segment_cd_lifestyle, User.segment_cd_pss).where(User.account_no == account_no_in)
    user = session.exec(statement).first()  # Get first match if any
    if user:
        return {
            "account_no": account_no_in,
            "segment_cd_lifestyle": user.segment_cd_lifestyle,
            "segment_cd_pss": user.segment_cd_pss
        }
    else:
        return {"error": "User not found"}


# with get_users_session() as session:
#     user = "839901347407"
#     result = get_user_info(user, session)
#     print(result)

# with get_transactions_session() as session:
#     sku = 7443964  # Example SKU
#     result = get_transactions_by_sku(sku, session)
#     print(result)

def save_to_json(data, filename):
    with open(filename, 'w') as json_file:
        json.dump(data, json_file, indent=4)

with get_products_session() as sessionProd, get_transactions_session() as sessionTra, get_users_session() as sessionUser:
    name = "ARROZ CAROLINO CAÇAROLA 1KG"
    resultProd = get_product_info(name, sessionProd)
    resultTra = get_transactions_by_sku(resultProd["sku"], sessionTra)
    resultUser = list()
    for tra in resultTra:
        resultUser.append(get_user_info(tra["account_no"], sessionUser))
    
    save_to_json(resultProd, "resultProd.json")
    save_to_json(resultTra, "result_transactions.json")
    save_to_json(resultUser, "result_users.json")

    # print(resultProd)
    # print(resultTra)
    # print(resultUser)

##
# GPT COOK
##

# Function to preprocess product price index

def preprocess_product_data(resultProd):
    df_prod = pd.DataFrame(resultProd)
    df_prod["sales_data"] = df_prod["sales_data"].astype(float)
    return df_prod

# Function to preprocess transactions
def preprocess_transaction_data(resultTra):
    df_tra = pd.DataFrame(resultTra)
    df_tra["total_sales"] = df_tra["qty"] * df_tra["gross_sls_amt"]
    df_tra["discount_ratio"] = df_tra["direct_dscnt_amt"] / df_tra["gross_sls_amt"]
    df_tra.fillna(0, inplace=True)
    return df_tra

# Function to preprocess user data
def preprocess_user_data(resultUser):
    df_user = pd.DataFrame(resultUser)
    df_user.fillna(0, inplace=True)
    return df_user

# Load and preprocess data

df_prod = preprocess_product_data(resultProd)
df_tra = preprocess_transaction_data(resultTra)
df_user = preprocess_user_data(resultUser)


# Merge datasets for training
df_merged = df_tra.merge(df_user, on="account_no", how="left")
print(df_merged.columns)
df_merged = df_merged.merge(df_prod, on='sku', how="left")

# Save processed data
df_merged.to_csv("processed_data.csv", index=False)

print("Data preprocessing complete.")

# Prepare features and target variable
features = ["total_sales", "discount_ratio", "segment_cd_lifestyle", "segment_cd_pss"]
target = "next_day_price"

df_merged[target] = df_merged["gross_sls_amt"].shift(-1)  # Using shifted price as next day prediction target
df_merged.dropna(inplace=True)

X = df_merged[features]
y = df_merged[target]

# Split data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train XGBoost model
model = xgb.XGBRegressor(objective="reg:squarederror", n_estimators=100, learning_rate=0.1, max_depth=5)
model.fit(X_train, y_train)

# Evaluate model
y_pred = model.predict(X_test)
mae = mean_absolute_error(y_test, y_pred)
print(f"Model MAE: {mae}")

# Save trained model
model.save_model("price_prediction_model.json")

print("Model training complete.")



# Load the trained model
model = xgb.XGBRegressor()
model.load_model("price_prediction_model.json")

# Select some test data
sample_data = X_test.iloc[:5]  # Select the first 5 rows for testing

# Create discount variations and make predictions
# for i, (index, row) in enumerate(sample_data.iterrows()):
#     print(f"\nSample {i+1}:")
#     print(row)
#     original_discount = row["discount_ratio"]

#     discount_variations = [original_discount * 0.5, original_discount, original_discount * 1.5] #Example
#     for discount in discount_variations:
#         temp_row = row.copy()
#         temp_row["discount_ratio"] = discount
#         prediction = model.predict(pd.DataFrame([temp_row]))[0]
#         print(f"  Discount: {discount:.2f}, Predicted next-day price: {prediction:.2f}")


#Adding to the previous code.
#Assume price elasticity for this example. Change for your data.
original_prices = y_test.iloc[:5].values # Get the original prices.

#Assume price elasticity for this example. Change for your data.
price_elasticity = -1.5 # Example: -1.5 (elastic demand)

# Create discount variations and make predictions
for i, (index, row) in enumerate(sample_data.iterrows()):
    print(f"\nSample {i+1}:")
    print(row)
    original_discount = row["discount_ratio"]
    original_price = original_prices[i] # get the original price.
    original_sales = row["total_sales"]

    discount_variations = [original_discount * 0.5, original_discount, original_discount * 1.5] #Example
    for discount in discount_variations:
        temp_row = row.copy()
        temp_row["discount_ratio"] = discount
        prediction = model.predict(pd.DataFrame([temp_row]))[0]
        print(f"  Discount: {discount:.2f}, Predicted next-day price: {prediction:.2f}")

        price_change_percent = (prediction - original_price) / original_price
        sales_change_percent = price_change_percent * price_elasticity
        predicted_sales = original_sales * (1 + sales_change_percent)
        print(f"    Predicted sales: {predicted_sales:.2f}")