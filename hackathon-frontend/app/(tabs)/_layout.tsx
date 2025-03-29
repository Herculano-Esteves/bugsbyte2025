import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#D32F2F', // Cor vermelha para a aba ativa
          tabBarInactiveTintColor: '#687076', // Cor cinza para abas inativas
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: [
            Platform.select({
              ios: {
                position: 'absolute',
                backgroundColor: '#FFF', // Fundo branco para a aba
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                height: 70,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -2 },
                shadowOpacity: 0.1,
                shadowRadius: 5,
              },
              default: {
                backgroundColor: '#FFF',
                height: 70,
              },
            }),
            styles.tabBarStyle,
          ],
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Coupons',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="pricetag" color={color} />,
          }}
        />
        <Tabs.Screen
          name="swiper"
          options={{
            title: 'Swiper',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="swap-horizontal" color={color} />,
          }}
        />
        <Tabs.Screen
          name="account"
          options={{
            title: 'Conta',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="person" color={color} />,
          }}
        />
      </Tabs>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  tabBarStyle: {
    borderTopWidth: 0,
    elevation: 0,
  },
});