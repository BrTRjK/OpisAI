from app.core.models.property import PropertyRequest, GeneratedDescription
import openai

class DescriptionGenerator:
    def __init__(self, api_key: str):
        self.api_key = api_key
        openai.api_key = api_key

    async def generate_description(self, property_data: PropertyRequest) -> GeneratedDescription:
        # Na razie dla testów, później dodamy prawdziwe generowanie przez OpenAI
        description = f"""
        {property_data.property_type.value} w lokalizacji {property_data.location}.
        Powierzchnia: {property_data.area} m².
        """
        
        return GeneratedDescription(
            description=description,
            property_type=property_data.property_type.value,
            location=property_data.location,
            style=property_data.style.value
        )