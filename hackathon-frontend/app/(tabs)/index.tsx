import React from 'react';
import CouponsScreen from '../../components/CouponsScreen';
import { useTheme } from '@/hooks/ThemeContext';

export default function CouponsTab() {
  const { isDarkMode } = useTheme();

  return <CouponsScreen isDarkMode={isDarkMode} />;
}