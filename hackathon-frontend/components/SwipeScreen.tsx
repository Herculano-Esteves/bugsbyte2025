import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';
const arrozCarolino = require('../assets/images/arrozCarolino.jpg');
const feijaoCatarino = require('../assets/images/feijaoCatarino.jpg');

interface Product {
  id: number;
  name: string;
  image: string; // URL da imagem do produto
  description: string;
}

export default function ProductsScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Dados mockados para teste
    setProducts([
      {
        id: 1,
        name: 'Arroz Carolino',
        image: arrozCarolino,
        description: 'Arroz integral saudável e nutritivo',
      },
      {
        id: 2,
        name: 'Feijão Catarino',
        image: feijaoCatarino, // Substitua por uma URL real
        description: 'Feijão catarino de alta qualidade',
      },
    ]);

    // Quando o back-end estiver pronto, descomente:
    // fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/products'); // Ajuste o endpoint
      setProducts(response.data);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    }
  };

  const handleLike = () => {
    console.log(`Gostou do produto: ${products[currentIndex].name}`);
    goToNextProduct();
  };

  const handleDislike = () => {
    console.log(`Não gostou do produto: ${products[currentIndex].name}`);
    goToNextProduct();
  };

  const goToNextProduct = () => {
    if (currentIndex < products.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0); // Volta ao primeiro produto se chegar ao fim
    }
  };

  if (products.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.noProductsText}>Nenhum produto disponível</Text>
      </View>
    );
  }

  const currentProduct = products[currentIndex];

  return (
    <View style={styles.container}>
      {/* Título e descrição */}
      <Text style={styles.screenTitle}>Swipe</Text>
      <Text style={styles.screenSubtitle}>
        Explore os produtos disponíveis e escolha os seus favoritos!
      </Text>

      {/* Card do produto */}
      <View style={styles.card}>
        <Image
          source={{ uri: currentProduct.image }}
          style={styles.productImage}
          resizeMode="cover"
        />
        <Text style={styles.productName}>{currentProduct.name}</Text>
        <Text style={styles.productDescription}>{currentProduct.description}</Text>
      </View>

      {/* Botões de interação */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.dislikeButton} onPress={handleDislike}>
          <Text style={styles.buttonText}>✖</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.likeButton} onPress={handleLike}>
          <Text style={styles.buttonText}>♥</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D32F2F', // Fundo vermelho
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF', // Texto branco para contraste
    marginBottom: 8,
  },
  screenSubtitle: {
    fontSize: 16,
    color: '#FFF', // Texto branco para contraste
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    width: '100%',
    maxWidth: 350,
    marginBottom: 20,
  },
  productImage: {
    width: '100%',
    height: 400,
    borderRadius: 10,
    marginBottom: 10,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  productDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '60%',
  },
  likeButton: {
    backgroundColor: '#FF5252',
    borderRadius: 50,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dislikeButton: {
    backgroundColor: '#FF9800',
    borderRadius: 50,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 24,
    color: '#FFF',
  },
  noProductsText: {
    fontSize: 18,
    color: '#FFF', // Texto branco para contraste
  },
});