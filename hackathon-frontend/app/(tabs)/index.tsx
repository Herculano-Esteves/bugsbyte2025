// app/index.tsx (se tiveres o Expo Router)
// ou App.tsx, se for um projeto Expo tradicional

import React from 'react';
import { View } from 'react-native';
import CouponsScreen from '../../components/CouponsScreen';

export default function Home() {
  return (
    <View style={{ flex: 1 }}>
      <CouponsScreen />
    </View>
  );
}


