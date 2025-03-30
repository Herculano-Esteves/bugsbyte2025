import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, Image, Alert } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useTheme } from '@/hooks/ThemeContext';
import { useUser } from '@/hooks/UserContext';
import { useFocusEffect } from '@react-navigation/native';

export default function CouponsScreen() {
  const { isDarkMode } = useTheme();
  const { userId } = useUser();
  const [coupons, setCoupons] = useState([]); // Estado único para os cupons
  const [selectedCoupon, setSelectedCoupon] = useState<null | typeof coupons[0]>(null);
  const [qrCodeVisible, setQrCodeVisible] = useState(false);
  const styles = createStyles(isDarkMode);

  const fetchUserCoupons = async () => {
    try {
      console.log('Buscando cupons para o usuário:', userId);
      const response = await fetch('http://10.14.0.128:8000/cuppons/get/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: Number(userId), // Garante que o user_id seja enviado como inteiro
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return;
      }

      const data = await response.json();
      setCoupons(data); // Atualiza o estado com os cupons recebidos
      console.log('Cupons recebidos:', data);
    } catch (error) {
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (userId) {
        fetchUserCoupons(); // Busca os cupons sempre que a aba for acessada
      }
    }, [userId])
  );

  const handleShowQRCode = useCallback((coupon: typeof coupons[0]) => {
    setSelectedCoupon(coupon);
    setQrCodeVisible(true);
  }, [coupons]);

  const renderCoupon = ({ item }: { item: typeof coupons[0] }) => {
    return (
      <View style={styles.couponCard}>
        <Image source={{ uri: item.image_url }} style={styles.couponImage} /> {/* Corrigido para usar image_url */}
        <View style={styles.couponInfo}>
          <Text style={styles.couponTitle}>{item.name}</Text> {/* Corrigido para usar name */}
          <Text style={styles.couponSku}>SKU: {item.sku}</Text> {/* Exibe o SKU */}
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.qrCodeButton} onPress={() => handleShowQRCode(item)}>
            <Text style={styles.buttonText}>Gerar QR Code</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Meus Cupões</Text>
      <Text style={styles.screenSubtitle}>
        Aqui encontras todos os cupões que ganhaste no Swiper
      </Text>
      <FlatList
        data={coupons}
        keyExtractor={(item) => item.sku.toString()} // Usa o SKU como chave
        renderItem={renderCoupon}
        contentContainerStyle={styles.listContainer}
      />
      <Modal visible={qrCodeVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.qrCodeContainer}>
            <Text style={styles.qrCodeTitle}>QR Code para {selectedCoupon?.name}</Text> {/* Corrigido para usar name */}
            {selectedCoupon && (
              <QRCode value={`Cupom SKU: ${selectedCoupon.sku}`} size={200} />
            )}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setQrCodeVisible(false)}
            >
              <Text style={styles.buttonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const createStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#D32F2F',
      paddingHorizontal: 16,
      paddingTop: 50,
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
      backgroundColor: isDarkMode ? '#1C1C1C' : '#FFF',
      borderRadius: 10,
      padding: 16,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    couponImage: {
      width: '100%',
      height: 150,
      borderRadius: 10,
      marginBottom: 10,
    },
    couponInfo: {
      marginBottom: 10,
    },
    couponTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: isDarkMode ? '#FFF' : '#333',
      marginBottom: 4,
    },
    couponSku: {
      fontSize: 14,
      color: isDarkMode ? '#CCC' : '#666',
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    qrCodeButton: {
      backgroundColor: '#FF9800',
      borderRadius: 8,
      paddingVertical: 10,
      paddingHorizontal: 16,
    },
    buttonText: {
      color: '#FFF',
      fontSize: 14,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    qrCodeContainer: {
      backgroundColor: isDarkMode ? '#1C1C1C' : '#FFF',
      borderRadius: 10,
      padding: 20,
      alignItems: 'center',
    },
    qrCodeTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 16,
      color: isDarkMode ? '#FFF' : '#333',
    },
    closeButton: {
      backgroundColor: '#FF5252',
      borderRadius: 8,
      paddingVertical: 6,
      paddingHorizontal: 10,
      alignSelf: 'center',
    },
  });