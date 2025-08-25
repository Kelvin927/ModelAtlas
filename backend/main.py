from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
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

# Register routers
app.include_router(health.router)
app.include_router(models.router)
app.include_router(run_code.router)
