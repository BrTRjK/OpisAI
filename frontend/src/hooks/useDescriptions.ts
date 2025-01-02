import { useState, useEffect } from 'react';
import api from '../utils/api';

interface Description {
  id: number;
  property_type: string;
  location: string;
  style: string;
  description: string;
  created_at: string;
}

export const useDescriptions = () => {
  const [descriptions, setDescriptions] = useState<Description[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDescriptions = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/history');
      setDescriptions(response.data);
      setError(null);
    } catch (err) {
      setError('Nie udało się pobrać historii opisów');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDescriptions();
  }, []);

  const addDescription = (newDescription: Description) => {
    setDescriptions(prev => [newDescription, ...prev]);
  };

  return {
    descriptions,
    isLoading,
    error,
    fetchDescriptions,
    addDescription
  };
};