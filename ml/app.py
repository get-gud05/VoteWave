from fastapi import FastAPI
from pydantic import BaseModel
import numpy as np
import joblib


model = joblib.load("isolation_forest_model.pkl")
scaler = joblib.load("scaler.pkl")


app = FastAPI()


class VoteTrafficData(BaseModel):
    votes_per_minute: float
    requests_from_same_ip: float


@app.post("/predict")

def predict(data: VoteTrafficData):

    features = np.array([[
        data.votes_per_minute,
        data.requests_from_same_ip
    ]])

    scaled_features = scaler.transform(features)

    anomaly_score = model.decision_function(
        scaled_features
    )[0]

    prediction = model.predict(
        scaled_features
    )[0]

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
