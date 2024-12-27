import React from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../utils/api';
import { useAuthStore } from '../../store/authStore';

export const LoginForm = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  
  const navigate = useNavigate();
  const toast = useToast();
  const setToken = useAuthStore(state => state.setToken);
  const setUser = useAuthStore(state => state.setUser);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      
      navigate('/'); // Przekieruj do strony głównej
    } catch (error) {
      toast({
        title: 'Błąd logowania',
        description: 'Nieprawidłowy email lub hasło',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit} width="100%" maxW="400px">
      <VStack spacing={4}>
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