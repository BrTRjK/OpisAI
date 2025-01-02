from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from sqlalchemy.sql import func
from app.core.database import Base
from pydantic import BaseModel
from typing import Optional, List
from enum import Enum

# Enumy dla możliwych wartości
class PropertyType(str, Enum):
    APARTMENT = "apartment"
    HOUSE = "house"
    PLOT = "plot"
    COMMERCIAL = "commercial"
    WAREHOUSE = "warehouse"
    INVESTMENT = "investment"

class OfferType(str, Enum):
    SALE = "sale"
    RENT = "rent"

class StyleType(str, Enum):
    ARTISTIC = "artistic"
    INNOVATIVE = "innovative"
    CLASSIC = "classic"
    ELEGANT = "elegant"
    INVESTMENT = "investment"

# Model SQLAlchemy dla bazy danych
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

# Pydantic models dla walidacji requestów
class PropertyRequest(BaseModel):
    property_type: PropertyType
    offer_type: Optional[OfferType] = None
    style: StyleType
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

class GeneratedDescription(BaseModel):
    description: str
    property_type: str
    location: str
    style: str