# backend/app/models/property.py
from datetime import datetime
from pydantic import BaseModel, Field
from typing import Optional
from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from sqlalchemy.sql import func
from app.core.database import Base
from enum import Enum

Base = declarative_base()

class PropertyType(str, Enum):
    PLOT = "Działka"
    HOUSE = "Dom"
    APARTMENT = "Mieszkanie"
    INVESTMENT = "Inwestycje"
    COMMERCIAL = "Lokale użytkowe"
    WAREHOUSE = "Hale i magazyny"

class OfferType(str, Enum):
    SALE = "Sprzedaż"
    RENT = "Wynajem"

class DescriptionStyle(str, Enum):
    ARTISTIC = "Artystyczny"
    INNOVATIVE = "Innowacyjny"
    CLASSIC = "Klasyczny"
    ELEGANT = "Elegancki"
    INVESTMENT = "Inwestycyjny"

class PropertyRequest(BaseModel):
    property_type: PropertyType
    offer_type: OfferType
    style: DescriptionStyle
    location: str = Field(..., min_length=2)
    area: float = Field(..., gt=0)
    rooms: Optional[int] = Field(None, ge=1)
    floor: Optional[str]
    building_type: Optional[str]
    advertiser_type: Optional[str]
    year_built: Optional[int] = Field(None, ge=1800, le=2024)
    market_type: str
    price_per_meter: Optional[float] = Field(None, gt=0)
    building_material: Optional[str]
    additional_info: Optional[str]

class GeneratedDescription(BaseModel):
    description: str
    style: DescriptionStyle
    created_at: str = Field(default_factory=lambda: datetime.now().isoformat())


class PropertyDescription(Base):
    __tablename__ = "property_descriptions"

    id = Column(Integer, primary_key=True, index=True)
    property_type = Column(String)
    offer_type = Column(String)
    style = Column(String)
    location = Column(String)
    area = Column(Float)
    description = Column(Text)
    rooms = Column(Integer, nullable=True)
    floor = Column(Integer, nullable=True)
    building_type = Column(String, nullable=True)
    developer_type = Column(String, nullable=True)
    construction_year = Column(String, nullable=True)
    market_type = Column(String, nullable=True)
    price_per_meter = Column(Float, nullable=True)
    building_material = Column(String, nullable=True)
    additional_info = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

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