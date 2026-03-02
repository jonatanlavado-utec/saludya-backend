from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import catalog_router
from database import create_tables, seed_data

app = FastAPI(
    title="SaludYa Catalog Service",
    description="Catalog service for specialties and doctors in SaludYa telemedicine platform",
    version="1.0.0",
    root_path="/api/catalog"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(catalog_router, tags=["Catalog"])

@app.on_event("startup")
async def startup():
    create_tables()
    seed_data()

@app.get("/")
def read_root():
    return {"service": "SaludYa Catalog Service", "status": "running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8003)
