import React, { useState } from 'react';
import { ThemeProvider } from '@/hooks/ThemeContext';
import { Stack } from 'expo-router';
import LoginScreen from '@/components/LoginScreen';

export default function RootLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <LoginScreen onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </ThemeProvider>
  );
}