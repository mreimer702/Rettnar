import React, { JSX, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ImageSourcePropType,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import BottomNavBar from '../components/BottomNavBar'; // Optional if needed

// Define the navigation param list
type RootStackParamList = {
  ProductPage: { productId: number };
  // ...other routes if needed
};
type VehiclesScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ProductPage'>;

// Define Vehicle item type
interface VehicleItem {
  id: number;
  title: string;
  image: ImageSourcePropType;
  price: string;
}

export default function VehiclePage(): JSX.Element {
  const navigation = useNavigation<VehiclesScreenNavigationProp>();
  const [vehicleList, setVehicleList] = useState<VehicleItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // TODO: Backend - Replace this mock data with real vehicle data from API
    const data: VehicleItem[] = [...Array(6)].map((_, i) => ({
      id: i + 1,
      title: `Vehicle ${i + 1}`,
      image: require('../../../assets/images/vehicle-placeholder.png'), // Replace with your actual placeholder image
      price: '$80/day',
    }));
    setVehicleList(data);
    setIsLoading(false);
  }, []);

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={[styles.searchContainer, { flexDirection: 'row', alignItems: 'center' }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft width={24} height={24} color="black" />
        </TouchableOpacity>
        <Text style={[styles.sectionTitle, { marginLeft: 10 }]}>Vehicles</Text>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" style={{ flex: 1, justifyContent: 'center' }} />
      ) : (
        <FlatList
          data={vehicleList}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.scrollContainer}
          renderItem={({ item }) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.card, styles.shadow]}
              onPress={() =>
                navigation.navigate('ProductPage', { productId: item.id })
              }
            >
              <Heart width={20} height={20} color="#e74c3c" style={styles.favoriteIcon} />
              <Image source={item.image} style={styles.thumbnail} resizeMode="cover" />
              <Text style={styles.itemName}>{item.title}</Text>
              <Text style={styles.price}>{item.price}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Optional Bottom Navigation Bar */}
      {/* <BottomNavBar active="Account" /> */}
    </View>
  );
}

import { StyleSheet } from 'react-native';
import { ChevronLeft, Heart } from 'lucide-react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  searchContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
  },
  scrollContainer: {
    paddingBottom: 16,
  },
  card: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    margin: 8,
    padding: 12,
    alignItems: 'center',
    minWidth: 150,
    maxWidth: '48%',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  favoriteIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  thumbnail: {
    width: 100,
    height: 80,
    borderRadius: 8,
    marginBottom: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    textAlign: 'center',
  },
  price: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
});
