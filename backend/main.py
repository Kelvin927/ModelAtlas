from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json
import os

app = FastAPI()

# Enable CORS for frontend (Next.js)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can restrict this to your frontend domain later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Path to the JSON dataset
DATA_PATH = os.path.join(os.path.dirname(__file__), "../data/models.json")

# Utility function to load models from JSON
def load_models():
    try:
        with open(DATA_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        print("Error loading models.json:", e)
        return []

@app.get("/")
def root():
    return {"message": "Welcome to ModelAtlas API"}

@app.get("/models")
def get_models():
    """Return all models from the dataset"""
    return load_models()

@app.get("/models/{model_id}")
def get_model(model_id: str):
    """Return a single model by ID"""
    models = load_models()
    for model in models:
        if model.get("id") == model_id:
            return model
    return {"error": "Model not found"}
