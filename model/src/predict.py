import joblib
import numpy as np
import pandas as pd

# -----------------------------
# 🧠 Payout Calculation Function
# -----------------------------
def calculate_payout(avg_daily_earning, expected_rides, actual_rides):

    rides_lost = max(0, expected_rides - actual_rides)

    earning_per_ride = avg_daily_earning / expected_rides

    income_loss = rides_lost * earning_per_ride

    payout = 0.7 * income_loss   # 70% coverage

    return round(payout, 2)

# -----------------------------
# 1️⃣ Load trained model
# -----------------------------
model = joblib.load("../trained/model.pkl")

# -----------------------------
# 2️⃣ Mock real-time input (later replace with APIs)
# -----------------------------
input_data = {
    "rainfall": 120,          # mm
    "temperature": 41,        # °C
    "aqi": 320,
    "traffic": 0.9,
    "platform_down": 0,
    "historical_orders": 120,

    # One-hot encoding (IMPORTANT)
    "city_Bangalore": 0,
    "city_Chennai": 1,
    "city_Coimbatore": 0,
    "city_Hyderabad": 0,
    "city_Madurai": 0,
    "city_Salem": 0
}

# Convert to DataFrame
df = pd.DataFrame([input_data])

# -----------------------------
# 3️⃣ Prediction
# -----------------------------
risk_score = model.predict_proba(df)[0][1]

print("\n🧠 Risk Score:", round(risk_score, 3))

# -----------------------------
# 4️⃣ Convert to Risk Level
# -----------------------------
if risk_score < 0.3:
    risk_level = "LOW"
elif risk_score < 0.7:
    risk_level = "MEDIUM"
else:
    risk_level = "HIGH"

print("⚠️ Risk Level:", risk_level)

# -----------------------------
# 5️⃣ Mock Real-Time Orders (API later)
# -----------------------------
current_orders = 60   # simulate drop

# -----------------------------
# 6️⃣ Validate Order Drop
# -----------------------------
order_drop_ratio = 1 - (current_orders / input_data["historical_orders"])

print("📉 Order Drop:", round(order_drop_ratio, 2))

# -----------------------------
# 7️⃣ Claim Decision Logic
# -----------------------------
if risk_score > 0.7 and order_drop_ratio > 0.25:
    trigger_claim = True
else:
    trigger_claim = False


# -----------------------------
# 🔟 Payout Policy Config (FINAL)
# -----------------------------
COVERAGE_PERCENT = 0.5   # 50% coverage
MAX_PAYOUT = 2000        # weekly cap

avg_daily_earning = 800
weekly_earning = avg_daily_earning * 7

payout = 0

if trigger_claim:
    income_loss = weekly_earning * order_drop_ratio
    payout = min(COVERAGE_PERCENT * income_loss, MAX_PAYOUT)
    payout = round(payout, 2)

# -----------------------------
# 8️⃣ Weekly Pricing Logic
# -----------------------------
if risk_score < 0.3:
    premium = 20
elif risk_score < 0.7:
    premium = 50
else:
    premium = 100

# -----------------------------
# 9️⃣ Final Output
# -----------------------------
print("\n💰 Weekly Premium: ₹", premium)
print("💸 Payout Amount: ₹", payout)

if trigger_claim:
    print("✅ CLAIM TRIGGERED")
else:
    print("❌ No Claim")

# -----------------------------
# 🔟 Structured Output (API-ready)
# -----------------------------
result = {
    "risk_score": float(risk_score),
    "risk_level": risk_level,
    "order_drop": float(order_drop_ratio),
    "premium": premium,
    "payout": payout,
    "claim": trigger_claim
}

print("\n📦 Final Output:\n", result)