import React from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
  Text,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../utils/api';
import { useAuthStore } from '../../store/authStore';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const toast = useToast();
  const setToken = useAuthStore(state => state.setToken);
  const setUser = useAuthStore(state => state.setUser);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { access_token } = await authApi.login(email, password);
      setToken(access_token);
      
      // Pobierz dane użytkownika
      const userData = await authApi.getCurrentUser();
      setUser(userData);

      toast({
        title: 'Zalogowano pomyślnie',
        status: 'success',
        duration: 3000,
      });
      
      navigate('/');
    } catch (error: any) {
      // Sprawdź typ błędu
      if (error.response?.status === 401) {
        setError('Nieprawidłowy email lub hasło');
      } else if (error.response?.status === 404) {
        setError('Nie istnieje konto z podanym adresem email');
      } else if (error.message === 'Network Error') {
        setError('Problem z połączeniem z serwerem. Sprawdź czy backend jest uruchomiony.');
      } else {
        setError('Wystąpił nieoczekiwany błąd');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit} width="100%" maxW="400px">
      <VStack spacing={4}>
        {error && (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            {error}
          </Alert>
        )}

        <FormControl isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Hasło</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormControl>

        <Button
          type="submit"
          colorScheme="blue"
          width="100%"
          isLoading={isLoading}
        >
          Zaloguj się
        </Button>
      </VStack>
    </Box>
  );
};