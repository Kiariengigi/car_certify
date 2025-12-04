from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
import joblib
import numpy as np
from datetime import datetime
import os

# Use absolute directory path so model loads correctly
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

model = joblib.load(os.path.join(BASE_DIR, "random_forest_model_improved.joblib"))
le_make = joblib.load(os.path.join(BASE_DIR, "le_make.joblib"))
le_model = joblib.load(os.path.join(BASE_DIR, "le_model.joblib"))
le_fuel = joblib.load(os.path.join(BASE_DIR, "le_fuel.joblib"))

current_year = datetime.now().year

app = FastAPI()

# Request schema
class MileageRequest(BaseModel):
    make: str
    model: str
    year: int
    engine_cc: float
    fuel_type: str

def safe_transform(encoder, value):
    if value in encoder.classes_:
        return encoder.transform([value])[0]
    else:
        return 0

@app.get("/")
def root():
    return {"message": "Mileage Model API"}

@app.post("/predict")
def predict(req: MileageRequest):
    try:
        # Convert to DataFrame
        df = pd.DataFrame([req.dict()])

        df["age"] = current_year - df["year"]

        df["make_encoded"] = df["make"].apply(lambda x: safe_transform(le_make, x))
        df["model_encoded"] = df["model"].apply(lambda x: safe_transform(le_model, x))
        df["fuel_type_encoded"] = df["fuel_type"].apply(lambda x: safe_transform(le_fuel, x))

        features = ["age", "year", "engine_cc", "make_encoded", "model_encoded", "fuel_type_encoded"]
        X_new = df[features]

        predicted_mileage = model.predict(X_new)

        return {"predicted_mileage": float(predicted_mileage[0])}

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
