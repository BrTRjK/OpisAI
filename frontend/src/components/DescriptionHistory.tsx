import { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Badge,
  Button,
  useToast,
  Select,
  Flex,
  Icon,
} from '@chakra-ui/react';
import axios from 'axios';
import jsPDF from 'jspdf';
import { FiDownload } from 'react-icons/fi';

interface Description {
  id: number;
  property_type: string;
  offer_type: string;
  style: string;
  location: string;
  area: number;
  description: string;
  created_at: string;
}

interface DescriptionHistoryProps {
  refreshTrigger: boolean;
}

type SortOption = 'date-desc' | 'date-asc' | 'location' | 'property-type';

export default function DescriptionHistory({ refreshTrigger }: DescriptionHistoryProps) {
  const [descriptions, setDescriptions] = useState<Description[]>([]);
  const [filteredDescriptions, setFilteredDescriptions] = useState<Description[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');
  const [filterPropertyType, setFilterPropertyType] = useState<string>('');
  const [filterOfferType, setFilterOfferType] = useState<string>('');
  const toast = useToast();

  const fetchHistory = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:8001/api/v1/history');
      setDescriptions(response.data);
    } catch (error) {
      toast({
        title: 'Błąd',
        description: 'Nie udało się pobrać historii opisów',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sortDescriptions = (data: Description[], sortOption: SortOption) => {
    const sorted = [...data];
    switch (sortOption) {
      case 'date-desc':
        return sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      case 'date-asc':
        return sorted.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      case 'location':
        return sorted.sort((a, b) => a.location.localeCompare(b.location));
      case 'property-type':
        return sorted.sort((a, b) => a.property_type.localeCompare(b.property_type));
      default:
        return sorted;
    }
  };

  const filterDescriptions = (data: Description[]) => {
    return data.filter(desc => 
      (!filterPropertyType || desc.property_type === filterPropertyType) &&
      (!filterOfferType || desc.offer_type === filterOfferType)
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pl-PL');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Skopiowano',
      description: 'Opis został skopiowany do schowka',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  const exportToPDF = (desc: Description) => {
    try {
      const doc = new jsPDF();
      
      // Dodaj nagłówek
      doc.setFontSize(16);
      doc.text(`Opis nieruchomości - ${desc.location}`, 20, 20);
      
      // Dodaj metadane
      doc.setFontSize(12);
      doc.text(`Typ: ${desc.property_type}`, 20, 40);
      doc.text(`Oferta: ${desc.offer_type}`, 20, 50);
      doc.text(`Powierzchnia: ${desc.area} m²`, 20, 60);
      doc.text(`Data utworzenia: ${formatDate(desc.created_at)}`, 20, 70);
      
      // Dodaj opis
      doc.setFontSize(12);
      const splitText = doc.splitTextToSize(desc.description, 170);
      doc.text(splitText, 20, 90);
      
      // Zapisz PDF
      doc.save(`opis-nieruchomości-${desc.location}.pdf`);

      toast({
        title: 'Sukces!',
        description: 'Opis został wyeksportowany do PDF',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Błąd',
        description: 'Nie udało się wyeksportować opisu do PDF',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [refreshTrigger]);

  useEffect(() => {
    const sortedData = sortDescriptions(descriptions, sortBy);
    const filteredData = filterDescriptions(sortedData);
    setFilteredDescriptions(filteredData);
  }, [descriptions, sortBy, filterPropertyType, filterOfferType]);

  const uniquePropertyTypes = Array.from(new Set(descriptions.map(desc => desc.property_type)));
  const uniqueOfferTypes = Array.from(new Set(descriptions.map(desc => desc.offer_type)));

  if (isLoading) {
    return <Box p={4}>Ładowanie historii...</Box>;
  }

  return (
    <Box p={4}>
      <Heading size="md" mb={4}>Historia wygenerowanych opisów</Heading>
      
      <Flex gap={4} mb={4} direction={{ base: 'column', md: 'row' }}>
        <Select 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          placeholder="Sortuj według..."
          maxW="200px"
        >
          <option value="date-desc">Najnowsze</option>
          <option value="date-asc">Najstarsze</option>
          <option value="location">Lokalizacja</option>
          <option value="property-type">Typ nieruchomości</option>
        </Select>

        <Select
          value={filterPropertyType}
          onChange={(e) => setFilterPropertyType(e.target.value)}
          placeholder="Filtruj po typie"
          maxW="200px"
        >
          {uniquePropertyTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </Select>

        <Select
          value={filterOfferType}
          onChange={(e) => setFilterOfferType(e.target.value)}
          placeholder="Filtruj po ofercie"
          maxW="200px"
        >
          {uniqueOfferTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </Select>
        
        {(filterPropertyType || filterOfferType) && (
          <Button 
            onClick={() => {
              setFilterPropertyType('');
              setFilterOfferType('');
            }}
            size="sm"
          >
            Wyczyść filtry
          </Button>
        )}
      </Flex>

      {filteredDescriptions.length === 0 ? (
        <Text>Brak wygenerowanych opisów</Text>
      ) : (
        <Accordion allowMultiple>
          {filteredDescriptions.map((desc) => (
            <AccordionItem key={desc.id}>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  <Text fontWeight="bold">{desc.location} - {desc.property_type}</Text>
                  <Text fontSize="sm" color="gray.600">
                    {formatDate(desc.created_at)}
                  </Text>
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4}>
                <VStack align="stretch" spacing={3}>
                  <Box>
                    <Badge colorScheme="blue" mr={2}>{desc.offer_type}</Badge>
                    <Badge colorScheme="green" mr={2}>{desc.style}</Badge>
                    <Badge colorScheme="purple">{desc.area} m²</Badge>
                  </Box>
                  <Text whiteSpace="pre-wrap">{desc.description}</Text>
                  <Flex gap={2}>
                    <Button 
                      size="sm" 
                      onClick={() => copyToClipboard(desc.description)}
                      colorScheme="blue"
                      variant="outline"
                    >
                      Kopiuj opis
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => exportToPDF(desc)}
                      colorScheme="green"
                      variant="outline"
                      leftIcon={<Icon as={FiDownload} />}
                    >
                      Eksportuj do PDF
                    </Button>
                  </Flex>
                </VStack>
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </Box>
  );
}