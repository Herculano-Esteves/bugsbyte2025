import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import axios from 'axios';

export default function CouponsScreen() {
  const [coupons, setCoupons] = useState([]);

  useEffect(() => {
    setCoupons([
      { id: 1, discount: 20, title: 'Pizza Promo', description: '20% de desconto na pizza', validity: '2025-04-01' },
      { id: 2, discount: 10, title: 'Supermercado', description: '10% no Pingo Doce', validity: '2025-05-01' },
    ]);
  }, []);

  const renderCoupon = ({ item }) => {
    return (
      <TouchableOpacity style={styles.couponContainer}>
        <View style={styles.couponHeader}>
          <Text style={styles.discountText}>{item.discount}%</Text>
          <Text style={styles.titleText}>{item.title}</Text>
        </View>
        <Text style={styles.descriptionText}>{item.description}</Text>
        <Text style={styles.validityText}>Válido até {item.validity}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Meus Cupons</Text>
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
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 50,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  couponContainer: {
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  couponHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  discountText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#E53935',
    marginRight: 8,
  },
  titleText: {
    fontSize: 16,
    fontWeight: '600',
  },
  descriptionText: {
    fontSize: 14,
    color: '#777',
    marginBottom: 4,
  },
  validityText: {
    fontSize: 12,
    color: '#999',
  },
});

  