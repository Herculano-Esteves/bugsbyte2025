import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/ThemeContext';

export default function ChatScreen() {
  const { isDarkMode } = useTheme();
  const [messages, setMessages] = useState([
    { id: '1', text: 'Olá! Como posso ajudar você hoje?', sender: 'AI' },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), text: input, sender: 'User' },
        { id: (Date.now() + 1).toString(), text: 'Resposta do AI (mock)', sender: 'AI' },
      ]);
      setInput('');
    }
  };

  const styles = createStyles(isDarkMode);

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.message,
              item.sender === 'AI' ? styles.aiMessage : styles.userMessage,
            ]}
          >
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
        contentContainerStyle={styles.messagesContainer}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Digite sua mensagem..."
          placeholderTextColor="#999"
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const createStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#1C1C1C' : '#FFF',
    },
    messagesContainer: {
      padding: 16,
    },
    message: {
      padding: 12,
      borderRadius: 8,
      marginBottom: 8,
      maxWidth: '80%',
    },
    aiMessage: {
      backgroundColor: '#EEE',
      alignSelf: 'flex-start',
    },
    userMessage: {
      backgroundColor: '#A91B1B',
      alignSelf: 'flex-end',
    },
    messageText: {
      color: isDarkMode ? '#FFF' : '#333',
    },
    inputContainer: {
      flexDirection: 'row',
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: isDarkMode ? '#444' : '#DDD',
    },
    input: {
      flex: 1,
      backgroundColor: isDarkMode ? '#333' : '#F8F8F8',
      borderRadius: 8,
      paddingHorizontal: 12,
      color: isDarkMode ? '#FFF' : '#333',
    },
    sendButton: {
      backgroundColor: '#A91B1B',
      borderRadius: 8,
      paddingHorizontal: 16,
      justifyContent: 'center',
      marginLeft: 8,
    },
    sendButtonText: {
      color: '#FFF',
      fontWeight: 'bold',
    },
  });