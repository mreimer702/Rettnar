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
import { useNavigation, NavigationProp } from '@react-navigation/native';
// import BottomNavBar from '../components/BottomNavBar'; // Optional if needed

// Define the navigation type for your stack (replace 'RootStackParamList' with your actual param list)
type RootStackParamList = {
  ProductPage: { productId: number };
  // add other routes here if needed
};

// Define Venue item type
interface VenueItem {
  id: number;
  title: string;
  image: ImageSourcePropType;
  price: string;
}

export default function VenuePage(): JSX.Element {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [venueList, setVenueList] = useState<VenueItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // TODO: Backend - Replace this mock data with real venue data from API
    const data: VenueItem[] = [...Array(6)].map((_, i) => ({
      id: i + 1,
      title: `Venue ${i + 1}`,
      image: require('../../../assets/images/venue-placeholder.png'), // Replace with actual image or keep as placeholder
      price: '$40/day',
    }));
    setVenueList(data);
    setIsLoading(false);
  }, []);

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={[styles.searchContainer, { flexDirection: 'row', alignItems: 'center' }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft width={24} height={24} color="black" />
        </TouchableOpacity>
        <Text style={[styles.sectionTitle, { marginLeft: 10 }]}>Venues</Text>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" style={{ flex: 1, justifyContent: 'center' }} />
      ) : (
        <FlatList
          data={venueList}
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

// Add StyleSheet for styles used in the component
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
    color: '#333',
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
    justifyContent: 'center',
    minHeight: 180,
    position: 'relative',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  favoriteIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginBottom: 10,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
    marginBottom: 4,
    textAlign: 'center',
  },
  price: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
});
