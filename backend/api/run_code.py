from fastapi import APIRouter
from pydantic import BaseModel
from core.executor import run_python_code

router = APIRouter()

class CodeRequest(BaseModel):
    code: str

@router.post("/run-code")
def run_code(req: CodeRequest):
    """API endpoint for running Python code"""
    return run_python_code(req.code)
