from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import json
import os

app = FastAPI()

# Enable CORS (allow frontend requests from localhost:3000 etc.)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow all origins (you can restrict later)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load models.json
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "../data/models.json")

with open(DATA_PATH, "r", encoding="utf-8") as f:
    models = json.load(f)

@app.get("/")
def root():
    return {"message": "ModelAtlas API is running!"}

@app.get("/models")
def get_models():
    return models

@app.get("/models/{model_id}")
def get_model(model_id: int):
    for model in models:
        if model["id"] == model_id:
            return model
    raise HTTPException(status_code=404, detail="Model not found")
