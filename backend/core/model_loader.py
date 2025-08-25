import os, json
from glob import glob

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # backend/
MODELS_DIR = os.path.join(BASE_DIR, "data", "models")

def load_models():
    models = []
    if not os.path.exists(MODELS_DIR):
        print(f"⚠️ Models directory not found: {MODELS_DIR}")
        return models

    for file_path in glob(os.path.join(MODELS_DIR, "*.json")):
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                models.append(json.load(f))
        except Exception as e:
            print(f"⚠️ Failed to load {file_path}: {e}")
    return models
