import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, Image } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useTheme } from '@/hooks/ThemeContext';

export default function CouponsScreen() {
  const { isDarkMode } = useTheme(); // Adiciona o tema global
  const styles = createStyles(isDarkMode); // Cria estilos com base no tema

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
    // Dados mockados para testes
    setCoupons([
      { 
        id: 1, 
        discount: 15, 
        title: 'Desconto Pizza Romana', 
        description: '15% de desconto na Pizza', 
        validity: '2025-04-10',
        image: 'https://www.continente.pt/dw/image/v2/BDVS_PRD/on/demandware.static/-/Sites-col-master-catalog/default/dw3c035882/images/col/671/6716050-frente.jpg?sw=2000&sh=2000', // Link aleatório
      },
      { 
        id: 2, 
        discount: 25, 
        title: 'Desconto Supermercado', 
        description: '25% no supermercado', 
        validity: '2025-05-01',
        image: 'https://feed.continente.pt/media/1pxho2rq/nvstudio_018-_1_.webp', // Link aleatório
      },
      { 
        id: 3, 
        discount: 10, 
        title: 'Desconto Wells ', 
        description: '10% de desconto em medicamentos', 
        validity: '2025-06-15',
        image: 'https://cm-lousa.pt/wp-content/uploads/2019/06/wells.png', // Link aleatório
      },
    ]);
  }, []);

  const handleShowQRCode = useCallback((coupon: typeof coupons[0]) => {
    setSelectedCoupon(coupon);
    setQrCodeVisible(true);
  }, []);

  const handleShowDetails = useCallback((coupon: typeof coupons[0]) => {
    setSelectedCoupon(coupon);
  }, []);

  const renderCoupon = ({ item }: { item: typeof coupons[0] }) => {
    return (
      <View style={styles.couponCard}>
        <View style={styles.discountContainer}>
          <Image
            source={{ uri: 'https://keepwells.pt/media/2wob3imk/benefits06.png?quality=100&rnd=132965704458570000' }}
            style={styles.discountImage}
          />
        </View>

        <View style={styles.couponInfo}>
          <Text style={styles.couponTitle}>{item.title}</Text>
          <Text style={styles.couponDescription}>{item.description}</Text>
          <Text style={styles.couponValidity}>Válido até {item.validity}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleShowDetails(item)}
          >
            <Text style={styles.buttonText}>Ver produto</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleShowQRCode(item)}
          >
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

      {selectedCoupon ? (
        <View style={styles.detailsContainer}>
          <Image source={{ uri: selectedCoupon.image }} style={styles.couponImage} />
          <Text style={styles.detailsTitle}>{selectedCoupon.title}</Text>
          <Text style={styles.detailsDescription}>{selectedCoupon.description}</Text>
          <Text style={styles.detailsValidity}>Válido até {selectedCoupon.validity}</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setSelectedCoupon(null)}
          >
            <Text style={styles.buttonText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={coupons}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderCoupon}
          contentContainerStyle={styles.listContainer}
        />
      )}

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
      backgroundColor: isDarkMode ? '#000' : '#D32F2F', // Preto ou vermelho
      paddingTop: 50,
      paddingHorizontal: 16,
    },
    screenTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: isDarkMode ? '#FFF' : '#FFF', // Branco
      marginBottom: 8,
    },
    screenSubtitle: {
      fontSize: 16,
      color: isDarkMode ? '#CCC' : '#FFF', // Cinza claro ou branco
      marginBottom: 16,
    },
    listContainer: {
      paddingBottom: 20,
    },
    couponCard: {
      backgroundColor: isDarkMode ? '#333' : '#FFF', // Cinza escuro ou branco
      borderRadius: 10,
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      marginBottom: 16,
    },
    discountContainer: {
      backgroundColor: '#FF5252',
      borderRadius: 30,
      paddingVertical: 10,
      paddingHorizontal: 14,
      marginRight: 10,
    },
    discountImage: {
      width: 50,
      height: 50,
      resizeMode: 'contain',
    },
    couponInfo: {
      flex: 1,
    },
    couponTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 4,
      color: isDarkMode ? '#FFF' : '#333', // Branco ou cinza escuro
    },
    couponDescription: {
      fontSize: 14,
      color: isDarkMode ? '#CCC' : '#666', // Cinza claro ou cinza médio
      marginBottom: 4,
    },
    couponValidity: {
      fontSize: 12,
      color: isDarkMode ? '#999' : '#999', // Cinza claro
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
    detailsContainer: {
      backgroundColor: isDarkMode ? '#333' : '#FFF', // Cinza escuro ou branco
      borderRadius: 10,
      padding: 16,
      marginBottom: 16,
      alignItems: 'center',
    },
    couponImage: {
      width: '100%',
      height: 200,
      borderRadius: 10,
      marginBottom: 16,
    },
    detailsTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 8,
      color: isDarkMode ? '#FFF' : '#333', // Branco ou cinza escuro
    },
    detailsDescription: {
      fontSize: 16,
      color: isDarkMode ? '#CCC' : '#666', // Cinza claro ou cinza médio
      marginBottom: 8,
      textAlign: 'center',
    },
    detailsValidity: {
      fontSize: 14,
      color: isDarkMode ? '#999' : '#999', // Cinza claro
      marginBottom: 16,
    },
    closeButton: {
      backgroundColor: '#FF5252',
      borderRadius: 8,
      paddingVertical: 6,
      paddingHorizontal: 10,
      alignSelf: 'center',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    qrCodeContainer: {
      backgroundColor: isDarkMode ? '#333' : '#FFF', // Cinza escuro ou branco
      borderRadius: 10,
      padding: 20,
      alignItems: 'center',
    },
    qrCodeTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 16,
      color: isDarkMode ? '#FFF' : '#333', // Branco ou cinza escuro
    },
  });