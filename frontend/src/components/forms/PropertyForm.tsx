import React from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  NumberInput,
  NumberInputField,
  VStack,
  Textarea,
  Grid,
  GridItem,
} from '@chakra-ui/react';

interface PropertyFormProps {
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

export const PropertyForm = ({ onSubmit, isLoading = false }: PropertyFormProps) => {
  const [formData, setFormData] = React.useState({
    property_type: '',
    offer_type: '',
    style: '',
    location: '',
    area: '',
    rooms: '',
    floor: '',
    building_type: '',
    developer_type: '',
    construction_year: '',
    market_type: '',
    price_per_meter: '',
    building_material: '',
    additional_info: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Box as="form" onSubmit={handleSubmit} width="100%">
      <Grid templateColumns="repeat(2, 1fr)" gap={6}>
        <GridItem>
          <FormControl isRequired>
            <FormLabel>Typ nieruchomości</FormLabel>
            <Select name="property_type" value={formData.property_type} onChange={handleChange}>
              <option value="">Wybierz typ</option>
              <option value="plot">Działka</option>
              <option value="house">Dom</option>
              <option value="apartment">Mieszkanie</option>
              <option value="investment">Inwestycje</option>
              <option value="commercial">Lokale użytkowe</option>
              <option value="warehouse">Hale i magazyny</option>
            </Select>
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isRequired>
            <FormLabel>Styl opisu</FormLabel>
            <Select name="style" value={formData.style} onChange={handleChange}>
              <option value="">Wybierz styl</option>
              <option value="artistic">Artystyczny</option>
              <option value="innovative">Innowacyjny</option>
              <option value="classic">Klasyczny</option>
              <option value="elegant">Elegancki</option>
              <option value="investment">Inwestycyjny</option>
            </Select>
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isRequired>
            <FormLabel>Lokalizacja</FormLabel>
            <Input name="location" value={formData.location} onChange={handleChange} />
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isRequired>
            <FormLabel>Powierzchnia (m²)</FormLabel>
            <NumberInput min={0}>
              <NumberInputField name="area" value={formData.area} onChange={handleChange} />
            </NumberInput>
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl>
            <FormLabel>Liczba pokoi</FormLabel>
            <NumberInput min={1}>
              <NumberInputField name="rooms" value={formData.rooms} onChange={handleChange} />
            </NumberInput>
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl>
            <FormLabel>Piętro</FormLabel>
            <NumberInput>
              <NumberInputField name="floor" value={formData.floor} onChange={handleChange} />
            </NumberInput>
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl>
            <FormLabel>Rodzaj zabudowy</FormLabel>
            <Select name="building_type" value={formData.building_type} onChange={handleChange}>
              <option value="">Wybierz rodzaj</option>
              <option value="block">Blok</option>
              <option value="apartment">Apartamentowiec</option>
              <option value="house">Dom wolnostojący</option>
              <option value="semi_detached">Bliźniak</option>
              <option value="terraced">Szeregowiec</option>
            </Select>
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl>
            <FormLabel>Typ ogłoszeniodawcy</FormLabel>
            <Select name="developer_type" value={formData.developer_type} onChange={handleChange}>
              <option value="">Wybierz typ</option>
              <option value="private">Prywatny</option>
              <option value="developer">Deweloper</option>
              <option value="agency">Agencja</option>
            </Select>
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl>
            <FormLabel>Rok budowy</FormLabel>
            <Input
              type="number"
              name="construction_year"
              value={formData.construction_year}
              onChange={handleChange}
              placeholder="np. 2020"
            />
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl>
            <FormLabel>Rynek</FormLabel>
            <Select name="market_type" value={formData.market_type} onChange={handleChange}>
              <option value="">Wybierz typ</option>
              <option value="primary">Pierwotny</option>
              <option value="secondary">Wtórny</option>
            </Select>
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl>
            <FormLabel>Cena za metr</FormLabel>
            <NumberInput>
              <NumberInputField
                name="price_per_meter"
                value={formData.price_per_meter}
                onChange={handleChange}
              />
            </NumberInput>
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl>
            <FormLabel>Materiał budynku</FormLabel>
            <Select name="building_material" value={formData.building_material} onChange={handleChange}>
               <option value="">Wybierz materiał</option>
               <option value="brick">Cegła</option>
               <option value="wood">Drewno</option>
               <option value="breeze_block">Pustak</option>
               <option value="ceramic">Keramzyt</option>
               <option value="large_plate">Wielka płyta</option>
               <option value="concrete">Beton</option>
               <option value="silicate">Silikat</option>
               <option value="cellular_concrete">Beton komórkowy</option>
               <option value="reinforced_concrete">Żelbet</option>
              <option value="other">Inny</option>
             </Select>
          </FormControl>
        </GridItem>

        <GridItem colSpan={2}>
          <FormControl>
            <FormLabel>Dodatkowe informacje</FormLabel>
            <Textarea
              name="additional_info"
              value={formData.additional_info}
              onChange={handleChange}
              placeholder="Wprowadź dodatkowe informacje o nieruchomości..."
              rows={4}
            />
          </FormControl>
        </GridItem>
      </Grid>

      <Button
        type="submit"
        colorScheme="blue"
        isLoading={isLoading}
        width="100%"
        mt={6}
      >
        Generuj opis
      </Button>
    </Box>
  );
};