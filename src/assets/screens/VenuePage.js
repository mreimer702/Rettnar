import React, {useEffect, useState} from 'react';
import {View, Text, ScrollView, TouchableOpacity, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {ChevronLeft} from 'react-native-feather';
import styles from '../styles/HomeStyle';
// import BottomNavBar from '../components/BottomNavBar'; // Optional if needed

// VenuePage Component
// Displays a list of available venues using mock data, with the option to navigate to a ProductPage for more details.
// This page will eventually fetch real data from the backend.

export default function VenuePage() {
  const navigation = useNavigation();
  const [venueList, setVenueList] = useState([]);

  // Fetch venue data on component mount using useEffect
  useEffect(() => {
    // TODO: Backend - Replace this mock data with real venue data from API
    setVenueList(
      [...Array(6)].map((_, i) => ({
        id: i + 1,
        title: `Venue ${i + 1}`,
        image: require('../assets/venue-placeholder.jpg'), // TODO: Backend should provide actual image URLs
        price: '$40/day', // TODO: Backend should provide actual pricing
      })),
    );
  }, []);

  return (
    <View style={styles.container}>
      {/* Scrollable container for venue content */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
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

        {/* Venue Grid Section */}
        {/* Displays venues using a two-column layout using flexbox */}
        <View style={styles.sectionContainer}>
          <View style={styles.gridContainer}>
            {venueList.map(item => (
              <TouchableOpacity
                key={item.id}
                style={styles.card}
                // Navigate to the ProductPage with the venue ID
                // TODO: Backend - Fetch venue details using this productId
                onPress={() =>
                  navigation.navigate('ProductPage', {
                    productId: item.id,
                  })
                }>
                {/* Display Favorite status (could be enhanced later using real data) */}
                <Text style={styles.favorite}>Favorite</Text>

                {/* Display Venue Image */}
                {/* TODO: Backend - Provide actual image URLs */}
                <Image
                  source={item.image}
                  style={styles.thumbnail}
                  resizeMode="cover"
                />

                {/* Display Venue Title and Price */}
                {/* TODO: Backend - Provide real title and price from API */}
                <Text style={styles.itemName}>{item.title}</Text>
                <Text style={styles.price}>{item.price}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Optional Bottom Navigation Bar */}
      {/* Uncomment if needed for navigation */}
      {/* <BottomNavBar active="Account" /> */}
    </View>
  );
}
