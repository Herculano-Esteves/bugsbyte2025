import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, ScrollView, Alert } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  interpolate,
  Extrapolate,
  runOnJS,
  withTiming,
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '@/hooks/UserContext';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function SwipeScreen() {
  const { userId } = useUser();
  const [products, setProducts] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCoupons, setSelectedCoupons] = useState<number[]>([]);
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);

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

  const handleSwipe = (direction) => {
    if (currentIndex >= products.length) return;
  
    const currentProduct = products[currentIndex];
    const type = direction === 'right'; // true para "gosto", false para "não gosto"
  
    console.log(
      type
        ? `Gostou do produto: ${currentProduct.name_url}`
        : `Não gostou do produto: ${currentProduct.name_url}`
    );
  
    // Envia os dados para o backend
    confirmSwipe(type, currentProduct.sku);
  
    runOnJS(goToNextProduct)();
  };

const goToNextProduct = () => {
  if (currentIndex < products.length - 1) {
    setCurrentIndex((prevIndex) => prevIndex + 1);
  } else {
    setCurrentIndex(products.length);
    console.log ('Todos os produtos foram exibidos');
  }
  translateX.value = 0;
  rotate.value = 0;
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
        // Usa withTiming para uma transição rápida (200ms)
        translateX.value = withTiming(
          SCREEN_WIDTH,
          { duration: 200 }, // Duração de 200ms
          () => runOnJS(handleSwipe)('right')
        );
      } else if (event.translationX < -150) {
        // Usa withTiming para uma transição rápida (200ms)
        translateX.value = withTiming(
          -SCREEN_WIDTH,
          { duration: 200 }, // Duração de 200ms
          () => runOnJS(handleSwipe)('left')
        );
      } else {
        // Retorna à posição inicial sem atraso significativo
        translateX.value = withTiming(0, { duration: 200 });
        rotate.value = withTiming(0, { duration: 200 });
      }
    },
  });

  // Outra versão para mover instantaneamente
  const gestureHandlerInstant = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startX = translateX.value;
    },
    onActive: (event, ctx) => {
      translateX.value = ctx.startX + event.translationX;
      rotate.value = (event.translationX / SCREEN_WIDTH) * 15;
    },
    onEnd: (event) => {
      if (event.translationX > 150) {
        translateX.value = SCREEN_WIDTH; // Move instantaneamente
        runOnJS(handleSwipe)('right');
      } else if (event.translationX < -150) {
        translateX.value = -SCREEN_WIDTH; // Move instantaneamente
        runOnJS(handleSwipe)('left');
      } else {
        translateX.value = 0;
        rotate.value = 0;
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

  const handleConfirm = () => {
    setIsConfirmed(true); // Define que a confirmação foi feita
    setConfirmationMessage('Resgate os seus cupons no separador cupons');
    console.log('Cupons selecionados:', selectedCoupons);
    // Adicione aqui a lógica adicional para confirmar os cupons selecionados
  };

  if (currentIndex >= products.length) {
    return (
      <SafeAreaView style={styles.container}>
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
          <View style={styles.overlayContainer}>
            <Text style={styles.confirmationMessage}>{confirmationMessage}</Text>
          </View>
        )}
      </SafeAreaView>
    );
  }
  const currentProduct = products[currentIndex];

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.screenTitle}>Swipe</Text>
      <Text style={styles.screenSubtitle}>
        Explore os produtos disponíveis e escolha os seus favoritos!
      </Text>
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[styles.card, animatedCardStyle]}>
          <Image
            source={{ uri: currentProduct.image_url }} // Exibe a imagem do produto
            style={styles.productImage}
            resizeMode="cover"
          />
          <Text style={styles.productName}>{currentProduct.name_url}</Text> {/* Exibe o nome do produto */}
          <Text style={styles.productDescription}>
            Preço: €{currentProduct.price.toFixed(2)} / {currentProduct.type_of_package} {/* Exibe o preço e o tipo de embalagem */}
          </Text>

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
    </SafeAreaView>
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
  // confirmationMessage: {
  //   fontSize: 30,
  //   color: '#FFF',
  //   marginTop: -150,
  //   textAlign: 'center',
  //   fontWeight: 'bold',
  // },
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
  } as ViewStyle,
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
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundo semitransparente
    zIndex: 10, // Garante que fique acima dos outros elementos
  },
  confirmationMessage: {
    fontSize: 30,
    color: '#FFF',
    textAlign: 'center',
    fontWeight: 'bold',
    backgroundColor: '#D32F2F', // Fundo para destacar a mensagem
    padding: 20,
    borderRadius: 10,
  },
});
