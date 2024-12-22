import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  VStack,
  SimpleGrid,
  useToast
} from '@chakra-ui/react';
import axios from 'axios';
import { useState } from 'react';

interface PropertyFormProps {
  onDescriptionGenerated?: () => void;
}

export default function PropertyForm({ onDescriptionGenerated }: PropertyFormProps) {
  // Stan formularza
  const [formData, setFormData] = useState({
    propertyType: '',
    offerType: '',
    style: '',
    location: '',
    area: '',
    rooms: '',
    floor: '',
    buildingType: '',
    advertiserType: '',
    yearBuilt: '',
    marketType: '',
    pricePerMeter: '',
    buildingMaterial: '',
    additionalInfo: ''
  });

  // Stany pomocnicze
  const [isLoading, setIsLoading] = useState(false);
  const [generatedDescription, setGeneratedDescription] = useState('');
  const toast = useToast();

  // Stałe
  const propertyTypes = ['Działka', 'Dom', 'Mieszkanie', 'Inwestycje', 'Lokale użytkowe', 'Hale i magazyny'];
  const offerTypes = ['Sprzedaż', 'Wynajem'];
  const styles = ['Artystyczny', 'Innowacyjny', 'Klasyczny', 'Elegancki', 'Inwestycyjny'];
  const marketTypes = ['Pierwotny', 'Wtórny'];

  // Obsługa zmiany pól formularza
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Obsługa wysyłania formularza
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const requestData = {
      property_type: formData.propertyType,
      offer_type: formData.offerType,
      style: formData.style,
      location: formData.location,
      area: Number(formData.area),
      rooms: formData.rooms ? Number(formData.rooms) : null,
      floor: formData.floor,
      building_type: formData.buildingType,
      advertiser_type: formData.advertiserType,
      year_built: formData.yearBuilt ? Number(formData.yearBuilt) : null,
      market_type: formData.marketType,
      price_per_meter: formData.pricePerMeter ? Number(formData.pricePerMeter) : null,
      building_material: formData.buildingMaterial,
      additional_info: formData.additionalInfo
    };

    try {
      const response = await axios.post(
        'http://localhost:8001/api/v1/generate', 
        requestData
      );

      setGeneratedDescription(response.data.description);
      
      if (onDescriptionGenerated) {
        onDescriptionGenerated();
      }

      toast({
        title: 'Sukces!',
        description: 'Pomyślnie wygenerowano opis nieruchomości.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: 'Błąd!',
        description: error.response?.data?.detail || 'Nie udało się wygenerować opisu',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit} p={6} borderRadius="lg" boxShadow="lg" bg="white">
      <VStack spacing={6}>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="full">
          <FormControl isRequired>
            <FormLabel>Typ nieruchomości</FormLabel>
            <Select
              name="propertyType"
              value={formData.propertyType}
              onChange={handleInputChange}
              placeholder="Wybierz typ nieruchomości"
            >
              {propertyTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </Select>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Rodzaj oferty</FormLabel>
            <Select
              name="offerType"
              value={formData.offerType}
              onChange={handleInputChange}
              placeholder="Wybierz rodzaj oferty"
            >
              {offerTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </Select>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Styl opisu</FormLabel>
            <Select
              name="style"
              value={formData.style}
              onChange={handleInputChange}
              placeholder="Wybierz styl opisu"
            >
              {styles.map(style => (
                <option key={style} value={style}>{style}</option>
              ))}
            </Select>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Rynek</FormLabel>
            <Select
              name="marketType"
              value={formData.marketType}
              onChange={handleInputChange}
              placeholder="Wybierz typ rynku"
            >
              {marketTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </Select>
          </FormControl>

         

<SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="full">
  {/* Istniejące pola select */}
  
  <FormControl isRequired>
    <FormLabel>Lokalizacja</FormLabel>
    <Input
      name="location"
      value={formData.location}
      onChange={handleInputChange}
      placeholder="np. Warszawa, Mokotów"
    />
  </FormControl>

  <FormControl isRequired>
    <FormLabel>Powierzchnia (m²)</FormLabel>
    <Input
      name="area"
      type="number"
      value={formData.area}
      onChange={handleInputChange}
      placeholder="np. 75"
    />
  </FormControl>

  <FormControl>
    <FormLabel>Liczba pokoi</FormLabel>
    <Input
      name="rooms"
      type="number"
      value={formData.rooms}
      onChange={handleInputChange}
      placeholder="np. 3"
    />
  </FormControl>

  <FormControl>
    <FormLabel>Piętro</FormLabel>
    <Input
      name="floor"
      value={formData.floor}
      onChange={handleInputChange}
      placeholder="np. 2 z 4"
    />
  </FormControl>

  <FormControl>
    <FormLabel>Rodzaj zabudowy</FormLabel>
    <Input
      name="buildingType"
      value={formData.buildingType}
      onChange={handleInputChange}
      placeholder="np. Blok, Kamienica"
    />
  </FormControl>

  <FormControl>
    <FormLabel>Rok budowy</FormLabel>
    <Input
      name="yearBuilt"
      type="number"
      value={formData.yearBuilt}
      onChange={handleInputChange}
      placeholder="np. 2010"
    />
  </FormControl>

  <FormControl>
    <FormLabel>Cena za metr (zł)</FormLabel>
    <Input
      name="pricePerMeter"
      type="number"
      value={formData.pricePerMeter}
      onChange={handleInputChange}
      placeholder="np. 8000"
    />
  </FormControl>

  <FormControl>
    <FormLabel>Materiał budynku</FormLabel>
    <Input
      name="buildingMaterial"
      value={formData.buildingMaterial}
      onChange={handleInputChange}
      placeholder="np. Cegła"
    />
  </FormControl>
</SimpleGrid>

<FormControl>
  <FormLabel>Dodatkowe informacje</FormLabel>
  <Textarea
    name="additionalInfo"
    value={formData.additionalInfo}
    onChange={handleInputChange}
    placeholder="Dodatkowe informacje o nieruchomości..."
    rows={4}
  />
</FormControl>

          {/* ... */}
        </SimpleGrid>

        <Button
          type="submit"
          colorScheme="blue"
          size="lg"
          width="full"
          isLoading={isLoading}
        >
          Generuj opis
        </Button>
      </VStack>

      {generatedDescription && (
        <Box mt={6} p={4} borderRadius="md" bg="gray.50">
          <FormLabel mb={2}>Wygenerowany opis:</FormLabel>
          <Box 
            p={4} 
            bg="white" 
            borderRadius="md" 
            border="1px" 
            borderColor="gray.200"
            whiteSpace="pre-wrap"
          >
            {generatedDescription}
          </Box>
          <Button
            mt={4}
            size="sm"
            onClick={() => navigator.clipboard.writeText(generatedDescription)}
          >
            Kopiuj do schowka
          </Button>
        </Box>
      )}
    </Box>
  );
}