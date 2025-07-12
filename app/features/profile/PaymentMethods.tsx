import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Sample payment methods data
const paymentMethods = [
  {
    id: '1',
    type: 'Visa',
    last4: '4242',
    icon: require('../../../assets/images/visa.png'),
  },
  {
    id: '2',
    type: 'MasterCard',
    last4: '5555',
    icon: require('../../../assets/images/mastercard.png'),
  },
  {
    id: '3',
    type: 'Amex',
    last4: '3005',
    icon: require('../../../assets/images/amex.png'),
  },
];

const PaymentMethods = () => {
  const router = useRouter(); 

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={24} color="black" />
      </TouchableOpacity>
        <Text style={styles.headerText}>Saved Drafts</Text>
      </View>

      <FlatList
        data={paymentMethods}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={item.icon} style={styles.cardIcon} />
            <Text style={styles.cardText}>{item.type} •••• {item.last4}</Text>
          </View>
        )}
        style={styles.cardList}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/features/profile/AddPayment')} 
      >
        <Text style={styles.buttonText}>Add Payment Method</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PaymentMethods;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  cardList: {
    marginBottom: 30,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
  },
  cardIcon: {
    width: 32,
    height: 20,
    marginRight: 12,
    resizeMode: 'contain',
  },
  cardText: {
    fontSize: 16,
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

