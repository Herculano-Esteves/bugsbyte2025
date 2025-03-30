import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Slot } from 'expo-router';
import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, Image, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { useTheme } from '@/hooks/ThemeContext';

export default function TabLayout() {
  const { isDarkMode } = useTheme(); // Access the theme context

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#D32F2F', // Red for active tab
          tabBarInactiveTintColor: '#687076', // Grey for inactive tabs
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: {
            backgroundColor: isDarkMode ? '#000' : '#FFF', // Black for dark mode, white for light mode
            height: 70, // Height of the tab bar
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 5,  
            elevation: 5, // Ensure shadow is applied on Android
            borderTopWidth: 1, // Add a border to separate the tab bar
            borderTopColor: isDarkMode ? '#444' : '#DDD', // Border color based on theme
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: 'Início',
            tabBarIcon: ({ focused }) => (
              <View>
                <Svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke={focused ? 'red' : '#687076'} // Red when focused, grey otherwise
                  fill="none"
                  style={styles.tabIcon}
                >
                  <Path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                  />
                </Svg>
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="cupoes"
          options={{
            title: 'Cupões',
            tabBarIcon: ({ focused }) => (
              <View>
                <Svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke={focused ? 'red' : '#687076'} // Red when focused, grey otherwise
                  fill="none"
                  style={styles.tabIcon}
                >
                  <Path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z"
                  />
                </Svg>
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="swiper"
          options={{
            title: 'Swiper',
            tabBarIcon: ({ focused }) => (
              <Image
                source={{
                  uri: focused
                    ? 'https://i.imgur.com/TslSjhX.png'
                    : 'https://i.imgur.com/V7cpNqT.png',
                }}
                style={styles.tabIcon}
              />
            ),
          }}
        />
        <Tabs.Screen
                  name="chat"
                  options={{
                    title: 'Chat',
                    tabBarIcon: ({ focused }) => (
                      <View>
                        <Svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke={focused ? 'red' : '#687076'} // Red when focused, grey otherwise
                          fill="none"
                          style={styles.tabIcon}
                        >
                          <Path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 20.25c4.97 0 9-3.14 9-7.5s-4.03-7.5-9-7.5-9 3.14-9 7.5c0 1.61.63 3.1 1.69 4.31-.43 1.72-1.3 3.19-1.31 3.21a.375.375 0 0 0 .53.46c.02-.01 2.02-1.01 3.62-2.01a10.93 10.93 0 0 0 4.47.98Z"
                          />
                        </Svg>
                      </View>
                    ),
                  }}
                />
        <Tabs.Screen
          name="more"
          options={{
            title: 'Mais',
            tabBarIcon: ({ focused }) => (
              <View>
                <Svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke={focused ? 'red' : '#687076'} // Red when focused, grey otherwise
                  fill="none"
                  style={styles.tabIcon}
                >
                  <Path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                  />
                </Svg>
              </View>
            ),
          }}
        />
      </Tabs>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  tabIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
});