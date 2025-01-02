from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints.generation import router as generation_router
from app.api.endpoints.history import router as history_router
from app.api.endpoints.auth import router as auth_router
from app.core.database import Base, engine
from app.config import settings

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(generation_router, prefix="/generation", tags=["generation"])
app.include_router(history_router, prefix="/history", tags=["history"])

@app.get("/")
def read_root():
    return {"Hello": "World"}