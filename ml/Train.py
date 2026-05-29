import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
import joblib

# -----------------------------------------
# Synthetic Dataset Generation
# -----------------------------------------

np.random.seed(42)

# Normal voting traffic
normal_votes_per_minute = np.random.normal(
    loc=25,
    scale=5,
    size=1000
)

normal_requests_from_same_ip = np.random.normal(
    loc=2,
    scale=1,
    size=1000
)

# Suspicious traffic spikes
attack_votes_per_minute = np.random.normal(
    loc=500,
    scale=100,
    size=50
)

attack_requests_from_same_ip = np.random.normal(
    loc=120,
    scale=40,
    size=50
)

# Combine traffic patterns
votes_per_minute = np.concatenate([
    normal_votes_per_minute,
    attack_votes_per_minute
])

requests_from_same_ip = np.concatenate([
    normal_requests_from_same_ip,
    attack_requests_from_same_ip
])

# Create DataFrame
dataset = pd.DataFrame({
    "votes_per_minute": votes_per_minute,
    "requests_from_same_ip": requests_from_same_ip
})

# -----------------------------------------
# Feature Scaling
# -----------------------------------------

scaler = StandardScaler()

scaled_dataset = scaler.fit_transform(dataset)

# -----------------------------------------
# Isolation Forest Model
# -----------------------------------------

model = IsolationForest(
    n_estimators=200,
    contamination=0.05,
    random_state=42
)

model.fit(scaled_dataset)

# -----------------------------------------
# Save Artifacts
# -----------------------------------------

joblib.dump(model, "isolation_forest_model.pkl")
joblib.dump(scaler, "scaler.pkl")

print("Isolation Forest model trained successfully")