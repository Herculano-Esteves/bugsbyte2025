import React, { useState } from 'react';
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
import { SafeAreaView } from 'react-native-safe-area-context';

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

const coupons = [
  {
    id: 1,
    discount: 15,
    title: 'Desconto Especial',
    description: '15% de desconto na sua próxima compra!',
    validity: '2025-12-31',
    image: 'https://www.continente.pt/dw/image/v2/BDVS_PRD/on/demandware.static/-/Sites-col-master-catalog/default/dw3c035882/images/col/671/6716050-frente.jpg?sw=2000&sh=2000',
  },
  {
    id: 2,
    discount: 10,
    title: 'Oferta Exclusiva',
    description: '10% de desconto em produtos selecionados!',
    validity: '2025-11-30',
    image: 'https://www.continente.pt/dw/image/v2/BDVS_PRD/on/demandware.static/-/Sites-col-master-catalog/default/dw3c035882/images/col/671/6716050-frente.jpg?sw=2000&sh=2000',
  },
  {
    id: 3,
    discount: 20,
    title: 'Mega Desconto',
    description: 'Aproveite 20% OFF em compras acima de R$100!',
    validity: '2025-10-15',
    image: 'https://www.continente.pt/dw/image/v2/BDVS_PRD/on/demandware.static/-/Sites-col-master-catalog/default/dw3c035882/images/col/671/6716050-frente.jpg?sw=2000&sh=2000',
  },
  {
    id: 4,
    discount: 5,
    title: 'Desconto Simples',
    description: '5% de desconto no checkout!',
    validity: '2025-09-20',
    image: 'https://www.continente.pt/dw/image/v2/BDVS_PRD/on/demandware.static/-/Sites-col-master-catalog/default/dw3c035882/images/col/671/6716050-frente.jpg?sw=2000&sh=2000',
  },
];

export default function SwipeScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCoupons, setSelectedCoupons] = useState<number[]>([]);
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false); // Novo estado para controlar a confirmação

  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);

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

  const toggleCouponSelection = (id: number) => {
    setSelectedCoupons((prevSelected) => {
      if (prevSelected.includes(id)) {
        // Remove o cupom se já estiver selecionado
        return prevSelected.filter((couponId) => couponId !== id);
      } else if (prevSelected.length < 2) {
        // Adiciona o cupom se menos de 2 estiverem selecionados
        return [...prevSelected, id];
      }
      // Retorna o estado atual se já houver 2 selecionados
      return prevSelected;
    });
  };

  const handleConfirm = () => {
    setIsConfirmed(true); // Define que a confirmação foi feita
    setConfirmationMessage('Resgate seus cupoes na aba cupoes');
    console.log('Cupoes selecionados:', selectedCoupons);
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
            <Text style={styles.chooseTwoText}>Escolha apenas duas:</Text>
            <ScrollView contentContainerStyle={styles.couponsContainer}>
              {coupons.map((coupon) => (
                <View key={coupon.id} style={styles.couponCard}>
                  <Image source={{ uri: coupon.image }} style={styles.couponImage} />
                  <View style={styles.couponInfo}>
                    <Text style={styles.couponTitle}>{coupon.title}</Text>
                    <Text style={styles.couponDescription}>{coupon.description}</Text>
                    <Text style={styles.couponValidity}>Válido até {coupon.validity}</Text>
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.selectionBox,
                      selectedCoupons.includes(coupon.id) && styles.selectionBoxSelected,
                    ]}
                    onPress={() => toggleCouponSelection(coupon.id)}
                  >
                    {selectedCoupons.includes(coupon.id) && (
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
          <View style={styles.confirmationContainer}>
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
    width: '90%', // Ocupa 90% da largura da tela
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
    width: 350,
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
