import random

# -----------------------------
# 📍 Zone Baselines
# -----------------------------
ZONE_PROFILES = {
    "Chennai": {"rain_base": 60, "traffic_base": 0.7, "aqi_base": 180},
    "Bangalore": {"rain_base": 40, "traffic_base": 0.85, "aqi_base": 150},
    "Delhi": {"rain_base": 20, "traffic_base": 0.8, "aqi_base": 300},
    "Hyderabad": {"rain_base": 30, "traffic_base": 0.75, "aqi_base": 170},
    "Coimbatore": {"rain_base": 50, "traffic_base": 0.6, "aqi_base": 120}
}

# -----------------------------
# 🎭 Scenario Engine
# -----------------------------
def generate_scenario(city):

    base = ZONE_PROFILES.get(city, ZONE_PROFILES["Chennai"])

    scenario_type = random.choice([
        "normal",
        "heavy_rain",
        "heatwave",
        "high_pollution",
        "traffic_spike",
        "platform_failure"
    ])

    rainfall = base["rain_base"] + random.uniform(-20, 20)
    temperature = random.uniform(28, 42)
    aqi = base["aqi_base"] + random.uniform(-50, 50)
    traffic = base["traffic_base"] + random.uniform(-0.2, 0.2)
    platform_down = 0

    # -----------------------------
    # Apply scenario overrides
    # -----------------------------
    if scenario_type == "heavy_rain":
        rainfall = random.uniform(100, 150)

    elif scenario_type == "heatwave":
        temperature = random.uniform(42, 46)

    elif scenario_type == "high_pollution":
        aqi = random.uniform(300, 450)

    elif scenario_type == "traffic_spike":
        traffic = random.uniform(0.9, 1.0)

    elif scenario_type == "platform_failure":
        platform_down = 1

    # -----------------------------
    # Clamp values (realistic limits)
    # -----------------------------
    rainfall = max(0, rainfall)
    traffic = min(max(traffic, 0), 1)

    return {
        "scenario": scenario_type,
        "rainfall": round(rainfall, 2),
        "temperature": round(temperature, 2),
        "aqi": round(aqi, 2),
        "traffic": round(traffic, 2),
        "platform_down": platform_down
    }