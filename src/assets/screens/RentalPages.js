import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Search, ChevronLeft} from 'react-native-feather';
import styles from '../styles/ManagementStyle';
import BottomNavBar from '../components/BottomNavBar';

// RentalPage component for displaying rental equipment and venues
export default function RentalPage() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for displaying rental equipment
  // TODO: Backend - Replace with actual API call to fetch equipment data
  const equipmentList = [
    {
      id: '1',
      title: 'Camera',
      price: '$XX/day',
      imageUrl: 'https://via.placeholder.com/150',
    },
    {
      id: '2',
      title: 'Tripod',
      price: '$XX/day',
      imageUrl: 'https://via.placeholder.com/150',
    },
  ];

  // Mock data for displaying venues available for rental
  // TODO: Backend - Replace with actual API call to fetch venue data
  const venueList = [
    {
      id: '3',
      title: 'Drone',
      status: 'Available for lending',
      imageUrl: 'https://via.placeholder.com/150',
    },
    {
      id: '4',
      title: 'Projector',
      status: 'Available for lending',
      imageUrl: 'https://via.placeholder.com/150',
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header Section */}
      {/* Displays a back button to navigate to the previous screen and a title */}
      <View
        style={[styles.header, {flexDirection: 'row', alignItems: 'center'}]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft width={24} height={24} color="black" />
        </TouchableOpacity>
        <Text style={[styles.headerText, {marginLeft: 10}]}>Rentals</Text>
      </View>

      {/* Search Bar Section */}
      {/* Allows users to search for rental items */}
      {/* TODO: Backend - Implement search functionality using API with searchQuery */}
      <View style={styles.searchBox}>
        <TextInput
          style={styles.input}
          placeholder="Search items"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.searchButton}>
          <Search width={20} height={20} color="white" />
        </TouchableOpacity>
      </View>
      <Text style={styles.subText}>Filter items</Text>

      {/* ScrollView for displaying equipment and venue categories */}
      <ScrollView>
        {/* Equipment Section */}
        {/* Displays a horizontal list of equipment items */}
        {/* TODO: Backend - Fetch equipment data using API */}
        <Text style={styles.sectionTitle}>Equipment</Text>
        <FlatList
          data={equipmentList}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({item}) => (
            <View style={styles.card}>
              {/* Display Equipment Image */}
              <Image source={{uri: item.imageUrl}} style={styles.image} />
              {/* Display Equipment Title */}
              <Text style={styles.itemTitle}>{item.title}</Text>
              {/* Display Equipment Price */}
              <Text style={styles.price}>{item.price}</Text>
            </View>
          )}
        />

        {/* Venue Section */}
        {/* Displays a horizontal list of venue items */}
        {/* TODO: Backend - Fetch venue data using API */}
        <Text style={styles.sectionTitle}>Venues</Text>
        <FlatList
          data={venueList}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({item}) => (
            <View style={styles.card}>
              {/* Display Venue Image */}
              <Image source={{uri: item.imageUrl}} style={styles.image} />
              {/* Display Venue Title */}
              <Text style={styles.itemTitle}>{item.title}</Text>
              {/* Display Venue Status */}
              <Text style={styles.status}>{item.status}</Text>
            </View>
          )}
        />
      </ScrollView>

      {/* Bottom Navigation Bar */}
      {/* Provides navigation across different app pages */}
      <BottomNavBar active="" />
    </View>
  );
}
