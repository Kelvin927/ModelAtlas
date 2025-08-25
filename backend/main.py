from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from api import health, models, run_code

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Ensure outputs directory exists
BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # backend/
OUTPUT_DIR = os.path.join(BASE_DIR, "outputs")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# ✅ Mount static files
app.mount("/outputs", StaticFiles(directory=OUTPUT_DIR), name="outputs")

# Register routers
app.include_router(health.router)
app.include_router(models.router)
app.include_router(run_code.router)
