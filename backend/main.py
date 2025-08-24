from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import json
from pathlib import Path

app = FastAPI(title="Model Handbook API")

DATA_FILE = Path(__file__).resolve().parent.parent / "data" / "models.json"

class ModelItem(BaseModel):
    id: str
    name: str
    category: str
    tags: List[str]
    summary: str
    latex: Optional[str] = None
    python_snippet: Optional[str] = None

def load_data():
    if DATA_FILE.exists():
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return []

@app.get("/models")
def list_models(q: Optional[str] = None, category: Optional[str] = None):
    models = load_data()
    if q:
        models = [m for m in models if q.lower() in m["name"].lower() or q.lower() in m["summary"].lower()]
    if category:
        models = [m for m in models if m["category"].lower() == category.lower()]
    return models

@app.get("/models/{mid}")
def get_model(mid: str):
    models = load_data()
    for m in models:
        if m["id"] == mid:
            return m
    raise HTTPException(404, "Model not found")
