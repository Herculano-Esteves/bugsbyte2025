import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, StatusBar } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '@/hooks/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MoreScreen() {
  const { isDarkMode, toggleTheme } = useTheme();

  const options = [
    { label: 'Continente Pay', icon: 'https://i.imgur.com/nm49Ghs.jpeg' },
    { label: 'Tira-Vez', icon: 'https://i.imgur.com/plOeAYr.jpeg' },
    { label: 'O Seu Folheto', icon: 'https://i.imgur.com/YHsalwh.jpeg' },
    { label: 'Lojas', icon: 'https://i.imgur.com/g1TRwWp.jpeg' },
    { label: 'Estacionamento', icon: 'https://i.imgur.com/fqBUJ4J.jpeg' },
    { label: 'Outras Apps', icon: 'https://i.imgur.com/aaPrsVU.jpeg' },
    { label: 'Gestão de Conta', icon: 'https://i.imgur.com/5EpCJ0S.jpeg' },
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
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={isDarkMode ? '#1C1C1C' : '#FFF'}
      />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mais</Text>
      </View>
      <FlatList
        data={options}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.optionsList}
        ListFooterComponent={
          <View style={styles.optionContainer}>
            <View style={styles.optionContent}>
              {/* SVG para "Modo Noturno" */}
              <Svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke={isDarkMode ? '#FFF' : '#333'} // Cor dinâmica com base no tema
                style={styles.nightModeIcon} // Estilo específico para o ícone do Modo Noturno
              >
                <Path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
                />
              </Svg>
              <Text style={styles.optionLabel}>Modo Noturno</Text>
            </View>
            <TouchableOpacity
              style={[
                styles.customSwitch,
                isDarkMode ? styles.switchOn : styles.switchOff,
              ]}
              onPress={toggleTheme}
            >
              <View
                style={[
                  styles.switchThumb,
                  isDarkMode ? styles.thumbOn : styles.thumbOff,
                ]}
              />
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
      backgroundColor: isDarkMode ? '#1C1C1C' : '#FFF',
    },
    header: {
      backgroundColor: isDarkMode ? '#A91B1B' : '#F8F8F8',
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? '#444' : '#DDD',
    },
    headerTitle: {
      fontSize: 32,
      fontWeight: 'bold',
      color: isDarkMode ? '#FFF' : '#A91B1B',
    },
    optionsList: {
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 70,
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
      borderRadius: 20, // Torna os ícones redondos
      marginRight: 12,
    },
    nightModeIcon: {
      width: 30, // Reduzido para 30
      height: 30, // Reduzido para 30
      marginRight: 12,
    },
    optionLabel: {
      fontSize: 16,
      color: isDarkMode ? '#FFF' : '#333',
    },
    optionArrow: {
      fontSize: 18,
      color: isDarkMode ? '#FFF' : '#333',
    },
    customSwitch: {
      width: 50,
      height: 25,
      borderRadius: 15,
      justifyContent: 'center',
      paddingHorizontal: 5,
    },
    switchOn: {
      backgroundColor: '#A91B1B',
    },
    switchOff: {
      backgroundColor: '#DDD',
    },
    switchThumb: {
      width: 20,
      height: 20,
      borderRadius: 10,
    },
    thumbOn: {
      backgroundColor: '#FFF',
      alignSelf: 'flex-end',
    },
    thumbOff: {
      backgroundColor: '#FFF',
      alignSelf: 'flex-start',
    },
  });