import pandas as pd
import random

# Pincode → City Mapping
pincode_data = {
    "600001": "Chennai",
    "600020": "Chennai",
    "600100": "Chennai",
    "641001": "Coimbatore",
    "641035": "Coimbatore",
    "625001": "Madurai",
    "625020": "Madurai",
    "636001": "Salem",
    "560001": "Bangalore",
    "560034": "Bangalore",
    "500001": "Hyderabad",
    "500081": "Hyderabad"
}

# Zone-specific config
zone_config = {
    "Chennai": {"rain_threshold": 120, "traffic_threshold": 0.85},
    "Coimbatore": {"rain_threshold": 80, "traffic_threshold": 0.70},
    "Madurai": {"rain_threshold": 70, "traffic_threshold": 0.65},
    "Salem": {"rain_threshold": 75, "traffic_threshold": 0.65},
    "Bangalore": {"rain_threshold": 90, "traffic_threshold": 0.90},
    "Hyderabad": {"rain_threshold": 85, "traffic_threshold": 0.80}
}

def generate_data(n=10000):
    data = []

    for _ in range(n):

        pincode = random.choice(list(pincode_data.keys()))
        city = pincode_data[pincode]
        config = zone_config[city]

        rainfall = random.uniform(0, 150)
        temperature = random.uniform(25, 45)
        aqi = random.uniform(50, 400)
        traffic = random.uniform(0.3, 1.0)

        historical_orders = random.randint(80, 150)

        disruption_factor = 1.0

        if rainfall > config["rain_threshold"]:
            disruption_factor -= 0.30
        if temperature > 40:
            disruption_factor -= 0.20
        if aqi > 300:
            disruption_factor -= 0.20
        if traffic > config["traffic_threshold"]:
            disruption_factor -= 0.20

        platform_down = random.random() < 0.05
        if platform_down:
            disruption_factor -= 0.40

        disruption_factor = max(0.3, disruption_factor)

        current_orders = int(historical_orders * disruption_factor)

        per_order_rate = 30
        income = current_orders * per_order_rate

        # 🔥 FIXED INCENTIVE LOGIC
        if current_orders >= 25:
            incentive = 500
        elif current_orders >= 20:
            incentive = 300
        elif current_orders >= 15:
            incentive = 150
        else:
            incentive = 0

        total_income = income + incentive

        disruption_label = 1 if current_orders < 0.75 * historical_orders else 0

        data.append([
            pincode, city, rainfall, temperature, aqi, traffic,
            platform_down, historical_orders, current_orders,
            income, incentive, total_income, disruption_label
        ])

    df = pd.DataFrame(data, columns=[
        "pincode", "city", "rainfall", "temperature", "aqi", "traffic",
        "platform_down", "historical_orders", "current_orders",
        "income", "incentive", "total_income", "disruption_label"
    ])

    return df


if __name__ == "__main__":
    df = generate_data(10000)
    df.to_csv("../data/synthetic_data.csv", index=False)
    print("✅ Updated dataset generated successfully!")