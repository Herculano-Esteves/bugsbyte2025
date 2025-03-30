import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, Image } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useTheme } from '@/hooks/ThemeContext';

export default function CouponsScreen() {
  const { isDarkMode } = useTheme();
  const styles = createStyles(isDarkMode);

  const [coupons, setCoupons] = useState<{ 
    id: number; 
    discount: number; 
    title: string; 
    description: string; 
    validity: string; 
    image: string; 
  }[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<null | typeof coupons[0]>(null);
  const [qrCodeVisible, setQrCodeVisible] = useState(false);

  useEffect(() => {
    setCoupons([
      { 
        id: 1, 
        discount: 15, 
        title: 'Desconto Pizza Romana', 
        description: '15% de desconto na Pizza', 
        validity: '2025-04-10',
        image: 'https://www.continente.pt/dw/image/v2/BDVS_PRD/on/demandware.static/-/Sites-col-master-catalog/default/dw3c035882/images/col/671/6716050-frente.jpg?sw=2000&sh=2000',
      },
      { 
        id: 2, 
        discount: 25, 
        title: 'Desconto Supermercado', 
        description: '25% no supermercado', 
        validity: '2025-05-01',
        image: 'https://feed.continente.pt/media/1pxho2rq/nvstudio_018-_1_.webp',
      },
      { 
        id: 3, 
        discount: 10, 
        title: 'Desconto Wells', 
        description: '10% de desconto em medicamentos', 
        validity: '2025-06-15',
        image: 'https://cm-lousa.pt/wp-content/uploads/2019/06/wells.png',
      },
    ]);
  }, []);

  const handleShowQRCode = useCallback((coupon: typeof coupons[0]) => {
    setSelectedCoupon(coupon);
    setQrCodeVisible(true);
  }, []);

  const renderCoupon = ({ item }: { item: typeof coupons[0] }) => {
    return (
      <View style={styles.couponCard}>
        <Image source={{ uri: item.image }} style={styles.couponImage} />
        <View style={styles.couponInfo}>
          <Text style={styles.couponTitle}>{item.title}</Text>
          <Text style={styles.couponDescription}>{item.description}</Text>
          <Text style={styles.couponValidity}>Válido até {item.validity}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.productButton}>
            <Text style={styles.buttonText}>Ver produto</Text>
          </TouchableOpacity>
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
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCoupon}
        contentContainerStyle={styles.listContainer}
      />
      <Modal visible={qrCodeVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.qrCodeContainer}>
            <Text style={styles.qrCodeTitle}>QR Code para {selectedCoupon?.title}</Text>
            {selectedCoupon && (
              <QRCode value={`Cupom ID: ${selectedCoupon.id}`} size={200} />
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
      backgroundColor: '#D32F2F', // Sempre vermelho, independente do tema
      paddingHorizontal: 16,
      paddingTop: 50,
    },
    screenTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#FFF', // Branco para o título
      marginBottom: 8,
    },
    screenSubtitle: {
      fontSize: 16,
      color: '#FFF', // Branco para o subtítulo
      marginBottom: 16,
    },
    listContainer: {
      paddingBottom: 20,
    },
    couponCard: {
      backgroundColor: isDarkMode ? '#1C1C1C' : '#FFF', // Preto no modo escuro, branco no claro
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
      color: isDarkMode ? '#FFF' : '#333', // Branco no modo escuro, cinza escuro no claro
      marginBottom: 4,
    },
    couponDescription: {
      fontSize: 14,
      color: isDarkMode ? '#CCC' : '#666', // Cinza claro no modo escuro, médio no claro
      marginBottom: 4,
    },
    couponValidity: {
      fontSize: 12,
      color: isDarkMode ? '#666' : '#999', // Cinza médio no modo escuro, claro no claro
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    productButton: {
      backgroundColor: '#FF5252', // Vermelho para o botão "Ver produto"
      borderRadius: 8,
      paddingVertical: 10,
      paddingHorizontal: 16,
    },
    qrCodeButton: {
      backgroundColor: '#FF9800', // Laranja para o botão "Gerar QR Code"
      borderRadius: 8,
      paddingVertical: 10,
      paddingHorizontal: 16,
    },
    buttonText: {
      color: '#FFF', // Branco para o texto dos botões
      fontSize: 14,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundo semitransparente
    },
    qrCodeContainer: {
      backgroundColor: isDarkMode ? '#1C1C1C' : '#FFF', // Preto no modo escuro, branco no claro
      borderRadius: 10,
      padding: 20,
      alignItems: 'center',
    },
    qrCodeTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 16,
      color: isDarkMode ? '#FFF' : '#333', // Branco no modo escuro, cinza escuro no claro
    },
    closeButton: {
      backgroundColor: '#FF5252', // Vermelho para o botão "Fechar"
      borderRadius: 8,
      paddingVertical: 6,
      paddingHorizontal: 10,
      alignSelf: 'center',
    },
  });