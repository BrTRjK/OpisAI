import {
  Box,
  Container,
  Heading,
  Text,
  Link as ChakraLink,
  VStack,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { RegisterForm } from '../components/auth/RegisterForm';

export const RegisterPage = () => {
  return (
    <Container maxW="container.sm" py={8}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading>Rejestracja</Heading>
          <Text mt={2} color="gray.600">
            Utwórz nowe konto
          </Text>
        </Box>
        
        <RegisterForm />
        
        <Text textAlign="center">
          Masz już konto?{' '}
          <ChakraLink as={RouterLink} to="/login" color="blue.500">
            Zaloguj się
          </ChakraLink>
        </Text>
      </VStack>
    </Container>
  );
};