from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import user_router
from database import create_tables
import uvicorn

app = FastAPI(
    title="SaludYa User Service",
    description="User management service for SaludYa telemedicine platform",
    version="1.0.0",
    root_path="/api/users"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router, tags=["Users"])

@app.on_event("startup")
async def startup():
    create_tables()

@app.get("/")
def read_root():
    return {"service": "SaludYa User Service", "status": "running"}

if __name__ == "__main__":
    
    uvicorn.run(app, host="0.0.0.0", port=8002)
