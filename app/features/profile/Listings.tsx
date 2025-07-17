import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const mockListings = [
  { id: '1', title: '4K Camera Package', price: '$100/day', status: 'Active' },
  { id: '2', title: 'Lighting Kit', price: '$50/day', status: 'Inactive' },
  { id: '3', title: 'Audio Equipment', price: '$40/day', status: 'Pending Approval' },
  { id: '4', title: 'Drone Kit', price: '$120/day', status: 'Active' },
  { id: '5', title: 'Tripod Stand', price: '$15/day', status: 'Inactive' },
  { id: '6', title: 'Wireless Microphones', price: '$35/day', status: 'Active' },
  { id: '7', title: 'Backdrops (Assorted Colors)', price: '$20/day', status: 'Pending Approval' },
  { id: '8', title: 'Editing Suite Access', price: '$150/day', status: 'Active' }]

const Listings = () => {
  const router = useRouter();

  const renderItem = ({ item }: { item: typeof mockListings[0] }) => (
    <TouchableOpacity style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.price}>{item.price}</Text>
        <Text style={[styles.status, getStatusStyle(item.status)]}>{item.status}</Text>
      </View>
    </TouchableOpacity>
  );

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Active':
        return { color: 'green' };
      case 'Inactive':
        return { color: 'gray' };
      case 'Pending Approval':
        return { color: 'orange' };
      default:
        return { color: 'black' };
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>My Listings</Text>
      </View>
      <FlatList
        data={mockListings}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

export default Listings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'column',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  status: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 12,
  },
});
