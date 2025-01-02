import React from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  VStack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';

interface Description {
  id: number;
  property_type: string;
  location: string;
  style: string;
  description: string;
  created_at: string;
}

interface DescriptionHistoryProps {
  descriptions: Description[];
  onCopy: (description: string) => void;
}

export const DescriptionHistory: React.FC<DescriptionHistoryProps> = ({
  descriptions,
  onCopy,
}) => {
  const toast = useToast();

  const handleCopy = (description: string) => {
    onCopy(description);
    toast({
      title: "Skopiowano do schowka",
      status: "success",
      duration: 2000,
    });
  };

  return (
    <Box overflowX="auto">
      {descriptions.length === 0 ? (
        <Text textAlign="center" py={4}>
          Brak wygenerowanych opisów
        </Text>
      ) : (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Data</Th>
              <Th>Typ</Th>
              <Th>Lokalizacja</Th>
              <Th>Styl</Th>
              <Th>Opis</Th>
              <Th>Akcje</Th>
            </Tr>
          </Thead>
          <Tbody>
            {descriptions.map((desc) => (
              <Tr key={desc.id}>
                <Td>
                  {desc.created_at ? format(new Date(desc.created_at), 'dd.MM.yyyy HH:mm', { locale: pl }) : '-'}
                </Td>
                <Td>{desc.property_type}</Td>
                <Td>{desc.location}</Td>
                <Td>{desc.style}</Td>
                <Td>
                  <Text noOfLines={2}>{desc.description}</Text>
                </Td>
                <Td>
                  <Button
                    size="sm"
                    colorScheme="blue"
                    onClick={() => handleCopy(desc.description)}
                  >
                    Kopiuj
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );
};