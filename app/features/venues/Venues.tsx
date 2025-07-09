import React, { JSX, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ImageSourcePropType,
  TextInput,
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

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
  const [searchQuery, setSearchQuery] = useState<string>('');

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
      <View style={{ padding: 16 }}>
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.sectionTitle}>Venues</Text>
        </View>
    
        {/* Search Bar Row */}
        <View style={styles.searchBarRow}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#64748B" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for items, tools, gear..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
    
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => navigation.navigate('SearchResult' as never)}
            activeOpacity={0.8}
          >
            <Text style={styles.searchButtonText}>Go</Text>
          </TouchableOpacity>
    
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="filter" size={20} color="#3B82F6" />
          </TouchableOpacity>
        </View>
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
              <View style={styles.imageContainer}>
                <Image source={item.image} style={styles.cardImage} resizeMode="cover" />
                <Ionicons name="heart" size={20} color="#e74c3c" style={styles.favoriteIcon} />
              </View>
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
  },
  headerRow: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 10,
  },
  searchBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  searchButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  filterButton: {
    marginLeft: 8,
    padding: 8,
    backgroundColor: '#E0F2FE',
    borderRadius: 8,
  },
  scrollContainer: {
    padding: 16,
  },
  imageContainer: {
  width: '100%',
  height: 140,
  borderTopLeftRadius: 12,
  borderTopRightRadius: 12,
  overflow: 'hidden',
  position: 'relative',
},

cardImage: {
  width: '100%',
  height: '100%',
},
  card: {
    flex: 1,
    margin: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    alignItems: 'center',
  },
  shadow: {
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#eee',
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
    color: '#666',
    textAlign: 'center',
  },
  favoriteIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 1,
  },
});
