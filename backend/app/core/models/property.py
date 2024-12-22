# backend/app/models/property.py
from datetime import datetime
from pydantic import BaseModel, Field
from typing import Optional
from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from sqlalchemy.ext.declarative import declarative_base
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
    property_type = Column(String(50))
    offer_type = Column(String(50))
    style = Column(String(50))
    location = Column(String(255))
    area = Column(Float)
    description = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    rooms = Column(Integer, nullable=True)
    floor = Column(String(50), nullable=True)
    building_type = Column(String(100), nullable=True)
    market_type = Column(String(50))