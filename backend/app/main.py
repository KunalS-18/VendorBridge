from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.routers import search, vendors
from app.services import price_benchmark


@asynccontextmanager
async def lifespan(app: FastAPI):
    price_benchmark.seed_if_empty()
    yield


app = FastAPI(title="VendorBridge API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(vendors.router)
app.include_router(search.router)


@app.get("/health")
def health():
    return {"status": "ok"}
