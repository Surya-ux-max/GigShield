import joblib
import pandas as pd
import random

from advanced_mock_api import generate_scenario


# -----------------------------
# 🧠 Payout Calculation Function
# -----------------------------
def calculate_payout(order_drop_ratio, avg_daily_earning=800):

    COVERAGE_PERCENT = 0.5
    MAX_PAYOUT = 2000

    weekly_earning = avg_daily_earning * 7
    income_loss = weekly_earning * order_drop_ratio

    payout = min(COVERAGE_PERCENT * income_loss, MAX_PAYOUT)

    return round(payout, 2)


# -----------------------------
# 1️⃣ Load trained model
# -----------------------------
model = joblib.load("../trained/model.pkl")


# -----------------------------
# 2️⃣ Get Advanced Mock Scenario
# -----------------------------
city = "Chennai"
mock = generate_scenario(city)

scenario = mock["scenario"]

print("\n🌍 Scenario:", scenario)


# -----------------------------
# 3️⃣ Prepare Model Input
# -----------------------------
input_data = {
    "rainfall": max(0, mock["rainfall"] + random.uniform(-5, 5)),
    "temperature": mock["temperature"] + random.uniform(-1, 1),
    "aqi": max(0, mock["aqi"] + random.uniform(-10, 10)),
    "traffic": min(max(mock["traffic"] + random.uniform(-0.05, 0.05), 0), 1),
    "platform_down": mock["platform_down"],
    "historical_orders": 120,

    # One-hot encoding
    "city_Bangalore": 0,
    "city_Chennai": 1 if city == "Chennai" else 0,
    "city_Coimbatore": 0,
    "city_Hyderabad": 0,
    "city_Madurai": 0,
    "city_Salem": 0
}

df = pd.DataFrame([input_data])


# -----------------------------
# 4️⃣ Prediction
# -----------------------------
risk_score = model.predict_proba(df)[0][1]


# -----------------------------
# 🧠 Scenario Correction Layer
# -----------------------------
# Fix for normal conditions
if scenario == "normal":
    risk_score = min(risk_score, 0.4)

# Mild condition correction
if (
    input_data["rainfall"] < 50 and
    input_data["temperature"] < 38 and
    input_data["aqi"] < 200 and
    input_data["traffic"] < 0.8 and
    input_data["platform_down"] == 0
):
    risk_score = min(risk_score, 0.3)


# -----------------------------
# 🎯 Scenario-based Risk Tuning
# -----------------------------
if scenario == "traffic_spike":
    risk_score = min(risk_score, 0.85)

elif scenario == "high_pollution":
    risk_score = min(risk_score, 0.8)

elif scenario == "heatwave":
    risk_score = min(risk_score, 0.75)


print("\n🧠 Risk Score:", round(risk_score, 3))


# -----------------------------
# 5️⃣ Risk Level
# -----------------------------
if risk_score < 0.3:
    risk_level = "LOW"
elif risk_score < 0.7:
    risk_level = "MEDIUM"
else:
    risk_level = "HIGH"

print("⚠️ Risk Level:", risk_level)


# -----------------------------
# 6️⃣ Simulate Order Drop
# -----------------------------
if scenario == "heavy_rain":
    base_orders = 40

elif scenario == "heatwave":
    base_orders = 60

elif scenario == "traffic_spike":
    base_orders = 55

elif scenario == "high_pollution":
    base_orders = 65

elif scenario == "platform_failure":
    base_orders = 20

else:
    base_orders = 100


# Add randomness
current_orders = base_orders + random.randint(-10, 10)
current_orders = max(0, current_orders)

historical_orders = input_data["historical_orders"]

order_drop_ratio = 1 - (current_orders / historical_orders)
order_drop_ratio = max(0, order_drop_ratio)

print("📉 Order Drop:", round(order_drop_ratio, 2))


# -----------------------------
# 7️⃣ Claim Logic (Advanced)
# -----------------------------
trigger_claim = False

# Core condition
if risk_score > 0.7 and order_drop_ratio > 0.25:
    trigger_claim = True

# Platform failure override
if input_data["platform_down"] == 1:
    trigger_claim = True

# False positive prevention
if risk_score > 0.8 and order_drop_ratio < 0.1:
    trigger_claim = False

# Extreme event override
if scenario in ["heavy_rain", "platform_failure"] and order_drop_ratio > 0.2:
    trigger_claim = True


# -----------------------------
# 8️⃣ Pricing Logic
# -----------------------------
if risk_score < 0.3:
    premium = 20
elif risk_score < 0.7:
    premium = 50
else:
    premium = 100


# -----------------------------
# 9️⃣ Payout Logic
# -----------------------------
payout = 0

if trigger_claim:
    payout = calculate_payout(order_drop_ratio)


# -----------------------------
# 🔟 Final Output
# -----------------------------
print("\n💰 Weekly Premium: ₹", premium)
print("💸 Payout Amount: ₹", payout)

if trigger_claim:
    print("✅ CLAIM TRIGGERED")
else:
    print("❌ No Claim")


# -----------------------------
# 📦 API Output
# -----------------------------
result = {
    "scenario": scenario,
    "risk_score": float(risk_score),
    "risk_level": risk_level,
    "order_drop": float(order_drop_ratio),
    "premium": premium,
    "payout": payout,
    "claim": trigger_claim
}

print("\n📦 Final Output:\n", result)