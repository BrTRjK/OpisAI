import React, { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  Flex,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { PropertyForm } from '../components/forms/PropertyForm';
import { DescriptionHistory } from '../components/DescriptionHistory';
import { useDescriptions } from '../hooks/useDescriptions';
import api from '../utils/api';

export const HomePage = () => {
  const { user, logout: logoutAction } = useAuthStore();
  const navigate = useNavigate();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { descriptions, addDescription } = useDescriptions();
  const [generatedDescription, setGeneratedDescription] = useState<string | null>(null);

  const handleLogoutClick = () => {
    logoutAction();
    navigate('/login');
  };

  const handleGenerateDescription = async (data: any) => {
    setIsLoading(true);
    try {
      const response = await api.post('/generation/generate', data);
      setGeneratedDescription(response.data.description);
      addDescription(response.data);
      toast({
        title: 'Opis wygenerowany pomyślnie',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Błąd generowania opisu',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyDescription = (description: string) => {
    navigator.clipboard.writeText(description);
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Flex justifyContent="space-between" alignItems="center">
          <Box>
            <Heading>Generator Opisów Nieruchomości</Heading>
            {user && <Text>Witaj, {user.username}!</Text>}
          </Box>
          <Button onClick={handleLogoutClick} colorScheme="red">
            Wyloguj się
          </Button>
        </Flex>

        <Tabs>
          <TabList>
            <Tab>Generator</Tab>
            <Tab>Historia opisów</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <Box bg="white" p={6} borderRadius="md" shadow="md">
                <PropertyForm 
                  onSubmit={handleGenerateDescription}
                  isLoading={isLoading}
                />
                {generatedDescription && (
                  <Box mt={6}>
                    <Heading size="md" mb={4}>Wygenerowany opis:</Heading>
                    <Alert status="success" mb={4}>
                      <AlertIcon />
                      <Text>{generatedDescription}</Text>
                    </Alert>
                    <Flex gap={4}>
                      <Button
                        onClick={() => navigator.clipboard.writeText(generatedDescription)}
                        colorScheme="blue"
                      >
                        Kopiuj do schowka
                      </Button>
                    </Flex>
                  </Box>
                )}
              </Box>
            </TabPanel>
            <TabPanel>
              <Box bg="white" p={6} borderRadius="md" shadow="md">
                <DescriptionHistory 
                  descriptions={descriptions}
                  onCopy={handleCopyDescription}
                />
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Container>
  );
};