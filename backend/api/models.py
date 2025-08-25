from fastapi import APIRouter, HTTPException
from core.model_loader import load_models

router = APIRouter()
models = load_models()

@router.get("/models")
def get_models():
    return models

@router.get("/models/{model_id}")
def get_model(model_id: str):
    for model in models:
        if model["id"] == model_id:
            return model
    raise HTTPException(status_code=404, detail=f"Model '{model_id}' not found")
