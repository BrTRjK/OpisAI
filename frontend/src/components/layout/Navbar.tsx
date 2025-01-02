import React from 'react';
import { Box, Flex, Button, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box bg="blue.500" px={4} py={2}>
      <Flex justify="space-between" align="center" maxW="container.xl" mx="auto">
        <Text color="white" fontWeight="bold">
          Generator Opisów
        </Text>
        {user && (
          <Flex align="center" gap={4}>
            <Text color="white">
              {user.username}
            </Text>
            <Button onClick={handleLogout} size="sm" colorScheme="red">
              Wyloguj
            </Button>
          </Flex>
        )}
      </Flex>
    </Box>
  );
};