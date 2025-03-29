import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  Image
} from 'react-native';
import axios from 'axios';

export default function CouponsScreen() {
  const [coupons, setCoupons] = useState<{ 
    id: number; 
    discount: number; 
    title: string; 
    description: string; 
    validity: string; 
  }[]>([]);

  useEffect(() => {
    // Dados mockados para testes
    setCoupons([
      { 
        id: 1, 
        discount: 15, 
        title: 'Desconto Pizzaria', 
        description: '15% de desconto na Pizza', 
        validity: '2025-04-10',
        // Caso queiras mostrar uma imagem, coloca aqui a URI:
        // image: 'https://example.com/pizza.png'
      },
      { 
        id: 2, 
        discount: 25, 
        title: 'Desconto Supermercado', 
        description: '25% no supermercado', 
        validity: '2025-05-01',
        // image: 'https://example.com/supermarket.png'
      },
    ]);

    // Quando tiveres o backend:
    // fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/coupons');
      setCoupons(response.data);
    } catch (error) {
      console.error('Erro ao buscar cupons:', error);
    }
  };

  const renderCoupon = ({ item }: { item: { id: number; discount: number; title: string; description: string; validity: string } }) => {
    return (
      <View style={styles.couponCard}>
        {/* Se tiveres imagens, podes descomentar a Image abaixo e passar o link no objeto */}
        {/* <Image source={{ uri: item.image }} style={styles.productImage} /> */}
        
        <View style={styles.discountContainer}>
          <Text style={styles.discountText}>{item.discount}%</Text>
        </View>

        <View style={styles.couponInfo}>
          <Text style={styles.couponTitle}>{item.title}</Text>
          <Text style={styles.couponDescription}>{item.description}</Text>
          <Text style={styles.couponValidity}>Válido até {item.validity}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.buttonText}>Ver produto</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.buttonText}>Abrir câmara</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Caça Produtos</Text>
      <Text style={styles.screenSubtitle}>
        Descubra os Cupões de Desconto que andam à solta nas lojas
      </Text>

      <FlatList
        data={coupons}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCoupon}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D32F2F', // Fundo vermelho
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
  },
  screenSubtitle: {
    fontSize: 16,
    color: '#FFF',
    marginBottom: 16,
  },
  listContainer: {
    paddingBottom: 20,
  },
  couponCard: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 16,
  },
  // Se usares imagem de produto:
  productImage: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    marginRight: 10,
  },
  discountContainer: {
    backgroundColor: '#FF5252',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginRight: 10,
  },
  discountText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  couponInfo: {
    flex: 1,
  },
  couponTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  couponDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  couponValidity: {
    fontSize: 12,
    color: '#999',
  },
  buttonContainer: {
    marginLeft: 'auto',
    alignItems: 'flex-end',
  },
  actionButton: {
    backgroundColor: '#FF5252',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
