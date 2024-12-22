from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    OPENAI_API_KEY: str
    DATABASE_URL: str
    ENVIRONMENT: str
    CORS_ORIGINS: str

    class Config:
        env_file = ".env"
        env_file_encoding = 'utf-8'
        extra = 'ignore'

@lru_cache()
def get_settings():
    return Settings()