from fastapi import FastAPI
from pydantic import BaseModel
import numpy as np
import joblib

# -----------------------------------------
# Load Trained Model
# -----------------------------------------

model = joblib.load("isolation_forest_model.pkl")
scaler = joblib.load("scaler.pkl")

# -----------------------------------------
# Initialize FastAPI
# -----------------------------------------

app = FastAPI()

# -----------------------------------------
# Request Schema
# -----------------------------------------

class VoteTrafficData(BaseModel):
    votes_per_minute: float
    requests_from_same_ip: float

# -----------------------------------------
# Prediction Endpoint
# -----------------------------------------

@app.post("/predict")

def predict(data: VoteTrafficData):

    # Create feature array
    features = np.array([[
        data.votes_per_minute,
        data.requests_from_same_ip
    ]])

    # Scale features
    scaled_features = scaler.transform(features)

    # Generate anomaly score
    anomaly_score = model.decision_function(
        scaled_features
    )[0]

    # Generate prediction
    prediction = model.predict(
        scaled_features
    )[0]

    # Convert to 0-100 suspicion score
    suspicion_score = int(
        max(
            0,
            min(
                100,
                (0.5 - anomaly_score) * 100
            )
        )
    )

    return {
        "suspicious": prediction == -1,
        "suspicion_score": suspicion_score,
        "anomaly_score": float(anomaly_score)
    }