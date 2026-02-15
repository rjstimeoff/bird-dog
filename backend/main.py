from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routers.analyze import router as analyze_router
from backend.routers.tracker import router as tracker_router
from backend.routers.resume_review import router as resume_review_router
from backend.database import init_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield


app = FastAPI(title="Bird Dog", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyze_router, prefix="/api")
app.include_router(tracker_router, prefix="/api")
app.include_router(resume_review_router, prefix="/api")


@app.get("/api/health")
async def health():
    return {"status": "ok"}
