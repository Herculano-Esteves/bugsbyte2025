import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, StatusBar } from 'react-native';
import { useTheme } from '@/hooks/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MoreScreen() {
  const { isDarkMode, toggleTheme } = useTheme();

  const options = [
    { label: 'Continente Pay', icon: 'https://i.imgur.com/6CS28cP.jpeg' },
    { label: 'Tira-Vez', icon: 'https://i.imgur.com/plOeAYr.jpeg' },
    { label: 'O Seu Folheto', icon: 'https://i.imgur.com/YHsalwh.jpeg' },
    { label: 'Lojas', icon: 'https://i.imgur.com/g1TRwWp.jpeg' },
    { label: 'Estacionamento', icon: 'https://i.imgur.com/fqBUJ4J.jpeg' },
    { label: 'Outras Apps', icon: 'https://i.imgur.com/aaPrsVU.jpeg' },
    { label: 'Gestão de Conta', icon: 'https://i.imgur.com/aJDS1zv.jpeg' },
    { label: 'Ajuda', icon: 'https://i.imgur.com/cwJGXi1.jpeg' },
  ];

  const styles = createStyles(isDarkMode);

  const renderItem = ({ item }: { item: typeof options[0] }) => (
    <TouchableOpacity style={styles.optionContainer}>
      <View style={styles.optionContent}>
        <Image source={{ uri: item.icon }} style={styles.optionIcon} />
        <Text style={styles.optionLabel}>{item.label}</Text>
      </View>
      <Text style={styles.optionArrow}>›</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Configuração da Barra de Status apenas para esta tela */}
      <StatusBar
        barStyle="dark-content" // Força o texto preto na barra de status
        backgroundColor="#FFF" // Fundo branco para a barra de status
      />

      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mais</Text>
      </View>

      {/* Lista de Opções */}
      <FlatList
        data={options}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.optionsList}
        ListFooterComponent={
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.toggleButton} onPress={toggleTheme}>
              <Text style={styles.toggleButtonText}>
                Mudar para {isDarkMode ? 'Modo Claro' : 'Modo Escuro'}
              </Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const createStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: isDarkMode ? '#1C1C1C' : '#FFF', // Preto ou branco, dependendo do tema
    },
    header: {
      backgroundColor: isDarkMode ? '#A91B1B' : '#F8F8F8', // Vermelho mais escuro no modo escuro, cinza claro no modo claro
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? '#444' : '#DDD',
    },
    headerTitle: {
      fontSize: 32,
      fontWeight: 'bold',
      color: isDarkMode ? '#FFF' : '#A91B1B', // Branco no modo escuro, vermelho mais escuro no modo claro
    },
    optionsList: {
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 70, // Espaçamento extra para evitar sobreposição com a barra de navegação
    },
    optionContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? '#444' : '#EEE',
    },
    optionContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    optionIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 12,
    },
    optionLabel: {
      fontSize: 16,
      color: isDarkMode ? '#FFF' : '#333', // Branco ou cinza escuro
    },
    optionArrow: {
      fontSize: 18,
      color: isDarkMode ? '#FFF' : '#333', // Branco ou cinza escuro
    },
    buttonContainer: {
      marginTop: 16, // Espaçamento entre a lista e o botão
      paddingHorizontal: 16, // Alinhamento com a lista
    },
    toggleButton: {
      backgroundColor: '#A91B1B', // Vermelho mais escuro
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center', // Centraliza o texto
    },
    toggleButtonText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#FFF', // Branco
    },
  });