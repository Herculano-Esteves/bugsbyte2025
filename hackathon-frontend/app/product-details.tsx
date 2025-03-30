import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter, useSearchParams } from 'expo-router';

export default function ProductDetails() {
  const { id } = useSearchParams();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalhes do Produto</Text>
      <Text style={styles.text}>ID do Produto: {id}</Text>
      <Text style={styles.text}>Aqui você pode exibir mais informações sobre o produto.</Text>
      <Text style={styles.text}>Adicione imagens, descrições e outros detalhes.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
  },
});