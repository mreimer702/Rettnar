import React, {useEffect, useState} from 'react';
import {View, Text, ScrollView, TouchableOpacity, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {ChevronLeft} from 'react-native-feather';
import styles from '../styles/HomeStyle';
import BottomNavBar from '../components/BottomNavBar';

// EquipmentPage Component
// Displays a list of equipment using mock data, with the option to navigate to a ProductPage for detailed information.
// This page will later fetch real equipment data from the backend.

export default function EquipmentPage() {
  const navigation = useNavigation();
  const [equipmentList, setEquipmentList] = useState([]);

  // Fetch equipment data on component mount using useEffect
  useEffect(() => {
    // TODO: Backend - Replace this mock data with real data from API
    setEquipmentList(
      [...Array(6)].map((_, i) => ({
        id: i + 1,
        title: `Equipment ${i + 1}`,
        image: require('../assets/equipment-placeholder.jpg'), // TODO: Backend should provide actual image URLs
        price: '$50/day', // TODO: Backend should provide actual pricing
      })),
    );
  }, []);

  return (
    <View style={styles.container}>
      {/* Scrollable container for the content */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header Section with Back Button */}
        <View
          style={[
            styles.searchContainer,
            {flexDirection: 'row', alignItems: 'center'},
          ]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronLeft width={24} height={24} color="black" />
          </TouchableOpacity>
          <Text style={[styles.sectionTitle, {marginLeft: 10}]}>Equipment</Text>
        </View>

        {/* Equipment Grid Section */}
        {/* Displays equipment using a two-column layout using flexbox */}
        <View style={styles.sectionContainer}>
          <View style={styles.gridContainer}>
            {equipmentList.map(item => (
              <TouchableOpacity
                key={item.id}
                style={styles.card}
                // Navigate to the ProductPage with the equipment ID
                // TODO: Backend - Fetch detailed product information using this productId
                onPress={() =>
                  navigation.navigate('ProductPage', {
                    productId: item.id,
                  })
                }>
                {/* Display Favorite status - Placeholder for now */}
                {/* TODO: Backend - Implement actual favorite status logic */}
                <Text style={styles.favorite}>Favorite</Text>

                {/* Display Equipment Image */}
                {/* TODO: Backend - Replace with actual image URL */}
                <Image
                  source={item.image}
                  style={styles.thumbnail}
                  resizeMode="cover"
                />

                {/* Display Equipment Title and Price */}
                {/* TODO: Backend - Replace with actual title and price */}
                <Text style={styles.itemName}>{item.title}</Text>
                <Text style={styles.price}>{item.price}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Optional Bottom Navigation */}
      {/* Uncomment if BottomNavBar is needed */}
      {/* <BottomNavBar active="Home" /> */}
    </View>
  );
}
