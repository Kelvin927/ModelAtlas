from fastapi import APIRouter, UploadFile, File, Form
from typing import List, Optional
from core.executor import run_python_code
import os, json

router = APIRouter()
MODELS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "models")

def load_model_required_columns(model_id: str) -> Optional[list]:
    model_file = os.path.join(MODELS_DIR, f"{model_id}.json")
    if not os.path.exists(model_file):
        return None
    try:
        with open(model_file, "r", encoding="utf-8") as f:
            data = json.load(f)
            return data.get("required_columns")
    except Exception:
        return None

@router.post("/run-code")
async def run_code(
    code: str = Form(...),
    model_id: str = Form(None),
    files: Optional[List[UploadFile]] = File(None),
    column_map: Optional[str] = Form(None),   # <--- NEW
):
    if files:
        print(f"[run-code] Received {len(files)} file(s): {[f.filename for f in files]}")
    else:
        print("[run-code] No files received")

    required_columns = load_model_required_columns(model_id) if model_id else None
    print(f"[run-code] Model {model_id} requires columns: {required_columns}")

    result = await run_python_code(
        code,
        files,
        required_columns=required_columns,
        column_map=column_map,                 # <--- NEW
    )

    if result.get("stderr"):
        print(f"[run-code] Execution error: {result['stderr']}")
    else:
        print("[run-code] Execution completed successfully")
    return result
