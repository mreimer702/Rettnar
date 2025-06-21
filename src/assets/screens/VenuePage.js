import React, {useEffect, useState} from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {ChevronLeft, Heart} from 'react-native-feather';
import styles from '../styles/HomeStyle';
// import BottomNavBar from '../components/BottomNavBar'; // Optional if needed

// VenuePage Component
// Displays a list of available venues using mock data, with the option to navigate to a ProductPage for more details.
// This page will eventually fetch real data from the backend.

export default function VenuePage() {
  const navigation = useNavigation();
  const [venueList, setVenueList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch venue data on component mount using useEffect
  useEffect(() => {
    // TODO: Backend - Replace this mock data with real venue data from API
    const data = [...Array(6)].map((_, i) => ({
      id: i + 1,
      title: `Venue ${i + 1}`,
      image: require('../venue-placeholder.jpg'),
      price: '$40/day',
    }));
    setVenueList(data);
    setIsLoading(false);
  }, []);

  return (
    <View style={styles.container}>
      {/* Header Section with Back Button and Title */}
      <View
        style={[
          styles.searchContainer,
          {flexDirection: 'row', alignItems: 'center'},
        ]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft width={24} height={24} color="black" />
        </TouchableOpacity>
        <Text style={[styles.sectionTitle, {marginLeft: 10}]}>Venues</Text>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" style={{ flex: 1, justifyContent: 'center' }} />
      ) : (
        <FlatList
          data={venueList}
          keyExtractor={item => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.scrollContainer}
          renderItem={({ item }) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.card, styles.shadow]}
              onPress={() =>
                navigation.navigate('ProductPage', {
                  productId: item.id,
                })
              }
            >
              {/* Favorite Icon */}
              <Heart width={20} height={20} color="#e74c3c" style={styles.favoriteIcon} />

              {/* Venue Image */}
              <Image
                source={item.image}
                style={styles.thumbnail}
                resizeMode="cover"
              />

              {/* Venue Title and Price */}
              <Text style={styles.itemName}>{item.title}</Text>
              <Text style={styles.price}>{item.price}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Optional Bottom Navigation Bar */}
      {/* Uncomment if needed for navigation */}
      <BottomNavBar active="Account" />
    </View>
  );
}
