import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const PRODUCTS = [
  { id: 1, title: 'Banana', image: 'https://via.placeholder.com/300' },
  { id: 2, title: 'Maçã', image: 'https://via.placeholder.com/300' },
  { id: 3, title: 'Leite', image: 'https://via.placeholder.com/300' },
  { id: 4, title: 'Pão', image: 'https://via.placeholder.com/300' },
];

export default function SwipeScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const liked = useRef<number[]>([]);

  const translateX = useSharedValue(0);

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'right') {
      liked.current.push(PRODUCTS[currentIndex].id);
    }

    if (currentIndex + 1 < PRODUCTS.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      console.log('Escolheste:', liked.current);
    }
    translateX.value = 0;
  };

  const gestureHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      translateX.value = event.translationX;
    },
    onEnd: () => {
      if (translateX.value > 120) {
        runOnJS(handleSwipe)('right');
      } else if (translateX.value < -120) {
        runOnJS(handleSwipe)('left');
      } else {
        translateX.value = withSpring(0);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: 1 - Math.abs(translateX.value) / 300,
  }));

  if (currentIndex >= PRODUCTS.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Já escolheste os produtos!</Text>
      </View>
    );
  }

  const product = PRODUCTS[currentIndex];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Caça Produtos</Text>
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[styles.card, animatedStyle]}>
          <Image source={{ uri: product.image }} style={styles.image} />
          <Text style={styles.cardTitle}>{product.title}</Text>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D32F2F', // Fundo vermelho
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 20,
  },
  card: {
    width: width * 0.9,
    height: height * 0.6,
    backgroundColor: '#FFF',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  image: {
    width: '80%',
    height: '60%',
    borderRadius: 10,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  text: {
    fontSize: 20,
    color: '#FFF',
  },
});