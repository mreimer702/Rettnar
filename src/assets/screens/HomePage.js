import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
  Dimensions,
  Alert,
  Animated,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Bell, Search, MapPin, ChevronRight} from 'react-native-feather';
import styles from '../styles/HomeStyle';
import BottomNavBar from '../components/BottomNavBar';

const {width} = Dimensions.get('window');

export default function Homepage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [recommendedEquipment, setRecommendedEquipment] = useState([]); // TODO: Replace with backend-provided equipment list
  const [recommendedVenues, setRecommendedVenues] = useState([]); // TODO: Replace with backend-provided venue list
  const navigation = useNavigation();
  const flatListRef = useRef(null);

  const currentCity = 'Toronto'; // TODO: Optionally update from backend or user settings

  const featuredListings = [
    // TODO: Replace with backend-provided featured listings
    {id: '1', title: 'Feature 1', image: require('../assets/feature1.jpg')},
    {id: '2', title: 'Feature 2', image: require('../assets/feature2.jpg')},
    {id: '3', title: 'Feature 3', image: require('../assets/feature3.jpg')},
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide(prevSlide => {
        const nextSlide = (prevSlide + 1) % featuredListings.length;

        if (nextSlide === 0) {
          // Jumping back to the first image
          flatListRef.current?.scrollToOffset({animated: false, offset: 0});
        } else {
          // scroll to next one
          flatListRef.current?.scrollToOffset({
            animated: true,
            offset: nextSlide * width,
          });
        }

        return nextSlide;
      });
    }, 3000); // scroll every 3 seconds

    return () => clearInterval(interval); // clear interval, prevent leaking of memory
  }, [featuredListings]);

  const handleScroll = event => {
    if (event?.nativeEvent?.contentOffset) {
      const slide = Math.round(event.nativeEvent.contentOffset.x / width);
      setActiveSlide(slide);
    }
  };

  const handleSearch = () => {
    if (!searchQuery.trim() && !selectedFilter) {
      Alert.alert('Please enter a keyword or choose a filter to search.');
      return;
    }

    navigation.navigate('SearchResultPage', {
      searchQuery,
      selectedCategory: selectedFilter,
    });
  };

  useEffect(() => {
    // TODO: Replace mock data with fetch call to backend
    setRecommendedEquipment(
      [...Array(6)].map((_, i) => ({
        id: i + 1,
        title: `Equipment ${i + 1}`,
        image: require('../assets/equipment-placeholder.jpg'),
        price: '$50/day',
      })),
    );

    setRecommendedVenues(
      [...Array(6)].map((_, i) => ({
        id: i + 1,
        title: `Venue ${i + 1}`,
        image: require('../assets/venue-placeholder.jpg'),
        price: '$40/day',
      })),
    );
  }, [selectedFilter]);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled">
        {/* Location and Search */}
        <View style={styles.searchContainer}>
          <TouchableOpacity
            style={styles.locationContainer}
            onPress={() => navigation.navigate('MapPage')}>
            <MapPin width={20} height={20} color="black" />
            <Text style={styles.locationText}>{currentCity}</Text>
          </TouchableOpacity>

          <View style={styles.topRow}>
            <View style={styles.searchBox}>
              <TextInput
                placeholder="Enter your activity"
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              <TouchableOpacity
                style={styles.searchButton}
                onPress={handleSearch}>
                <Search width={20} height={20} color="white" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.notificationButton}
              onPress={() => navigation.navigate('NotificationPage')}>
              <Bell width={24} height={24} color="black" />
            </TouchableOpacity>
          </View>
          <Text style={styles.subText}>Search for venues or equipment...</Text>

          {/* Filter buttons */}
          <View style={styles.filterContainer}>
            <TouchableOpacity
              style={[
                styles.filterButtonLarge,
                selectedFilter === 'equipment' && styles.activeFilterButton,
              ]}
              onPress={() =>
                setSelectedFilter(
                  selectedFilter === 'equipment' ? null : 'equipment',
                )
              }>
              <Text
                style={
                  selectedFilter === 'equipment'
                    ? styles.activeFilterText
                    : styles.filterText
                }>
                Equipment
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterButtonLarge,
                selectedFilter === 'venue' && styles.activeFilterButton,
              ]}
              onPress={() =>
                setSelectedFilter(selectedFilter === 'venue' ? null : 'venue')
              }>
              <Text
                style={
                  selectedFilter === 'venue'
                    ? styles.activeFilterText
                    : styles.filterText
                }>
                Venue
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Featured Carousel - TODO: replace hardcoded items with backend data */}
        <View style={styles.featuredContainer}>
          <FlatList
            ref={flatListRef}
            data={featuredListings}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.id}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            renderItem={({item}) => (
              <View style={[styles.carouselItem, {width}]}>
                <Image source={item.image} style={styles.featuredImage} />
              </View>
            )}
          />
          <View style={styles.pagination}>
            {featuredListings.map((_, index) => (
              <View
                key={index}
                style={[styles.dot, activeSlide === index && styles.activeDot]}
              />
            ))}
          </View>
        </View>

        {/* Recommended Equipment - TODO: replace with API fetch results */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Equipment</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('EquipmentPage')}>
              <ChevronRight width={20} height={20} color="gray" />
            </TouchableOpacity>
          </View>
          <View style={styles.gridContainer}>
            {recommendedEquipment.map(item => (
              <TouchableOpacity
                key={item.id}
                style={styles.card}
                onPress={() =>
                  navigation.navigate('ProductPage', {
                    productId: item.id, // TODO: fetch this product's detail from backend by ID
                  })
                }>
                <Text style={styles.favorite}>Favorite</Text>
                <Image
                  source={item.image}
                  style={styles.thumbnail}
                  resizeMode="cover"
                />
                <Text style={styles.itemName}>{item.title}</Text>
                <Text style={styles.price}>{item.price}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recommended Venues - TODO: replace with API fetch results */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Venues</Text>
            <TouchableOpacity onPress={() => navigation.navigate('VenuePage')}>
              <ChevronRight width={20} height={20} color="gray" />
            </TouchableOpacity>
          </View>
          <View style={styles.gridContainer}>
            {recommendedVenues.map(item => (
              <TouchableOpacity
                key={item.id}
                style={styles.card}
                onPress={() =>
                  navigation.navigate('ProductPage', {
                    productId: item.id, // TODO: fetch this product's detail from backend by ID
                  })
                }>
                <Text style={styles.favorite}>Favorite</Text>
                <Image
                  source={item.image}
                  style={styles.thumbnail}
                  resizeMode="cover"
                />
                <Text style={styles.itemName}>{item.title}</Text>
                <Text style={styles.price}>{item.price}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <BottomNavBar active="Home" />
    </View>
  );
}
