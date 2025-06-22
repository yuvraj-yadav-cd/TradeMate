import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const savedUser = await AsyncStorage.getItem('userData');
      if (savedUser) {
        setUserData(JSON.parse(savedUser));
      } else {
        // Set default user data
        const defaultUser = {
          name: 'John Doe',
          email: 'john.doe@example.com',
          phone: '+1 234 567 8900',
          address: '123 Main Street',
          city: 'New York',
          membershipLevel: 'Premium',
          memberSince: 'January 2024',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=JohnDoe&backgroundColor=purple'
        };
        await saveUserData(defaultUser);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const saveUserData = async (data) => {
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(data));
      setUserData(data);
      return true;
    } catch (error) {
      console.error('Error saving user data:', error);
      return false;
    }
  };

  return (
    <UserContext.Provider value={{ userData, saveUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);