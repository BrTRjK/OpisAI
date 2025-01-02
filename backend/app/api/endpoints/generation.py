from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.models.property import PropertyGenerationRequest, PropertyDescription
from app.core.services.description_generator import DescriptionGenerator
from app.config import settings 
import logging

class PropertyGenerationRequest(BaseModel):
    property_type: str
    offer_type: Optional[str]
    style: str
    location: str
    area: float
    rooms: Optional[int] = None
    floor: Optional[int] = None
    building_type: Optional[str] = None
    developer_type: Optional[str] = None
    construction_year: Optional[str] = None
    market_type: Optional[str] = None
    price_per_meter: Optional[float] = None
    building_material: Optional[str] = None
    additional_info: Optional[str] = None

# Konfiguracja logowania
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

router = APIRouter()

async def get_generator():
    try:
        return DescriptionGenerator(api_key=settings.OPENAI_API_KEY)
    except Exception as e:
        logger.error(f"Error creating generator: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate")
async def generate_description(
    property_data: PropertyGenerationRequest,
    db: Session = Depends(get_db),
    generator: DescriptionGenerator = Depends(get_generator)
):
    try:
        logger.info("Rozpoczęcie generowania opisu")
        logger.info(f"Otrzymane dane: {property_data.dict()}")
        
        # Generowanie opisu
        generated = await generator.generate_description(property_data)
        logger.info(f"Wygenerowany opis: {generated.description[:100]}...")

        # Przygotowanie obiektu do zapisania
        db_description = PropertyDescription(
            property_type=str(property_data.property_type.value),
            offer_type=str(property_data.offer_type.value),
            style=str(property_data.style.value),
            location=property_data.location,
            area=float(property_data.area),
            description=generated.description,
            rooms=property_data.rooms,
            floor=property_data.floor,
            building_type=property_data.building_type,
            market_type=property_data.market_type
        )

        # Zapis do bazy danych
        logger.info("Próba zapisania do bazy danych")
        try:
            db.add(db_description)
            db.commit()
            db.refresh(db_description)
            logger.info(f"Zapisano opis do bazy danych z ID: {db_description.id}")
        except Exception as db_error:
            logger.error(f"Błąd podczas zapisywania do bazy: {str(db_error)}")
            db.rollback()
            raise HTTPException(status_code=500, detail=f"Database error: {str(db_error)}")
        
        return generated
    except Exception as e:
        logger.error(f"Główny błąd: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))