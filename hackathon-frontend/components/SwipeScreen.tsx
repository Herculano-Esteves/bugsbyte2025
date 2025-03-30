import React, { useState, useCallback } from 'react';
import { useRouter } from 'expo-router'; // Importar o hook useRouter
import Icon from 'react-native-vector-icons/FontAwesome';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  interpolate,
  Extrapolate,
  runOnJS,
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { useFocusEffect } from '@react-navigation/native';


const SCREEN_WIDTH = Dimensions.get('window').width;

const products = [
  {
    id: 1,
    name: 'Arroz Carolino',
    image: require('../assets/images/arrozCarolino.jpg'),
    description: 'Arroz integral saudável e nutritivo',
  },
  {
    id: 2,
    name: 'Feijão Catarino',
    image: require('../assets/images/feijaoCatarino.jpg'),
    description: 'Feijão catarino de alta qualidade',
  },
  {
    id: 3,
    name: 'Azeite Virgem Extra',
    image: 'https://www.worten.pt/i/0b655be7732a8a73b9957875940ba3e7aed6e973',
    description: 'Azeite virgem extra de primeira qualidade',
  },
  {
    id: 4,
    name: 'Pão de Trigo',
    image: 'https://www.continente.pt/dw/image/v2/BDVS_PRD/on/demandware.static/-/Sites-col-master-catalog/default/dwdf4d85d6/images/col/785/7855600-frente.png?sw=2000&sh=2000',
    description: 'Pão de trigo fresco e crocante',
  }
  // {
  //   id: 5,
  //   name: 'Leite Magro',
  //   image: 'https://www.continente.pt/dw/image/v2/BDVS_PRD/on/demandware.static/-/Sites-col-master-catalog/default/dw6a5d60b5/images/col/687/6879889-hero.jpg?sw=280&sh=280',
  //   description: 'Leite magro com baixo teor de gordura',
  // },
  // {
  //   id: 6,
  //   name: 'Ovos Biológicos',
  //   image: 'https://www.continente.pt/dw/image/v2/BDVS_PRD/on/demandware.static/-/Sites-col-master-catalog/default/dwe8e16ee4/images/col/745/7453999-cima.jpg?sw=2000&sh=2000',
  //   description: 'Ovos biológicos de galinhas felizes',
  // },
  // {
  //   id: 7,
  //   name: 'Maçãs Gala',
  //   image: 'https://www.continente.pt/dw/image/v2/BDVS_PRD/on/demandware.static/-/Sites-col-master-catalog/default/dw750176fb/images/col/784/7848011-hero.jpg?sw=2000&sh=2000',
  //   description: 'Maçãs gala frescas e saborosas',
  // },
  // {
  //   id: 8,
  //   name: 'Bananas da Madeira',
  //   image: 'https://www.continente.pt/dw/image/v2/BDVS_PRD/on/demandware.static/-/Sites-col-master-catalog/default/dwd4c8df36/images/col/207/2076480-frente.jpg?sw=2000&sh=2000',
  //   description: 'Bananas da Madeira frescas e doces',
  // },
  // {
  //   id: 9,
  //   name: 'Morangos Biológicos',
  //   image: 'https://www.continente.pt/dw/image/v2/BDVS_PRD/on/demandware.static/-/Sites-col-master-catalog/default/dw07014595/images/col/826/8266638-topshot.jpg?sw=2000&sh=2000',
  //   description: 'Morangos biológicos de qualidade superior',
  // },
  // {
  //   id: 10,
  //   name: 'Cenouras Biológicas',
  //   image: 'https://www.continente.pt/dw/image/v2/BDVS_PRD/on/demandware.static/-/Sites-col-master-catalog/default/dw45098f83/images/col/738/7382406-frente.jpg?sw=2000&sh=2000',
  //   description: 'Cenouras biológicas frescas e saborosas',
  // }
];

import { useUser } from '@/hooks/UserContext'; // Import the UserContext hook

export default function SwipeScreen() {
  const { userId } = useUser(); // Retrieve userId from the context
  const [coupons, setCoupons] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCoupons, setSelectedCoupons] = useState<number[]>([]);
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const router = useRouter();

  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);


  const fetchCoupons = async () => {
    try {
      console.log('Buscando cupons...');
      const response = await fetch('http://10.14.0.128:8000/cuppons/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erro na resposta do servidor:', errorData);
        Alert.alert('Erro', 'Algo deu errado ao buscar os cupons.');
        return;
      }

      const data = await response.json();
      setCoupons(data); // Atualiza o estado com os cupons recebidos
      console.log('Cupons recebidos:', data);
    } catch (error) {
      console.error('Erro na requisição:', error);
      Alert.alert('Erro', 'Não foi possível buscar os cupons.');
    }
  };

  // Função para buscar produtos do backend
  const fetchProducts = async () => {
    try {
      console.log('Buscando produtos para o usuário:', userId);
      const response = await fetch('http://10.14.0.128:8000/swipes/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: Number(userId), // Garante que userId seja enviado como inteiro
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erro na resposta do servidor:', errorData);
        Alert.alert('Erro', 'Algo deu errado ao buscar os produtos.');
        return;
      }

      const data = await response.json();
      setProducts(data); // Atualiza o estado com os produtos recebidos
    } catch (error) {
      console.error('Erro na requisição:', error);
      Alert.alert('Erro', 'Não foi possível buscar os produtos.');
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (userId) {
        fetchProducts();
        fetchCoupons();
      }
    }, [userId])
  );
  
  const confirmSwipe = async (type: boolean, sku: number) => {
    try {
      const response = await fetch('http://10.14.0.128:8000/swipes/confirm/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: Number(userId), // Garante que userId seja enviado como inteiro
          type: type, // true para "gosto", false para "não gosto"
          sku: sku, // SKU do produto
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erro na resposta do servidor:', errorData);
        Alert.alert('Erro', 'Algo deu errado ao confirmar o swipe.');
        return;
      }
  
      const data = await response.json();
      console.log('Swipe confirmado com sucesso:', data);
    } catch (error) {
      console.error('Erro na requisição:', error);
      Alert.alert('Erro', 'Não foi possível confirmar o swipe.');
    }
  };

  const sendSelectedCoupons = async () => {
    try {
      const response = await fetch('http://10.14.0.128:8000/cuppons/add/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: Number(userId), // Garante que o userId seja enviado como inteiro
          sku: selectedCoupons[0], // Primeiro cupom selecionado
          sku2: selectedCoupons[1], // Segundo cupom selecionado
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erro na resposta do servidor:', errorData);
        Alert.alert('Erro', 'Algo deu errado ao enviar os cupons.');
        return;
      }
  
      const data = await response.json();
      console.log('Cupons enviados com sucesso:', data);
      Alert.alert('Sucesso', 'Cupons enviados com sucesso!');
    } catch (error) {
      console.error('Erro na requisição:', error);
      Alert.alert('Erro', 'Não foi possível enviar os cupons.');
    }
  };

  const handleSwipe = (direction) => {
    if (currentIndex >= products.length) return;
    console.log(
      direction === 'right'
        ? `Gostou do produto: ${products[currentIndex].name}`
        : `Não gostou do produto: ${products[currentIndex].name}`
    );
    runOnJS(goToNextProduct)();
  };

  const goToNextProduct = () => {
    if (currentIndex < products.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    } else {
      setCurrentIndex(products.length);
      console.log('Todos os produtos foram exibidos');
    }
    translateX.value = 0;
    rotate.value = 0;
  };

  const handleConfirm = () => {
    setIsConfirmed(true); // Define que a confirmação foi feita
    setConfirmationMessage('Resgate seus cupons na aba cupons');
    console.log('Cupons selecionados:', selectedCoupons);

    // Redirecionar para a aba de cupons
    router.push('/(tabs)/cupoes'); // Caminho para a aba de cupons
  };

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startX = translateX.value;
    },
    onActive: (event, ctx) => {
      translateX.value = ctx.startX + event.translationX;
      rotate.value = (event.translationX / SCREEN_WIDTH) * 15;
    },
    onEnd: (event) => {
      if (event.translationX > 150) {
        translateX.value = withSpring(SCREEN_WIDTH, {}, () => runOnJS(handleSwipe)('right'));
      } else if (event.translationX < -150) {
        translateX.value = withSpring(-SCREEN_WIDTH, {}, () => runOnJS(handleSwipe)('left'));
      } else {
        translateX.value = withSpring(0);
        rotate.value = withSpring(0);
      }
    },
  });

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  const checkStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [0, SCREEN_WIDTH * 0.25],
      [0, 1],
      Extrapolate.CLAMP
    ),
    transform: [
      {
        scale: interpolate(
          translateX.value,
          [0, SCREEN_WIDTH * 0.25],
          [0.5, 1.5],
          Extrapolate.CLAMP
        ),
      },
    ],
  }));

  const crossStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [0, -SCREEN_WIDTH * 0.25],
      [0, 1],
      Extrapolate.CLAMP
    ),
    transform: [
      {
        scale: interpolate(
          translateX.value,
          [0, -SCREEN_WIDTH * 0.25],
          [0.5, 1.5],
          Extrapolate.CLAMP
        ),
      },
    ],
  }));

  const toggleCouponSelection = (sku: number) => {
    setSelectedCoupons((prevSelected) => {
      if (prevSelected.includes(sku)) {
        // Remove o cupom se já estiver selecionado
        return prevSelected.filter((couponSku) => couponSku !== sku);
      } else if (prevSelected.length < 2) {
        // Adiciona o cupom se menos de 2 estiverem selecionados
        return [...prevSelected, sku];
      }
      // Retorna o estado atual se já houver 2 selecionados
      return prevSelected;
    });
  };


  if (currentIndex >= products.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.screenTitle}>Parabéns!</Text>
        <Text style={styles.screenSubtitle}>
          Você avaliou todos os produtos. Estas são as suas recompensas.
        </Text>

        {/* Exibe os cupons e o botão Confirmar apenas se não estiver confirmado */}
        {!isConfirmed ? (
          <>
            <Text style={styles.chooseTwoText}>Escolha apenas dois cupons:</Text>
            <ScrollView contentContainerStyle={styles.couponsContainer}>
              {coupons.map((coupon) => (
                <View key={coupon.sku} style={styles.couponCard}>
                  <Image source={{ uri: coupon.image_url }} style={styles.couponImage} />
                  <View style={styles.couponInfo}>
                    <Text style={styles.couponTitle}>Cupao 10% de desconto no produto {coupon.name}</Text>
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.selectionBox,
                      selectedCoupons.includes(coupon.sku) && styles.selectionBoxSelected,
                    ]}
                    onPress={() => toggleCouponSelection(coupon.sku)}
                  >
                    {selectedCoupons.includes(coupon.sku) && (
                      <Icon name="check" size={28} color="#FFF" />
                    )}
                  </TouchableOpacity>
                </View>
              ))}

              {selectedCoupons.length === 2 && (
                <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
                  <Text style={styles.confirmButtonText}>Confirmar</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </>
        ) : (
          // Centraliza a mensagem de confirmação
          <View style={styles.confirmationContainer}>
            <Text style={styles.confirmationMessage}>{confirmationMessage}</Text>
          </View>
        )}
      </View>
    );
  }
  const currentProduct = products[currentIndex];

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Swipe</Text>
      <Text style={styles.screenSubtitle}>
        Explore os produtos disponíveis e escolha os seus favoritos!
      </Text>
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[styles.card, animatedCardStyle]}>
          <Image
            source={currentProduct.image}
            style={styles.productImage}
            resizeMode="cover"
          />
          <Text style={styles.productName}>{currentProduct.name}</Text>
          <Text style={styles.productDescription}>{currentProduct.description}</Text>

          {/* Ícone de "Gosto" */}
          <Animated.View style={[styles.checkIcon, checkStyle]}>
            <Icon name="check" size={40} color="green" />
          </Animated.View>

          {/* Ícone de "Não gosto" */}
          <Animated.View style={[styles.crossIcon, crossStyle]}>
            <Icon name="times" size={40} color="orange" />
          </Animated.View>
        </Animated.View>
      </PanGestureHandler>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.dislikeButton} onPress={() => handleSwipe('left')}>
          <Text style={styles.buttonText}>✖</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.likeButton} onPress={() => handleSwipe('right')}>
          <Text style={styles.buttonText}>♥</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const iconContainer = {
  position: 'absolute',
  top: 25,
  zIndex: 10,
};

const styles = StyleSheet.create({
  couponsContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingBottom: 40, // Espaço para o botão
    width: '100%', // Garante que os cupons ocupem toda a largura
  },
  couponCard: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 16,
    flexDirection: 'row', // Alinha o conteúdo horizontalmente
    alignItems: 'center',
    justifyContent: 'space-between', // Garante que os elementos fiquem nas extremidades
    width: 370, // Largura do cartão
    marginBottom: 16,
    alignSelf: 'center', // Centraliza o cupom horizontalmente
    elevation: 3,
  },
  couponImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 16,
  },
  couponInfo: {
    flex: 1, // Faz o texto ocupar o espaço restante
  },
  selectionBox: {
    width: 32,
    height: 32,
    borderWidth: 2,
    borderColor: '#999',
    borderRadius: 4,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectionBoxSelected: {
    backgroundColor: '#4CAF50', // Cor verde para indicar seleção
    borderColor: '#4CAF50',
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    width: 370,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center', // Centraliza o botão
    marginTop: 16,
  },
  confirmButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  confirmationMessage: {
    fontSize: 30,
    color: '#FFF',
    marginTop: -150,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  confirmationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#D32F2F',
    alignItems: 'center',
    justifyContent: 'flex-start', // Alinha o conteúdo no topo
    padding: 20,
    paddingTop: 50, // Adiciona espaço no topo
  },
  checkIcon: {
    ...iconContainer,
    left: 30,
  },
  crossIcon: {
    ...iconContainer,
    right: 30,
  },
  screenTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
    marginTop: -20, // Adiciona espaço entre o topo e o título
  },
  screenSubtitle: {
    fontSize: 20,
    color: '#FFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
    width: '100%',
    maxWidth: 350,
    height: 450,
    marginTop: 40, // Adiciona espaço entre a descrição e o cartão
  },
  productImage: {
    width: '100%',
    height: 300,
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
    marginTop: 20,
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
    color: '#FFF',
  },
  chooseTwoText: {
    fontSize: 20, // Tamanho maior
    fontWeight: 'bold', // Negrito
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 15, // Espaço abaixo do texto
  },
});
