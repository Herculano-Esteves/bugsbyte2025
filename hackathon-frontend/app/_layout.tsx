import React, { useState } from 'react';
import { ThemeProvider } from '@/hooks/ThemeContext';
import { UserProvider } from '@/hooks/UserContext';
import { Stack } from 'expo-router';
import LoginScreen from '@/components/LoginScreen';

export default function RootLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return (
      <UserProvider>
        <LoginScreen onLogin={() => setIsAuthenticated(true)} />
      </UserProvider>
    );
  }

  return (
    <UserProvider>
      <ThemeProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </ThemeProvider>
    </UserProvider>
  );
}