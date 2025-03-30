import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useTheme } from '@/hooks/ThemeContext';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { isDarkMode } = useTheme();
  const router = useRouter();
  const styles = createStyles(isDarkMode);

  // Escolha da imagem com base no tema
  const swiperImageUri = isDarkMode
    ? 'https://i.imgur.com/cts9wy5.jpeg' // Substitua pela URL da imagem para o modo escuro
    : 'https://i.pinimg.com/736x/66/04/af/6604af29ee4ff2d5169f8c68b40aee47.jpg'; // URL da imagem para o modo claro

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>CARTÃO CONTINENTE</Text>
        </View>

        {/* Cartão de Boas-Vindas */}
        <View style={styles.welcomeCard}>
          <View>
            <Text style={styles.greeting}>Olá, Gonçalo 👋</Text>
            <Text style={styles.earned}>Já ganhou 0,00 €</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.topUpText}>Carregar saldo</Text>
          </TouchableOpacity>
        </View>

        {/* Ícones de Acesso Rápido */}
        <View style={styles.quickAccessContainer}>
          {[
            { label: 'Avaliar compras', image: 'https://i.imgur.com/qzllEw2.jpeg' },
            { label: 'Chat', image: 'https://i.imgur.com/aJDS1zv.jpeg', action: () => router.push('/chat') }, // Navega para o chat
            { label: 'Continente Pay', image: 'https://i.imgur.com/6CS28cP.jpeg' },
          ].map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.quickAccessItem}
              onPress={item.action}
            >
              <Image source={{ uri: item.image }} style={styles.quickAccessIcon} />
              <Text style={styles.quickAccessLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Seção de Destaque para o Swiper */}
        <View style={styles.swiperSection}>
          <Image
            source={{ uri: swiperImageUri }} // Imagem condicional com base no tema
            style={styles.swiperImage}
          />
          <Text style={styles.swiperTitle}>Experimente o nosso Swiper!</Text>
          <Text style={styles.swiperSubtitle}>
            Descubra produtos incríveis deslizando para a direita ou esquerda.
          </Text>
          <TouchableOpacity
            style={styles.swiperButton}
            onPress={() => router.push('/swiper')} // Navega para a aba do Swiper
          >
            <Text style={styles.swiperButtonText}>Ir para o Swiper</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: '#D32F2F', // Red background for the safe area
    },
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#1C1C1C' : '#F8F8F8', // Black or light gray for the main container
    },
    header: {
      backgroundColor: '#D32F2F', // Red
      padding: 20,
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#FFF',
    },
    welcomeCard: {
      backgroundColor: isDarkMode ? '#333' : '#FFF', // Dark gray or white
      borderRadius: 10,
      padding: 16,
      margin: 16,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 3,
    },
    greeting: {
      fontSize: 18,
      fontWeight: 'bold',
      color: isDarkMode ? '#FFF' : '#333', // White or dark gray
    },
    earned: {
      fontSize: 16,
      color: isDarkMode ? '#CCC' : '#666', // Light gray or medium gray
      marginTop: 4,
    },
    topUpText: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#D32F2F',
    },
    quickAccessContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginHorizontal: 16,
      marginBottom: 16,
    },
    quickAccessItem: {
      alignItems: 'center',
    },
    quickAccessIcon: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginBottom: 8,
    },
    quickAccessLabel: {
      fontSize: 12,
      color: isDarkMode ? '#FFF' : '#333', // White or dark gray
      textAlign: 'center',
    },
    swiperSection: {
      backgroundColor: isDarkMode ? '#333' : '#FFF', // Dark gray or white
      borderRadius: 10,
      padding: 16,
      marginHorizontal: 16,
      marginBottom: 16,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 3,
    },
    swiperImage: {
      width: '100%',
      height: 200,
      borderRadius: 10,
      marginBottom: 16,
    },
    swiperTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#D32F2F',
      marginBottom: 8,
    },
    swiperSubtitle: {
      fontSize: 14,
      color: isDarkMode ? '#CCC' : '#666', // Light gray or medium gray
      textAlign: 'center',
      marginBottom: 16,
    },
    swiperButton: {
      backgroundColor: '#D32F2F',
      borderRadius: 8,
      paddingVertical: 10,
      paddingHorizontal: 20,
    },
    swiperButtonText: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#FFF',
    },
  });