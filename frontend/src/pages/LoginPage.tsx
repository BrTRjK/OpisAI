import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Link as ChakraLink,
  VStack,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { LoginForm } from '../components/auth/LoginForm';

export const LoginPage = () => {
  return (
    <Container maxW="container.sm" py={8}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading>Logowanie</Heading>
          <Text mt={2} color="gray.600">
            Zaloguj się do swojego konta
          </Text>
        </Box>
        
        <LoginForm />
        
        <Text textAlign="center">
          Nie masz konta?{' '}
          <ChakraLink as={RouterLink} to="/register" color="blue.500">
            Zarejestruj się
          </ChakraLink>
        </Text>
      </VStack>
    </Container>
  );
};