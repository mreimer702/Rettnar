import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

const mockBookings = [
  { id: '1', title: 'Camera Rental', date: 'July 12, 2025', status: 'Confirmed' },
  { id: '2', title: 'Lighting Kit', date: 'July 15, 2025', status: 'Pending' },
  { id: '3', title: 'Studio Space', date: 'July 20, 2025', status: 'Cancelled' }]
const Bookings = () => {
  const router = useRouter();

  const renderItem = ({ item }: { item: typeof mockBookings[0] }) => (
    <TouchableOpacity style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.date}>{item.date}</Text>
        <Text style={[styles.status, getStatusStyle(item.status)]}>{item.status}</Text>
      </View>
    </TouchableOpacity>
  );

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return { color: 'green' };
      case 'Pending':
        return { color: 'orange' };
      case 'Cancelled':
        return { color: 'red' };
      default:
        return { color: 'gray' };
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>My Bookings</Text>
      </View>
      <FlatList
        data={mockBookings}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
);

};

export default Bookings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 40,
  },
  headerText: {
    fontSize: 26,
    fontWeight: 'bold',
    marginLeft: 12,
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
  date: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  status: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
