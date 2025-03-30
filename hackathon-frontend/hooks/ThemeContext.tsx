import { Text } from 'react-native';
import React, { createContext, useContext, useState, useEffect } from 'react';
import * as Font from 'expo-font';

type ThemeContextType = {
  isDarkMode: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'Poppins-Regular': require('@/assets/fonts/Poppins-Regular.ttf'),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return null; // Opcional: exiba uma tela de carregamento
  }

  // Define a fonte como padrão para todos os textos
  Text.defaultProps = Text.defaultProps || {};
  Text.defaultProps.style = [{ fontFamily: 'Poppins-Regular' }, Text.defaultProps.style];

  
  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};