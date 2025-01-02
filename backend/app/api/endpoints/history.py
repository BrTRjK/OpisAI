from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.models.property import PropertyDescription
from typing import List
import logging

# Konfiguracja loggera
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

router = APIRouter()

@router.get("")
async def get_history(db: Session = Depends(get_db)):
    try:
        descriptions = db.query(PropertyDescription).order_by(PropertyDescription.created_at.desc()).all()
        logger.info(f"Pobrano {len(descriptions)} opisów z bazy danych")
        return descriptions
    except Exception as e:
        logger.error(f"Error fetching history: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))