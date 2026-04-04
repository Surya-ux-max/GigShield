import pandas as pd
import numpy as np


# Load dataset
df = pd.read_csv("../data/synthetic_data.csv")

print("\n================ DATA INFO ================")
print(df.info())

# -----------------------------
# 1️⃣ NULL VALUES
# -----------------------------
print("\n================ NULL VALUES ================")
print(df.isnull().sum())

# -----------------------------
# 2️⃣ DUPLICATES
# -----------------------------
print("\n================ DUPLICATES ================")
print(df.duplicated().sum())

# -----------------------------
# 3️⃣ DATA TYPE FIXES
# -----------------------------
print("\n================ DATA TYPE FIXES ================")

# Convert boolean → int
df["platform_down"] = df["platform_down"].astype(int)

# Drop pincode
df.drop("pincode", axis=1, inplace=True)

# Encode city
df = pd.get_dummies(df, columns=["city"])

# 🔥 REMOVE LEAKAGE FEATURES
df.drop(["income", "current_orders", "total_income", "incentive"], axis=1, inplace=True)

print("\nSample after cleaning:")
print(df.head())

# -----------------------------
# 4️⃣ SKEWNESS
# -----------------------------
print("\n================ SKEWNESS ================")
numeric_cols = df.select_dtypes(include=np.number).columns
print(df[numeric_cols].skew())

# -----------------------------
# 5️⃣ OUTLIERS
# -----------------------------
print("\n================ OUTLIERS ================")

for col in ["rainfall", "temperature", "aqi", "traffic"]:
    Q1 = df[col].quantile(0.25)
    Q3 = df[col].quantile(0.75)
    IQR = Q3 - Q1

    lower = Q1 - 1.5 * IQR
    upper = Q3 + 1.5 * IQR

    outliers = df[(df[col] < lower) | (df[col] > upper)].shape[0]

    print(f"{col}: {outliers} outliers")

# -----------------------------
# 6️⃣ CORRELATION
# -----------------------------
print("\n================ CORRELATION ================")
corr = df.corr(numeric_only=True)["disruption_label"].sort_values(ascending=False)
print(corr)

# -----------------------------
# 7️⃣ ANALYSIS
# -----------------------------
print("\n================ DISRUPTION ANALYSIS ================")

print("Avg Rain (Disruption):", df[df["disruption_label"] == 1]["rainfall"].mean())
print("Avg Temp (Disruption):", df[df["disruption_label"] == 1]["temperature"].mean())
print("Avg AQI (Disruption):", df[df["disruption_label"] == 1]["aqi"].mean())

# -----------------------------
# 8️⃣ NORMALIZATION
# -----------------------------
from sklearn.preprocessing import StandardScaler

scaler = StandardScaler()

cols = ["rainfall", "temperature", "aqi", "traffic"]

df[cols] = scaler.fit_transform(df[cols])

# -----------------------------
# 9️⃣ FINAL SHAPE
# -----------------------------
print("\n================ FINAL DATA SHAPE ================")
print(df.shape)

# -----------------------------
# 🔟 SAVE
# -----------------------------
df.to_csv("../data/cleaned_data.csv", index=False)

print("\n✅ Cleaned dataset saved as cleaned_data.csv")