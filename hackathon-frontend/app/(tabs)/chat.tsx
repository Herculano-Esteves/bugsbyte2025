import React from 'react';
import { SafeAreaView, StyleSheet, StatusBar } from 'react-native';
import ChatComponent from '@/components/ChatComponent';

export default function ChatScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#D32F2F" />
      <ChatComponent />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#D32F2F', // Cor de fundo consistente com o tema
  },
});