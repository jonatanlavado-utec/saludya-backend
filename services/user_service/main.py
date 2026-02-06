from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import user_router
from database import create_tables

app = FastAPI(
    title="SaludYa User Service",
    description="User management service for SaludYa telemedicine platform",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router, prefix="/users", tags=["Users"])

@app.on_event("startup")
async def startup():
    create_tables()

@app.get("/")
def read_root():
    return {"service": "SaludYa User Service", "status": "running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)
