import pandas as pd
from models import User

def calculate_statistics(users):
    if not users:
        return {
            "total_users": 0,
            "unique_emails": 0,
            "average_name_length": 0.0,
            "name_lengths": {"count": 0, "mean": 0.0, "std": 0.0, "min": 0.0, "max": 0.0}
        }

    # Convert to pandas DataFrame
    df = pd.DataFrame([user.dict() for user in users])

    # Calculate statistics
    name_lengths = df['name'].apply(len).describe().to_dict()
    # Replace NaN with None (null in JSON) in name_lengths
    for key, value in name_lengths.items():
        if pd.isna(value):
            name_lengths[key] = None

    stats = {
        "total_users": len(df),
        "unique_emails": df['email'].nunique(),
        "average_name_length": float(df['name'].apply(len).mean()),  # Ensure float
        "name_lengths": name_lengths,
    }

    return stats

def get_user_statistics(users):
    stats = calculate_statistics(users)
    return stats