import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config.settings import get_settings
from .api.endpoints import generation, history
from .core.database import engine
from .core.models.property import Base

# Konfiguracja logowania
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Inicjalizacja aplikacji
app = FastAPI(
    title="Real Estate Description Generator",
    description="API do generowania opisów nieruchomości",
    version="1.0.0"
)

# Inicjalizacja bazy danych
logger.info("Tworzenie tabel bazy danych...")
try:
    Base.metadata.create_all(bind=engine)
    logger.info("Tabele zostały utworzone pomyślnie")
except Exception as e:
    logger.error(f"Błąd podczas tworzenia tabel: {str(e)}")
    raise

# Konfiguracja CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Podpięcie routerów
app.include_router(generation.router, prefix="/api/v1", tags=["generation"])
app.include_router(history.router, prefix="/api/v1", tags=["history"])

# Endpointy
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/test-settings")
async def test_settings():
    settings = get_settings()
    return {
        "api_key_exists": bool(settings.OPENAI_API_KEY),
        "api_key_length": len(settings.OPENAI_API_KEY) if settings.OPENAI_API_KEY else 0
    }