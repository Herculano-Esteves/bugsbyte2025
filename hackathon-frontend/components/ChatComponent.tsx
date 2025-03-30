import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { useTheme } from '@/hooks/ThemeContext';

export default function ChatComponent() {
  const { isDarkMode } = useTheme();
  const [messages, setMessages] = useState([
    { id: '1', text: 'Olá! Como posso ajudar você hoje?', sender: 'AI' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage = { id: Date.now().toString(), text: input, sender: 'User' };
      setMessages((prev) => [...prev, userMessage]);
      setInput('');
      setLoading(true);

      try {
        const response = await fetch('http://10.14.0.128:8000/chatbot/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: input }),
        });

        if (!response.ok) {
          throw new Error('Erro ao se comunicar com o backend.');
        }

        const data = await response.json();
        const aiMessage = { id: Date.now().toString(), text: data.message, sender: 'AI' };
        setMessages((prev) => [...prev, aiMessage]);
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível enviar a mensagem.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const styles = createStyles(isDarkMode);

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ChatBot</Text>
      </View>

      {/* Lista de mensagens */}
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
            <Text
              style={
                item.sender === 'AI'
                  ? styles.aiMessageText
                  : styles.userMessageText
              }
            >
              {item.text}
            </Text>
          </View>
        )}
        contentContainerStyle={styles.messagesContainer}
      />

      {/* Campo de entrada */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Digite sua mensagem..."
          placeholderTextColor="#999"
          editable={!loading}
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSend}
          disabled={loading}
        >
          <Text style={styles.sendButtonText}>{loading ? 'Enviando...' : 'Enviar'}</Text>
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
    header: {
      backgroundColor: '#D32F2F',
      padding: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#FFF',
    },
    messagesContainer: {
      flexGrow: 1,
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
      backgroundColor: '#D32F2F',
      alignSelf: 'flex-end',
    },
    aiMessageText: {
      color: '#333',
    },
    userMessageText: {
      color: '#FFF',
    },
    inputContainer: {
      flexDirection: 'row',
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: isDarkMode ? '#444' : '#DDD',
      backgroundColor: isDarkMode ? '#333' : '#F8F8F8',
    },
    input: {
      flex: 1,
      backgroundColor: isDarkMode ? '#444' : '#FFF',
      borderRadius: 8,
      paddingHorizontal: 12,
      color: isDarkMode ? '#FFF' : '#333',
    },
    sendButton: {
      backgroundColor: '#D32F2F',
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