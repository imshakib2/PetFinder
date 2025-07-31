import React, { createContext, useContext, useState, useEffect } from 'react';

interface Pet {
  _id: string;
  name: string;
  type: string;
  breed: string;
  color: string;
  size: string;
  age: string;
  gender: string;
  description: string;
  status: string;
  location: {
    area: string;
    city: string;
  };
  dateReported: string;
  dateLostOrFound: string;
  images: string[];
  contactInfo: {
    name: string;
    email: string;
    phone: string;
  };
  reward: number;
}

interface PetContextType {
  pets: Pet[];
  recentPets: Pet[];
  searchPets: (query: string) => Promise<Pet[]>;
  getPetById: (id: string) => Promise<Pet>;
  reportPet: (petData: FormData) => Promise<void>;
  fetchPets: (filters?: any) => Promise<void>;
  fetchUserPets: () => Promise<{ pets: Pet[], statistics: any }>;
  isLoading: boolean;
}

const PetContext = createContext<PetContextType | undefined>(undefined);

export const usePets = () => {
  const context = useContext(PetContext);
  if (!context) {
    throw new Error('usePets must be used within a PetProvider');
  }
  return context;
};

export const PetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [recentPets, setRecentPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchRecentPets();
    // Also fetch all pets for profile activity
    fetchPets();
  }, []);

  const fetchRecentPets = async () => {
    try {
      const response = await fetch('/api/pets?limit=6');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const text = await response.text();
      if (!text) {
        console.warn('Empty response from server');
        setRecentPets([]);
        return;
      }
      const data = JSON.parse(text);
      setRecentPets(data.pets || []);
    } catch (error) {
      console.error('Error fetching recent pets:', error);
      setRecentPets([]);
    }
  };

  const fetchPets = async (filters = {}) => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          queryParams.append(key, filters[key]);
        }
      });
      const response = await fetch(`/api/pets?${queryParams}`);
      if (!response.ok) {
        console.error(`HTTP error! status: ${response.status}`);
        setPets([]);
        return;
      }
      const text = await response.text();
      if (!text) {
        console.warn('Empty response from server');
        setPets([]);
        return;
      }
      const data = JSON.parse(text);
      console.log('Fetched pets data:', data);
      setPets(data.pets || []);
    } catch (error) {
      console.error('Error fetching pets:', error);
      setPets([]);
    } finally {
      setIsLoading(false);
    }
  };

  const searchPets = async (query: string) => {
    try {
      const response = await fetch(`/api/pets/search/${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const text = await response.text();
      if (!text) {
        console.warn('Empty response from server');
        return [];
      }
      return JSON.parse(text);
    } catch (error) {
      console.error('Error searching pets:', error);
      return [];
    }
  };

  const getPetById = async (id: string) => {
    try {
      const response = await fetch(`/api/pets/${id}`);
      if (!response.ok) {
        throw new Error('Pet not found');
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  };

  const reportPet = async (petData: FormData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/pets', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: petData,
      });

      if (!response.ok) {
        throw new Error('Failed to report pet');
      }

      await fetchRecentPets(); // Refresh recent pets
    } catch (error) {
      throw error;
    }
  };

  const fetchUserPets = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return { pets: [], statistics: { totalReported: 0, reunitedPets: 0, activePets: 0, lostPets: 0, foundPets: 0 } };
      }

      const response = await fetch('/api/pets/user/my-pets', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error(`HTTP error! status: ${response.status}`);
        return { pets: [], statistics: { totalReported: 0, reunitedPets: 0, activePets: 0, lostPets: 0, foundPets: 0 } };
      }

      const text = await response.text();
      if (!text) {
        console.warn('Empty response from server');
        return { pets: [], statistics: { totalReported: 0, reunitedPets: 0, activePets: 0, lostPets: 0, foundPets: 0 } };
      }

      const data = JSON.parse(text);
      console.log('Fetched user pets data:', data);
      return {
        pets: data.pets || [],
        statistics: data.statistics || { totalReported: 0, reunitedPets: 0, activePets: 0, lostPets: 0, foundPets: 0 }
      };
    } catch (error) {
      console.error('Error fetching user pets:', error);
      return { pets: [], statistics: { totalReported: 0, reunitedPets: 0, activePets: 0, lostPets: 0, foundPets: 0 } };
    }
  };

  return (
    <PetContext.Provider value={{
      pets,
      recentPets,
      searchPets,
      getPetById,
      reportPet,
      fetchPets,
      fetchUserPets,
      isLoading
    }}>
      {children}
    </PetContext.Provider>
  );
};