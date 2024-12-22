# backend/app/services/description_generator.py
from openai import OpenAI
from ..models.property import PropertyRequest, GeneratedDescription
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class DescriptionGenerator:
    def __init__(self, api_key: str):
        self.client = OpenAI(api_key=api_key)
        logger.info("OpenAI client initialized successfully")

    async def generate_description(self, property_data: PropertyRequest) -> GeneratedDescription:
        try:
            prompt = self._create_prompt(property_data, property_data.style)
            
            completion = self.client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "Jesteś profesjonalnym rzeczoznawcą nieruchomości z wieloletnim doświadczeniem w pisaniu opisów nieruchomości."},
                    {"role": "user", "content": prompt}
                ]
            )

            return GeneratedDescription(
                description=completion.choices[0].message.content,
                style=property_data.style,
                created_at=datetime.now().isoformat()
            )
        except Exception as e:
            logger.error(f"Error in generate_description: {str(e)}")
            raise

    def _create_prompt(self, property_data: PropertyRequest, style: str) -> str:
        base_prompt = f"""Stwórz profesjonalny opis nieruchomości w języku polskim w stylu {style}.
        
Szczegóły nieruchomości:
- Typ: {property_data.property_type}
- Oferta: {property_data.offer_type}
- Lokalizacja: {property_data.location}
- Powierzchnia: {property_data.area} m²
"""
        if property_data.rooms:
            base_prompt += f"- Liczba pokoi: {property_data.rooms}\n"
        if property_data.floor:
            base_prompt += f"- Piętro: {property_data.floor}\n"
        if property_data.building_type:
            base_prompt += f"- Rodzaj zabudowy: {property_data.building_type}\n"
        if property_data.year_built:
            base_prompt += f"- Rok budowy: {property_data.year_built}\n"
        if property_data.price_per_meter:
            base_prompt += f"- Cena za metr: {property_data.price_per_meter} zł/m²\n"
        if property_data.additional_info:
            base_prompt += f"\nDodatkowe informacje: {property_data.additional_info}"

        style_instructions = {
            "Artystyczny": "Użyj poetyckiego, opisowego języka, podkreślając atmosferę i wrażenia estetyczne.",
            "Innowacyjny": "Skup się na nowoczesnych aspektach i technologicznych udogodnieniach.",
            "Klasyczny": "Użyj profesjonalnego, rzeczowego języka, koncentrując się na kluczowych faktach.",
            "Elegancki": "Podkreśl prestiż i wyjątkowość nieruchomości, używając wyrafinowanego języka.",
            "Inwestycyjny": "Skoncentruj się na potencjale inwestycyjnym i aspektach finansowych."
        }

        return base_prompt + "\n" + style_instructions[property_data.style]
        