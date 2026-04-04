import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import joblib

# -----------------------------
# 1️⃣ Load Data
# -----------------------------
df = pd.read_csv("../data/cleaned_data.csv")

# -----------------------------
# 2️⃣ Split Features & Target
# -----------------------------
X = df.drop("disruption_label", axis=1)
y = df["disruption_label"]

# -----------------------------
# 3️⃣ Train-Test Split
# -----------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# -----------------------------
# 4️⃣ Train Model (Random Forest)
# -----------------------------
model = RandomForestClassifier(
    n_estimators=100,
    max_depth=10,
    random_state=42
)

model.fit(X_train, y_train)

# -----------------------------
# 5️⃣ Predictions
# -----------------------------
y_pred = model.predict(X_test)

# -----------------------------
# 6️⃣ Evaluation
# -----------------------------
accuracy = accuracy_score(y_test, y_pred)

print("\n✅ Accuracy:", accuracy)
print("\n📊 Classification Report:\n")
print(classification_report(y_test, y_pred))

# -----------------------------
# 7️⃣ Save Model
# -----------------------------
joblib.dump(model, "../trained/model.pkl")

print("\n💾 Model saved as model.pkl")