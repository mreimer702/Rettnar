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

export default function ListingPage() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data
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
      {/* Top Header with back button */}
      <View
        style={[styles.header, {flexDirection: 'row', alignItems: 'center'}]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft width={24} height={24} color="black" />
        </TouchableOpacity>
        <Text style={[styles.headerText, {marginLeft: 10}]}>Listings</Text>
      </View>

      {/* Search bar */}
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

      <ScrollView>
        {/* Equipment category */}
        <Text style={styles.sectionTitle}>Equipment</Text>
        <FlatList
          data={equipmentList}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({item}) => (
            <View style={styles.card}>
              <Image source={{uri: item.imageUrl}} style={styles.image} />
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.price}>{item.price}</Text>
            </View>
          )}
        />

        {/* Venue category */}
        <Text style={styles.sectionTitle}>Venues</Text>
        <FlatList
          data={venueList}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({item}) => (
            <View style={styles.card}>
              <Image source={{uri: item.imageUrl}} style={styles.image} />
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.status}>{item.status}</Text>
            </View>
          )}
        />
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <BottomNavBar active="" />
    </View>
  );
}
